import { exec } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { ProjectInitializationError } from "@errors";
import type { PackageManagerConfig } from "@mappings/packageManagers";
import type { Env } from "@shared/env";

const execAsync = promisify(exec);

export const projectInitializer = async (
	manager: PackageManagerConfig,
	env: Env,
): Promise<void> => {
	const cwd = env.isDev ? path.join(env.cwd, "mock") : env.cwd;
	try {
		await execAsync(manager.initCommand, { cwd });
	} catch (e) {
		throw new ProjectInitializationError(manager.initCommand, e);
	}
};
