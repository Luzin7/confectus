import { DepedenciesInstallerRepository } from "@modules/depedenciesInstaller/repositories/contracts/DepedenciesInstallerRepository";
import fs from "fs";
import { InstallDependencies } from "./InstallDependencies";
import { TestDepedenciesInstallerRepositoryImplementations } from "@test/modules/typescript/repositories/implementations/DepedenciesInstallerRepositoryImplementations";

let depedenciesInstallerRepository: DepedenciesInstallerRepository;
let sut: InstallDependencies;

describe("installTypescript", () => {
  beforeEach(() => {
    depedenciesInstallerRepository =
      new TestDepedenciesInstallerRepositoryImplementations();
    sut = new InstallDependencies(depedenciesInstallerRepository);
  });

  // afterEach(() => {
  //   fs.rmdirSync('src/test/tests', { recursive: true })
  //   fs.mkdirSync('src/test/tests')
  // })

  it("should be able to execute installTypescript", async () => {
    const managerInstallCommand = "npm install";
    const dependecies = "express";

    await sut.execute({ managerInstallCommand, dependecies });

    const packageJsonExists = fs.readFileSync("src/test/tests/package.json");

    expect(packageJsonExists.includes(dependecies)).toBe(true);
  });

  it("should NOT be able to execute installTypescript", async () => {
    const managerInstallCommand = "npm uninstall";
    const dependecies = "express";

    await sut.execute({ managerInstallCommand, dependecies });

    const packageJsonExists = fs.readFileSync("src/test/tests/package.json");

    expect(packageJsonExists.includes(dependecies)).toBe(false);
  });
});
