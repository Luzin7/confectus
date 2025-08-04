import { QuestionProps } from "@application/dtos/question";
import chalk from "chalk";

export const wichStackQuestion: QuestionProps[] = [
	{
		name: "stack",
		type: "list",
		message: "Which stack do you want to use?",
		choices: ["Frontend", "Backend"],
	},
];

export const backendQuestions: QuestionProps[] = [
	{
		name: "wichManager",
		type: "list",
		message: `🛠️  Which ${chalk.bold.underline(
			"package manager",
		)} do want to use?`,
		choices: ["NPM", "Yarn", "Bun", "PNPM"],
	},
	{
		name: "hasPackageJson",
		type: "list",
		message: `📦 Have you already created your ${chalk.whiteBright.underline(
			"package.json",
		)}?`,
		choices: ["No", "Yes"],
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
		message: `🧪 Do you want to setup a ${chalk.greenBright(
			"Test",
		)} to this project?`,
		choices: ["Vitest", "No"],
	},
	{
		name: "isVscode",
		type: "list",
		message: `💻 Do you want to create a ${chalk.blueBright(
			".vscode",
		)} folder?`,
		choices: ["Yes", "No"],
	},
	{
		name: "createDirectories",
		type: "list",
		message: `📂 Do you want to create a ${chalk.whiteBright.underline(
			"src",
		)} directory?`,
		choices: ["Yes", "No"],
	},
	{
		name: "addScripts",
		type: "list",
		message: `💻 Do you want implement common ${chalk.greenBright(
			"scripts",
		)} into your package.json (dev, start, test...)?`,
		choices: ["Yes", "No"],
	},
];

export const frontendQuestions: QuestionProps[] = [
	{
		name: "hasPackageJson",
		type: "list",
		message: `📦 Have you already created your ${chalk.whiteBright.underline(
			"package.json",
		)}?`,
		choices: ["Yes", "No"],
	},
	{
		name: "wichManager",
		type: "list",
		message: `🛠️  Which ${chalk.bold.underline(
			"package manager",
		)} do want to use?`,
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
		message: `💻 Do you want to create a ${chalk.blueBright(
			".vscode",
		)} folder?`,
		choices: ["Yes", "No"],
	},
	{
		name: "wichStack",
		type: "list",
		message: "🛠️  Which stack are you using?",
		choices: ["N/A", "React", "Next.js", "Vue.js"],
	},
];
