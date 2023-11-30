import { UseCase } from "@shared/core/modules/UseCase";
import { SetupManagerRepository } from "../repositories/contracts/SetupManagerRepository";

export class SetupManager implements UseCase<Record<string, string>> {
  constructor(private setupManagerRepository: SetupManagerRepository) {}

  async execute(answers: Record<string, string>): Promise<void> {
    await this.setupManagerRepository.setupConfigurations(answers);
    await this.setupManagerRepository.installDependencies(answers);
  }
}
