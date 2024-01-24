import { SetupManagerRepository } from "../contracts/SetupManagerRepository";
import Answers from "src/types/answers";
import path from "path";
import fs from "fs-extra";
import { InitializeNewProjectRepository } from "src/modules/initializeNewProject/repositories/contracts/InitializeNewProjectRepository";
import { DepedenciesInstallerRepository } from "src/modules/depedenciesInstaller/repositories/contracts/DepedenciesInstallerRepository";
import managers from "src/infra/cli/managers";
import { TemplatesManagerRepository } from "src/modules/templatesManager/repositories/contracts/TemplatesManagerRepository";

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
  }: Pick<
    Answers,
    "wichLanguage" | "willLint" | "wichManager"
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
  }

  async setupConfigurations({
    hasPackageJson,
    isVscode,
    wichManager,
    wichLanguage,
    willLint,
  }: Pick<
    Answers,
    "hasPackageJson" | "isVscode" | "wichManager" | "wichLanguage" | "willLint"
  >): Promise<void> {
    const isDevelopment = process.env.NODE_ENV === "development";
    const isTypescript = wichLanguage === "Typescript";

    if (hasPackageJson === "No") {
      const { initCommand } = managers[wichManager];
      await this.initializeNewProjectRepository.install(initCommand);
    }

    fs.mkdirSync(isDevelopment ? "./mock/src" : "src", { recursive: true });

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

      await this.templatesManagerRepository.install(
        ["typescript", "tsconfig.json"],
        "tsconfig.json",
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
