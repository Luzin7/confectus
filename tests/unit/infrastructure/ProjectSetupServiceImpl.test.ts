import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectSetupServiceImpl } from '../../../src/infrastructure/services/ProjectSetupServiceImpl.js';
import type { ProjectInitializationService } from '../../../src/core/contracts/ProjectInitializationService.js';
import type { DependencyInstallerService } from '../../../src/core/contracts/DependencyInstallerService.js';
import type { FileTemplateService } from '../../../src/core/contracts/FileTemplateService.js';
import type { Answers } from '../../../src/application/dtos/answers.js';

describe('ProjectSetupServiceImpl', () => {
  let service: ProjectSetupServiceImpl;
  let mockProjectInitializationService: ProjectInitializationService;
  let mockDependencyInstallerService: DependencyInstallerService;
  let mockFileTemplateService: FileTemplateService;

  beforeEach(() => {
    mockProjectInitializationService = {
      initialize: vi.fn()
    };

    mockDependencyInstallerService = {
      install: vi.fn()
    };

    mockFileTemplateService = {
      copyTemplate: vi.fn()
    };

    service = new ProjectSetupServiceImpl(
      mockProjectInitializationService,
      mockDependencyInstallerService,
      mockFileTemplateService
    );

    process.env.NODE_ENV = 'test';
  });

  describe('Success Cases', () => {
    it('should install dependencies for frontend project', async () => {
      const answers: Answers = {
        stack: 'Frontend',
        wichStack: 'React',
        wichManager: 'NPM',
        wichLanguage: 'Typescript',
        wichLinter: 'Eslint',
        isVscode: 'Yes',
        hasPackageJson: 'Yes',
        wichTest: 'Vitest',
        createDirectories: 'Yes',
        addScripts: 'Yes'
      };

      mockDependencyInstallerService.install = vi.fn().mockResolvedValue(undefined);

      await service.installDependencies(answers);

      expect(mockDependencyInstallerService.install).toHaveBeenCalled();
    });

    it('should setup frontend environment', async () => {
      const answers: Answers = {
        stack: 'Frontend',
        wichStack: 'React',
        wichManager: 'NPM',
        wichLanguage: 'Typescript',
        wichLinter: 'Eslint',
        isVscode: 'Yes',
        hasPackageJson: 'Yes',
        wichTest: 'Vitest',
        createDirectories: 'Yes',
        addScripts: 'Yes'
      };

      mockFileTemplateService.copyTemplate = vi.fn().mockResolvedValue(undefined);

      await service.setupFrontendEnvironment(answers);

      expect(mockFileTemplateService.copyTemplate).toHaveBeenCalled();
    });

    it('should setup backend environment', async () => {
      const answers: Answers = {
        stack: 'Backend',
        wichStack: 'N/A',
        wichManager: 'NPM',
        wichLanguage: 'Typescript',
        wichLinter: 'Eslint',
        hasPackageJson: 'No',
        isVscode: 'Yes',
        wichTest: 'Vitest',
        createDirectories: 'Yes',
        addScripts: 'Yes'
      };

      mockFileTemplateService.copyTemplate = vi.fn().mockResolvedValue(undefined);

      await service.setupBackendEnvironment(answers);

      expect(mockFileTemplateService.copyTemplate).toHaveBeenCalled();
    });
  });

  describe('Error Cases', () => {
    it('should handle dependency installation errors', async () => {
      const answers: Answers = {
        stack: 'Frontend',
        wichStack: 'React',
        wichManager: 'NPM',
        wichLanguage: 'Typescript',
        wichLinter: 'Eslint',
        isVscode: 'Yes',
        hasPackageJson: 'Yes',
        wichTest: 'Vitest',
        createDirectories: 'Yes',
        addScripts: 'Yes'
      };

      mockDependencyInstallerService.install = vi.fn()
        .mockRejectedValue(new Error('Installation failed'));

      await expect(service.installDependencies(answers))
        .rejects.toThrow('Installation failed');
    });

    it('should handle frontend environment setup errors', async () => {
      const answers: Answers = {
        stack: 'Frontend',
        wichStack: 'React',
        wichManager: 'NPM',
        wichLanguage: 'Typescript',
        wichLinter: 'Eslint',
        isVscode: 'Yes',
        hasPackageJson: 'Yes',
        wichTest: 'Vitest',
        createDirectories: 'Yes',
        addScripts: 'Yes'
      };

      mockFileTemplateService.copyTemplate = vi.fn()
        .mockRejectedValue(new Error('Template generation failed'));

      await expect(service.setupFrontendEnvironment(answers))
        .rejects.toThrow('Template generation failed');
    });

    it('should handle backend environment setup errors', async () => {
      const answers: Answers = {
        stack: 'Backend',
        wichStack: 'N/A',
        wichManager: 'NPM',
        wichLanguage: 'Typescript',
        wichLinter: 'Eslint',
        hasPackageJson: 'No',
        isVscode: 'Yes',
        wichTest: 'Vitest',
        createDirectories: 'Yes',
        addScripts: 'Yes'
      };

      mockFileTemplateService.copyTemplate = vi.fn()
        .mockRejectedValue(new Error('Backend setup failed'));

      await expect(service.setupBackendEnvironment(answers))
        .rejects.toThrow('Backend setup failed');
    });
  });
});
