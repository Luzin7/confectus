import { InitializeNewProjectRepository } from "@modules/initializeNewProject/repositories/contracts/InitializeNewProjectRepository";
import { UseCase } from "@shared/core/modules/UseCase";
import validateManagerInitCommand from "src/providers/validators/validateInitCommand";

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
