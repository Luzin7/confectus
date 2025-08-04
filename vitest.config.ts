import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    includeSource: ['src/**/*.spec.ts'],
    include: ['tests/**/*.test.ts'],
    exclude: [...configDefaults.exclude, 'tests/modules/**', 'temp-test/**'],
    globals: true,
    environment: 'node',
    setupFiles: ['tests/setup/vitest.setup.ts'],
    watch: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'coverage/**',
        'dist/**',
        'mock/**',
        'temp-test/**',
        'tests/**',
        '**/*.d.ts',
        'build.js',
        'vitest.config.ts',
        'tsup.config.js'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  },
  resolve: {
    alias: {
      '@core/': '/src/core/',
      '@application/': '/src/application/',
      '@infrastructure/': '/src/infrastructure/',
      '@interface/': '/src/interface/',
      '@configs/': '/src/configs/',
      '@templates/': '/src/templates/'
    },
  },
});
