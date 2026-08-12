---
"confectus": "major"
---

Complete rewrite to a functional pipeline architecture. The CLI is rebuilt around a unidirectional flow: Prompt → Schema (zod validation) → Mapper (pure) → Generators (I/O).

This is a `major` bump (`2.0.0`) because the internal source tree was fully restructured. User-facing UX is unchanged — running `confectus` or `cf` produces the same outcome as before.

## Internal changes

- Removed `application/`, `core/contracts/`, `infrastructure/`, `plugins/`, dead `configs/cli/` directories and pass-through use cases that wrapped the actual logic.
- Removed `ProjectSetupServiceImpl` god-service (394 lines) — replaced by `src/pipeline/templateMapper.ts` (pure function returning `FileOp[]` from validated `Answers`).
- Removed 5 contracts that never had implementation (`DependenciesInstallerRepository`, `InitializeNewProjectRepository`, `QuestionnaireRepository`, `SetupManagerRepository`, `TemplatesManagerRepository`).
- Removed 3 duplicated copies of `managers.ts` and 3 of `questions.ts` (only 1 of each was actually imported). The dead `configs/cli/managers.ts` copy had a real bug (`pnpm install` instead of `pnpm add`) that no longer exists.
- Eliminated 14 `throw new Error(string)` — replaced with typed `ConfectusError` hierarchy with pt-BR messages and `code` field.
- Eliminated 19 inline `NODE_ENV === "development"` checks — replaced with single `Env.isDev` source injected through the pipeline.
- `tsup.config.js` switched from `entry: ["src/**/*.ts"]` glob (which bundled templates as `.js` AND copied them via `build.js` — double dist footprint) to a single `src/main.ts` entry. `dist/` now ships `main.js` (14.6KB) + `templates/` only.

## Bug fixes encoded as regression tests

- `backend.biome.configFilePath` now correctly points at `backend/linters/biome/biome.json`. Previously it pointed at the VSCode `settings.json` file (so installing Biome on a backend project copied the wrong file).
- `backend.vitest` extension was inconsistent — `configFileName: "vitest.config.js"` but `configFilePath` ending in `.ts`. Split into `vitestJs` and `vitestTs` template refs, with src and dest extensions always aligned.
- `backend.greetings.configFileName` was a leftover placeholder `".eslintrc.js"` even though it pointed to `helloWorld.ts`. The dict entry is gone; the mapper now resolves the destination to `src/app.ts` or `src/app.js` based on language choice.
- `hasPackageJson` prompt choice order was inverted between Backend (`"No", "Yes"`) and Frontend (`"Yes", "No"`). Now unified to `"Yes", "No"` on both paths.
- Orphan `backend/typescript/tests/vitest/tsconfig.json` (no references in any dict) deleted.
