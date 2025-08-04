export abstract class UseCase<T> {
	abstract execute(props: T | null): Promise<void>;
}
