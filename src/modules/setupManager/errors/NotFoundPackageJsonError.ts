import { UseCaseError } from '@shared/core/errors/ErrorUseCase.js';

export class NotFoundPackageJsonError extends Error implements UseCaseError {
  constructor() {
    super(
      'The package.json file does not exist or is not accessible. Please, intialize a package.json file in your frontend project before running Confectus.',
    );
  }
}
