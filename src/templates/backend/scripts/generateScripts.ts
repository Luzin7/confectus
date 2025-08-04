export function generateScripts(
	willTest: boolean,
	willHaveSrcDirectory: boolean,
	isTypescript: boolean,
): Record<string, string> {
	const scripts: Record<string, string> = {
		start: isTypescript ? "npm run build && node ./dist/app.js" : "node app.js",
		dev: isTypescript ? "tsx app.ts" : "node --watch app.js",
	};

	if (isTypescript) {
		scripts.build = "tsc";
	}

	if (willHaveSrcDirectory) {
		if (!isTypescript) {
			scripts.start = "node ./src/app.js";
		}
		scripts.dev = isTypescript
			? "tsx ./src/app.ts"
			: "node --watch ./src/app.js";
	}

	if (willTest) {
		scripts.test = "vitest";
	}

	return scripts;
}
