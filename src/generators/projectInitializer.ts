import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import type { Env } from "@shared/env";
import type { PackageManagerConfig } from "@mappings/packageManagers";
import { ProjectInitializationError } from "@errors";

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
