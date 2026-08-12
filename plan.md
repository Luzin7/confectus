# Confectus 2.0.0 — Pipeline Functional Refactor

> Source repo: `~/Documents/codes/personal/confectus`
> Status: planned, ready to execute
> Target version: `2.0.0` (no user-facing UX change, semver bump signals internal rewrite)
> Branch strategy: `refactor/pipeline-functional` from `dev`

---

## Context — why this refactor

The current codebase applies Clean Architecture / DDD / Repository pattern to a **scaffolding CLI that lives and dies in a few seconds**. Outcome:

- `ProjectSetupServiceImpl`: 394-line god-service with **4 copy-pasted `if` blocks** (React/Next/Vue/N/A), nested `switch > switch`, 14 `throw new Error(string)` that **destroy typed errors** already created (`throw new Error(new NoPackageJsonError().message)` — instantiates the class only to discard its type).
- **5 contracts in `core/contracts/` never had implementation** (`DependenciesInstallerRepository`, `InitializeNewProjectRepository`, `QuestionnaireRepository`, `SetupManagerRepository`, `TemplatesManagerRepository`) — dead abstraction layer.
- **3 use cases** in `application/` are pure pass-through wrappers (~10 lines each, 1 useful line).
- **3 copies of `managers.ts` and 3 of `questions.ts`** — only 1 of each is imported, the dead copies include one with a real bug (`pnpm install` instead of `pnpm add`).
- **`NODE_ENV === "development"` hack appears 19 times across 5 files** to switch `mock/` paths — no abstraction, every impl re-implements the same condition.
- **`tsconfig.json` has an `@interface` alias to a folder that never existed**; `vitest.config.ts` and `tsconfig.json` aliases diverge.

Conclusion: the architecture was the disease, not the cure. The fix is not to add more layers — it is to **remove them** and move to a unidirectional functional pipeline: `Prompt → Schema → Mapper (pure) → Generators (I/O)`.

## Decisions (locked)

| # | Decision | Rationale |
|---|---|---|
| 1 | Functional pipeline, no classes for roteamento logic | CLI tem no domain richness, no invariants to protect beyond schema validation. Classes without invariants = namespace with `this.` — the exact habit that produced the current debt. |
| 2 | Keep current dependencies (nanospinner, inquirer 9, biome 1.8.3) | Zero churn during refactor. Dep upgrades are orthogonal and can be a separate PR (lote D-full). |
| 3 | No coverage threshold; **TDD rigor on critical points only** | Critical points: `validateAnswers`, `templateMapper`, `dependenciesFor`, `fileWriter`, end-to-end `pipeline()`. Rest gets integration coverage organically. |
| 4 | Tests with `tmpdir` (real writes), no `mock-fs` | Project choice — simpler, less fragile with native deps. |
| 5 | `2.0.0` semver bump | Signals internal rewrite. UX unchanged. |
| 6 | Branch from `dev` | Last merge 04/08/2025 on `dev`, stable base. |
| 7 | Small commits per lote | Trackable history for review. |

## Target architecture

```
src/
  main.ts                      # shebang + bootstrap
  pipeline.ts                  # prompt → schema → mapper → run (entry orchestrator)
  schema/
    configSchema.ts             # zod schema + inferred `Answers` type
    validateAnswers.ts          # cross-field consistency (Either<ParseError, Answers>)
  prompts/
    collectAnswers.ts          # inquirer prompts separated from schema (UI ≠ validation)
  mappings/
    packageManagers.ts          # const NPM/Yarn/Bun/PNPM = { init, install, addDev }
    templatesDictionary.ts      # backendTemplates / frontendTemplates (lookup O(1))
    dependenciesDictionary.ts  # backendDeps / frontendDeps (lista de pacotes)
    scriptsDictionary.ts        # scripts injetados em package.json
  pipeline/
    templateMapper.ts           # (config) => FileOp[]          — pure, TDD
    dependenciesFor.ts          # (config) => string[]          — pure, TDD
    scriptsFor.ts               # (config) => Record<string,string> — pure
  generators/
    fileWriter.ts               # (ops[], env) => Promise<void>  — TDD via tmpdir
    packageJsonUpdater.ts       # (scripts, env) => Promise<void>
    packageInstaller.ts         # (deps, manager, env) => Promise<void>
    projectInitializer.ts       # (manager, env) => Promise<void>
  errors/
    index.ts                    # all typed errors, one class per case
  shared/
    env.ts                      # type Env { cwd, templatesRoot, isDev }
    spinner.ts                  # nanospinner wrapper
  templates/                    # PRESERVED INTEGRALLY (poda em lote D)
tests/
  integration/
    validateAnswers.test.ts
    templateMapper.test.ts
    dependenciesFor.test.ts
    fileWriter.integration.test.ts
    pipeline.backend.ts.integration.test.ts
    pipeline.frontend.ts.integration.test.ts
    pipeline.edge-cases.integration.test.ts
    smoke.cli.test.ts            # spawns real binário
  setup/
    tmpdir.ts                   # helper: creates tmpdir + copies templates in
```

