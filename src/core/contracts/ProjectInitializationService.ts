export abstract class ProjectInitializationService {
	abstract initialize(initCommand: string): Promise<void>;
}
