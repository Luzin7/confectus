import { SetupManagerRepository } from "../contracts/SetupManagerRepository";
import Answers from "src/types/answers";
import fs from "fs";
import path from "path";
import { InitializeNewProjectRepository } from "src/modules/initializeNewProject/repositories/contracts/InitializeNewProjectRepository";
import { DepedenciesInstallerRepository } from "src/modules/depedenciesInstaller/repositories/contracts/DepedenciesInstallerRepository";
import managers from "src/infra/cli/managers";

export class SetupManagerRepositoryImplementation
  implements SetupManagerRepository
{
  constructor(
    private initializeNewProjectRepository: InitializeNewProjectRepository,
    private depedenciesInstallerRepository: DepedenciesInstallerRepository,
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
    // const isDev = process.env.NODE_ENV === "development";
    const isTypescript = wichLanguage === "Typescript";
    const currentPath = new URL(".", import.meta.url).pathname;
    const rootPath = path.resolve(currentPath, "");
    const templatesPath = (subpath: string) =>
      path.join(rootPath, "templates", subpath);

    const copyFiles = async (source: string, destination: string) => {
      try {
        fs.mkdirSync(path.dirname(destination), { recursive: true });
        fs.copyFileSync(source, destination);
      } catch (error) {
        console.error(`Erro ao copiar ${source} para ${destination}:`, error);
      }
    };

    if (isVscode === "Yes") {
      await copyFiles(
        templatesPath("ide/vscode/.editorconfig"),
        ".editorconfig",
      );
      await copyFiles(
        templatesPath("ide/vscode/settings.json"),
        ".vscode/settings.json",
      );
    }

    if (isTypescript) {
      await copyFiles(
        templatesPath("typescript/tsconfig.json"),
        "tsconfig.json",
      );
    }

    if (willLint === "Yes") {
      isTypescript
        ? await copyFiles(
            templatesPath("lint/typescript/.eslintrc.json"),
            ".eslintrc.json",
          )
        : await copyFiles(
            templatesPath("lint/javascript/.eslintrc.json"),
            ".eslintrc.json",
          );
    }

    fs.mkdirSync("src", { recursive: true });

    if (hasPackageJson === "No") {
      const { initCommand } = managers[wichManager];
      await this.initializeNewProjectRepository.install(initCommand);
    }
  }
}
