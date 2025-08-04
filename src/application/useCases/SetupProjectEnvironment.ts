import { UseCase } from "../../core/contracts/UseCase.js";
import { ProjectSetupService } from "../../core/contracts/ProjectSetupService.js";

interface SetupEnvironmentRequest {
  answers: Record<string, string>;
}

export class SetupProjectEnvironment implements UseCase<SetupEnvironmentRequest> {
  constructor(private projectSetupService: ProjectSetupService) {}

  async execute({ answers }: SetupEnvironmentRequest): Promise<void> {
    const stack = answers.stack;
    
    if (stack === "Backend") {
      await this.projectSetupService.setupBackendEnvironment(answers);
    } else {
      await this.projectSetupService.setupFrontendEnvironment(answers);
    }
  }
}
