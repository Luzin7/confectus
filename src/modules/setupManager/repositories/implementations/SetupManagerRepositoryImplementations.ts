import { SetupManagerRepository } from "../contracts/SetupManagerRepository";
import Answers from "src/types/answers";
import path from "path";
import fs from "fs-extra";
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
    const isDevelopment = process.env.NODE_ENV === "development";
    console.log({ isDevelopment });
    const isTypescript = wichLanguage === "Typescript";
    const currentPath = new URL(".", import.meta.url).pathname;
    const rootPath = isDevelopment
      ? path.resolve(currentPath, "../../../../")
      : path.resolve(currentPath);
    console.log({ rootPath });
    const templatesPath = (...subpaths: string[]) =>
      path.join(rootPath, "templates", ...subpaths);

    const copyFiles = async (source: string, destination: string) => {
      const sourcePath = path.resolve(source);
      const destinationPath = path.resolve(destination);
      try {
        fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
        fs.copyFileSync(sourcePath, destinationPath);
      } catch (error) {
        console.error(
          `Erro ao copiar ${sourcePath} para ${destinationPath}:`,
          error,
        );
      }
    };

    if (hasPackageJson === "No") {
      const { initCommand } = managers[wichManager];
      await this.initializeNewProjectRepository.install(initCommand);
    }

    fs.mkdirSync(isDevelopment ? "./mock/src" : "src", { recursive: true });

    await copyFiles(
      templatesPath("git", "gitignore"),
      isDevelopment ? path.resolve("mock", ".gitignore") : ".gitignore",
    );

    if (isVscode === "Yes") {
      await copyFiles(
        templatesPath("ide", "vscode", ".editorconfig"),
        isDevelopment ? path.resolve("mock", ".editorconfig") : ".editorconfig",
      );

      await copyFiles(
        templatesPath("ide", "vscode", "settings.json"),
        isDevelopment
          ? path.resolve("mock", ".vscode", "settings.json")
          : path.resolve(".vscode", "settings.json"),
      );
    }

    if (isTypescript) {
      await copyFiles(
        templatesPath("greetings", "helloWorld.ts"),
        isDevelopment
          ? path.resolve("mock", "src", "app.ts")
          : path.resolve("src", "app.ts"),
      );

      await copyFiles(
        templatesPath("typescript", "tsconfig.json"),
        isDevelopment ? path.resolve("mock", "tsconfig.json") : "tsconfig.json",
      );
    }

    if (!isTypescript) {
      await copyFiles(
        templatesPath("greetings", "helloWorld.ts"),
        isDevelopment
          ? path.resolve("mock", "src", "app.js")
          : path.resolve("src", "app.js"),
      );
    }

    if (willLint === "Yes") {
      isTypescript
        ? await copyFiles(
            templatesPath("lint", "typescript", ".eslintrc.json"),
            isDevelopment
              ? path.resolve("mock", ".eslintrc.json")
              : ".eslintrc.json",
          )
        : await copyFiles(
            templatesPath("lint", "javascript", ".eslintrc.json"),
            isDevelopment
              ? path.resolve("mock", ".eslintrc.json")
              : ".eslintrc.json",
          );
    }
  }
}
