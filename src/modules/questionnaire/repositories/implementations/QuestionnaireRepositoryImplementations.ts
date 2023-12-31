import questions from "src/infra/cli/questions";
import { QuestionnaireRepository } from "../contracts/QuestionnaireRepository";
import inquirer from "inquirer";

export class QuestionnaireRepositoryImplementations
  implements QuestionnaireRepository
{
  private answers: Record<string, string> = {};

  private saveAnswers(answers: Record<string, string>) {
    this.answers = { ...this.answers, ...answers };
  }

  async startQuestionnaire(): Promise<void> {
    try {
      const responses = await inquirer.prompt(questions);
      this.saveAnswers(responses);
    } catch (error) {
      console.error("Error during questionnaire:", error);
    }
  }

  get Answers(): Record<string, string> {
    return this.answers;
  }
}
