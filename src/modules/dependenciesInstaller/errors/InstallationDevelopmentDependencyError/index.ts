import { UseCaseError } from "@core/errors/ErrorUseCase";

export class InstallationDevelopmentDependencyError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(
      'An error occurred during the development dependencies installation process.',
    );
  }
}
