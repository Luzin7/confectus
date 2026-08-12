import { templateMapper } from "@pipeline/templateMapper";
import type { BackendAnswers, FrontendAnswers } from "@schema/configSchema";
import { describe, expect, it } from "vitest";

const baseBackend = (
	overrides: Partial<BackendAnswers> = {},
): BackendAnswers => ({
	stack: "Backend",
	wichManager: "NPM",
	wichLanguage: "Typescript",
	wichLinter: "Biome",
	hasPackageJson: "Yes",
	isVscode: "Yes",
	wichTest: "No",
	createDirectories: "Yes",
	addScripts: "No",
	...overrides,
});

const baseFrontend = (
	overrides: Partial<FrontendAnswers> = {},
): FrontendAnswers => ({
	stack: "Frontend",
	wichManager: "NPM",
	wichLanguage: "Typescript",
	wichLinter: "Biome",
	hasPackageJson: "Yes",
	isVscode: "Yes",
	wichStack: "React",
	...overrides,
});

const dests = (result: { ops: { dest: string }[] }) =>
	result.ops.map((o) => o.dest).sort();

describe("templateMapper — always installed", () => {
	it("installs gitignore and readme on every backend config", () => {
		const result = templateMapper(baseBackend());
		expect(dests(result)).toContain(".gitignore");
		expect(dests(result)).toContain("README.md");
	});

	it("installs gitignore and readme on every frontend config", () => {
		const result = templateMapper(baseFrontend());
		expect(dests(result)).toContain(".gitignore");
		expect(dests(result)).toContain("README.md");
	});
});

describe("templateMapper — backend TS + Biome + Vitest + VSCode + src", () => {
	const result = templateMapper(baseBackend({ wichTest: "Vitest" }));

	it("creates the expected set of files", () => {
		expect(dests(result)).toEqual([
			".editorconfig",
			".gitignore",
			".vscode/settings.json",
			"README.md",
			"biome.json",
			"src/app.ts",
			"tsconfig.json",
			"vitest.config.ts",
		]);
	});

	it("pulls @biomejs/biome and vite/vitest as devDeps", () => {
		expect(result.devDeps).toContain("@biomejs/biome");
		expect(result.devDeps).toContain("vite");
		expect(result.devDeps).toContain("vitest");
	});

	it("pulls tsx (dep) and typescript/@types/node (devDeps) from typescript template", () => {
		expect(result.deps).toContain("tsx");
		expect(result.devDeps).toContain("typescript");
		expect(result.devDeps).toContain("@types/node");
	});
});

describe("templateMapper — backend JS + Eslint + no test + no vscode + no src", () => {
	const result = templateMapper(
		baseBackend({
			wichLanguage: "Javascript",
			wichLinter: "Eslint",
			wichTest: "No",
			isVscode: "No",
			createDirectories: "No",
		}),
	);

	it("does not create src/app.ts when createDirectories=No", () => {
		expect(dests(result)).not.toContain("src/app.ts");
	});

	it("does not create tsconfig.json for JS", () => {
		expect(dests(result)).not.toContain("tsconfig.json");
	});

	it("installs backend JS eslint config", () => {
		expect(dests(result)).toContain("eslint.config.mjs");
	});

	it("does not pull vite/vitest devDeps when test=No", () => {
		expect(result.devDeps).not.toContain("vitest");
		expect(result.devDeps).not.toContain("vite");
	});

	it("does not pull tsx/typescript when not TS", () => {
		expect(result.deps).not.toContain("tsx");
		expect(result.devDeps).not.toContain("typescript");
	});
});

describe("templateMapper — backend bug-fix regression suite", () => {
	it("installs backend biome.json from the correct path (not VSCode settings.json)", () => {
		const result = templateMapper(baseBackend({ wichLinter: "Biome" }));
		const biome = result.ops.find((o) => o.dest === "biome.json");
		expect(biome).toBeDefined();
		expect(biome?.src.join("/")).toBe("backend/linters/biome/biome.json");
	});

	it("uses vitest.config.ts for TS backend and vitest.config.js for JS backend (path matches name)", () => {
		const ts = templateMapper(
			baseBackend({ wichLanguage: "Typescript", wichTest: "Vitest" }),
		);
		const tsCfg = ts.ops.find((o) => o.dest === "vitest.config.ts");
		expect(tsCfg).toBeDefined();
		expect(tsCfg?.src.join("/").endsWith("vitest.config.ts")).toBe(true);

		const js = templateMapper(
			baseBackend({ wichLanguage: "Javascript", wichTest: "Vitest" }),
		);
		const jsCfg = js.ops.find((o) => o.dest === "vitest.config.js");
		expect(jsCfg).toBeDefined();
		expect(jsCfg?.src.join("/").endsWith("vitest.config.js")).toBe(true);
	});

	it("places greetings at src/app.ts (TS) or src/app.js (JS), not at .eslintrc.js placeholder", () => {
		const ts = templateMapper(baseBackend({ wichLanguage: "Typescript" }));
		expect(ts.ops.find((o) => o.dest === "src/app.ts")).toBeDefined();
		expect(ts.ops.find((o) => o.dest === ".eslintrc.js")).toBeUndefined();
	});
});

