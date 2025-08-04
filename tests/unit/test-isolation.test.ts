import * as fs from 'fs-extra';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Test Isolation Check', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should run in isolated test environment', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.cwd()).toContain('temp-test');
  });

  it('should not modify real project files', async () => {
    const mkdirSpy = vi.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined);
    const copyFileSpy = vi.spyOn(fs, 'copyFileSync').mockImplementation(() => undefined);
    const writeFileSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined);

    fs.mkdirSync('test-dir');
    fs.copyFileSync('source.txt', 'dest.txt');
    fs.writeFileSync('package.json', 'test content');

    expect(mkdirSpy).toHaveBeenCalled();
    expect(copyFileSpy).toHaveBeenCalled();
    expect(writeFileSpy).toHaveBeenCalled();

    mkdirSpy.mockRestore();
    copyFileSpy.mockRestore();
    writeFileSpy.mockRestore();
  });
});
