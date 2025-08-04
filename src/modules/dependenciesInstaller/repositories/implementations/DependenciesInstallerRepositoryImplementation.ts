import { exec } from "child_process";
import { promisify } from "util";
import { SettingsProps } from "@application/dtos/setting.js";
import { InstallationDependencyError } from "@core/errors/InstallationDependencyError.js";
import { InstallationDevelopmentDependencyError } from "@core/errors/InstallationDevelopmentDependencyError.js";
import { DependenciesInstallerRepository } from "../contracts/DependenciesInstallerRepository.js";

export class DependenciesInstallerRepositoryImplementation
	implements DependenciesInstallerRepository
{
	async install(
		managerInstallCommand: string,
		dependency: string,
		stackChoiced: SettingsProps,
	): Promise<void> {
		const { dependencies, devDependencies } =
			stackChoiced[dependency.toLowerCase()] ?? {};

		function installCommand(deps: string, dev: boolean) {
			const isDevelopment = process.env.NODE_ENV === "development";
			return isDevelopment
				? `cd mock && ${managerInstallCommand} ${deps} ${dev ? "-D" : ""}`
				: `${managerInstallCommand} ${deps} ${dev ? "-D" : ""}`;
		}

		const installDependency = async (
			deps: string,
			dev: boolean,
			errorType:
				| InstallationDependencyError
				| InstallationDevelopmentDependencyError,
		) => {
			try {
				await promisify(exec)(installCommand(deps, dev));
			} catch (_error) {
				throw new Error(errorType.message);
			}
		};

		dependencies &&
			(await installDependency(
				dependencies,
				false,
				new InstallationDependencyError(),
			));
		devDependencies &&
			(await installDependency(
				devDependencies,
				true,
				new InstallationDevelopmentDependencyError(),
			));
	}
}
