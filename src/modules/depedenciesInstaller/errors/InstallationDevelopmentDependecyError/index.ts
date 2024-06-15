import { UseCaseError } from "@shared/core/errors/ErrorUseCase.js";

export class InstallationDevelopmentDependecyError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(
      'An error occurred during the development dependencies installation process.',
    );
  }
}
