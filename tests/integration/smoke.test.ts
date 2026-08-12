import { spawn } from "child_process";
import { promises as fs, existsSync, readFileSync } from "fs";
import os from "os";
import path from "path";
import { describe, expect, it } from "vitest";

const REPO_TEMPLATES = path.resolve(__dirname, "../../src/templates");

const copyRecursive = async (src: string, dest: string): Promise<void> => {
	const entries = await fs.readdir(src);
	for (const e of entries) {
		const s = path.join(src, e);
		const d = path.join(dest, e);
		const stat = await fs.stat(s);
		if (stat.isDirectory()) {
			await fs.mkdir(d, { recursive: true });
			await copyRecursive(s, d);
		} else {
			await fs.copyFile(s, d);
		}
	}
};

const setupSmoke = async (): Promise<{
	cwd: string;
	cleanup: () => Promise<void>;
}> => {
	const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "smoke-"));
	const templatesRoot = path.join(cwd, "templates");
	await fs.mkdir(templatesRoot, { recursive: true });
	await copyRecursive(REPO_TEMPLATES, templatesRoot);
	// Pre-create empty package.json so assertPackageJsonPresent doesn't fail
	await fs.writeFile(
		path.join(cwd, "package.json"),
		JSON.stringify(
			{ name: "smoke-test", version: "1.0.0", scripts: {} },
			null,
			2,
		),
	);
	return { cwd, cleanup: () => fs.rm(cwd, { recursive: true, force: true }) };
};

type Answer = { key: string; arrows: number };

const encodeAnswers = (sequence: Answer[]): string[] => {
	const inputs: string[] = [];
	for (const a of sequence) {
		for (let i = 0; i < a.arrows; i++) {
			inputs.push("\x1b[B");
		}
		inputs.push("\r");
	}
	return inputs;
};

const runCli = async (
	cwd: string,
	inputs: string[],
): Promise<{ code: number | null; stdout: string }> => {
	return new Promise((resolve) => {
		const bin = path.resolve(__dirname, "../../dist/main.js");
		const child = spawn("node", [bin], { cwd });
		const stdout: string[] = [];
		child.stdout.on("data", (c) => stdout.push(c.toString()));

		let i = 0;
		const feed = () => {
			if (i < inputs.length) {
				child.stdin.write(inputs[i]);
				i++;
				setTimeout(feed, 100);
			} else {
				child.stdin.end();
			}
		};
		setTimeout(feed, 200);

		child.on("close", (code) => resolve({ code, stdout: stdout.join("") }));
	});
};

const mustExist = (cwd: string, rel: string): void => {
	if (!existsSync(path.join(cwd, rel))) {
		throw new Error(`expected ${rel} to exist in ${cwd}`);
	}
};

