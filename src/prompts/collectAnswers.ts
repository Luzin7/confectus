import inquirer from "inquirer";
import chalk from "chalk";
import type { Answers } from "@schema/configSchema";
import { QuestionnaireError } from "@errors";

type QuestionType = "list";

type PromptQuestion = {
	readonly name: string;
	readonly type: QuestionType;
	readonly message: string;
	readonly choices: readonly string[];
};

const stackQuestion: PromptQuestion[] = [
	{
		name: "stack",
		type: "list",
		message: "Which stack do you want to use?",
		choices: ["Frontend", "Backend"],
	},
];

const backendQuestions: PromptQuestion[] = [
	{
		name: "wichManager",
		type: "list",
		message: `🛠️  Which ${chalk.bold.underline("package manager")} do you want to use?`,
		choices: ["NPM", "Yarn", "Bun", "PNPM"],
	},
	{
		name: "hasPackageJson",
		type: "list",
		message: `📦 Have you already created your ${chalk.whiteBright.underline("package.json")}?`,
		choices: ["Yes", "No"],
	},
	{
		name: "wichLanguage",
		type: "list",
		message: `🪛  Wich ${chalk.cyan("language")} do you want to use?`,
		choices: ["Javascript", "Typescript"],
	},
	{
		name: "wichLinter",
		type: "list",
		message: `🧹 Do you want to add ${chalk.blue("linter")} to lint your code?`,
		choices: ["Eslint", "Biome", "No"],
	},
	{
		name: "wichTest",
		type: "list",
		message: `🧪 Do you want to setup a ${chalk.greenBright("Test")} runner for this project?`,
		choices: ["Vitest", "No"],
	},
	{
		name: "isVscode",
		type: "list",
		message: `💻 Do you want to create a ${chalk.blueBright(".vscode")} folder?`,
		choices: ["Yes", "No"],
	},
	{
		name: "createDirectories",
		type: "list",
		message: `📂 Do you want to create a ${chalk.whiteBright.underline("src")} directory?`,
		choices: ["Yes", "No"],
	},
	{
		name: "addScripts",
		type: "list",
		message: `💻 Do you want to implement common ${chalk.greenBright("scripts")} into your package.json (dev, start, test...)?`,
		choices: ["Yes", "No"],
	},
];

const frontendQuestions: PromptQuestion[] = [
	{
		name: "hasPackageJson",
		type: "list",
		message: `📦 Have you already created your ${chalk.whiteBright.underline("package.json")}?`,
		choices: ["Yes", "No"],
	},
	{
		name: "wichManager",
		type: "list",
		message: `🛠️  Which ${chalk.bold.underline("package manager")} do you want to use?`,
		choices: ["NPM", "Yarn", "Bun", "PNPM"],
	},
	{
		name: "wichLanguage",
		type: "list",
		message: `🪛  Wich ${chalk.cyan("language")} do you want to use?`,
		choices: ["Javascript", "Typescript"],
	},
	{
		name: "wichLinter",
		type: "list",
		message: `🧹 Do you want to add ${chalk.blue("linter")} to lint your code?`,
		choices: ["Eslint", "Biome", "No"],
	},
	{
		name: "isVscode",
		type: "list",
		message: `💻 Do you want to create a ${chalk.blueBright(".vscode")} folder?`,
		choices: ["Yes", "No"],
	},
	{
		name: "wichStack",
		type: "list",
		message: "🛠️  Which stack are you using?",
		choices: ["N/A", "React", "Next.js", "Vue.js"],
	},
];

const prompt = async (questions: PromptQuestion[]): Promise<Record<string, string>> => {
	try {
		return await inquirer.prompt(questions as never);
	} catch (e) {
		throw new QuestionnaireError(e);
	}
};

export const collectAnswers = async (): Promise<Record<string, string>> => {
	const stack = await prompt(stackQuestion);
	const rest = await prompt(stack.stack === "Backend" ? backendQuestions : frontendQuestions);
	return { ...stack, ...rest };
};

export type { Answers };
