export abstract class ProjectSetupService {
	abstract installDependencies(answers: Record<string, string>): Promise<void>;
	abstract setupBackendEnvironment(
		answers: Record<string, string>,
	): Promise<void>;
	abstract setupFrontendEnvironment(
		answers: Record<string, string>,
	): Promise<void>;
}