describe("smoke — real CLI binary end-to-end", () => {
	it("backend TS + Biome + No-test + VSCode + No-src + No-scripts", async () => {
		const { cwd, cleanup } = await setupSmoke();
		try {
			// Stack default = Frontend → arrow down once for Backend
			// Backend questions order: wichManager, hasPackageJson, wichLanguage, wichLinter, wichTest, isVscode, createDirectories, addScripts
			// Defaults: NPM / Yes / Javascript / Eslint / Vitest / Yes / Yes / Yes
			// We want: NPM / Yes / TS (down 1) / Biome (down 1) / No-test (down 1) / Yes / No-src (down 1) / No-scripts (down 1)
			const inputs = encodeAnswers([
				{ key: "stack", arrows: 1 }, // Backend
				{ key: "wichManager", arrows: 0 }, // NPM
				{ key: "hasPackageJson", arrows: 0 }, // Yes
				{ key: "wichLanguage", arrows: 1 }, // Typescript
				{ key: "wichLinter", arrows: 1 }, // Biome
				{ key: "wichTest", arrows: 1 }, // No
				{ key: "isVscode", arrows: 0 }, // Yes
				{ key: "createDirectories", arrows: 1 }, // No
				{ key: "addScripts", arrows: 1 }, // No
			]);

			const result = await runCli(cwd, inputs);
			expect(result.code).toBe(0);

			mustExist(cwd, ".gitignore");
			mustExist(cwd, "README.md");
			mustExist(cwd, ".editorconfig");
			mustExist(cwd, ".vscode/settings.json");
			mustExist(cwd, "biome.json");
			mustExist(cwd, "tsconfig.json");
			// No src dir, no vitest, no eslint
			expect(existsSync(path.join(cwd, "src"))).toBe(false);
			expect(existsSync(path.join(cwd, "vitest.config.ts"))).toBe(false);
			expect(existsSync(path.join(cwd, "eslint.config.mjs"))).toBe(false);
		} finally {
			await cleanup();
		}
	}, 30000);

	it("backend JS + Eslint + No-test + No-vscode + No-src + No-scripts (minimal)", async () => {
		const { cwd, cleanup } = await setupSmoke();
		try {
			// JS / Eslint / No-test / No-vscode / No-src / No-scripts
			const inputs = encodeAnswers([
				{ key: "stack", arrows: 1 }, // Backend
				{ key: "wichManager", arrows: 0 }, // NPM
				{ key: "hasPackageJson", arrows: 0 }, // Yes
				{ key: "wichLanguage", arrows: 0 }, // Javascript
				{ key: "wichLinter", arrows: 0 }, // Eslint
				{ key: "wichTest", arrows: 1 }, // No
				{ key: "isVscode", arrows: 1 }, // No
				{ key: "createDirectories", arrows: 1 }, // No
				{ key: "addScripts", arrows: 1 }, // No
			]);

			const result = await runCli(cwd, inputs);
			expect(result.code).toBe(0);

			mustExist(cwd, ".gitignore");
			mustExist(cwd, "README.md");
			mustExist(cwd, "eslint.config.mjs");
			expect(existsSync(path.join(cwd, "tsconfig.json"))).toBe(false);
			expect(existsSync(path.join(cwd, "biome.json"))).toBe(false);
			expect(existsSync(path.join(cwd, ".editorconfig"))).toBe(false);
			expect(existsSync(path.join(cwd, ".vscode"))).toBe(false);
		} finally {
			await cleanup();
		}
	}, 30000);

	it("frontend TS + React + Eslint + VSCode", async () => {
		const { cwd, cleanup } = await setupSmoke();
		try {
			// Frontend questions order: hasPackageJson, wichManager, wichLanguage, wichLinter, isVscode, wichStack
			// Defaults: Yes / NPM / Javascript / Eslint / Yes / N/A
			// Want: Yes / NPM / TS (down 1) / Eslint / Yes / React (down 1)
			const inputs = encodeAnswers([
				{ key: "stack", arrows: 0 }, // Frontend (default)
				{ key: "hasPackageJson", arrows: 0 }, // Yes
				{ key: "wichManager", arrows: 0 }, // NPM
				{ key: "wichLanguage", arrows: 1 }, // Typescript
				{ key: "wichLinter", arrows: 0 }, // Eslint
				{ key: "isVscode", arrows: 0 }, // Yes
				{ key: "wichStack", arrows: 1 }, // React
			]);

			const result = await runCli(cwd, inputs);
			expect(result.code).toBe(0);

			mustExist(cwd, ".gitignore");
			mustExist(cwd, "README.md");
			mustExist(cwd, "eslint.config.mjs");
			mustExist(cwd, ".editorconfig");
			mustExist(cwd, ".vscode/settings.json");
			// Verify the React+TS ESLint config was copied
			const eslintContent = readFileSync(
				path.join(cwd, "eslint.config.mjs"),
				"utf8",
			);
			expect(eslintContent).toContain("react");
		} finally {
			await cleanup();
		}
	}, 30000);

	it("frontend JS + Vue.js + Biome + No-vscode", async () => {
		const { cwd, cleanup } = await setupSmoke();
		try {
			// Frontend: Yes / NPM / Javascript / Biome (down 1) / No-vscode (down 1) / Vue (down 3)
			const inputs = encodeAnswers([
				{ key: "stack", arrows: 0 }, // Frontend
				{ key: "hasPackageJson", arrows: 0 }, // Yes
				{ key: "wichManager", arrows: 0 }, // NPM
				{ key: "wichLanguage", arrows: 0 }, // Javascript
				{ key: "wichLinter", arrows: 1 }, // Biome
				{ key: "isVscode", arrows: 1 }, // No
				{ key: "wichStack", arrows: 3 }, // Vue.js
			]);

			const result = await runCli(cwd, inputs);
			expect(result.code).toBe(0);

			mustExist(cwd, "biome.json");
			// No eslint file because Biome was chosen
			expect(existsSync(path.join(cwd, "eslint.config.mjs"))).toBe(false);
			// No VSCode since user said No
			expect(existsSync(path.join(cwd, ".vscode"))).toBe(false);
			expect(existsSync(path.join(cwd, ".editorconfig"))).toBe(false);
		} finally {
			await cleanup();
		}
	}, 30000);

	it("frontend TS + N/A stack + No linter (degenerate case)", async () => {
		const { cwd, cleanup } = await setupSmoke();
		try {
			// Frontend: Yes / NPM / TS (down 1) / No (down 2) / Yes / N/A (default)
			const inputs = encodeAnswers([
				{ key: "stack", arrows: 0 }, // Frontend
				{ key: "hasPackageJson", arrows: 0 }, // Yes
				{ key: "wichManager", arrows: 0 }, // NPM
				{ key: "wichLanguage", arrows: 1 }, // Typescript
				{ key: "wichLinter", arrows: 2 }, // No
				{ key: "isVscode", arrows: 0 }, // Yes
				{ key: "wichStack", arrows: 0 }, // N/A
			]);

			const result = await runCli(cwd, inputs);
			expect(result.code).toBe(0);

			mustExist(cwd, ".gitignore");
			mustExist(cwd, "README.md");
			mustExist(cwd, ".editorconfig");
			mustExist(cwd, ".vscode/settings.json");
			expect(existsSync(path.join(cwd, "eslint.config.mjs"))).toBe(false);
			expect(existsSync(path.join(cwd, "biome.json"))).toBe(false);
		} finally {
			await cleanup();
		}
	}, 30000);
});
