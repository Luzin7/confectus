import { createSpinner, type Spinner } from "nanospinner";

export type SpinnerLike = {
	readonly start: (text?: string) => unknown;
	readonly success: (text?: string) => unknown;
	readonly error: (text?: string) => unknown;
	readonly stop: () => unknown;
};

export const startSpinner = (text: string): Spinner => {
	const spinner = createSpinner(text);
	spinner.start();
	return spinner;
};

export const withSpinner = async <T>(
	text: string,
	fn: () => Promise<T>,
	spinner: ReturnType<typeof startSpinner> = startSpinner(text),
): Promise<T> => {
	try {
		const result = await fn();
		spinner.success();
		return result;
	} catch (e) {
		spinner.error();
		throw e;
	}
};
