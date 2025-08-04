import { LoadingService } from "../../core/contracts/LoadingService.js";
import { ProjectSetupService } from "../../core/contracts/ProjectSetupService.js";
import { UseCase } from "../../core/contracts/UseCase.js";
import { LoadingWrapper } from "../../shared/LoadingWrapper.js";

interface SetupEnvironmentRequest {
	answers: Record<string, string>;
}

export class SetupProjectEnvironment
	implements UseCase<SetupEnvironmentRequest>
{
	private loadingWrapper: LoadingWrapper;

	constructor(
		private projectSetupService: ProjectSetupService,
		private loadingService: LoadingService,
	) {
		this.loadingWrapper = new LoadingWrapper(loadingService);
	}

	async execute({ answers }: SetupEnvironmentRequest): Promise<void> {
		const stack = answers.stack;

		await this.loadingWrapper.execute(
			async () => {
				if (stack === "Backend") {
					await this.projectSetupService.setupBackendEnvironment(answers);
				} else {
					await this.projectSetupService.setupFrontendEnvironment(answers);
				}
			},
			{
				startMessage: `🔧 Setting up ${stack.toLowerCase()} environment...`,
				successMessage: `🎯 ${stack} environment configured successfully!`,
				errorMessage: `💥 Failed to configure ${stack.toLowerCase()} environment`,
			},
		);
	}
}
