export class ConfectusError extends Error {
	readonly code: string;
	readonly cause?: unknown;

	constructor(message: string, code: string, cause?: unknown) {
		super(message);
		this.name = this.constructor.name;
		this.code = code;
		this.cause = cause;
	}
}

export class NoPackageJsonError extends ConfectusError {
	constructor() {
		super(
			"Por favor, inicialize um arquivo package.json antes de continuar.",
			"NO_PACKAGE_JSON",
		);
	}
}

export class NotFoundPackageJsonError extends ConfectusError {
	constructor() {
		super(
			"O arquivo package.json não existe ou não está acessível no diretório atual.",
			"NOT_FOUND_PACKAGE_JSON",
		);
	}
}

export class PackageManagerConfigNotFoundError extends ConfectusError {
	constructor(manager: string) {
		super(
			`Configuração não encontrada para o package manager: ${manager}`,
			"PACKAGE_MANAGER_CONFIG_NOT_FOUND",
		);
	}
}

export class TemplateCopyError extends ConfectusError {
	constructor(src: readonly string[], dest: string, cause?: unknown) {
		const pathStr = src.join("/");
		super(
			`Falha ao copiar template "${pathStr}" para "${dest}".`,
			"TEMPLATE_COPY_ERROR",
			cause,
		);
	}
}

export class ProjectInitializationError extends ConfectusError {
	constructor(command: string, cause?: unknown) {
		super(
			`Falha ao inicializar projeto com comando "${command}".`,
			"PROJECT_INITIALIZATION_ERROR",
			cause,
		);
	}
}

export class DependencyInstallError extends ConfectusError {
	constructor(dependency: string, cause?: unknown) {
		super(
			`Falha ao instalar dependência "${dependency}".`,
			"DEPENDENCY_INSTALL_ERROR",
			cause,
		);
	}
}

export class LinterConfigNotFoundError extends ConfectusError {
	constructor(key: string) {
		super(
			`Configuração não encontrada para linter "${key}".`,
			"LINTER_CONFIG_NOT_FOUND",
		);
	}
}

export class PackageJsonScriptsUpdateError extends ConfectusError {
	constructor(cause?: unknown) {
		super(
			"Falha ao atualizar scripts no package.json.",
			"PACKAGE_JSON_SCRIPTS_UPDATE_ERROR",
			cause,
		);
	}
}

export class QuestionnaireError extends ConfectusError {
	constructor(cause?: unknown) {
		super(
			"Erro durante o questionário interativo.",
			"QUESTIONNAIRE_ERROR",
			cause,
		);
	}
}
