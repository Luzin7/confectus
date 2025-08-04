import { exec } from "child_process";
import { promisify } from "util";
import { ProjectInitializationService } from "../../core/contracts/ProjectInitializationService.js";

export class ProjectInitializationServiceImpl
	implements ProjectInitializationService
{
	async initialize(initCommand: string): Promise<void> {
		const isDevelopment = process.env.NODE_ENV === "development";
		const command = isDevelopment ? `cd mock && ${initCommand}` : initCommand;

		try {
			await promisify(exec)(command);
		} catch (error) {
			const isDevelopment = process.env.NODE_ENV === "development";
			if (isDevelopment) {
				console.error("Failed to initialize project:", error);
			}
			
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			throw new Error(`Project initialization failed: ${errorMessage}`);
		}
	}
}
