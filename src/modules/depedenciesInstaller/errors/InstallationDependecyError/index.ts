import { UseCaseError } from "@shared/core/errors/ErrorUseCase.js";

export class InstallationDependecyError extends Error implements UseCaseError {
  constructor() {
    super('An error occurred during the dependencies installation process.');
  }
}
