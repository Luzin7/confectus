export type TemplateRef = {
	readonly src: readonly string[];
	readonly dest: string;
};

export type DependencyRef = {
	readonly dependencies: readonly string[];
	readonly devDependencies: readonly string[];
};

export type StackKey = "Backend" | "Frontend";
export type LanguageKey = "Javascript" | "Typescript";
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

const parseDeps = (raw: string | null): DependencyRef => {
	if (raw === null) return empty;
	const list = raw.split(/\s+/).filter(Boolean);
	return { dependencies: list, devDependencies: [] };
};

const parseDevDeps = (raw: string | null): DependencyRef => {
	if (raw === null) return empty;
	const list = raw.split(/\s+/).filter(Boolean);
	return { dependencies: [], devDependencies: list };
};

const mergeDeps = (...refs: DependencyRef[]): DependencyRef => {
	const dependencies = refs.flatMap((r) => r.dependencies);
	const devDependencies = refs.flatMap((r) => r.devDependencies);
	return { dependencies, devDependencies };
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
	greetingsTs: entry(
		["backend", "greetings", "helloWorld.ts"],
		"src/app.ts",
	),
	greetingsJs: entry(
		["backend", "greetings", "helloWorld.ts"],
		"src/app.js",
	),
	typescript: entry(
		["backend", "typescript", "tsconfig.json"],
		"tsconfig.json",
		mergeDeps(parseDeps("tsx"), parseDevDeps("typescript @types/node ts-node tsup")),
	),
	eslint: entry(
		["backend", "linters", "eslint", "javascript", "eslint.config.mjs"],
		"eslint.config.mjs",
		parseDevDeps(
			"eslint eslint-config-airbnb-base eslint-plugin-import eslint-plugin-prettier eslint-config-prettier",
		),
	),
	eslintts: entry(
		["backend", "linters", "eslint", "typescript", "eslint.config.mjs"],
		"eslint.config.mjs",
		parseDevDeps(
			"eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-prettier eslint-config-standard eslint-plugin-import eslint-config-prettier prettier",
		),
	),
	biome: entry(
		["backend", "linters", "biome", "biome.json"],
		"biome.json",
		parseDevDeps("@biomejs/biome"),
	),
	vitestJs: entry(
		["backend", "frameworks", "configs", "vitest", "vitest.config.js"],
		"vitest.config.js",
		parseDevDeps("vite vitest"),
	),
	vitestTs: entry(
		["backend", "frameworks", "configs", "vitest", "vitest.config.ts"],
		"vitest.config.ts",
		parseDevDeps("vite vitest"),
	),
} as const;

export const frontendTemplates = {
	eslintJs: entry(
		["frontend", "linters", "javascript", "eslint", "eslint.config.mjs"],
		"eslint.config.mjs",
		parseDevDeps("eslint eslint-plugin-prettier prettier"),
	),
	eslintTs: entry(
		["frontend", "linters", "typescript", "eslint", "eslint.config.mjs"],
		"eslint.config.mjs",
		parseDevDeps(
			"eslint eslint-plugin-prettier prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser",
		),
	),
	eslintReactJs: entry(
		["frontend", "linters", "react", "eslint", "javascript", "eslint.config.mjs"],
		"eslint.config.mjs",
		parseDevDeps(
			"eslint globals eslint-plugin-react eslint-plugin-react-hooks prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-jsx-a11y eslint-config-standard",
		),
	),
	eslintReactTs: entry(
		["frontend", "linters", "react", "eslint", "typescript", "eslint.config.mjs"],
		"eslint.config.mjs",
		parseDevDeps(
			"eslint @eslint/compat globals @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-jsx-a11y eslint-config-standard",
		),
	),
	eslintNextJs: entry(
		["frontend", "linters", "next", "eslint", "javascript", "eslint.config.mjs"],
		"eslint.config.mjs",
		parseDevDeps(
			"eslint eslint-plugin-react eslint-plugin-react-hooks prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-jsx-a11y eslint-config-standard",
		),
	),
	eslintNextTs: entry(
		["frontend", "linters", "next", "eslint", "typescript", "eslint.config.mjs"],
		"eslint.config.mjs",
		parseDevDeps(
			"eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier eslint-config-prettier eslint-plugin-prettier eslint-config-standard",
		),
	),
	eslintVueJs: entry(
		["frontend", "linters", "vue", "eslint", "javascript", "eslint.config.mjs"],
		"eslint.config.mjs",
		parseDevDeps(
			"eslint eslint-plugin-vue prettier eslint-config-prettier eslint-plugin-prettier",
		),
	),
	eslintVueTs: entry(
		["frontend", "linters", "vue", "eslint", "typescript", "eslint.config.mjs"],
		"eslint.config.mjs",
		parseDevDeps(
			"eslint-config-prettier eslint @typescript-eslint/parser@5.59.0 @typescript-eslint/eslint-plugin@5.59.0 @vue/eslint-config-typescript@13.0.0 eslint-plugin-vue@9.11.0 eslint-plugin-prettier@5.0.0 prettier@2.8.8",
		),
	),
	biome: entry(
		["frontend", "linters", "biome", "biome.json"],
		"biome.json",
		parseDevDeps("@biomejs/biome"),
	),
} as const;

export type LinterLookup<T> = {
	readonly No: null;
	readonly Biome: T;
	readonly Eslint: T;
};

export const frontendEslintByStack: Record<
	FrontendStackKey,
	{ readonly Javascript: keyof typeof frontendTemplates; readonly Typescript: keyof typeof frontendTemplates }
> = {
	"N/A": { Javascript: "eslintJs", Typescript: "eslintTs" },
	React: { Javascript: "eslintReactJs", Typescript: "eslintReactTs" },
	"Next.js": { Javascript: "eslintNextJs", Typescript: "eslintNextTs" },
	"Vue.js": { Javascript: "eslintVueJs", Typescript: "eslintVueTs" },
};
