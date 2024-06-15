import { SettingsProps } from "@@types/setting.js";
import { UseCase } from "@shared/core/modules/UseCase.js";
import { DepedenciesInstallerRepository } from "../repositories/contracts/DepedenciesInstallerRepository.js";

interface req {
  managerInstallCommand: string;
  dependency: string;
  stackChoiced: SettingsProps;
}

export class InstallDependencies implements UseCase<req> {
  constructor(
    private dependenciesInstallerRepository: DepedenciesInstallerRepository,
  ) {}

  async execute({
    managerInstallCommand,
    dependency,
    stackChoiced,
  }: req): Promise<void> {
    await this.dependenciesInstallerRepository.install(
      managerInstallCommand,
      dependency,
      stackChoiced,
    );
  }
}
