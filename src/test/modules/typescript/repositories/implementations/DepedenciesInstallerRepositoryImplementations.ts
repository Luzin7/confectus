import { DepedenciesInstallerRepository } from "@modules/depedenciesInstaller/repositories/contracts/DepedenciesInstallerRepository";
import { exec } from "child_process";
import { promisify } from "util";

export class TestDepedenciesInstallerRepositoryImplementations
  implements DepedenciesInstallerRepository
{
  async install(managerInstallCommand): Promise<void> {
    const command = `${managerInstallCommand} ${dependecies}`;

    await promisify(exec)(`cd src/test/tests && ${command}`);
  }
}
