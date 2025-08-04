# Confectus - AI Coding Instructions

## Project Overview
Confectus is a CLI tool for automating development environment setup for JavaScript/TypeScript projects. It uses clean architecture with dependency injection, stateful repositories, and template-based file generation.

## Architecture Patterns

### Dependency Injection Pattern
**Critical**: All dependencies are manually wired in `src/app.ts` - this is the only place where concrete implementations are instantiated:
```typescript
// SetupManager gets injected with 3 other repositories
const setupManagerRepositoryImplementation = new SetupManagerRepositoryImplementation(
  initializeNewProjectRepository,
  depedenciesRepository,
  templatesManagerRepository,
);
```

### Stateful Repository Pattern
Repositories store user answers/state internally:
- `QuestionnaireRepositoryImplementations.Answers` - getter exposes collected answers
- State flows: Questionnaire → Use Cases via `questionnaireRepository.Answers`
- **Never** instantiate repositories multiple times - state will be lost

### Execution Flow (Critical Order)
1. `questionnaire.execute()` - collects user input
2. `environmentSettings.execute(answers)` - sets up files/config  
3. `installDependencies.execute(answers)` - installs packages

### Essential Module Architecture
- **Use Cases**: Implement `UseCase<T>` abstract class with `execute(props: T | null): Promise<void>`
- **Repositories**: Contract/implementation pattern - contracts define interfaces, implementations handle logic
- **Naming Convention**: `{Feature}RepositoryImplementations` (note: ends with 's')

### Path Aliases (Critical for Imports)
```typescript
"@modules/*": ["./modules/*"]     // Module boundaries
"@shared/*": ["./shared/*"]       // Shared utilities/types  
"@@types/*": ["./types/*"]        // Global type definitions (double @)
"@configs/*": ["./configs/*"]     // CLI questions & setup configs
```
**Note**: Templates use relative imports from build context, not path aliases

## Development Workflows

### Build Process (Custom Template Copying)
- `npm run build`: tsup compilation + `build.js` copies `src/templates/` → `dist/templates/`
- Templates must be copied because they're read at runtime from `dist/templates/`
- **Binary executables**: Both `confectus` and `cf` point to `dist/main.js`

### Development vs Production Error Handling
```typescript
// Pattern used throughout: check NODE_ENV for error verbosity
if (process.env.NODE_ENV === 'development') {
  return console.error({ error }); // Detailed error object
}
return console.error(new QuestionnaireError()); // User-friendly message
```

## Project-Specific Conventions

### Questionnaire-Driven Configuration
- Stack choice (`Frontend`/`Backend`) determines subsequent question sets in `@configs/cli/questions.ts`
- Answers stored as `Record<string, string>` with strict typed access via `src/types/answers.ts`
- **Key Pattern**: Repository holds state, use cases are stateless and receive answers as parameters

### Template Organization Pattern
```
src/templates/
├── backend/          # Node.js project templates
│   ├── frameworks/   # Express, Fastify configs
│   ├── linters/      # ESLint, Biome configs  
│   ├── scripts/      # Package.json script generators
│   └── typescript/   # TS config templates
├── frontend/         # React, Vue, Next.js templates
├── git/             # .gitignore, README templates
└── ide/             # VSCode settings
```
Templates are **static files**, not dynamically generated - they're copied verbatim to user projects.

### Error Handling Pattern
- Custom errors extend `UseCaseError` abstract class from `@shared/core/errors/`
- **Repository level**: Try-catch with conditional error logging based on NODE_ENV
- **Use case level**: No error handling - let repositories handle it
- Each module has its own error classes in `{module}/errors/`

## Critical Integration Points

### State Management Flow
1. `QuestionnaireRepositoryImplementations` collects and stores user input
2. State accessed via `.Answers` getter property (not method)
3. State passed to other use cases as parameter, never shared via injection

### File System Operations
- Uses `fs-extra` for robust file operations (not native fs)
- Templates copied from internal `dist/templates/` to user's current working directory
- Package.json manipulation based on user choices (add dependencies, scripts, etc.)

**Key Rule**: When adding new features, follow the established dependency injection pattern in `app.ts` and maintain the stateful repository → stateless use case flow.
