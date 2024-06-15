import { SetupManagerRepository } from '@modules/setupManager/repositories/contracts/SetupManagerRepository.js';
import { UseCase } from '@shared/core/modules/UseCase.js';
import chalk from 'chalk';
import { createSpinner } from 'nanospinner';

export class EnvironmentSettings implements UseCase<Record<string, string>> {
  constructor(private setupManagerRepository: SetupManagerRepository) {}

  async execute(answers: Record<string, string>): Promise<void> {
    const spinner = createSpinner(
      `We're rushing to setup your project!`,
    ).start();
    try {
      if (answers.stack === 'Frontend') {
        await this.setupManagerRepository.setupFrontendConfigurations(answers);
        spinner.success({ text: 'Project environment is now complete!' });
        return;
      }
      await this.setupManagerRepository.setupBackendConfigurations(answers);
      spinner.success({ text: 'Project environment is now complete!' });
    } catch (error) {
      spinner.error({
        text: chalk.red(error),
      });
      process.exit(1);
    }
  }
}
