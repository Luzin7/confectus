export abstract class SetupManagerRepository {
	abstract installDependencies(answers: Record<string, string>): Promise<void>;
	abstract setupBackendConfigurations(
		answers: Record<string, string>,
	): Promise<void>;

	abstract setupFrontendConfigurations(
		answers: Record<string, string>,
	): Promise<void>;
}
