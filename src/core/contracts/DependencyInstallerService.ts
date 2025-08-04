import { SettingsProps } from "../../application/dtos/setting.js";

export abstract class DependencyInstallerService {
	abstract install(
		managerInstallCommand: string,
		dependency: string,
		stackChoiced: SettingsProps,
	): Promise<void>;
}
