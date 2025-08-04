import { QuestionnaireService } from "../../core/contracts/QuestionnaireService.js";
import { UseCase } from "../../core/contracts/UseCase.js";

export class CollectProjectRequirements implements UseCase<void> {
	constructor(private questionnaireService: QuestionnaireService) {}

	async execute(): Promise<void> {
		await this.questionnaireService.collectAnswers([]);
	}
}
