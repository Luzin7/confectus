import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InstallProjectDependencies } from '../../../src/application/useCases/InstallProjectDependencies.js';
import { ProjectSetupService } from '../../../src/core/contracts/ProjectSetupService.js';

const createMockProjectSetupService = (): ProjectSetupService => ({
  installDependencies: vi.fn(),
  setupFrontendEnvironment: vi.fn(),
  setupBackendEnvironment: vi.fn()
});

describe('InstallProjectDependencies Use Case', () => {
  let useCase: InstallProjectDependencies;
  let mockProjectSetupService: ProjectSetupService;

  beforeEach(() => {
    mockProjectSetupService = createMockProjectSetupService();
    useCase = new InstallProjectDependencies(mockProjectSetupService);
  });

  describe('Success Cases', () => {
    it('should install project dependencies successfully', async () => {
      const answers = { 
        stack: 'Frontend', 
        wichLanguage: 'TypeScript',
        wichManager: 'npm',
        wichLinter: 'ESLint',
        wichTest: 'Vitest'
      };

      await useCase.execute({ answers });

      expect(mockProjectSetupService.installDependencies).toHaveBeenCalledWith(answers);
      expect(mockProjectSetupService.installDependencies).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Cases', () => {
    it('should handle installation errors', async () => {
      const answers = { 
        stack: 'Frontend', 
        wichLanguage: 'TypeScript',
        wichManager: 'npm',
        wichLinter: 'ESLint'
      };
      const errorMessage = 'Dependencies installation failed';
      
      vi.mocked(mockProjectSetupService.installDependencies).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(useCase.execute({ answers })).rejects.toThrow(errorMessage);
    });
  });
});
