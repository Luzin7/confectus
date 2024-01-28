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
        text: chalk.red(error),
      });
      process.exit(1);
    }
    try {
      const spinner = createSpinner(
        `We're rushing to setup your project!`,
      ).start();
      await this.setupManagerRepository.installDependencies(answers);
      spinner.success({ text: "Project dependencies installed successfully!" });
      spinner.success({
        text: `${chalk.bold.magenta(
          "Thank you for using Confectus! See you in the next code!",
        )}
      `,
      });
    } catch (error) {
      spinner.error({
        text: chalk.red(error),
      });
      process.exit(1);
    }
  }
}
