import { beforeEach, describe, expect, it, vi } from "vitest";
import { SetupProjectEnvironment } from "../../../src/application/useCases/SetupProjectEnvironment.js";
import { ProjectSetupService } from "../../../src/core/contracts/ProjectSetupService.js";

const createMockProjectSetupService = (): ProjectSetupService => ({
	installDependencies: vi.fn(),
	setupFrontendEnvironment: vi.fn(),
	setupBackendEnvironment: vi.fn(),
});

describe("SetupProjectEnvironment Use Case", () => {
	let useCase: SetupProjectEnvironment;
	let mockProjectSetupService: ProjectSetupService;

	beforeEach(() => {
		mockProjectSetupService = createMockProjectSetupService();
		useCase = new SetupProjectEnvironment(mockProjectSetupService);
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
