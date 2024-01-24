import { exec } from "child_process";
import { promisify } from "util";
import { DepedenciesInstallerRepository } from "../contracts/DepedenciesInstallerRepository";
import { dependeciesSetup } from "../../setups";
import { InstallationDependecyError } from "../../errors/InstallationDependecyError";
import { InstallationDevelopmentDependecyError } from "../../errors/InstallationDevelopmentDependecyError";

export class DepedenciesInstallerRepositoryImplementations
  implements DepedenciesInstallerRepository
{
  async install(
    managerInstallCommand: string,
    dependency: string,
  ): Promise<void> {
    const { dependencies, devDependencies } =
      dependeciesSetup[dependency.toLowerCase()] ?? {};

    function installCommand(deps: string, dev: boolean) {
      const isDevelopment = process.env.NODE_ENV === "development";
      return isDevelopment
        ? `cd mock && ${managerInstallCommand} ${deps} ${dev ? "-D" : ""}`
        : `${managerInstallCommand} ${deps} ${dev ? "-D" : ""}`;
    }

    const installDependency = async (
      deps: string,
      dev: boolean,
      errorType: unknown,
    ) => {
      try {
        await promisify(exec)(installCommand(deps, dev));
      } catch (error) {
        throw new Error(errorType as string);
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
