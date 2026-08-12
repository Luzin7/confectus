import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/main.ts"],
	format: "esm",
	outDir: "./dist",
	splitting: false,
	loader: { ".*": "copy" },
	external: ["vitest/config"],
});
