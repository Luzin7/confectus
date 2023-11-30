export abstract class SetupManagerRepository {
  abstract installDependencies(answers: Record<string, string>): Promise<void>;
  abstract setupConfigurations(answers: Record<string, string>): Promise<void>;
}
