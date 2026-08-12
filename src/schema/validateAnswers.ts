import type { z } from "zod";
import {
	type Answers,
	type BackendAnswers,
	type FrontendAnswers,
	type RawAnswers,
	configSchema,
} from "./configSchema";

export type ParseError = {
	readonly kind: "ParseError";
	readonly issues: readonly string[];
};

export type Success<T> = {
	readonly kind: "Success";
	readonly value: T;
};

export type ValidationResult = Success<Answers> | ParseError;

const ok = <T>(value: T): Success<T> => ({ kind: "Success", value });
const err = (issues: readonly string[]): ParseError => ({
	kind: "ParseError",
	issues,
});

const collectIssues = (raw: Partial<RawAnswers>): string[] => {
	const issues: string[] = [];

	if (raw.stack === "Backend") {
		if (raw.wichTest === undefined) {
			issues.push("wichTest is required when stack is Backend");
		}
		if (raw.createDirectories === undefined) {
			issues.push("createDirectories is required when stack is Backend");
		}
		if (raw.addScripts === undefined) {
			issues.push("addScripts is required when stack is Backend");
		}
	}

	if (raw.stack === "Frontend") {
		if (raw.wichStack === undefined) {
			issues.push("wichStack is required when stack is Frontend");
		}
		if (raw.wichTest !== undefined) {
			issues.push("wichTest is only valid for Backend");
		}
		if (raw.createDirectories !== undefined) {
			issues.push("createDirectories is only valid for Backend");
		}
		if (raw.addScripts !== undefined) {
			issues.push("addScripts is only valid for Backend");
		}
	}

	return issues;
};

const buildBackend = (raw: z.infer<typeof configSchema>): BackendAnswers => ({
	stack: "Backend",
	wichManager: raw.wichManager,
	wichLanguage: raw.wichLanguage,
	wichLinter: raw.wichLinter,
	hasPackageJson: raw.hasPackageJson,
	isVscode: raw.isVscode,
	wichTest: raw.wichTest ?? "No",
	createDirectories: raw.createDirectories ?? "No",
	addScripts: raw.addScripts ?? "No",
});

const buildFrontend = (raw: z.infer<typeof configSchema>): FrontendAnswers => ({
	stack: "Frontend",
	wichManager: raw.wichManager,
	wichLanguage: raw.wichLanguage,
	wichLinter: raw.wichLinter,
	hasPackageJson: raw.hasPackageJson,
	isVscode: raw.isVscode,
	wichStack: raw.wichStack ?? "N/A",
});

export const validateAnswers = (raw: unknown): ValidationResult => {
	const parsed = configSchema.safeParse(raw);
	if (!parsed.success) {
		const issues = parsed.error.issues.map(
			(i) => `${i.path.join(".")}: ${i.message}`,
		);
		return err(issues);
	}

	const crossIssues = collectIssues(parsed.data);
	if (crossIssues.length > 0) {
		return err(crossIssues);
	}

	const answers: Answers =
		parsed.data.stack === "Backend"
			? buildBackend(parsed.data)
			: buildFrontend(parsed.data);

	return ok(answers);
};
