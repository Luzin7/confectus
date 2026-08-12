export type Env = {
	readonly cwd: string;
	readonly templatesRoot: string;
	readonly isDev: boolean;
};

export const buildEnv = (overrides: Partial<Env> = {}): Env => {
	const cwd = overrides.cwd ?? process.cwd();
	const templatesRoot =
		overrides.templatesRoot ??
		(overrides.isDev ?? false
			? `${cwd}/src/templates`
			: `${cwd}/templates`);
	const isDev = overrides.isDev ?? false;
	return { cwd, templatesRoot, isDev };
};
