import validateManagerInitCommand from "src/providers/validators/validateInitCommand";
import { UseCase } from "src/shared/core/modules/UseCase";
import { InitializeNewProjectRepository } from "../../repositories/contracts/InitializeNewProjectRepository";

interface req {
  managerInitCommand: string;
}

export class InitializeNewProject implements UseCase<req> {
  constructor(
    private initializeNewProjectRepository: InitializeNewProjectRepository,
  ) {}

  async execute({ managerInitCommand }: req): Promise<void> {
    validateManagerInitCommand(managerInitCommand);

    const command = `${managerInitCommand}`;

    await this.initializeNewProjectRepository.install(command);
  }
}
