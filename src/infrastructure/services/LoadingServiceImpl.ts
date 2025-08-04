import { createSpinner } from "nanospinner";
import { LoadingService } from "../../core/contracts/LoadingService.js";

export class LoadingServiceImpl implements LoadingService {
	private spinner = createSpinner();

	start(message: string): void {
		this.spinner.start({ text: message });
	}

	success(message: string): void {
		this.spinner.success({ text: `\x1b[32m${message}\x1b[0m` });
	}

	error(message: string): void {
		this.spinner.error({ text: `\x1b[31m${message}\x1b[0m` });
	}

	stop(): void {
		this.spinner.stop();
	}
}
