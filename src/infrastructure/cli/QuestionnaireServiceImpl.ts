import { QuestionProps } from "../../application/dtos/question.js";
import { QuestionnaireError } from "../../core/errors/QuestionnaireError.js";
import { backendQuestions, frontendQuestions, wichStackQuestion } from "../../infrastructure/cli/questions.js";
import inquirer from "inquirer";
import { QuestionnaireService } from "../../core/contracts/QuestionnaireService.js";

export class QuestionnaireServiceImpl implements QuestionnaireService {
	private _answers: Record<string, string> = {};
	private stackChoice = "";

	get answers(): Record<string, string> {
		return this._answers;
	}

	private wichStackWillUse(stackChoice: Record<string, string>) {
		this.stackChoice = stackChoice.stack;
	}

	private saveAnswers(answers: Record<string, string>) {
		this._answers = { ...this._answers, ...answers };
	}

	async collectAnswers(questions: QuestionProps[]): Promise<Record<string, string>> {
		try {
			const wichStackChoiceAnswers = await inquirer.prompt(wichStackQuestion);
			this.wichStackWillUse(wichStackChoiceAnswers);
			this.saveAnswers(wichStackChoiceAnswers);

			if (this.stackChoice === "Backend") {
				const backendAnswers = await inquirer.prompt(backendQuestions);
				this.saveAnswers(backendAnswers);
			} else {
				const frontendAnswers = await inquirer.prompt(frontendQuestions);
				this.saveAnswers(frontendAnswers);
			}

			return this._answers;
		} catch (error) {
			throw new Error(new QuestionnaireError().message);
		}
	}
}
