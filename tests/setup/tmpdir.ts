import { mkdtempSync, copyFileSync, mkdirSync, existsSync, readdirSync, rmSync, statSync } from "fs";
import path from "path";
import os from "os";

export type TestEnv = {
	readonly cwd: string;
	readonly templatesRoot: string;
	readonly cleanup: () => void;
};

const copyTemplatesInto = (dest: string, source: string): void => {
	if (!existsSync(source)) return;
	const entries = readdirSync(source);
	for (const entry of entries) {
		const srcPath = path.join(source, entry);
		const destPath = path.join(dest, entry);
		if (statSync(srcPath).isDirectory()) {
			mkdirSync(destPath, { recursive: true });
			copyTemplatesInto(destPath, srcPath);
		} else {
			copyFileSync(srcPath, destPath);
		}
	}
};

export const setupTestEnv = (templatesSource: string = path.resolve(__dirname, "../../src/templates")): TestEnv => {
	const cwd = mkdtempSync(path.join(os.tmpdir(), "confectus-test-"));
	const templatesRoot = path.join(cwd, "templates");
	mkdirSync(templatesRoot, { recursive: true });
	copyTemplatesInto(templatesRoot, templatesSource);
	return {
		cwd,
		templatesRoot,
		cleanup: () => rmSync(cwd, { recursive: true, force: true }),
	};
};
