import { SetupManagerRepository } from '@core/contracts/SetupManagerRepository';
import { UseCase } from '@core/contracts/UseCase';
import chalk from 'chalk';
import { createSpinner } from 'nanospinner';

export class SetupProjectEnvironment implements UseCase<Record<string, string>> {
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
      throw error;
    }
  }
}
