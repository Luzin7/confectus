import { SettingsProps } from "@/types/setting";
import { exec } from "child_process";
import { promisify } from "util";
import { InstallationDependecyError } from "../../errors/InstallationDependecyError";
import { InstallationDevelopmentDependecyError } from "../../errors/InstallationDevelopmentDependecyError";
import { DepedenciesInstallerRepository } from "../contracts/DepedenciesInstallerRepository";

export class DepedenciesInstallerRepositoryImplementations
  implements DepedenciesInstallerRepository
{
  async install(
    managerInstallCommand: string,
    dependency: string,
    stackChoiced: SettingsProps,
  ): Promise<void> {
    const { dependencies, devDependencies } =
      stackChoiced[dependency.toLowerCase()] ?? {};

    function installCommand(deps: string, dev: boolean) {
      const isDevelopment = process.env.NODE_ENV === "development";
      return isDevelopment
        ? `cd mock && ${managerInstallCommand} ${deps} ${dev ? "-D" : ""}`
        : `${managerInstallCommand} ${deps} ${dev ? "-D" : ""}`;
    }

    const installDependency = async (
      deps: string,
      dev: boolean,
      errorType:
        | InstallationDependecyError
        | InstallationDevelopmentDependecyError,
    ) => {
      try {
        await promisify(exec)(installCommand(deps, dev));
      } catch (error) {
        throw new Error(errorType.message);
      }
    };

    dependencies &&
      (await installDependency(
        dependencies,
        false,
        new InstallationDependecyError(),
      ));
    devDependencies &&
      (await installDependency(
        devDependencies,
        true,
        new InstallationDevelopmentDependecyError(),
      ));
  }
}
