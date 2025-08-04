import { beforeEach, describe, expect, it, vi } from "vitest";
import { InstallProjectDependencies } from "../../../src/application/useCases/InstallProjectDependencies.js";
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

describe("InstallProjectDependencies Use Case", () => {
	let useCase: InstallProjectDependencies;
	let mockProjectSetupService: ProjectSetupService;
	let mockLoadingService: LoadingService;

	beforeEach(() => {
		mockProjectSetupService = createMockProjectSetupService();
		mockLoadingService = createMockLoadingService();
		useCase = new InstallProjectDependencies(
			mockProjectSetupService,
			mockLoadingService,
		);
	});

	describe("Success Cases", () => {
		it("should install project dependencies successfully", async () => {
			const answers = {
				stack: "Frontend",
				wichLanguage: "TypeScript",
				wichManager: "npm",
				wichLinter: "ESLint",
				wichTest: "Vitest",
			};

			await useCase.execute({ answers });

			expect(mockProjectSetupService.installDependencies).toHaveBeenCalledWith(
				answers,
			);
			expect(mockProjectSetupService.installDependencies).toHaveBeenCalledTimes(
				1,
			);
		});
	});

	describe("Error Cases", () => {
		it("should handle installation errors", async () => {
			const answers = {
				stack: "Frontend",
				wichLanguage: "TypeScript",
				wichManager: "npm",
				wichLinter: "ESLint",
			};
			const errorMessage = "Dependencies installation failed";

			vi.mocked(mockProjectSetupService.installDependencies).mockRejectedValue(
				new Error(errorMessage),
			);

			await expect(useCase.execute({ answers })).rejects.toThrow(errorMessage);
		});
	});
});