**Deaths:** `application/`, `core/contracts/`, `core/errors/ErrorUseCase.ts`, `infrastructure/`, `plugins/`, `shared/LoadingWrapper.ts`, `configs/cli/`, `application/dtos/`, das 6 errors atuais 5 viram 1 arquivo, use cases, mock state interno de `QuestionnaireServiceImpl`.

**Survives (migrated):** dicionários de dependências (`dependenciesInstallerSetup/index.ts` linhas 1–260) viram `mappings/*.ts` com chaves normalizadas em lowercase-canônico.

## Lotes — order optimized for cost

**Inverted from naive order:** I do the mappings BEFORE the schema because the mappings are the current source of truth. Building schema first then mapping against it forces retroadjust — mapping first then typing it is cheaper.

| # | Lote | Why this order | Est. |
|---|------|----------------|------|
| 0 | Setup: branch + commit plan as `plan.md` in repo | Anchors everything; documents intent in repo history | 30min |
| 1 | `mappings/*.ts` — normalize keys, consolidate to 1 file each | Source of truth first; no upstream dependency | 3–4h |
| 2 | `schema/configSchema.ts` + `validateAnswers.ts` (zod) | Types inferred from already-normalized dict; cross-field rules | 2–3h |
| 3 | Template regression fixes (only bugs blocking tests): `backend.biome` path, `backend.vitest` extension mismatch, `greetings` placeholder bug, dead `tsconfig.json` in `tests/vitest/` | Must fix before mapper TDD or tests will encode bugs as "expected" | 1h |
| 4 | `pipeline/templateMapper.ts` + `dependenciesFor.ts` + `scriptsFor.ts` **TDD** | Critical point #1 — pure functions, table tests | 3h |
| 5 | `generators/fileWriter.ts` **TDD via tmpdir** + remaining generators | Critical point #2 — fileWriter is the only I/O with subtle semantics | 3h |
| 6 | Delete dead code: `application/`, `core/`, `infrastructure/`, `plugins/`, `configs/cli/`, `shared/LoadingWrapper.ts` | Only after mappers+generators are green | 30min |
| 7 | `pipeline.ts` + `prompts/collectAnswers.ts` + new `main.ts` | Wire up what already works | 1h |
| 8 | Integration tests end-to-end + smoke CLI test | `pipeline()` full run, inquirer programmatic, real spawns | 2–3h |
| 9 | Update `tsconfig.json` + `vitest.config.ts` aliases, `tsup.config.js` entry, remove `rollup-plugin-multi-entry` + `@types/jest` + `ts-node`, bump `1.8.0` → `2.0.0` | Build hygiene | 1h |
| 10 | Lint + type-check + smoke pass + open PR `refactor/pipeline-functional` → `main` | Validation gate | 30min |

**Total est.: ~16–18h hands-on**, split across commits per lote.

## Critical points — TDD scope

These are where bugs hide today and where regressions are most costly. Full TDD discipline (red → green → refactor).

| Point | Risk if skipped | Test format |
|---|---|---|
| `validateAnswers` | Backend config missing `createDirectories` passes silently; tests then run with undefined branches | Unit table: invalid × valid cross-field combinations |
| `templateMapper` | The `backend.biome` bug returns (settings.json instead of biome.json); `greetings` placeholder bug returns | Unit: snapshot of `FileOp[]` for each `(wichStack × wichLanguage × wichLinter × wichTest)` combination |
| `dependenciesFor` | Silent install of `eslint` when user said `No` | Unit: assert empty array for `"No"` paths; assert correct casing of dep keys |
| `fileWriter` | Templates written to wrong path (current `mock/` hack shows how easy this is) | Integration with `tmpdir`: verify existence + content-blob equality for every copied file |
| `pipeline()` end-to-end | Wiring between modules broken silently; spinner hangs; inquirer never resolves | Smoke: spawn real CLI binary as subprocess with piped stdin, assert exit code 0 + files exist on disk + package.json updated correctly |

## Test infrastructure

