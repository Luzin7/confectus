import { exec } from "child_process";
import { promisify } from "util";
import { InitializeNewProjectRepository } from "../contracts/InitializeNewProjectRepository";

export class InitializeNewProjectRepositoryImplementations
  implements InitializeNewProjectRepository
{
  async install(initCommand: string): Promise<void> {
    // TIRA ESSE MOCK DPS
    await promisify(exec)(`${initCommand}`);
  }
}
