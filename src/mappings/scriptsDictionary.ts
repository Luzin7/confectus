import type { TestKey } from "./templatesDictionary";

export type ScriptsDictionary = {
	readonly willTest: TestKey;
	readonly hasSrc: boolean;
	readonly isTypescript: boolean;
};

const buildScripts = ({
	willTest,
	hasSrc,
	isTypescript,
}: ScriptsDictionary): Record<string, string> => {
	const scripts: Record<string, string> = {};

	if (isTypescript) {
		scripts.build = "tsc";
		if (hasSrc) {
			scripts.dev = "tsx ./src/app.ts";
			scripts.start = "npm run build && node ./dist/app.js";
		} else {
			scripts.dev = "tsx app.ts";
			scripts.start = "npm run build && node ./dist/app.js";
		}
		return { ...scripts, ...(willTest === "Vitest" ? { test: "vitest" } : {}) };
	}

	if (hasSrc) {
		scripts.dev = "node --watch ./src/app.js";
		scripts.start = "node ./src/app.js";
	} else {
		scripts.dev = "node --watch app.js";
		scripts.start = "node app.js";
	}

	return { ...scripts, ...(willTest === "Vitest" ? { test: "vitest" } : {}) };
};

export const scriptsFor = (input: ScriptsDictionary): Record<string, string> =>
	buildScripts(input);
