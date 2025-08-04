import { beforeEach, describe, expect, it, vi } from "vitest";
import { SetupProjectEnvironment } from "../../../src/application/useCases/SetupProjectEnvironment.js";
import { LoadingService } from "../../../src/core/contracts/LoadingService.js";
import { ProjectSetupService } from "../../../src/core/contracts/ProjectSetupService.js";

const createMockProjectSetupService = (): ProjectSetupService => ({
	installDependencies: vi.fn(),
	setupFrontendEnvironment: vi.fn(),
	setupBackendEnvironment: vi.fn(),
});

const createMockLoadingService = (): LoadingService => ({
	start: vi.fn(),
	success: vi.fn(),
	error: vi.fn(),
	stop: vi.fn(),
});

describe("SetupProjectEnvironment Use Case", () => {
	let useCase: SetupProjectEnvironment;
	let mockProjectSetupService: ProjectSetupService;
	let mockLoadingService: LoadingService;

	beforeEach(() => {
		mockProjectSetupService = createMockProjectSetupService();
		mockLoadingService = createMockLoadingService();
		useCase = new SetupProjectEnvironment(
			mockProjectSetupService,
			mockLoadingService,
		);
	});

	describe("Success Cases", () => {
		it("should setup frontend environment successfully", async () => {
			const answers = { stack: "Frontend", language: "TypeScript" };

			await useCase.execute({ answers });

			expect(
				mockProjectSetupService.setupFrontendEnvironment,
			).toHaveBeenCalledWith(answers);
			expect(
				mockProjectSetupService.setupFrontendEnvironment,
			).toHaveBeenCalledTimes(1);
			expect(
				mockProjectSetupService.setupBackendEnvironment,
			).not.toHaveBeenCalled();
			expect(mockLoadingService.start).toHaveBeenCalledWith(
				"🔧 Setting up frontend environment...",
			);
			expect(mockLoadingService.success).toHaveBeenCalledWith(
				"🎯 Frontend environment configured successfully!",
			);
		});

		it("should setup backend environment successfully", async () => {
			const answers = { stack: "Backend", language: "TypeScript" };

			await useCase.execute({ answers });

			expect(
				mockProjectSetupService.setupBackendEnvironment,
			).toHaveBeenCalledWith(answers);
			expect(
				mockProjectSetupService.setupBackendEnvironment,
			).toHaveBeenCalledTimes(1);
			expect(
				mockProjectSetupService.setupFrontendEnvironment,
			).not.toHaveBeenCalled();
			expect(mockLoadingService.start).toHaveBeenCalledWith(
				"🔧 Setting up backend environment...",
			);
			expect(mockLoadingService.success).toHaveBeenCalledWith(
				"🎯 Backend environment configured successfully!",
			);
		});
	});

	describe("Error Cases", () => {
		it("should handle setup environment errors", async () => {
			const answers = { stack: "Frontend", language: "TypeScript" };
			const errorMessage = "Environment setup failed";

			vi.mocked(
				mockProjectSetupService.setupFrontendEnvironment,
			).mockRejectedValue(new Error(errorMessage));

			await expect(useCase.execute({ answers })).rejects.toThrow(errorMessage);
		});
	});
});
