import { exec } from "child_process";
import { promisify } from "util";
import { SettingsProps } from "../../application/dtos/setting.js";
import { DependencyInstallerService } from "../../core/contracts/DependencyInstallerService.js";
import { InstallationDependencyError } from "../../core/errors/InstallationDependencyError.js";
import { InstallationDevelopmentDependencyError } from "../../core/errors/InstallationDevelopmentDependencyError.js";

export class DependencyInstallerServiceImpl
	implements DependencyInstallerService
{
	async install(
		managerInstallCommand: string,
		dependency: string,
		stackChoiced: SettingsProps,
	): Promise<void> {
		const dependencyConfig = stackChoiced[dependency.toLowerCase()] ?? {};

		if (!dependencyConfig) {
			throw new Error(
				`Dependency configuration not found: ${dependency.toLowerCase()}`,
			);
		}

		const { dependencies, devDependencies } = dependencyConfig;

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
			const command = installCommand(deps, dev);
			try {
				await promisify(exec)(command);
			} catch (error) {
				const isDevelopment = process.env.NODE_ENV === "development";
				if (isDevelopment) {
					console.error("Dependency installation failed:");
					console.error("Command:", command);
					console.error("Error:", error);
					return;
				}

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
