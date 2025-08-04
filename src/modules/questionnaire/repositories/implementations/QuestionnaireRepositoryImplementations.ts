
import { backendQuestions, frontendQuestions, wichStackQuestion } from '@configs/cli/questions.js';
import { QuestionnaireRepository } from '@core/contracts/QuestionnaireRepository';
import { QuestionProps } from '@application/dtos/question';
import { QuestionnaireError } from '@core/errors/QuestionnaireError';
import inquirer from 'inquirer';

export class QuestionnaireRepositoryImplementation
  implements QuestionnaireRepository
{
  private stackChoice: string = '';
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

      const isFrontend: boolean = this.stackChoice === 'Frontend';

      const questions: QuestionProps[] = isFrontend
        ? frontendQuestions
        : backendQuestions;
      const answers: Record<string, string> = await inquirer.prompt(questions);

      return this.saveAnswers(answers);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error({ error });
      }

      throw new QuestionnaireError();
    }
  }

  get Answers(): Record<string, string> {
    return this.answers;
  }
}
