import { QuestionnaireRepository } from "@core/contracts/QuestionnaireRepository";
import { UseCase } from "@core/contracts/UseCase";

export class CollectProjectRequirements implements UseCase<null> {
  constructor(private questionnaireRepository: QuestionnaireRepository) {}

  async execute(): Promise<void> {
    await this.questionnaireRepository.startQuestionnaire();
  }
}
