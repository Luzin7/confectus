import { InitializeNewProjectRepository } from "@modules/initializeNewProject/repositories/contracts/InitializeNewProjectRepository";
import fs from "fs";
import { InitializeNewProject } from "./InitializeNewProject";
import { TestInitializeNewProjectRepositoryImplementations } from "@test/modules/initializeNewProject/repositories/implementations/InitializeNewProjectRepositoryImplementations";

let initializeNewProjectRepository: InitializeNewProjectRepository;
let sut: InitializeNewProject;

describe("initializeNewProjectRepository", () => {
  beforeEach(() => {
    initializeNewProjectRepository =
      new TestInitializeNewProjectRepositoryImplementations();
    sut = new InitializeNewProject(initializeNewProjectRepository);
  });

  it("should be able to execute initializeNewProjectRepository", async () => {
    const managerInitCommand = "npm init -y";

    await sut.execute({ managerInitCommand });

    const packageJsonExists = fs.readFileSync("src/test/tests/package.json");

    expect(packageJsonExists.includes("main")).toBe(true);
  });
});
