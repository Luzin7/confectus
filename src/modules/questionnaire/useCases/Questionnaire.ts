import { UseCase } from "@shared/core/modules/UseCase.js";
import { QuestionnaireRepository } from "../repositories/contracts/QuestionnaireRepository.js";

export class Questionnaire implements UseCase<null> {
  constructor(private questionnaireRepository: QuestionnaireRepository) {}

  async execute(): Promise<void> {
    await this.questionnaireRepository.startQuestionnaire();
  }
}
