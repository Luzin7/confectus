import { SetupManagerRepository } from "../contracts/SetupManagerRepository";
import Answers from "src/types/answers";
import fs from "fs";
import path from "path";
import { InitializeNewProjectRepository } from "@modules/initializeNewProject/repositories/contracts/InitializeNewProjectRepository";
import managers from "@infra/cli/managers";
import { DepedenciesInstallerRepository } from "@modules/depedenciesInstaller/repositories/contracts/DepedenciesInstallerRepository";

export class SetupManagerRepositoryImplementation
  implements SetupManagerRepository
{
  constructor(
    private initializeNewProjectRepository: InitializeNewProjectRepository,
    private depedenciesInstallerRepository: DepedenciesInstallerRepository,
  ) {}

  async installDependencies(
    answers: Pick<Answers, "wichLanguage" | "willLint" | "wichManager">,
  ): Promise<void> {
    const { wichLanguage, willLint, wichManager } = answers;
    const managerInstallCommand: string = managers[wichManager].installCommand;
    const isTypescript = wichLanguage === "Typescript";

    if (isTypescript) {
      await this.depedenciesInstallerRepository.install(
        managerInstallCommand,
        wichLanguage,
      );
    }

    if (willLint === "Yes") {
      if (isTypescript) {
        await this.depedenciesInstallerRepository.install(
          managerInstallCommand,
          "EslintTS",
        );
      }

      await this.depedenciesInstallerRepository.install(
        managerInstallCommand,
        "Eslint",
      );
    }
  }

  async setupConfigurations(
    answers: Pick<Answers, "hasPackageJson" | "wichManager" | "isVscode">,
  ): Promise<void> {
    const { hasPackageJson, isVscode, wichManager } = answers;

    if (isVscode === "Yes") {
      try {
        const currentPath = new URL(".", import.meta.url).pathname;

        const rootPath = path.resolve(currentPath, "../../../../..");

        const settingsJson = path.join(
          rootPath,
          "src",
          "modules",
          "setupManager",
          "templates",
          "ide",
          "vscode",
          "settings.json",
        );

        const editorconfig = path.join(
          rootPath,
          "src",
          "modules",
          "setupManager",
          "templates",
          "ide",
          "vscode",
          ".editorconfig",
        );

        const settingsContent = fs.readFileSync(settingsJson, "utf-8");
        // const editorconfigContent = fs.readFileSync(editorconfig, "utf-8");

        const settingsObject = JSON.parse(settingsContent);

        fs.mkdirSync("./mock/.vscode", { recursive: true });

        fs.writeFileSync(
          "./mock/.vscode/settings.json",
          JSON.stringify(settingsObject, null, 2),
          "utf-8",
        );
        fs.copyFileSync(editorconfig, "./mock/.editorconfig");

        console.log("Configurações do VSCode atualizadas com sucesso!");
      } catch (error) {
        console.error("Erro ao configurar o VSCode:", error);
      }
    }

    try {
      fs.mkdirSync("./mock/src", { recursive: true });
    } catch (error) {
      console.error("Erro ao configurar o src:", error);
    }

    if (hasPackageJson === "No") {
      const initCommand: string = managers[wichManager].initCommand;
      await this.initializeNewProjectRepository.install(initCommand);
    }
  }
}
