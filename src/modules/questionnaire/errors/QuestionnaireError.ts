import { UseCaseError } from '@shared/core/errors/ErrorUseCase.js';

export class QuestionnaireError extends Error implements UseCaseError {
  constructor() {
    super('An error occurred during the questionnaire process.');
  }
}
