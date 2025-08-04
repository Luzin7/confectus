import { SettingsProps } from "@application/dtos/setting";

export abstract class DependenciesInstallerRepository {
	abstract install(
		managerInstallCommand: string,
		dependency: string,
		stackChoiced: SettingsProps,
	): Promise<void>;
}
