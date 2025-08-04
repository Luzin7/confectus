import { exec } from "child_process";
import { promisify } from "util";
import { InitializeNewProjectRepository } from "@core/contracts/InitializeNewProjectRepository";

export class InitializeNewProjectRepositoryImplementation
	implements InitializeNewProjectRepository
{
	async install(initCommand: string): Promise<void> {
		const isDevelopment = process.env.NODE_ENV === "development";

		isDevelopment
			? await promisify(exec)(`cd mock && ${initCommand}`)
			: await promisify(exec)(`${initCommand}`);
	}
}
