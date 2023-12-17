import { exec } from "child_process";
import { DepedenciesInstallerRepository } from "src/modules/depedenciesInstaller/repositories/contracts/DepedenciesInstallerRepository";
import { promisify } from "util";

export class TestDepedenciesInstallerRepositoryImplementations
  implements DepedenciesInstallerRepository
{
  async install(
    managerInstallCommand: string,
    dependency: string,
  ): Promise<void> {
    const command = `${managerInstallCommand} ${dependency}`;

    await promisify(exec)(`cd src/test/tests && ${command}`);
  }
}
