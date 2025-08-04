export abstract class InitializeNewProjectRepository {
  abstract install(initCommand: string): Promise<void>;
}
