export abstract class DepedenciesInstallerRepository {
  abstract install(
    managerInstallCommand: string,
    dependency: string,
  ): Promise<void>;
}
