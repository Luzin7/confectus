import { LoadingService } from "../core/contracts/LoadingService.js";

interface LoadingWrapperOptions {
	startMessage: string;
	successMessage: string;
	errorMessage: string;
}

export class LoadingWrapper {
	constructor(private loadingService: LoadingService) {}

	async execute<T>(
		operation: () => Promise<T>,
		options: LoadingWrapperOptions,
	): Promise<T> {
		this.loadingService.start(options.startMessage);

		try {
			const result = await operation();
			this.loadingService.success(options.successMessage);
			return result;
		} catch (error) {
			this.loadingService.error(options.errorMessage);
			throw error;
		}
	}
}
