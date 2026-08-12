import { collectAnswers } from "@prompts/collectAnswers";
import { validateAnswers, type ValidationResult, type ParseError, type Success } from "@schema/validateAnswers";
import { templateMapper, type MapperResult } from "@pipeline/templateMapper";
import { fileWriter } from "@generators/fileWriter";
import { packageInstaller } from "@generators/packageInstaller";
import { projectInitializer } from "@generators/projectInitializer";
import { packageJsonUpdater } from "@generators/packageJsonUpdater";
import { packageManagers, type PackageManagerConfig } from "@mappings/packageManagers";
import { scriptsFor } from "@mappings/scriptsDictionary";
import { startSpinner } from "@shared/spinner";
import type { Env } from "@shared/env";
import type { Answers } from "@schema/configSchema";
import {
	ConfectusError,
	NotFoundPackageJsonError,
	PackageManagerConfigNotFoundError,
} from "@errors";
import fs from "fs-extra";
import path from "path";

export type EitherError =
	| { kind: "Left"; error: ConfectusError }
	| { kind: "Right"; value: undefined };

const right = (): EitherError => ({ kind: "Right", value: undefined });
const left = (error: ConfectusError): EitherError => ({ kind: "Left", error });

const assertPackageJsonPresent = async (cfg: Answers, env: Env): Promise<void> => {
	if (cfg.hasPackageJson === "Yes") {
		const cwd = env.isDev ? path.join(env.cwd, "mock") : env.cwd;
		const exists = await fs.pathExists(path.join(cwd, "package.json"));
		if (!exists) throw new NotFoundPackageJsonError();
	}
};

export const pipeline = async (env: Env): Promise<EitherError> => {
	const raw = await collectAnswers();
	const validation: ValidationResult = validateAnswers(raw);
	if (validation.kind === "ParseError") {
		return left(
			new ConfectusError(
				`Configuração inválida: ${(validation as ParseError).issues.join("; ")}`,
				"VALIDATION_ERROR",
			),
		);
	}

	const cfg = (validation as Success<Answers>).value;
	const managerConfig: PackageManagerConfig | undefined = packageManagers[cfg.wichManager];
	if (!managerConfig) {
		return left(new PackageManagerConfigNotFoundError(cfg.wichManager));
	}

	try {
		await assertPackageJsonPresent(cfg, env);

		if (cfg.hasPackageJson === "No") {
			const spinnerInit = startSpinner("Initializing project...");
			try {
				await projectInitializer(managerConfig, env);
				spinnerInit.success();
			} catch (e) {
				spinnerInit.error();
				throw e;
			}
		}

		const mapped: MapperResult = templateMapper(cfg);

		const spinnerFiles = startSpinner("Writing template files...");
		try {
			await fileWriter(mapped.ops, env);
			spinnerFiles.success();
		} catch (e) {
			spinnerFiles.error();
			throw e;
		}

		if (cfg.stack === "Backend" && cfg.addScripts === "Yes") {
			const scripts = scriptsFor({
				willTest: cfg.wichTest,
				hasSrc: cfg.createDirectories === "Yes",
				isTypescript: cfg.wichLanguage === "Typescript",
			});
			const spinnerScripts = startSpinner("Updating package.json scripts...");
			try {
				await packageJsonUpdater(scripts, env);
				spinnerScripts.success();
			} catch (e) {
				spinnerScripts.error();
				throw e;
			}
		}

		const hasDeps = mapped.deps.length > 0 || mapped.devDeps.length > 0;
		if (hasDeps) {
			const spinnerDeps = startSpinner("Installing dependencies...");
			try {
				await packageInstaller(mapped.deps, mapped.devDeps, managerConfig, env);
				spinnerDeps.success();
			} catch (e) {
				spinnerDeps.error();
				throw e;
			}
		}

		return right();
	} catch (e) {
		if (e instanceof ConfectusError) return left(e);
		return left(new ConfectusError("Erro inesperado durante o setup.", "UNKNOWN", e));
	}
};
