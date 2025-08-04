import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoadingServiceImpl } from "../../../src/infrastructure/services/LoadingServiceImpl.js";

// Mock do nanospinner
vi.mock("nanospinner", () => ({
	createSpinner: vi.fn(() => ({
		start: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		stop: vi.fn(),
	})),
}));

describe("LoadingServiceImpl", () => {
	let loadingService: LoadingServiceImpl;
	let mockSpinner: any;

	beforeEach(async () => {
		const { createSpinner } = await import("nanospinner");
		mockSpinner = {
			start: vi.fn(),
			success: vi.fn(),
			error: vi.fn(),
			stop: vi.fn(),
		};
		(createSpinner as any).mockReturnValue(mockSpinner);
		loadingService = new LoadingServiceImpl();
	});

	it("should start spinner with message", () => {
		const message = "Loading...";
		
		loadingService.start(message);
		
		expect(mockSpinner.start).toHaveBeenCalledWith({ text: message });
	});

	it("should show success message", () => {
		const message = "Success!";
		
		loadingService.success(message);
		
		expect(mockSpinner.success).toHaveBeenCalledWith({ text: message });
	});

	it("should show error message", () => {
		const message = "Error occurred!";
		
		loadingService.error(message);
		
		expect(mockSpinner.error).toHaveBeenCalledWith({ text: message });
	});

	it("should stop spinner", () => {
		loadingService.stop();
		
		expect(mockSpinner.stop).toHaveBeenCalled();
	});
});
