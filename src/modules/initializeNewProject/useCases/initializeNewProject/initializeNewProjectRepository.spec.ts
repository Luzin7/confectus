import fs from "fs";
import { InitializeNewProject } from "./InitializeNewProject";
import { InitializeNewProjectRepository } from "../../repositories/contracts/InitializeNewProjectRepository";
import { TestInitializeNewProjectRepositoryImplementations } from "src/test/modules/initializeNewProject/repositories/implementations/InitializeNewProjectRepositoryImplementations";

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

    expect(packageJsonExists.includes("name")).toBe(true);
  });
});
