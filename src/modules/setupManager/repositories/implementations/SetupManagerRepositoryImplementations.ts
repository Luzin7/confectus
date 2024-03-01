import managers from "@/infra/cli/managers";
import { DepedenciesInstallerRepository } from "@/modules/depedenciesInstaller/repositories/contracts/DepedenciesInstallerRepository";
import { InitializeNewProjectRepository } from "@/modules/initializeNewProject/repositories/contracts/InitializeNewProjectRepository";
import { TemplatesManagerRepository } from "@/modules/templatesManager/repositories/contracts/TemplatesManagerRepository";
import fs from "fs-extra";
import path from "path";
import Answers from "../../../../types/answers/index";
import { SetupManagerRepository } from "../contracts/SetupManagerRepository";

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
    wichLinter,
    wichManager,
    wichTest,
  }: Pick<
    Answers,
    "wichLanguage" | "wichLinter" | "wichManager" | "wichTest"
  >): Promise<void> {
    const { installCommand } = managers[wichManager];
    const isTypescript = wichLanguage === "Typescript";

    const installDependency = async (dependency: string) => {
      await this.depedenciesInstallerRepository.install(
        installCommand,
        dependency,
      );
    };

    if (isTypescript) {
      await installDependency(wichLanguage);
    }

    if (wichLinter !== "No") {
      if (wichLinter === "Eslint") {
        const lintDependency = isTypescript ? "EslintTS" : "Eslint";
        await installDependency(lintDependency);
      }
      if (wichLinter === "Biome") {
        const biomeDependency = wichLinter;
        await installDependency(biomeDependency);
      }
    }

    if (wichTest === "Vitest") {
      const testDependency = isTypescript ? "VitestTS" : "Vitest";
      await installDependency(testDependency);
    }
  }

  async setupConfigurations({
    hasPackageJson,
    isVscode,
    wichManager,
    wichLanguage,
    wichLinter,
    wichTest,
  }: Pick<
    Answers,
    | "hasPackageJson"
    | "isVscode"
    | "wichLanguage"
    | "wichManager"
    | "wichTest"
    | "wichLinter"
  >): Promise<void> {
    const isDevelopment = process.env.NODE_ENV === "development";
    const isTypescript = wichLanguage === "Typescript";
    const willTest = wichTest === "Vitest";

    const createDirectory = async (directory: string) => {
      await fs.mkdir(isDevelopment ? `./mock/${directory}` : directory, {
        recursive: true,
      });
    };

    const installTemplate = async (
      templatePath: string[],
      outputPath: string,
    ) => {
      await this.templatesManagerRepository.install(templatePath, outputPath);
    };

    if (hasPackageJson === "No") {
      const { initCommand } = managers[wichManager];
      await this.initializeNewProjectRepository.install(initCommand);
    }

    await createDirectory("src");
    willTest && (await createDirectory("src/test"));

    await installTemplate(["git", "gitignore"], ".gitignore");

    if (isVscode === "Yes") {
      await installTemplate(
        ["ide", "vscode", ".editorconfig"],
        ".editorconfig",
      );
      if (wichLinter === "Biome") {
        return await installTemplate(
          ["ide", "vscode", "settings", "biome", "settings.json"],
          path.join(".vscode", "settings.json"),
        );
      }

      await installTemplate(
        ["ide", "vscode", "settings", "eslint", "settings.json"],
        path.join(".vscode", "settings.json"),
      );
    }

    if (isTypescript) {
      await installTemplate(
        ["greetings", "helloWorld.ts"],
        path.join("src", "app.ts"),
      );
      await installTemplate(["typescript", "tsconfig.json"], "tsconfig.json");

      if (willTest) {
        await installTemplate(
          ["frameworks", "configs", "vitest", "vitest.config.ts"],
          "vitest.config.ts",
        );
      }
    } else {
      await installTemplate(
        ["greetings", "helloWorld.ts"],
        path.join("src", "app.js"),
      );
    }

    if (willTest && !isTypescript) {
      await installTemplate(
        ["frameworks", "configs", "vitest", "vitest.config.js"],
        "vitest.config.js",
      );
    }

    if (wichLinter !== "No") {
      if (wichLinter === "Eslint") {
        await installTemplate(
          [
            "linters",
            "eslint",
            isTypescript ? "typescript" : "javascript",
            ".eslintrc.json",
          ],
          ".eslintrc.json",
        );
      }
      if (wichLinter === "Biome") {
        await installTemplate(["linters", "biome", "biome.json"], "biome.json");
      }
    }
  }
}
