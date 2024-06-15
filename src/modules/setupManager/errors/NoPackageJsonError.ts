import { UseCaseError } from '@shared/core/errors/ErrorUseCase.js';

export class NoPackageJsonError extends Error implements UseCaseError {
  constructor() {
    super(
      "Please, intialize a package.json file in your frontend project before running Confectus. We're working to make Confectus works with other libs/frameworks or without them.",
    );
  }
}
