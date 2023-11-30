import { TypescriptRepository} from '@modules/typescript/repositories/contracts/TypescriptRepository';
import { InstallTypescript } from './InstallTypescript';
import { TestTypescriptRepositoryImplementations } from '@test/modules/typescript/repositories/implementations/TypescriptRepositoryImplementations';
import fs from 'fs';

let typescriptRepository: TypescriptRepository
let sut: InstallTypescript

describe("installTypescript", () => {
  beforeEach(() => {
    typescriptRepository = new TestTypescriptRepositoryImplementations()
    sut = new InstallTypescript(typescriptRepository)
  })

  // afterEach(() => {
  //   fs.rmdirSync('src/test/tests', { recursive: true })
  //   fs.mkdirSync('src/test/tests')
  // })
  
  
  it("should be able to execute installTypescript", async () => {
    const managerInstallCommand = "npm install"
    const dependecies = "express"

    await sut.execute({ managerInstallCommand, dependecies })

    const packageJsonExists = fs.readFileSync('src/test/tests/package.json')

    expect(packageJsonExists.includes(dependecies)).toBe(true)
  })
  

  it("should NOT be able to execute installTypescript", async () => {
    const managerInstallCommand = "npm uninstall"
    const dependecies = "express"

    await sut.execute({ managerInstallCommand, dependecies })

    const packageJsonExists = fs.readFileSync('src/test/tests/package.json')
    
    expect(packageJsonExists.includes(dependecies)).toBe(false)

  })
})