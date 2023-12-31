import { SetupManagerRepository } from "../repositories/contracts/SetupManagerRepository";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import { UseCase } from "src/shared/core/modules/UseCase";

export class SetupManager implements UseCase<Record<string, string>> {
  constructor(private setupManagerRepository: SetupManagerRepository) {}

  async execute(answers: Record<string, string>): Promise<void> {
    const spinner = createSpinner(
      `We're rushing to setup your project!`,
    ).start();
    try {
      await this.setupManagerRepository.setupConfigurations(answers);
      spinner.success({ text: "Project setup completed successfully!" });
    } catch (error) {
      spinner.error({
        text: chalk.red(`The setup process has failed...
      \n ${error}`),
      });
      process.exit(1);
    }
    try {
      await this.setupManagerRepository.installDependencies(answers);
      spinner.success({ text: "Project dependencies installed successfully!" });
    } catch (error) {
      spinner.error({
        text: chalk.red(`The installation process has failed...
      \n ${error}`),
      });
      process.exit(1);
    }
  }
}
