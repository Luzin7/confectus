import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectInitializationServiceImpl } from '../../../src/infrastructure/services/ProjectInitializationServiceImpl.js';
import { exec } from 'child_process';
import { promisify } from 'util';

vi.mock('child_process');
vi.mock('util');

describe('ProjectInitializationServiceImpl', () => {
  let service: ProjectInitializationServiceImpl;
  let mockExec: any;
  let mockPromisify: any;

  beforeEach(() => {
    service = new ProjectInitializationServiceImpl();
    mockExec = vi.mocked(exec);
    mockPromisify = vi.mocked(promisify);
    
    process.env.NODE_ENV = 'test';
  });

  describe('Success Cases', () => {
    it('should initialize project successfully in development mode', async () => {
      process.env.NODE_ENV = 'development';
      const service = new ProjectInitializationServiceImpl();
      const mockExecPromise = vi.fn().mockResolvedValue({ stdout: 'success', stderr: '' });
      mockPromisify.mockReturnValue(mockExecPromise);

      const initCommand = 'npm init -y';

      await service.initialize(initCommand);

      expect(mockPromisify).toHaveBeenCalledWith(mockExec);
      expect(mockExecPromise).toHaveBeenCalledWith('cd mock && npm init -y');
    });

    it('should initialize project successfully in production mode', async () => {
      process.env.NODE_ENV = 'production';
      const service = new ProjectInitializationServiceImpl();
      const mockExecPromise = vi.fn().mockResolvedValue({ stdout: 'success', stderr: '' });
      mockPromisify.mockReturnValue(mockExecPromise);

      const initCommand = 'npm init -y';

      await service.initialize(initCommand);

      expect(mockExecPromise).toHaveBeenCalledWith('npm init -y');
    });

    it('should handle different package managers', async () => {
      const mockExecPromise = vi.fn().mockResolvedValue({ stdout: 'success', stderr: '' });
      mockPromisify.mockReturnValue(mockExecPromise);

      const initCommand = 'yarn init -y';

      await service.initialize(initCommand);

      expect(mockExecPromise).toHaveBeenCalledWith('yarn init -y');
    });
  });

  describe('Error Cases', () => {
    it('should handle initialization errors', async () => {
      const mockExecPromise = vi.fn().mockRejectedValue(new Error('Init failed'));
      mockPromisify.mockReturnValue(mockExecPromise);
      
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const initCommand = 'npm init -y';

      await expect(service.initialize(initCommand))
        .rejects.toThrow('Project initialization failed');
        
      expect(console.error).toHaveBeenCalledWith('Failed to initialize project:', expect.any(Error));
    });

    it('should handle permission errors', async () => {
      const mockExecPromise = vi.fn().mockRejectedValue(new Error('Permission denied'));
      mockPromisify.mockReturnValue(mockExecPromise);
      
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const initCommand = 'npm init -y';

      await expect(service.initialize(initCommand))
        .rejects.toThrow('Project initialization failed');
    });
  });
});
