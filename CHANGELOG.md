# confectus

## 2.0.0

### Major Changes

- d7020aa: Complete rewrite to a functional pipeline architecture. The CLI is rebuilt around a unidirectional flow: Prompt → Schema (zod validation) → Mapper (pure) → Generators (I/O).

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

## 1.8.1

### Patch Changes

- 6e347c7: resolve minor errors

## 1.8.0

### Minor Changes

- de02d4a: # Architecture Refactoring & Test Suite Implementation

  ## 🏗️ Architecture Changes

  - **Clean Architecture Implementation**: Restructured codebase following clean architecture principles with clear separation of concerns
  - **Path Alias Migration**: Updated from old `@modules/*`, `@shared/*`, `@@types/*` aliases to new clean architecture structure:
    - `@core/*` - Core contracts and errors
    - `@application/*` - Use cases and DTOs
    - `@infrastructure/*` - External services implementations
    - `@configs/*` - Configuration files
    - `@templates/*` - Template files
  - **Dependency Injection Refactoring**: Improved dependency injection patterns and service implementations
  - **Repository Pattern Enhancement**: Consolidated repository implementations with consistent naming conventions

  ## 🧪 Test Infrastructure

  - **Comprehensive Test Suite**: Added unit tests for all major components
  - **Test Environment Isolation**: Implemented proper test isolation with mocked dependencies
  - **Vitest Configuration**: Enhanced test configuration with coverage reporting and proper setup
  - **Mock Infrastructure**: Created comprehensive mocking system for file operations, CLI interactions, and external dependencies

  ## 🔧 Technical Improvements

  - **TypeScript Strict Mode**: Enhanced type safety with strict TypeScript configuration
  - **Error Handling**: Improved error handling patterns across all modules
  - **Build Process**: Maintained existing build process with updated path references
  - **Code Organization**: Better file structure following domain-driven design principles

  ## 🚀 Breaking Changes

  - **Import Path Changes**: Updated all internal imports to use new path aliases
  - **Class Name Standardization**: Renamed repository implementations for consistency
  - **Module Structure**: Reorganized module boundaries for better maintainability

  This refactoring provides a solid foundation for future development while maintaining backward compatibility for end users.

## 1.7.0

### Minor Changes

- # Architecture Refactoring & Test Suite Implementation

  ## 🏗️ Architecture Changes

  - **Clean Architecture Implementation**: Restructured codebase following clean architecture principles with clear separation of concerns
  - **Path Alias Migration**: Updated from old `@modules/*`, `@shared/*`, `@@types/*` aliases to new clean architecture structure:
    - `@core/*` - Core contracts and errors
    - `@application/*` - Use cases and DTOs
    - `@infrastructure/*` - External services implementations
    - `@configs/*` - Configuration files
    - `@templates/*` - Template files
  - **Dependency Injection Refactoring**: Improved dependency injection patterns and service implementations
  - **Repository Pattern Enhancement**: Consolidated repository implementations with consistent naming conventions

  ## 🧪 Test Infrastructure

  - **Comprehensive Test Suite**: Added unit tests for all major components
  - **Test Environment Isolation**: Implemented proper test isolation with mocked dependencies
  - **Vitest Configuration**: Enhanced test configuration with coverage reporting and proper setup
  - **Mock Infrastructure**: Created comprehensive mocking system for file operations, CLI interactions, and external dependencies

  ## 🔧 Technical Improvements

  - **TypeScript Strict Mode**: Enhanced type safety with strict TypeScript configuration
  - **Error Handling**: Improved error handling patterns across all modules
  - **Build Process**: Maintained existing build process with updated path references
  - **Code Organization**: Better file structure following domain-driven design principles

  ## 🚀 Breaking Changes

  - **Import Path Changes**: Updated all internal imports to use new path aliases
  - **Class Name Standardization**: Renamed repository implementations for consistency
  - **Module Structure**: Reorganized module boundaries for better maintainability

  This refactoring provides a solid foundation for future development while maintaining backward compatibility for end users.

### Patch Changes

- Fix file creation error

## 1.6.2

### Patch Changes

- minor adjusts

## 1.6.1

### Patch Changes

- Adjust errors in nest and react with ts and eslint

## 1.6.0

### Minor Changes

- Update Eslint configurations to v9.x.

## 1.5.0

### Minor Changes

- Fix eslint configuration for Next.js and react using Javascript and Typescript.

## 1.4.6

### Patch Changes

- Fix eslint configuration for vue.js using Typescript

## 1.4.5

### Patch Changes

- Fix package error that causes erros when was installing depedencies

## 1.4.0

### Minor Changes

- Add vanilla configurations and options, update questionnaire and fix minor bugs.

## 1.3.1

### Patch Changes

- Fix some bugs

## 1.3.0

### Minor Changes

- Add Frontend configuration and options for the user, update questionnaire and fix minor bugs.

## 1.2.0

### Minor Changes

- Add more configuration and options for the user, improve package size and performance, update questionnaire and more.

## 1.1.1

### Patch Changes

- Fix bundle

## 1.1.0

### Minor Changes

- Add BiomeJS as option for linter, improve package size, update questionnaire and more.

## 1.0.0

### Major Changes

- First major version of confectus

## 0.4.0

### Minor Changes

- Add compatility for windows, add test to setups options and fix minor bugs.

## 0.3.0

### Minor Changes

- Fix errors, add errors treatment, improve package size, update questionnaire and more.

## 0.2.58

### Patch Changes

- fix error that cause error when try create gitignore file

## 0.2.57

### Patch Changes

- fix error that cause error when try to create a gitignorefile

## 0.2.55

### Patch Changes

- alter token

## 0.2.54

### Patch Changes

- alter token

## 0.2.53

### Patch Changes

- fix error that didnt create gitignore file

## 0.2.52

### Patch Changes

- Add automation to deploy the lib on npm