- **No global mocks.** Current `tests/setup/vitest.setup.ts` (89 lines) mocks `fs-extra` and `child_process` globally — fragile (mock + per-test `spyOn` over it). Delete.
- **`tmpdir` helper** in `tests/setup/tmpdir.ts`:
  ```ts
  export function setupEnv(): { env: Env; cleanup: () => void } {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "confectus-"));
    const templatesRoot = path.join(cwd, "templates");
    fse.copySync(path.resolve(__dirname, "../../src/templates"), templatesRoot);
    return { env: { cwd, templatesRoot, isDev: false }, cleanup: () => fse.removeSync(cwd) };
  }
  ```
- **Coverage**: no threshold. The critical points above are mandatory green; other codepaths gain coverage organically via integration tests.

## Bug fixes committed during refactor (free wins)

These are bugs the explorer confirmed today. The refactor eliminates them by construction:

1. `backend.biome.configFilePath` aponta pra settings do VSCode → redirecionado pra `backend/linters/biome/biome.json`.
2. `backend.vitest.configFileName = "vitest.config.js"` mas `configFilePath` é `.ts` → unified: extensão alinhada com o filepath.
3. `backend.greetings.configFileName = ".eslintrc.js"` typo placeholder → removido; `app.ts`/`app.js` resolved no mapper.
4. `hasPackageJson` choices em ordem invertida entre Backend (`"No","Yes"`) e Frontend (`"Yes","No"`) → unified pra `"Yes","No"`.
5. `pnpm install` em `configs/cli/managers.ts` → morto, deletado junto com o arquivo.
6. 14 `throw new Error(string)` → todos viram erros tipados em `errors/index.ts`.
7. 19 `NODE_ENV === "development"` inline → única fonte `Env.isDev`, injetada.
8. `tsconfig.json` with `@interface` alias to nonexistent folder → removed.
9. `tsup.config.js` entry `src/**/*.ts` bundling templates as `.js` → entry `src/main.ts` only; templates copied by `build.js` (preserved).

## Smoke test final — gate before PR

Run real CLI binary in 5 variations inside `tmpdir`:

| # | Stack | Language | Linter | Test | VSCode | Src | Scripts | Stack-specific |
|---|---|---|---|---|---|---|---|---|
| 1 | Backend | TS | Biome | Vitest | Yes | Yes | Yes | — |
| 2 | Backend | JS | Eslint | No | No | No | No | — |
| 3 | Frontend | TS | Eslint | — | Yes | — | — | React |
| 4 | Frontend | JS | Biome | — | No | — | — | Vue.js |
| 5 | Frontend | TS | No | — | No | — | — | N/A |

For each variation, assert:
- Exit code 0.
- Expected set of files exists in cwd.
- `package.json` was created/updated with the expected scripts and dependencies.
- No leftover `mock/` directory (the old hack must be gone).

If all 5 pass → PR is ready for manual review.

## Out of scope (deferred to future PRs)

- **Lote D-full template poda**: dedup `vitest.config.{ts,js}` entre backend/frontend, dedup `eslint.config.mjs` JS-only between stacks, remove `backend/typescript/tests/vitest/tsconfig.json` (orphan).
- **Dep upgrades**: `@biomejs/biome` 1.8.3 → 2.x, `nanospinner` → `ora`, `inquirer` 9 → `@inquirer/prompts`. Separate PR.
- **New features**: new frameworks (Angular, Svelte), new linters (Oxlint), new test runners (Bun test). Separate PRs after this 2.0.0 lands.

## Open question for execution phase

- **Commits per lote or single squash?** Default: `rebase`-friendly small commits per lote (`refactor(lote1): mappings`...). If you prefer a single squash commit at PR merge, I'll respect.

---

## Review checklist for manual pass after PR

- [ ] `mappings/*.ts` keys normalized lowercase-canônico, no casing variants (`eslintReactTs` vs `EslintTS` etc.)
- [ ] `validateAnswers` returns Either, never throws
- [ ] `templateMapper` and `dependenciesFor` are pure — no `import fs`, `import path`, no `process.*`
- [ ] `fileWriter` is the ONLY file that imports `fs-extra`/`fs`
- [ ] `packageInstaller` and `projectInitializer` are the ONLY files that import `child_process`
- [ ] Zero `throw new Error(string)` in `src/`
- [ ] Zero `process.env.NODE_ENV` in `src/` outside `shared/env.ts`
- [ ] Zero `cd mock &&` shell hacks
- [ ] Zero `../../` imports in `src/` (use path aliases)
- [ ] All errors are typed classes extending a common `ConfectusError` base, with `code` and `message` in pt-BR
- [ ] `dist/` is reproducible from `pnpm build`
- [ ] Smoke tests pass on 5 variations
