import { exec } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { DependencyInstallError } from "@errors";
import type { PackageManagerConfig } from "@mappings/packageManagers";
import type { Env } from "@shared/env";

const execAsync = promisify(exec);

const buildInstallCommand = (
	manager: PackageManagerConfig,
	packages: readonly string[],
	isDev: boolean,
): string => {
	const installCmd = manager.installCommand;
	const flag = isDev ? manager.installDevFlag : "";
	const list = packages.join(" ");
	return [installCmd, flag, list].filter(Boolean).join(" ");
};

export const packageInstaller = async (
	packages: readonly string[],
	devPackages: readonly string[],
	manager: PackageManagerConfig,
	env: Env,
): Promise<void> => {
	const cwd = env.isDev ? path.join(env.cwd, "mock") : env.cwd;

	const run = async (pkgs: readonly string[], isDev: boolean) => {
		if (pkgs.length === 0) {
			return;
		}
		const cmd = buildInstallCommand(manager, pkgs, isDev);
		try {
			await execAsync(cmd, { cwd });
		} catch (e) {
			throw new DependencyInstallError(pkgs.join(", "), e);
		}
	};

	await run(packages, false);
	await run(devPackages, true);
};
