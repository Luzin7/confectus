export abstract class FileTemplateService {
  abstract copyTemplate(
    templateSource: string[],
    templateDestination: string,
  ): Promise<void>;
}
