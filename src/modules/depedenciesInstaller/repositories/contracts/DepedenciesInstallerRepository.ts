import { SettingsProps } from "@/types/setting";

export abstract class DepedenciesInstallerRepository {
  abstract install(
    managerInstallCommand: string,
    dependency: string,
    stackChoiced: SettingsProps,
  ): Promise<void>;
}
