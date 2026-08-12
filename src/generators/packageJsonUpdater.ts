import fs from "fs-extra";
import path from "path";
import type { Env } from "@shared/env";
import { PackageJsonScriptsUpdateError } from "@errors";

export const packageJsonUpdater = async (
	scripts: Record<string, string>,
	env: Env,
): Promise<void> => {
	const cwd = env.isDev ? path.join(env.cwd, "mock") : env.cwd;
	const packageJsonPath = path.join(cwd, "package.json");

	try {
		const packageJson = (await fs.pathExists(packageJsonPath))
			? await fs.readJson(packageJsonPath)
			: { name: "confectus-project", version: "1.0.0" };
		packageJson.scripts = { ...(packageJson.scripts ?? {}), ...scripts };
		await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
	} catch (e) {
		throw new PackageJsonScriptsUpdateError(e);
	}
};
