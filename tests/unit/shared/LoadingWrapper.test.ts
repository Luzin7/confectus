import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoadingService } from "../../../src/core/contracts/LoadingService.js";
import { LoadingWrapper } from "../../../src/shared/LoadingWrapper.js";

const createMockLoadingService = (): LoadingService => ({
	start: vi.fn(),
	success: vi.fn(),
	error: vi.fn(),
	stop: vi.fn(),
});

describe("LoadingWrapper", () => {
	let loadingWrapper: LoadingWrapper;
	let mockLoadingService: LoadingService;

	beforeEach(() => {
		mockLoadingService = createMockLoadingService();
		loadingWrapper = new LoadingWrapper(mockLoadingService);
	});

	it("should execute operation with loading states - success case", async () => {
		const mockOperation = vi.fn().mockResolvedValue("success result");
		const options = {
			startMessage: "🔧 Starting...",
			successMessage: "🎯 Success!",
			errorMessage: "💥 Error!",
		};

		const result = await loadingWrapper.execute(mockOperation, options);

		expect(mockLoadingService.start).toHaveBeenCalledWith("🔧 Starting...");
		expect(mockOperation).toHaveBeenCalled();
		expect(mockLoadingService.success).toHaveBeenCalledWith("🎯 Success!");
		expect(result).toBe("success result");
	});

	it("should execute operation with loading states - error case", async () => {
		const mockError = new Error("Test error");
		const mockOperation = vi.fn().mockRejectedValue(mockError);
		const options = {
			startMessage: "🔧 Starting...",
			successMessage: "🎯 Success!",
			errorMessage: "💥 Error!",
		};

		await expect(loadingWrapper.execute(mockOperation, options)).rejects.toThrow(
			"Test error",
		);

		expect(mockLoadingService.start).toHaveBeenCalledWith("🔧 Starting...");
		expect(mockOperation).toHaveBeenCalled();
		expect(mockLoadingService.error).toHaveBeenCalledWith("💥 Error!");
		expect(mockLoadingService.success).not.toHaveBeenCalled();
	});
});
