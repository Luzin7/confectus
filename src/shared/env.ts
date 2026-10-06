import path from "node:path";

export type Env = {
	readonly cwd: string;
	readonly templatesRoot: string;
	readonly isDev: boolean;
	readonly targetDir: string;
};

export type BuildEnvOverrides = {
	readonly cwd?: string;
	readonly templatesRoot: string;
	readonly isDev?: boolean;
};

export const buildEnv = (overrides: BuildEnvOverrides): Env => {
	const cwd = overrides.cwd ?? process.cwd();
	const isDev = overrides.isDev ?? false;
	const targetDir = isDev ? path.join(cwd, "mock") : cwd;
	return { cwd, templatesRoot: overrides.templatesRoot, isDev, targetDir };
};
