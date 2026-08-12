#!/usr/bin/env node
import { pipeline } from "@pipeline";
import chalk from "chalk";
import { buildEnv } from "@shared/env";
import { ConfectusError } from "@errors";

export async function main(): Promise<void> {
	const result = await pipeline(buildEnv({ isDev: process.env.NODE_ENV === "development" }));

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
