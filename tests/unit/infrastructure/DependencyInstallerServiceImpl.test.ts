import { exec } from "child_process";
import { promisify } from "util";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DependencyInstallerServiceImpl } from "../../../src/infrastructure/services/DependencyInstallerServiceImpl.js";

vi.mock("child_process");
vi.mock("util");

describe("DependencyInstallerServiceImpl", () => {
	let service: DependencyInstallerServiceImpl;
	let mockExec: ReturnType<typeof vi.mocked<typeof exec>>;
	let mockPromisify: ReturnType<typeof vi.mocked<typeof promisify>>;

	beforeEach(() => {
		service = new DependencyInstallerServiceImpl();
		mockExec = vi.mocked(exec);
		mockPromisify = vi.mocked(promisify);

		process.env.NODE_ENV = "test";
	});

	describe("Success Cases", () => {
		it("should install dependencies successfully", async () => {
			const mockExecPromise = vi
				.fn()
				.mockResolvedValue({ stdout: "success", stderr: "" });
			mockPromisify.mockReturnValue(mockExecPromise);

			const managerInstallCommand = "npm install";
			const dependency = "typescript";
			const stackChoiced = {
				typescript: {
					configFiles: {
						configFileName: "tsconfig.json",
						configFilePath: ["backend", "typescript", "tsconfig.json"],
					},
					dependencies: "typescript",
					devDependencies: "@types/node",
				},
			};

			await service.install(managerInstallCommand, dependency, stackChoiced);

			expect(mockPromisify).toHaveBeenCalledWith(mockExec);
			expect(mockExecPromise).toHaveBeenCalledTimes(2);
		});

		it("should install only dependencies when devDependencies is null", async () => {
			const mockExecPromise = vi
				.fn()
				.mockResolvedValue({ stdout: "success", stderr: "" });
			mockPromisify.mockReturnValue(mockExecPromise);

			const managerInstallCommand = "npm install";
			const dependency = "react";
			const stackChoiced = {
				react: {
					configFiles: {
						configFileName: "package.json",
						configFilePath: ["frontend", "react", "package.json"],
					},
					dependencies: "react react-dom",
					devDependencies: null,
				},
			};

			await service.install(managerInstallCommand, dependency, stackChoiced);

			expect(mockExecPromise).toHaveBeenCalledTimes(1);
		});

		it("should install only devDependencies when dependencies is null", async () => {
			const mockExecPromise = vi
				.fn()
				.mockResolvedValue({ stdout: "success", stderr: "" });
			mockPromisify.mockReturnValue(mockExecPromise);

			const managerInstallCommand = "npm install";
			const dependency = "eslint";
			const stackChoiced = {
				eslint: {
					configFiles: {
						configFileName: ".eslintrc.json",
						configFilePath: ["backend", "linters", "eslint.json"],
					},
					dependencies: null,
					devDependencies: "eslint @typescript-eslint/parser",
				},
			};

			await service.install(managerInstallCommand, dependency, stackChoiced);

			expect(mockExecPromise).toHaveBeenCalledTimes(1);
		});
	});

	describe("Error Cases", () => {
		it("should throw error when dependency installation fails", async () => {
			const mockExecPromise = vi
				.fn()
				.mockRejectedValueOnce(new Error("Installation failed"))
				.mockResolvedValue({ stdout: "success", stderr: "" });
			mockPromisify.mockReturnValue(mockExecPromise);

			const managerInstallCommand = "npm install";
			const dependency = "typescript";
			const stackChoiced = {
				typescript: {
					configFiles: {
						configFileName: "tsconfig.json",
						configFilePath: ["backend", "typescript", "tsconfig.json"],
					},
					dependencies: "typescript",
					devDependencies: "@types/node",
				},
			};

			await expect(
				service.install(managerInstallCommand, dependency, stackChoiced),
			).rejects.toThrow();
		});

		it("should throw error when devDependency installation fails", async () => {
			const mockExecPromise = vi
				.fn()
				.mockResolvedValueOnce({ stdout: "success", stderr: "" })
				.mockRejectedValueOnce(new Error("DevDependency installation failed"));
			mockPromisify.mockReturnValue(mockExecPromise);

			const managerInstallCommand = "npm install";
			const dependency = "typescript";
			const stackChoiced = {
				typescript: {
					configFiles: {
						configFileName: "tsconfig.json",
						configFilePath: ["backend", "typescript", "tsconfig.json"],
					},
					dependencies: "typescript",
					devDependencies: "@types/node",
				},
			};

			await expect(
				service.install(managerInstallCommand, dependency, stackChoiced),
			).rejects.toThrow();
		});

		it("should handle missing dependency configuration", async () => {
			const managerInstallCommand = "npm install";
			const dependency = "nonexistent";
			const stackChoiced = {};

			await expect(
				service.install(managerInstallCommand, dependency, stackChoiced),
			).resolves.not.toThrow();
		});
	});
});
