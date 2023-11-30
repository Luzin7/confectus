import { log } from "console";
import { SetupManagerRepository } from "../contracts/SetupManagerRepository";
import Answers from "src/types/answers";

export class SetupManagerRepositoryImplementation
  implements SetupManagerRepository
{
  async installDependencies(
    answers: Pick<Answers, "wichLanguage" | "willLint">,
  ): Promise<void> {
    const { wichLanguage, willLint } = answers;
    const dep = { wichLanguage, willLint };
    log(dep);
  }

  async setupConfigurations(
    answers: Pick<Answers, "hasPackageJson" | "wichManager" | "isVscode">,
  ): Promise<void> {
    const { hasPackageJson, isVscode, wichManager } = answers;
    const setup = { hasPackageJson, isVscode, wichManager };
    log(setup);
  }
}
