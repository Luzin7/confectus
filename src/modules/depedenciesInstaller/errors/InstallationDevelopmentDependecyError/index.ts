import { UseCaseError } from "src/shared/core/errors/ErrorUseCase";

export class InstallationDevelopmentDependecyError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(
      "An error occurred during the development dependencies installation process.",
    );
  }
}
