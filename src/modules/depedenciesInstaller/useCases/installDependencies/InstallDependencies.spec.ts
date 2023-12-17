import fs from "fs";
import { InstallDependencies } from "./InstallDependencies";
import { DepedenciesInstallerRepository } from "../../repositories/contracts/DepedenciesInstallerRepository";
import { TestDepedenciesInstallerRepositoryImplementations } from "src/test/modules/typescript/repositories/implementations/DepedenciesInstallerRepositoryImplementations";

let depedenciesInstallerRepository: DepedenciesInstallerRepository;
let sut: InstallDependencies;

describe("InstallDependencies", () => {
  beforeEach(() => {
    depedenciesInstallerRepository =
      new TestDepedenciesInstallerRepositoryImplementations();
    sut = new InstallDependencies(depedenciesInstallerRepository);
  });

  it("should be able to execute InstallDependencies", async () => {
    const managerInstallCommand = "npm install";
    const dependency = "express";

    await sut.execute({ managerInstallCommand, dependency });

    const packageJsonExists = fs.readFileSync("src/test/tests/package.json");

    expect(packageJsonExists.includes(dependency)).toBe(true);
  });
});
