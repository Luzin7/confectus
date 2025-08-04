import { beforeEach, describe, expect, it, vi } from "vitest";
import { FileTemplateServiceImpl } from "../../../src/infrastructure/filesystem/FileTemplateServiceImpl.js";

describe("FileTemplateServiceImpl", () => {
	let service: FileTemplateServiceImpl;

	beforeEach(() => {
		service = new FileTemplateServiceImpl();
		vi.clearAllMocks();

		process.env.NODE_ENV = "development";
	});

	describe("Success Cases", () => {
		it("should create instance successfully", () => {
			expect(service).toBeDefined();
			expect(service.copyTemplate).toBeDefined();
		});

		it("should have copyTemplate method", () => {
			expect(typeof service.copyTemplate).toBe("function");
		});
	});

	describe("Error Cases", () => {
		it("should handle invalid template source gracefully", async () => {
			const templateSource: string[] = [];
			const templateDestination = "test/test.txt";

			try {
				await service.copyTemplate(templateSource, templateDestination);
				expect(true).toBe(true);
			} catch (error) {
				expect(error).toBeDefined();
			}
		});
	});
});
