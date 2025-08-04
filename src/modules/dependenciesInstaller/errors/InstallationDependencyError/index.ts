import { UseCaseError } from "@core/errors/ErrorUseCase";

export class InstallationDependencyError extends Error implements UseCaseError {
	constructor() {
		super("An error occurred during the dependencies installation process.");
	}
}
