export abstract class TemplatesManagerRepository {
	abstract install(
		templateSource: string[],
		templateDestination: string,
	): Promise<void>;
}
