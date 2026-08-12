import { existsSync, readFileSync } from "fs";
import path from "path";
import { describe, expect, it, vi } from "vitest";

vi.unmock("fs-extra");
vi.unmock("child_process");

const { fileWriter } = await import("@generators/fileWriter");
const { setupTestEnv } = await import("../setup/tmpdir");

type FileOp = { src: readonly string[]; dest: string };

const fileContent = (dir: string, rel: string): string =>
	readFileSync(path.join(dir, rel), "utf8");

const buildEnv = (env: {
	cwd: string;
	templatesRoot: string;
	isDev?: boolean;
}) => ({
	cwd: env.cwd,
	templatesRoot: env.templatesRoot,
	isDev: env.isDev ?? false,
});

describe("fileWriter — TDD via tmpdir", () => {
	it("copies gitignore + README from real templates into cwd", async () => {
		const env = setupTestEnv();
		try {
			const targetEnv = buildEnv(env);
			const ops: FileOp[] = [
				{ src: ["git", "gitignore"], dest: ".gitignore" },
				{ src: ["git", "README.md"], dest: "README.md" },
			];

			await fileWriter(ops, targetEnv);

			expect(existsSync(path.join(env.cwd, ".gitignore"))).toBe(true);
			expect(existsSync(path.join(env.cwd, "README.md"))).toBe(true);
			expect(fileContent(env.cwd, ".gitignore")).toContain("node_modules");
		} finally {
			env.cleanup();
		}
	});

	it("creates nested directories when destination has subpaths (.vscode/settings.json)", async () => {
		const env = setupTestEnv();
		try {
			const targetEnv = buildEnv(env);
			const ops: FileOp[] = [
				{
					src: ["ide", "vscode", "settings", "eslint", "settings.json"],
					dest: ".vscode/settings.json",
				},
				{ src: ["ide", "vscode", ".editorconfig"], dest: ".editorconfig" },
			];

			await fileWriter(ops, targetEnv);

			expect(existsSync(path.join(env.cwd, ".vscode", "settings.json"))).toBe(
				true,
			);
			expect(existsSync(path.join(env.cwd, ".editorconfig"))).toBe(true);
			expect(fileContent(env.cwd, ".vscode/settings.json")).toContain("eslint");
		} finally {
			env.cleanup();
		}
	});

	it("copies backend biome template to .json file (regression: bug used to copy VSCode settings.json)", async () => {
		const env = setupTestEnv();
		try {
			const targetEnv = buildEnv(env);
			const ops: FileOp[] = [
				{
					src: ["backend", "linters", "biome", "biome.json"],
					dest: "biome.json",
				},
			];

			await fileWriter(ops, targetEnv);

			const content = fileContent(env.cwd, "biome.json");
			expect(content).toContain("linter");
			expect(content).not.toContain("eslint");
		} finally {
			env.cleanup();
		}
	});

	it("preserves file content byte-for-byte (eslint React TS config)", async () => {
		const env = setupTestEnv();
		try {
			const targetEnv = buildEnv(env);
			const ops: FileOp[] = [
				{
					src: [
						"frontend",
						"linters",
						"react",
						"eslint",
						"typescript",
						"eslint.config.mjs",
					],
					dest: "eslint.config.mjs",
				},
			];

			await fileWriter(ops, targetEnv);

			const expectedSource = fileContent(
				env.templatesRoot,
				"frontend/linters/react/eslint/typescript/eslint.config.mjs",
			);
			const written = fileContent(env.cwd, "eslint.config.mjs");
			expect(written).toEqual(expectedSource);
		} finally {
			env.cleanup();
		}
	});

	it("throws TemplateCopyError with code when source template does not exist", async () => {
		const env = setupTestEnv();
		try {
			const targetEnv = buildEnv(env);
			const ops: FileOp[] = [
				{ src: ["nonexistent", "missing.config"], dest: "missing.config" },
			];

			await expect(fileWriter(ops, targetEnv)).rejects.toMatchObject({
				code: "TEMPLATE_COPY_ERROR",
			});
		} finally {
			env.cleanup();
		}
	});

	it("overwrites an existing file at the destination", async () => {
		const env = setupTestEnv();
		try {
			const targetEnv = buildEnv(env);
			const ops: FileOp[] = [{ src: ["git", "README.md"], dest: "README.md" }];

			const original = fileContent(env.templatesRoot, "git/README.md");
			await fileWriter(ops, targetEnv);
			await fileWriter(ops, targetEnv);

			expect(fileContent(env.cwd, "README.md")).toEqual(original);
		} finally {
			env.cleanup();
		}
	});

	it("writes to mock/ subdirectory when env.isDev=true", async () => {
		const env = setupTestEnv();
		try {
			const targetEnv = buildEnv({ ...env, isDev: true });
			const ops: FileOp[] = [{ src: ["git", "gitignore"], dest: ".gitignore" }];

			await fileWriter(ops, targetEnv);

			expect(existsSync(path.join(env.cwd, "mock", ".gitignore"))).toBe(true);
			expect(existsSync(path.join(env.cwd, ".gitignore"))).toBe(false);
		} finally {
			env.cleanup();
		}
	});
});
