#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ConfectusError } from "@errors";
import { pipeline } from "@pipeline";
import { buildEnv } from "@shared/env";
import chalk from "chalk";

export async function main(): Promise<void> {
	const moduleDir = path.dirname(fileURLToPath(import.meta.url));
	const result = await pipeline(
		buildEnv({
			isDev: process.env.NODE_ENV === "development",
			templatesRoot: path.join(moduleDir, "templates"),
		}),
	);

	if (result.kind === "Right") {
		console.log(`\n${chalk.green("✔")} Project setup completed successfully!`);
		console.log(`${chalk.cyan("✨")} Everything is ready to start developing!`);
		return;
	}

	const error = result.error;
	console.log(`\n${chalk.red("💥")} Project setup failed!`);
	if (error instanceof ConfectusError) {
		console.error(`${chalk.red("●")} ${error.message}`);
	}
	if (process.env.NODE_ENV === "development" && error.cause) {
		console.error({ cause: error.cause });
	}
	process.exit(1);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
