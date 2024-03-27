import { UseCase } from "@/shared/core/modules/UseCase";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import { SetupManagerRepository } from "../../repositories/contracts/SetupManagerRepository";

export class EnvironmentSettings implements UseCase<Record<string, string>> {
  constructor(private setupManagerRepository: SetupManagerRepository) {}

  async execute(answers: Record<string, string>): Promise<void> {
    const spinner = createSpinner(
      `We're rushing to setup your project!`,
    ).start();
    try {
      if (answers.stack === "Frontend") {
        return await this.setupManagerRepository.setupFrontendConfigurations(
          answers,
        );
      }
      await this.setupManagerRepository.setupBackendConfigurations(answers);
      spinner.success({ text: "Project environment is now complete!" });
    } catch (error) {
      spinner.error({
        text: chalk.red(error),
      });
      process.exit(1);
    }
  }
}
