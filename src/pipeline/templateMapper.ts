import {
	type LinterKey,
	type TemplateEntry,
	type TemplateRef,
	backendTemplates,
	frontendEslintByStack,
	frontendTemplates,
	sharedTemplates,
} from "@mappings/templatesDictionary";
import type { DependencyRef } from "@mappings/templatesDictionary";
import type {
	Answers,
	BackendAnswers,
	FrontendAnswers,
} from "@schema/configSchema";

export type FileOp = TemplateRef;

export type MapperResult = {
	readonly ops: readonly FileOp[];
	readonly deps: readonly string[];
	readonly devDeps: readonly string[];
	readonly scripts?: Record<string, string>;
};

const alwaysInstalled = (): FileOp[] => [
	sharedTemplates.gitignore.template,
	sharedTemplates.readme.template,
];

const vscodeOps = (linter: LinterKey): FileOp[] => [
	sharedTemplates.editorconfig.template,
	linter === "Biome"
		? sharedTemplates.vscodeBiome.template
		: sharedTemplates.vscodeEslint.template,
];

const collectBackend = (cfg: BackendAnswers): MapperResult => {
	const ops: FileOp[] = alwaysInstalled();
	const deps: string[] = [];
	const devDeps: string[] = [];

	const push = (entry: TemplateEntry) => {
		ops.push(entry.template);
		deps.push(...entry.deps.dependencies);
		devDeps.push(...entry.deps.devDependencies);
	};

	const pushOnlyOps = (...entries: FileOp[]) => ops.push(...entries);
	const isTypescript = cfg.wichLanguage === "Typescript";

	if (cfg.createDirectories === "Yes") {
		push(
			isTypescript
				? backendTemplates.greetingsTs
				: backendTemplates.greetingsJs,
		);
	}

	if (cfg.isVscode === "Yes") {
		pushOnlyOps(...vscodeOps(cfg.wichLinter));
	}

	if (isTypescript) {
		push(backendTemplates.typescript);
	}

	if (cfg.wichLinter === "Eslint") {
		push(isTypescript ? backendTemplates.eslintts : backendTemplates.eslint);
	} else if (cfg.wichLinter === "Biome") {
		push(backendTemplates.biome);
	}

	if (cfg.wichTest === "Vitest") {
		push(isTypescript ? backendTemplates.vitestTs : backendTemplates.vitestJs);
	}

	return { ops, deps, devDeps };
};

const collectFrontend = (cfg: FrontendAnswers): MapperResult => {
	const ops: FileOp[] = alwaysInstalled();
	const deps: string[] = [];
	const devDeps: string[] = [];

	const push = (entry: TemplateEntry) => {
		ops.push(entry.template);
		deps.push(...entry.deps.dependencies);
		devDeps.push(...entry.deps.devDependencies);
	};

	const pushOnlyOps = (...entries: FileOp[]) => ops.push(...entries);
	const _isTypescript = cfg.wichLanguage === "Typescript";

	if (cfg.isVscode === "Yes") {
		pushOnlyOps(...vscodeOps(cfg.wichLinter));
	}

	if (cfg.wichLinter === "Eslint") {
		const key = frontendEslintByStack[cfg.wichStack][cfg.wichLanguage];
		push(frontendTemplates[key]);
	} else if (cfg.wichLinter === "Biome") {
		push(frontendTemplates.biome);
	}

	return { ops, deps, devDeps };
};

export const templateMapper = (cfg: Answers): MapperResult =>
	cfg.stack === "Backend" ? collectBackend(cfg) : collectFrontend(cfg);