describe("templateMapper — frontend Eslint routing by stack", () => {
	it("uses eslintReactTs for React + TS", () => {
		const result = templateMapper(
			baseFrontend({
				wichStack: "React",
				wichLanguage: "Typescript",
				wichLinter: "Eslint",
			}),
		);
		const eslint = result.ops.find((o) => o.dest === "eslint.config.mjs");
		expect(eslint?.src.join("/")).toContain("react/eslint/typescript");
	});

	it("uses eslintNextJs for Next + JS", () => {
		const result = templateMapper(
			baseFrontend({
				wichStack: "Next.js",
				wichLanguage: "Javascript",
				wichLinter: "Eslint",
			}),
		);
		const eslint = result.ops.find((o) => o.dest === "eslint.config.mjs");
		expect(eslint?.src.join("/")).toContain("next/eslint/javascript");
	});

	it("uses eslintVueTs for Vue + TS", () => {
		const result = templateMapper(
			baseFrontend({
				wichStack: "Vue.js",
				wichLanguage: "Typescript",
				wichLinter: "Eslint",
			}),
		);
		const eslint = result.ops.find((o) => o.dest === "eslint.config.mjs");
		expect(eslint?.src.join("/")).toContain("vue/eslint/typescript");
	});

	it("uses eslintTs for N/A + TS", () => {
		const result = templateMapper(
			baseFrontend({
				wichStack: "N/A",
				wichLanguage: "Typescript",
				wichLinter: "Eslint",
			}),
		);
		const eslint = result.ops.find((o) => o.dest === "eslint.config.mjs");
		expect(eslint?.src.join("/")).toContain("typescript/eslint");
	});
});

describe("templateMapper — frontend Biome", () => {
	it("installs frontend biome.json with frontend-specific content (not backend)", () => {
		const result = templateMapper(baseFrontend({ wichLinter: "Biome" }));
		const biome = result.ops.find((o) => o.dest === "biome.json");
		expect(biome).toBeDefined();
		expect(biome?.src.join("/")).toBe("frontend/linters/biome/biome.json");
	});

	it("routes VSCode settings to biome variant when linter=Biome", () => {
		const result = templateMapper(baseFrontend({ wichLinter: "Biome" }));
		const vscode = result.ops.find((o) => o.dest === ".vscode/settings.json");
		expect(vscode).toBeDefined();
		expect(vscode?.src.join("/")).toBe(
			"ide/vscode/settings/biome/settings.json",
		);
	});
});

describe("templateMapper — VSCode routing", () => {
	it("routes VSCode settings to eslint variant when linter=Eslint (frontend)", () => {
		const result = templateMapper(baseFrontend({ wichLinter: "Eslint" }));
		const vscode = result.ops.find((o) => o.dest === ".vscode/settings.json");
		expect(vscode?.src.join("/")).toBe(
			"ide/vscode/settings/eslint/settings.json",
		);
	});

	it("does not create vscode settings when isVscode=No", () => {
		const result = templateMapper(baseBackend({ isVscode: "No" }));
		expect(
			result.ops.find((o) => o.dest === ".vscode/settings.json"),
		).toBeUndefined();
		expect(result.ops.find((o) => o.dest === ".editorconfig")).toBeUndefined();
	});
});

describe("templateMapper — no linter", () => {
	it("does not install any linter file when wichLinter=No (backend)", () => {
		const result = templateMapper(baseBackend({ wichLinter: "No" }));
		expect(result.ops.find((o) => o.dest === "biome.json")).toBeUndefined();
		expect(
			result.ops.find((o) => o.dest === "eslint.config.mjs"),
		).toBeUndefined();
	});

	it("cannot pull biome or eslint deps when wichLinter=No (frontend)", () => {
		const result = templateMapper(baseFrontend({ wichLinter: "No" }));
		expect(result.devDeps).not.toContain("@biomejs/biome");
		expect(result.devDeps).not.toContain("eslint");
	});
});

describe("templateMapper — determinism", () => {
	it("returns the same ops reference for the same backend config", () => {
		const a = templateMapper(baseBackend());
		const b = templateMapper(baseBackend());
		expect(a.ops).toEqual(b.ops);
		expect(a.deps).toEqual(b.deps);
	});
});
