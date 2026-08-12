import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import type { Env } from "@shared/env";
import type { PackageManagerConfig } from "@mappings/packageManagers";
import { DependencyInstallError } from "@errors";

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
		if (pkgs.length === 0) return;
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
