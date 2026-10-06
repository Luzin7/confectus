export type TemplateRef = {
	readonly src: readonly string[];
	readonly dest: string;
};

export type DependencyRef = {
	readonly dependencies: readonly string[];
	readonly devDependencies: readonly string[];
};

export type LinterKey = "Eslint" | "Biome" | "No";
export type TestKey = "Vitest" | "No";
export type FrontendStackKey = "N/A" | "React" | "Next.js" | "Vue.js";

export type TemplateEntry = {
	readonly template: TemplateRef;
	readonly deps: DependencyRef;
};

const empty: DependencyRef = {
	dependencies: [],
	devDependencies: [],
};

const parseDevDeps = (raw: string | null): DependencyRef => {
	if (raw === null) {
		return empty;
	}
	const list = raw.split(/\s+/).filter(Boolean);
	return { dependencies: [], devDependencies: list };
};

const entry = (
	src: readonly string[],
	dest: string,
	deps: DependencyRef = empty,
): TemplateEntry => ({ template: { src, dest }, deps });

export const sharedTemplates = {
	editorconfig: entry(["ide", "vscode", ".editorconfig"], ".editorconfig"),
	gitignore: entry(["git", "gitignore"], ".gitignore"),
	readme: entry(["git", "README.md"], "README.md"),
	vscodeEslint: entry(
		["ide", "vscode", "settings", "eslint", "settings.json"],
		".vscode/settings.json",
	),
	vscodeBiome: entry(
		["ide", "vscode", "settings", "biome", "settings.json"],
		".vscode/settings.json",
	),
} as const;

export const backendTemplates = {
	greetingsTs: entry(["backend", "greetings", "helloWorld.ts"], "src/app.ts"),
	greetingsJs: entry(["backend", "greetings", "helloWorld.ts"], "src/app.js"),
	typescript: entry(
		["backend", "typescript", "tsconfig.json"],
		"tsconfig.json",
		parseDevDeps("typescript@^6.0.3 @types/node@^22.20.5 tsx@^4.23.12"),
	),
	eslint: entry(
		["backend", "linters", "eslint", "javascript", "eslint.config.mjs"],
		"eslint.config.mjs",
		parseDevDeps(
			"eslint@^9.39.5 @eslint/js@^9.39.5 globals@^17.13.0 eslint-config-prettier@^10.1.8 eslint-plugin-prettier@^5.5.6 prettier@^3.9.9",
		),
	),
	eslintts: entry(
		["backend", "linters", "eslint", "typescript", "eslint.config.mjs"],
		"eslint.config.mjs",
		parseDevDeps(
			"eslint@^9.39.5 @eslint/js@^9.39.5 globals@^17.13.0 eslint-config-prettier@^10.1.8 eslint-plugin-prettier@^5.5.6 prettier@^3.9.9 typescript-eslint@^8.71.1",
		),
	),
	biome: entry(
		["backend", "linters", "biome", "biome.json"],
		"biome.json",
		parseDevDeps("@biomejs/biome@^2.5.15"),
	),
	vitestJs: entry(
		["backend", "frameworks", "configs", "vitest", "vitest.config.js"],
		"vitest.config.js",
		parseDevDeps("vitest@^5.0.3"),
	),
	vitestTs: entry(
		["backend", "frameworks", "configs", "vitest", "vitest.config.ts"],
		"vitest.config.ts",
		parseDevDeps("vitest@^5.0.3"),
	),
} as const;

