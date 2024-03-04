import rollup from "rollup-plugin-multi-entry";
import { defineConfig } from "tsup";
export default defineConfig({
  entry: ["src/**/*.ts", "!src/test/**/*", "!src/**/*.spec.*"],
  format: "esm",
  outDir: "./dist",
  plugins: [rollup()],
  loader: { ".*": "copy" },
  external: ["vitest/config"],
});
