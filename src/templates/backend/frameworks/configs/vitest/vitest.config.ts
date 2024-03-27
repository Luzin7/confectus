import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    includeSource: ["src/**/*.spec.ts"],
    exclude: [...configDefaults.exclude],
    globals: true,
  },
  resolve: {
    alias: {
      "@module/": "/src/module/",
      "@shared/": "/src/shared/",
      "@test/": "/src/test/",
      "@env/": "/src/env/",
      "@infra/": "/src/infra/",
      "@providers/": "/src/providers/",
    },
  },
});
