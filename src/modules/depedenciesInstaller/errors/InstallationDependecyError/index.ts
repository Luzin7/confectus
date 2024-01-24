import { UseCaseError } from "src/shared/core/errors/ErrorUseCase";

export class InstallationDependecyError extends Error implements UseCaseError {
  constructor() {
    super("An error occurred during the dependencies installation process.");
  }
}
