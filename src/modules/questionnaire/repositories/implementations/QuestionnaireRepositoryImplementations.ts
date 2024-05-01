import {
  backendQuestions,
  frontendQuestions,
  wichStackQuestion,
} from "@/shared/core/cli/questions";
import { QuestionProps } from "@/types/question";
import inquirer from "inquirer";
import { QuestionnaireError } from "../../errors/QuestionnaireError";
import { QuestionnaireRepository } from "../contracts/QuestionnaireRepository";

export class QuestionnaireRepositoryImplementations
  implements QuestionnaireRepository
{
  private stackChoice: string = "";
  private answers: Record<string, string> = {};

  private wichStackWillUse(stackChoice: Record<string, string>) {
    this.stackChoice = stackChoice.stack;
  }

  private saveAnswers(answers: Record<string, string>) {
    this.answers = { ...this.answers, ...answers };
  }

  async startQuestionnaire(): Promise<void> {
    try {
      const stack: Record<string, string> =
        await inquirer.prompt(wichStackQuestion);

      this.wichStackWillUse(stack);

      this.saveAnswers({ stack: this.stackChoice });

      const isFrontend: boolean = this.stackChoice === "Frontend";

      const questions: QuestionProps[] = isFrontend
        ? frontendQuestions
        : backendQuestions;
      const answers: Record<string, string> = await inquirer.prompt(questions);

      return this.saveAnswers(answers);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        return console.error({ error });
      }

      return console.error(new QuestionnaireError());
    }
  }

  get Answers(): Record<string, string> {
    return this.answers;
  }
}
