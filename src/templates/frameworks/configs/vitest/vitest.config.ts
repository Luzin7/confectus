/// <reference types="vitest"/>
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    include: ["src/**/*.spec.ts"],
    dir: "src/test",
  },
});
