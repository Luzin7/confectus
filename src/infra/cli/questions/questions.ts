import chalk from "chalk";
import { QuestionProps } from "src/types/question";

export const questions: QuestionProps[] = [
  {
    name: "hasPackageJson",
    type: "list",
    message: `📦 Have you already initialized your project with a ${chalk.bgWhiteBright(
      "init command",
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
    name: "isVscode",
    type: "list",
    message: `💻 Are you using ${chalk.blueBright("VS Code")}?`,
    choices: ["Yes", "No"],
  },
  {
    name: "wichLanguage",
    type: "list",
    message: `🪛  Wich language do you want to use?`,
    choices: ["Javascript", "Typescript"],
  },
  {
    name: "willLint",
    type: "list",
    message: `🧹 Do you want to configure ${chalk.magentaBright(
      "ESLint",
    )} to lint your code?`,
    choices: ["Yes", "No"],
  },
  // {
  //   name: 'test',
  //   type: 'list',
  //   message: `🧪 Do you want to setup a ${chalk.yellowBright(
  //     'Test',
  //   )} to this project?`,
  //   choices: ['vitest'],
  // },
];
