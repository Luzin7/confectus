import { exec } from "child_process";
import { promisify } from "util";
import { DepedenciesInstallerRepository } from "../contracts/DepedenciesInstallerRepository";
import { dependeciesSetup } from "@modules/depedenciesInstaller/setups";

export class DepedenciesInstallerRepositoryImplementations
  implements DepedenciesInstallerRepository
{
  async install(
    managerInstallCommand: string,
    dependency: string,
  ): Promise<void> {
    const dependencies =
      dependeciesSetup[dependency.toLowerCase()].dependencies;
    const devDependencies =
      dependeciesSetup[dependency.toLowerCase()].devDependencies;
    const productionDependencies =
      dependencies !== null
        ? `${managerInstallCommand} ${dependencies}`
        : false;
    const developmentDependencies =
      devDependencies !== null
        ? `${managerInstallCommand} ${devDependencies}`
        : false;

    productionDependencies &&
      (await promisify(exec)(`cd ./mock && ${productionDependencies}`));

    developmentDependencies &&
      (await promisify(exec)(`cd ./mock && ${developmentDependencies} -D`));
  }
}
