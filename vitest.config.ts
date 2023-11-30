///<reference types="vitest"/>
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    include: ["src/**/*.spec.ts"],
    dir: "src/test"
  },
  resolve: {
    alias: {
      "@shared/": "./src/shared/",
      "@modules/": "./src/modules/",
      "@test/": "src/test/",
      "@env/": "src/env/",
      "@infra/": "src/infra/",
      "@app/": "src/app/",
      "@domain/": "src/domain/",
    },
  }
})