import { createSpinner } from "nanospinner";
import { LoadingService } from "../../core/contracts/LoadingService.js";

export class LoadingServiceImpl implements LoadingService {
	private spinner = createSpinner();

	start(message: string): void {
		this.spinner.start({ text: message });
	}

	success(message: string): void {
		this.spinner.success({ text: message });
	}

	error(message: string): void {
		this.spinner.error({ text: message });
	}

	stop(): void {
		this.spinner.stop();
	}
}
