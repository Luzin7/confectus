import { defineConfig } from "tsup";
import rollup from "rollup-plugin-multi-entry";
export default defineConfig({
  entry: ["src/**/*.ts"],
  format: "esm",
  outDir: "./dist",
  plugins: [rollup()],
  loader: { ".*": "copy" },
});
