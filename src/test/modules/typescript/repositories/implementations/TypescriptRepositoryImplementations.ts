import { TypescriptRepository } from '@modules/typescript/repositories/contracts/TypescriptRepository'
import { exec } from 'child_process';
import { promisify } from 'util';

export class TestTypescriptRepositoryImplementations implements TypescriptRepository {
  async install(installCommands: string): Promise<void> {
    await promisify(exec)(
    `cd src/test/tests && ${installCommands}`,
    );
  }
}
