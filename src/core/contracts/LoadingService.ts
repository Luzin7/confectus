export interface LoadingService {
	start(message: string): void;
	success(message: string): void;
	error(message: string): void;
	stop(): void;
}
