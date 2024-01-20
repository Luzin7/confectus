import { exec } from "child_process";
import { promisify } from "util";
import { DepedenciesInstallerRepository } from "../contracts/DepedenciesInstallerRepository";
import { dependeciesSetup } from "../../setups";

export class DepedenciesInstallerRepositoryImplementations
  implements DepedenciesInstallerRepository
{
  async install(
    managerInstallCommand: string,
    dependency: string,
  ): Promise<void> {
    const isDevelopment = process.env.NODE_ENV === "development";
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
      (isDevelopment
        ? await promisify(exec)(`cd mock && ${productionDependencies}`)
        : await promisify(exec)(`${productionDependencies}`));

    developmentDependencies &&
      (isDevelopment
        ? await promisify(exec)(`cd mock && ${developmentDependencies} -D`)
        : await promisify(exec)(`${developmentDependencies} -D`));
  }
}
