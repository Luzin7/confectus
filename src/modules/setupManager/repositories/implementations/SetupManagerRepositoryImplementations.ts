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
import { NoPackageJsonError } from "../../errors/NoPackageJsonError";
import { NotFoundPackageJsonError } from "../../errors/NotFoundPackageJsonError";
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
    wichStack,
  }: Pick<
    Answers,
    | "wichLanguage"
    | "wichLinter"
    | "wichManager"
    | "wichTest"
    | "wichStack"
    | "stack"
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
        let linterChoiced = "";
        if (wichStack === "React") {
          linterChoiced = isTypescript ? "eslintReactTs" : "eslintReact";
        } else if (wichStack === "Next.js") {
          linterChoiced = isTypescript ? "eslintNextTs" : "eslintNext";
        } else if (wichStack === "Vue.js") {
          linterChoiced = isTypescript ? "eslintVueTs" : "eslintVue";
        }
        await installDependency(linterChoiced);

        const lintDependency = isTypescript ? "EslintTS" : "Eslint";
        await installDependency(lintDependency);
      } else if (wichLinter === "Biome") {
        await installDependency(wichLinter);
      }
    }

    if (wichTest === "Vitest") {
      const testDependency = isTypescript ? "VitestTS" : "Vitest";
      await installDependency(testDependency);
    }
  }

  async setupFrontendConfigurations({
    wichLanguage,
    wichLinter,
    isVscode,
    wichStack,
    hasPackageJson,
  }: Pick<
    Answers,
    "isVscode" | "wichLanguage" | "wichLinter" | "wichStack" | "hasPackageJson"
  >): Promise<void> {
    const isDevelopment = process.env.NODE_ENV === "development";
    const isTypescript: boolean = wichLanguage === "Typescript";
    const linterSelected = wichLinter;
    const stackSelected = wichStack;

    const installTemplate = async (
      templatePath: string[],
      outputPath: string,
    ) => {
      await this.templatesManagerRepository.install(templatePath, outputPath);
    };

    if (hasPackageJson === "No") {
      throw new Error(new NoPackageJsonError().message);
    }

    const PackageJsonExists = fs.existsSync(
      isDevelopment ? `./mock/package.json` : "package.json",
    );

    if (!PackageJsonExists) {
      throw new Error(new NotFoundPackageJsonError().message);
    }

    await Promise.all([
      installTemplate(["git", "gitignore"], ".gitignore"),
      installTemplate(["git", "README.md"], "README.md"),
    ]);

    if (isVscode === "Yes") {
      await installTemplate(
        frontendDependeciesSetup.editorconfig.configFiles.configFilePath,
        frontendDependeciesSetup.editorconfig.configFiles.configFileName,
      );

      const vscodeConfigPath = path.join(".vscode", "settings.json");
      const linterTemplatePath =
        linterSelected === "Biome"
          ? frontendDependeciesSetup.biome.configFiles.configFilePath
          : frontendDependeciesSetup.vscode.configFiles.configFilePath;
      await installTemplate(linterTemplatePath, vscodeConfigPath);
    }

    if (linterSelected !== "No") {
      if (stackSelected === "React") {
        const linterChoiced = isTypescript ? "eslintReactTs" : "eslintReact";
        const linterConfigPath =
          frontendDependeciesSetup[linterChoiced.toLowerCase()].configFiles
            .configFilePath;
        const linterConfigFileName =
          frontendDependeciesSetup[linterChoiced.toLowerCase()].configFiles
            .configFileName;

        return await installTemplate(linterConfigPath, linterConfigFileName);
      }

      if (stackSelected === "Next.js") {
        const linterChoiced = isTypescript ? "eslintNextTs" : "eslintNext";
        const linterConfigPath =
          frontendDependeciesSetup[linterChoiced.toLowerCase()].configFiles
            .configFilePath;
        const linterConfigFileName =
          frontendDependeciesSetup[linterChoiced.toLowerCase()].configFiles
            .configFileName;

        return await installTemplate(linterConfigPath, linterConfigFileName);
      }

      if (stackSelected === "Vue.js") {
        const linterChoiced = isTypescript ? "eslintVueTs" : "eslintVue";
        const linterConfigPath =
          frontendDependeciesSetup[linterChoiced.toLowerCase()].configFiles
            .configFilePath;
        const linterConfigFileName =
          frontendDependeciesSetup[linterChoiced.toLowerCase()].configFiles
            .configFileName;

        return await installTemplate(linterConfigPath, linterConfigFileName);
      }

      await installTemplate(
        frontendDependeciesSetup.biome.configFiles.configFilePath,
        frontendDependeciesSetup.biome.configFiles.configFileName,
      );
    }
  }

  async setupBackendConfigurations({
    hasPackageJson,
    isVscode,
    wichManager,
    wichLanguage,
    wichLinter,
    wichTest,
    createDirectories,
    addScripts,
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
  >): Promise<void> {
    const isDevelopment = process.env.NODE_ENV === "development";
    const isTypescript = wichLanguage === "Typescript";
    const willTest = wichTest === "Vitest";
    const willHaveSrcDirectory = createDirectories === "Yes";
    const willAddScripts = addScripts === "Yes";
    const linterChoiced = wichLinter;

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

    await Promise.all([
      installTemplate(["git", "gitignore"], ".gitignore"),
      installTemplate(["git", "README.md"], "README.md"),
    ]);

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

      const configFilePath =
        backendDependeciesSetup.greetings.configFiles.configFilePath;
      const configFileName = isTypescript ? "app.ts" : "app.js";
      await installTemplate(configFilePath, path.join("src", configFileName));
    }

    if (isVscode === "Yes") {
      await installTemplate(
        backendDependeciesSetup.editorconfig.configFiles.configFilePath,
        backendDependeciesSetup.editorconfig.configFiles.configFileName,
      );

      const vscodeConfigPath = path.join(".vscode", "settings.json");
      const linterTemplatePath =
        linterChoiced === "Biome"
          ? backendDependeciesSetup.biome.configFiles.configFilePath
          : backendDependeciesSetup.vscode.configFiles.configFilePath;
      await installTemplate(linterTemplatePath, vscodeConfigPath);
    }

    if (isTypescript) {
      const languageConfig =
        backendDependeciesSetup[wichLanguage.toLowerCase()].configFiles;
      await installTemplate(
        languageConfig.configFilePath,
        languageConfig.configFileName,
      );

      if (willTest) {
        const testConfig = backendDependeciesSetup.vitestts.configFiles;
        await installTemplate(
          testConfig.configFilePath,
          testConfig.configFileName,
        );
      }
    }

    if (willTest && !isTypescript) {
      const testConfig =
        backendDependeciesSetup[wichTest.toLowerCase()].configFiles;
      await installTemplate(
        testConfig.configFilePath,
        testConfig.configFileName,
      );
    }

    if (linterChoiced !== "No") {
      const linterConfigPath =
        backendDependeciesSetup[linterChoiced.toLowerCase()].configFiles
          .configFilePath;
      const linterConfigFileName =
        backendDependeciesSetup[linterChoiced.toLowerCase()].configFiles
          .configFileName;

      if (linterChoiced === "Eslint") {
        const lintDependency = isTypescript ? "eslintts" : "eslint";
        await installTemplate(
          backendDependeciesSetup[lintDependency.toLowerCase()].configFiles
            .configFilePath,
          linterConfigFileName,
        );
      } else {
        await installTemplate(linterConfigPath, linterConfigFileName);
      }
    }
  }
}
