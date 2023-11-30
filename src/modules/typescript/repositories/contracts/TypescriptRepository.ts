export abstract class TypescriptRepository {
  abstract install(installCommands: string): Promise<void>;
}
