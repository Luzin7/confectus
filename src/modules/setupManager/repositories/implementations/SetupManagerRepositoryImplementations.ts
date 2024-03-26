import managers from "@/infra/cli/managers";
import { DepedenciesInstallerRepository } from "@/modules/depedenciesInstaller/repositories/contracts/DepedenciesInstallerRepository";
import {
  backendDependeciesSetup,
  frontendDependeciesSetup,
} from "@/modules/depedenciesInstaller/setups";
import { InitializeNewProjectRepository } from "@/modules/initializeNewProject/repositories/contracts/InitializeNewProjectRepository";
import { TemplatesManagerRepository } from "@/modules/templatesManager/repositories/contracts/TemplatesManagerRepository";
import { generateScripts } from "@/templates/backend/scripts/generateScripts";
import { SettingsProps } from "@/types/setting";
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
    stack,
  }: Pick<
    Answers,
    "wichLanguage" | "wichLinter" | "wichManager" | "wichTest" | "stack"
  >): Promise<void> {
    const { installCommand } = managers[wichManager];
    const isTypescript: boolean = wichLanguage === "Typescript";
    const stackChoiced: SettingsProps =
      stack === "Backend" ? backendDependeciesSetup : frontendDependeciesSetup;

    const installDependency = async (dependency: string) => {
      await this.depedenciesInstallerRepository.install(
        installCommand,
        dependency,
        stackChoiced,
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
    createDirectories,
    addScripts,
    stack,
  }: Pick<
    Answers,
    | "hasPackageJson"
    | "isVscode"
    | "wichLanguage"
    | "wichManager"
    | "wichTest"
    | "wichLinter"
    | "createDirectories"
    | "addScripts"
    | "stack"
  >): Promise<void> {
    const isDevelopment = process.env.NODE_ENV === "development";
    const isTypescript = wichLanguage === "Typescript";
    const willTest = wichTest === "Vitest";
    const willHaveSrcDirectory = createDirectories === "Yes";
    const willAddScripts = addScripts === "Yes";
    const linterChoiced = wichLinter;
    const stackChoiced =
      stack === "Backend" ? backendDependeciesSetup : frontendDependeciesSetup;

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

    await installTemplate(["git", "gitignore"], ".gitignore");
    await installTemplate(["git", "README.md"], "README.md");

    if (hasPackageJson === "No") {
      const { initCommand } = managers[wichManager];
      await this.initializeNewProjectRepository.install(initCommand);
    }

    if (willAddScripts) {
      const packageJsonPath = isDevelopment
        ? "./mock/package.json"
        : "package.json";

      const scripts = generateScripts(
        willTest,
        willHaveSrcDirectory,
        isTypescript,
      );

      const packageJson = await fs.readJson(packageJsonPath);

      packageJson.scripts = { ...packageJson.scripts, ...scripts };

      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }

    if (willHaveSrcDirectory) {
      await createDirectory("src");
      willTest && (await createDirectory("src/test"));

      isTypescript
        ? await installTemplate(
            stackChoiced.greetings.configFiles.configFilePath,
            path.join("src", "app.ts"),
          )
        : await installTemplate(
            stackChoiced.greetings.configFiles.configFilePath,
            path.join("src", "app.js"),
          );
    }

    if (isVscode === "Yes") {
      await installTemplate(
        stackChoiced.editorconfig.configFiles.configFilePath,
        stackChoiced.editorconfig.configFiles.configFileName,
      );
      if (linterChoiced === "Biome") {
        return await installTemplate(
          stackChoiced.biome.configFiles.configFilePath,
          path.join(".vscode", "settings.json"),
        );
      }

      await installTemplate(
        stackChoiced.vscode.configFiles.configFilePath,
        path.join(".vscode", "settings.json"),
      );
    }

    if (isTypescript) {
      await installTemplate(
        stackChoiced[wichLanguage.toLowerCase()].configFiles.configFilePath,
        stackChoiced[wichLanguage.toLowerCase()].configFiles.configFileName,
      );
      if (willTest) {
        const typescriptTest = "vitestts";
        await installTemplate(
          stackChoiced[typescriptTest.toLowerCase()].configFiles.configFilePath,
          stackChoiced[typescriptTest.toLowerCase()].configFiles.configFileName,
        );
      }
    }

    if (willTest && !isTypescript) {
      await installTemplate(
        stackChoiced[wichTest.toLowerCase()].configFiles.configFilePath,
        stackChoiced[wichTest.toLowerCase()].configFiles.configFileName,
      );
    }

    if (linterChoiced !== "No") {
      if (linterChoiced === "Eslint") {
        const lintDependency = isTypescript ? "eslintts" : "eslint";

        await installTemplate(
          stackChoiced[lintDependency.toLowerCase()].configFiles.configFilePath,
          stackChoiced[lintDependency.toLowerCase()].configFiles.configFileName,
        );
      }
      if (linterChoiced === "Biome") {
        await installTemplate(
          stackChoiced[linterChoiced.toLowerCase()].configFiles.configFilePath,
          stackChoiced[linterChoiced.toLowerCase()].configFiles.configFileName,
        );
      }
    }
  }
}
