import { exec } from "child_process";
import { InitializeNewProjectRepository } from "src/modules/initializeNewProject/repositories/contracts/InitializeNewProjectRepository";
import { promisify } from "util";

export class TestInitializeNewProjectRepositoryImplementations
  implements InitializeNewProjectRepository
{
  async install(initCommand: string): Promise<void> {
    await promisify(exec)(`cd src/test/tests && ${initCommand}`);
  }
}
