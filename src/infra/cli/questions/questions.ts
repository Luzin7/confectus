import { QuestionProps } from "@/types/question";
import chalk from "chalk";

export const questions: QuestionProps[] = [
  {
    name: "hasPackageJson",
    type: "list",
    message: `📦 Have you already initialized your project with a ${chalk.whiteBright.underline(
      "init command",
    )}?`,
    choices: ["No", "Yes"],
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
    name: "isVscode",
    type: "list",
    message: `💻 Do you want to create a ${chalk.blueBright(
      ".vscode",
    )} folder?`,
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
    message: `🧪 Do you want to setup a ${chalk.greenBright(
      "Test",
    )} to this project?`,
    choices: ["Vitest", "No"],
  },
];
