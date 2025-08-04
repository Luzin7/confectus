import { LoadingService } from "../../core/contracts/LoadingService.js";
import { ProjectSetupService } from "../../core/contracts/ProjectSetupService.js";
import { UseCase } from "../../core/contracts/UseCase.js";
import { LoadingWrapper } from "../../shared/LoadingWrapper.js";

interface InstallDependenciesRequest {
	answers: Record<string, string>;
}

export class InstallProjectDependencies
	implements UseCase<InstallDependenciesRequest>
{
	private loadingWrapper: LoadingWrapper;

	constructor(
		private projectSetupService: ProjectSetupService,
		private loadingService: LoadingService,
	) {
		this.loadingWrapper = new LoadingWrapper(loadingService);
	}

	async execute({ answers }: InstallDependenciesRequest): Promise<void> {
		await this.loadingWrapper.execute(
			async () => {
				await this.projectSetupService.installDependencies(answers);
			},
			{
				startMessage: "📦 Installing project dependencies...",
				successMessage: "🚀 Dependencies installed successfully!",
				errorMessage: "🔥 Failed to install dependencies",
			},
		);
	}
}
