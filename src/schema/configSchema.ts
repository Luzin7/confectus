import { z } from "zod";

export const configSchema = z.object({
	stack: z.enum(["Frontend", "Backend"]),
	wichManager: z.enum(["NPM", "Yarn", "Bun", "PNPM"]),
	wichLanguage: z.enum(["Javascript", "Typescript"]),
	wichLinter: z.enum(["Eslint", "Biome", "No"]),
	hasPackageJson: z.enum(["Yes", "No"]),
	isVscode: z.enum(["Yes", "No"]),

	wichTest: z.enum(["Vitest", "No"]).optional(),
	createDirectories: z.enum(["Yes", "No"]).optional(),
	addScripts: z.enum(["Yes", "No"]).optional(),
	wichStack: z.enum(["N/A", "React", "Next.js", "Vue.js"]).optional(),
});

export type RawAnswers = z.input<typeof configSchema>;

export type BackendAnswers = {
	readonly stack: "Backend";
	readonly wichManager: z.infer<typeof configSchema>["wichManager"];
	readonly wichLanguage: z.infer<typeof configSchema>["wichLanguage"];
	readonly wichLinter: z.infer<typeof configSchema>["wichLinter"];
	readonly hasPackageJson: z.infer<typeof configSchema>["hasPackageJson"];
	readonly isVscode: z.infer<typeof configSchema>["isVscode"];
	readonly wichTest: "Vitest" | "No";
	readonly createDirectories: "Yes" | "No";
	readonly addScripts: "Yes" | "No";
};

export type FrontendAnswers = {
	readonly stack: "Frontend";
	readonly wichManager: z.infer<typeof configSchema>["wichManager"];
	readonly wichLanguage: z.infer<typeof configSchema>["wichLanguage"];
	readonly wichLinter: z.infer<typeof configSchema>["wichLinter"];
	readonly hasPackageJson: z.infer<typeof configSchema>["hasPackageJson"];
	readonly isVscode: z.infer<typeof configSchema>["isVscode"];
	readonly wichStack: "N/A" | "React" | "Next.js" | "Vue.js";
};

export type Answers = BackendAnswers | FrontendAnswers;
