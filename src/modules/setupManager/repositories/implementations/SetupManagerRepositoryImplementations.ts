import { SetupManagerRepository } from "../contracts/SetupManagerRepository";
import path from "path";
import fs from "fs-extra";
import { InitializeNewProjectRepository } from "@/modules/initializeNewProject/repositories/contracts/InitializeNewProjectRepository";
import { DepedenciesInstallerRepository } from "@/modules/depedenciesInstaller/repositories/contracts/DepedenciesInstallerRepository";
import { TemplatesManagerRepository } from "@/modules/templatesManager/repositories/contracts/TemplatesManagerRepository";
import { Answers } from "inquirer";
import managers from "@/infra/cli/managers";

export class SetupManagerRepositoryImplementation
  implements SetupManagerRepository
{
  constructor(
    private initializeNewProjectRepository: InitializeNewProjectRepository,
    private depedenciesInstallerRepository: DepedenciesInstallerRepository,
    private templatesManagerRepository: TemplatesManagerRepository,
  ) {}

  async installDependencies({
    wichLanguage,
    willLint,
    wichManager,
    wichTest,
  }: Pick<
    Answers,
    "wichLanguage" | "willLint" | "wichManager" | "wichTest"
  >): Promise<void> {
    const { installCommand } = managers[wichManager];
    const isTypescript = wichLanguage === "Typescript";

    if (isTypescript) {
      await this.depedenciesInstallerRepository.install(
        installCommand,
        wichLanguage,
      );
    }

    if (willLint === "Yes") {
      await this.depedenciesInstallerRepository.install(
        installCommand,
        isTypescript ? "EslintTS" : "Eslint",
      );
    }

    if (wichTest === "Vitest") {
      await this.depedenciesInstallerRepository.install(
        installCommand,
        isTypescript ? "VitestTS" : "Vitest",
      );
    }
  }

  async setupConfigurations({
    hasPackageJson,
    isVscode,
    wichManager,
    wichLanguage,
    willLint,
    wichTest,
  }: Pick<
    Answers,
    | "hasPackageJson"
    | "isVscode"
    | "wichLanguage"
    | "wichManager"
    | "wichTest"
    | "willLint"
  >): Promise<void> {
    const isDevelopment = process.env.NODE_ENV === "development";
    const isTypescript = wichLanguage === "Typescript";
    const willTest = wichTest === "Vitest";

    if (hasPackageJson === "No") {
      const { initCommand } = managers[wichManager];
      await this.initializeNewProjectRepository.install(initCommand);
    }

    await fs.mkdir(isDevelopment ? "./mock/src" : "src", { recursive: true });
    willTest &&
      (await fs.mkdir(isDevelopment ? "./mock/src/test" : "src/test", {
        recursive: true,
      }));

    await this.templatesManagerRepository.install(
      ["git", "gitignore"],
      ".gitignore",
    );

    if (isVscode === "Yes") {
      await this.templatesManagerRepository.install(
        ["ide", "vscode", ".editorconfig"],
        ".editorconfig",
      );

      await this.templatesManagerRepository.install(
        ["ide", "vscode", "settings.json"],
        path.join(".vscode", "settings.json"),
      );
    }

    if (isTypescript) {
      await this.templatesManagerRepository.install(
        ["greetings", "helloWorld.ts"],
        path.join("src", "app.ts"),
      );

      wichTest === "Vitest"
        ? await this.templatesManagerRepository.install(
            ["typescript", "tests", "vitest", "tsconfig.json"],
            "tsconfig.json",
          )
        : await this.templatesManagerRepository.install(
            ["typescript", "tsconfig.json"],
            "tsconfig.json",
          );
    }

    if (willTest) {
      isTypescript
        ? await this.templatesManagerRepository.install(
            ["frameworks", "configs", "vitest", "vitest.config.ts"],
            "vitest.config.ts",
          )
        : await this.templatesManagerRepository.install(
            ["frameworks", "configs", "vitest", "vitest.config.js"],
            "vitest.config.js",
          );
    }

    if (!isTypescript) {
      await this.templatesManagerRepository.install(
        ["greetings", "helloWorld.ts"],
        path.join("src", "app.js"),
      );
    }

    if (willLint === "Yes") {
      isTypescript
        ? await this.templatesManagerRepository.install(
            ["lint", "typescript", ".eslintrc.json"],
            ".eslintrc.json",
          )
        : await this.templatesManagerRepository.install(
            ["lint", "javascript", ".eslintrc.json"],
            ".eslintrc.json",
          );
    }
  }
}
