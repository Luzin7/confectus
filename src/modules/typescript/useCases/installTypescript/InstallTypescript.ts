import { UseCase } from "@shared/core/modules/UseCase";
import { TypescriptRepository } from "../../repositories/contracts/TypescriptRepository";
import { validateManagerInstallCommand } from "../../../../providers/validators/validateInstallCommand/validateInstallCommand";

interface req {
  managerInstallCommand: string;
  dependecies: string;
}

// DEIXAR ISSO GENERICO PARA SER INSTALADOR DE QUALQUER DEPENDENCIA PAPAI

export class InstallTypescript implements UseCase<req> {
  constructor(private tsRepository: TypescriptRepository) {}

  async execute({ dependecies, managerInstallCommand }: req): Promise<void> {
    validateManagerInstallCommand(managerInstallCommand);

    const command = `${managerInstallCommand} ${dependecies}`;

    await this.tsRepository.install(command);
  }
}
