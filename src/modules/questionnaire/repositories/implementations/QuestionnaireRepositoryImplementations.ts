import { QuestionnaireRepository } from "../contracts/QuestionnaireRepository";
import inquirer from "inquirer";
import { QuestionnaireError } from "../../errors/QuestionnaireError";
import questions from "@/infra/cli/questions";

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
      return console.error(new QuestionnaireError());
    }
  }

  get Answers(): Record<string, string> {
    return this.answers;
  }
}
