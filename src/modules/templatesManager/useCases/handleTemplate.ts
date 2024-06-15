import { UseCase } from "@shared/core/modules/UseCase.js";
import { TemplatesManagerRepository } from "../repositories/contracts/TemplatesManagerRepository.js";

interface req {
  templateSource: string[];
  templateDestination: string;
}

export class HandleTemplate implements UseCase<req> {
  constructor(private templatesManagerRepository: TemplatesManagerRepository) {}

  async execute({ templateSource, templateDestination }: req): Promise<void> {
    await this.templatesManagerRepository.install(
      templateSource,
      templateDestination,
    );
  }
}
