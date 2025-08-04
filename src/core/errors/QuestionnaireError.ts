import { UseCaseError } from "./ErrorUseCase";

export class QuestionnaireError extends Error implements UseCaseError {
  constructor() {
    super('An error occurred during the questionnaire process.');
  }
}
