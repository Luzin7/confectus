import { UseCase } from "@/shared/core/modules/UseCase";
import { InitializeNewProjectRepository } from "../../repositories/contracts/InitializeNewProjectRepository";

interface req {
  managerInitCommand: string;
}

export class InitializeNewProject implements UseCase<req> {
  constructor(
    private initializeNewProjectRepository: InitializeNewProjectRepository,
  ) {}

  async execute({ managerInitCommand }: req): Promise<void> {
    await this.initializeNewProjectRepository.install(managerInitCommand);
  }
}
