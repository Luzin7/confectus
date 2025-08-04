import { QuestionProps } from "../../application/dtos/question.js";

export abstract class QuestionnaireService {
	abstract collectAnswers(
		questions: QuestionProps[],
	): Promise<Record<string, string>>;
	abstract get answers(): Record<string, string>;
}
