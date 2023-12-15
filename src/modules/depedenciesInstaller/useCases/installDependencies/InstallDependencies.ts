import { UseCase } from "@shared/core/modules/UseCase";
import { DepedenciesInstallerRepository } from "@modules/depedenciesInstaller/repositories/contracts/DepedenciesInstallerRepository";

interface req {
  managerInstallCommand: string;
  dependency: string;
}

export class InstallDependencies implements UseCase<req> {
  constructor(
    private dependenciesInstallerRepository: DepedenciesInstallerRepository,
  ) {}

  async execute({ managerInstallCommand, dependency }: req): Promise<void> {
    await this.dependenciesInstallerRepository.install(
      managerInstallCommand,
      dependency,
    );
  }
}
