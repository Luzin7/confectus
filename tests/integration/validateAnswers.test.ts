import { validateAnswers } from "@schema/validateAnswers";
import { describe, expect, it } from "vitest";

const validBackend = (overrides: Record<string, unknown> = {}) => ({
	stack: "Backend",
	wichManager: "NPM",
	wichLanguage: "Typescript",
	wichLinter: "Biome",
	hasPackageJson: "Yes",
	isVscode: "Yes",
	wichTest: "Vitest",
	createDirectories: "Yes",
	addScripts: "Yes",
	...overrides,
});

const validFrontend = (overrides: Record<string, unknown> = {}) => ({
	stack: "Frontend",
	wichManager: "NPM",
	wichLanguage: "Typescript",
	wichLinter: "Eslint",
	hasPackageJson: "Yes",
	isVscode: "Yes",
	wichStack: "React",
	...overrides,
});

describe("validateAnswers — happy paths", () => {
	it("returns Success<BackendAnswers> for valid backend input", () => {
		const result = validateAnswers(validBackend());
		expect(result.kind).toBe("Success");
		if (result.kind === "Success") {
			expect(result.value.stack).toBe("Backend");
			expect(result.value.wichTest).toBe("Vitest");
		}
	});

	it("returns Success<FrontendAnswers> for valid frontend input", () => {
		const result = validateAnswers(validFrontend());
		expect(result.kind).toBe("Success");
		if (result.kind === "Success") {
			expect(result.value.stack).toBe("Frontend");
		}
	});
});

describe("validateAnswers — schema-level failures", () => {
	it("fails on unknown stack", () => {
		const result = validateAnswers(validBackend({ stack: "Mobile" }));
		expect(result.kind).toBe("ParseError");
	});

	it("fails on missing required field (wichManager)", () => {
		const { wichManager: _drop, ...rest } = validBackend();
		expect(_drop).toBeDefined();
		const result = validateAnswers(rest);
		expect(result.kind).toBe("ParseError");
	});
});

describe("validateAnswers — cross-field validation", () => {
	it("fails when stack=Backend and wichTest is missing", () => {
		const { wichTest: _drop, ...rest } = validBackend();
		expect(_drop).toBeDefined();
		const result = validateAnswers(rest);
		expect(result.kind).toBe("ParseError");
		if (result.kind === "ParseError") {
			expect(result.issues.some((i) => i.includes("wichTest"))).toBe(true);
		}
	});

	it("fails when stack=Backend and createDirectories is missing", () => {
		const { createDirectories: _drop, ...rest } = validBackend();
		expect(_drop).toBeDefined();
		const result = validateAnswers(rest);
		expect(result.kind).toBe("ParseError");
		if (result.kind === "ParseError") {
			expect(result.issues.some((i) => i.includes("createDirectories"))).toBe(
				true,
			);
		}
	});

	it("fails when stack=Backend and addScripts is missing", () => {
		const { addScripts: _drop, ...rest } = validBackend();
		expect(_drop).toBeDefined();
		const result = validateAnswers(rest);
		expect(result.kind).toBe("ParseError");
		if (result.kind === "ParseError") {
			expect(result.issues.some((i) => i.includes("addScripts"))).toBe(true);
		}
	});

	it("fails when stack=Frontend and wichStack is missing", () => {
		const { wichStack: _drop, ...rest } = validFrontend();
		const result = validateAnswers(rest);
		expect(result.kind).toBe("ParseError");
		if (result.kind === "ParseError") {
			expect(result.issues.some((i) => i.includes("wichStack"))).toBe(true);
		}
	});

	it("fails when stack=Frontend but sends backend-only fields (wichTest)", () => {
		const result = validateAnswers({ ...validFrontend(), wichTest: "Vitest" });
		expect(result.kind).toBe("ParseError");
	});

	it("fails when stack=Frontend but sends backend-only fields (createDirectories)", () => {
		const result = validateAnswers({
			...validFrontend(),
			createDirectories: "Yes",
		});
		expect(result.kind).toBe("ParseError");
	});

	it("fails when stack=Frontend but sends backend-only fields (addScripts)", () => {
		const result = validateAnswers({ ...validFrontend(), addScripts: "Yes" });
		expect(result.kind).toBe("ParseError");
	});
});

describe("validateAnswers — non-object input", () => {
	it("fails on null", () => {
		expect(validateAnswers(null).kind).toBe("ParseError");
	});

	it("fails on undefined", () => {
		expect(validateAnswers(undefined).kind).toBe("ParseError");
	});

	it("fails on string", () => {
		expect(validateAnswers("not an object").kind).toBe("ParseError");
	});
});
