import path from "node:path";
import { buildEnv } from "@shared/env";
import { describe, expect, it } from "vitest";

describe("buildEnv", () => {
	it("sets targetDir to cwd when isDev is false", () => {
		const env = buildEnv({
			cwd: "/tmp/project",
			templatesRoot: "/tmp/templates",
		});

		expect(env.isDev).toBe(false);
		expect(env.targetDir).toBe("/tmp/project");
		expect(env.targetDir).toBe(env.cwd);
	});

	it("sets targetDir to cwd/mock when isDev is true", () => {
		const env = buildEnv({
			cwd: "/tmp/project",
			templatesRoot: "/tmp/templates",
			isDev: true,
		});

		expect(env.isDev).toBe(true);
		expect(env.targetDir).toBe(path.join("/tmp/project", "mock"));
		expect(env.targetDir).not.toBe(env.cwd);
	});

	it("takes templatesRoot from the override instead of deriving it from cwd", () => {
		const env = buildEnv({
			cwd: "/tmp/project",
			templatesRoot: "/elsewhere/dist/templates",
		});

		expect(env.templatesRoot).toBe("/elsewhere/dist/templates");
		expect(env.templatesRoot).not.toBe(path.join(env.cwd, "templates"));
	});

	it("defaults cwd to process.cwd() when omitted", () => {
		const env = buildEnv({ templatesRoot: "/tmp/templates" });

		expect(env.cwd).toBe(process.cwd());
		expect(env.targetDir).toBe(process.cwd());
	});
});