export const frontendTemplates = {
	eslintJs: entry(
		["frontend", "linters", "javascript", "eslint", "eslint.config.mjs"],
		"eslint.config.mjs",
		parseDevDeps(
			"eslint@^9.39.5 @eslint/js@^9.39.5 globals@^17.13.0 eslint-config-prettier@^10.1.8 eslint-plugin-prettier@^5.5.6 prettier@^3.9.9",
		),
	),
	eslintTs: entry(
		["frontend", "linters", "typescript", "eslint", "eslint.config.mjs"],
		"eslint.config.mjs",
		parseDevDeps(
			"eslint@^9.39.5 @eslint/js@^9.39.5 globals@^17.13.0 eslint-config-prettier@^10.1.8 eslint-plugin-prettier@^5.5.6 prettier@^3.9.9 typescript-eslint@^8.71.1",
		),
	),
	eslintReactJs: entry(
		[
			"frontend",
			"linters",
			"react",
			"eslint",
			"javascript",
			"eslint.config.mjs",
		],
		"eslint.config.mjs",
		parseDevDeps(
			"eslint@^9.39.5 @eslint/js@^9.39.5 globals@^17.13.0 eslint-config-prettier@^10.1.8 eslint-plugin-prettier@^5.5.6 prettier@^3.9.9 eslint-plugin-react@^7.37.5 eslint-plugin-react-hooks@^7.1.1 eslint-plugin-jsx-a11y@^6.10.2",
		),
	),
	eslintReactTs: entry(
		[
			"frontend",
			"linters",
			"react",
			"eslint",
			"typescript",
			"eslint.config.mjs",
		],
		"eslint.config.mjs",
		parseDevDeps(
			"eslint@^9.39.5 @eslint/js@^9.39.5 globals@^17.13.0 eslint-config-prettier@^10.1.8 eslint-plugin-prettier@^5.5.6 prettier@^3.9.9 eslint-plugin-react@^7.37.5 eslint-plugin-react-hooks@^7.1.1 eslint-plugin-jsx-a11y@^6.10.2 typescript-eslint@^8.71.1",
		),
	),
	eslintNextJs: entry(
		[
			"frontend",
			"linters",
			"next",
			"eslint",
			"javascript",
			"eslint.config.mjs",
		],
		"eslint.config.mjs",
		parseDevDeps(
			"eslint@^9.39.5 @eslint/js@^9.39.5 globals@^17.13.0 eslint-config-prettier@^10.1.8 eslint-plugin-prettier@^5.5.6 prettier@^3.9.9 eslint-plugin-react@^7.37.5 eslint-plugin-react-hooks@^7.1.1 eslint-plugin-jsx-a11y@^6.10.2",
		),
	),
	eslintNextTs: entry(
		[
			"frontend",
			"linters",
			"next",
			"eslint",
			"typescript",
			"eslint.config.mjs",
		],
		"eslint.config.mjs",
		parseDevDeps(
			"eslint@^9.39.5 @eslint/js@^9.39.5 globals@^17.13.0 eslint-config-prettier@^10.1.8 eslint-plugin-prettier@^5.5.6 prettier@^3.9.9 eslint-plugin-react@^7.37.5 eslint-plugin-react-hooks@^7.1.1 eslint-plugin-jsx-a11y@^6.10.2 typescript-eslint@^8.71.1",
		),
	),
	eslintVueJs: entry(
		["frontend", "linters", "vue", "eslint", "javascript", "eslint.config.mjs"],
		"eslint.config.mjs",
		parseDevDeps(
			"eslint@^9.39.5 @eslint/js@^9.39.5 globals@^17.13.0 eslint-config-prettier@^10.1.8 eslint-plugin-prettier@^5.5.6 prettier@^3.9.9 eslint-plugin-vue@^10.11.1 vue-eslint-parser@^10.4.1",
		),
	),
	eslintVueTs: entry(
		["frontend", "linters", "vue", "eslint", "typescript", "eslint.config.mjs"],
		"eslint.config.mjs",
		parseDevDeps(
			"eslint@^9.39.5 @eslint/js@^9.39.5 globals@^17.13.0 eslint-config-prettier@^10.1.8 eslint-plugin-prettier@^5.5.6 prettier@^3.9.9 eslint-plugin-vue@^10.11.1 vue-eslint-parser@^10.4.1 typescript-eslint@^8.71.1 @vue/eslint-config-typescript@^14.9.0",
		),
	),
	biome: entry(
		["frontend", "linters", "biome", "biome.json"],
		"biome.json",
		parseDevDeps("@biomejs/biome@^2.5.15"),
	),
} as const;

export const frontendEslintByStack: Record<
	FrontendStackKey,
	{
		readonly Javascript: keyof typeof frontendTemplates;
		readonly Typescript: keyof typeof frontendTemplates;
	}
> = {
	"N/A": { Javascript: "eslintJs", Typescript: "eslintTs" },
	React: { Javascript: "eslintReactJs", Typescript: "eslintReactTs" },
	"Next.js": { Javascript: "eslintNextJs", Typescript: "eslintNextTs" },
	"Vue.js": { Javascript: "eslintVueJs", Typescript: "eslintVueTs" },
};
