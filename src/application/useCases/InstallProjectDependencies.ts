import { ProjectSetupService } from "../../core/contracts/ProjectSetupService.js";
import { UseCase } from "../../core/contracts/UseCase.js";

interface InstallDependenciesRequest {
	answers: Record<string, string>;
}

export class InstallProjectDependencies
	implements UseCase<InstallDependenciesRequest>
{
	constructor(private projectSetupService: ProjectSetupService) {}

	async execute({ answers }: InstallDependenciesRequest): Promise<void> {
		await this.projectSetupService.installDependencies(answers);
	}
}
