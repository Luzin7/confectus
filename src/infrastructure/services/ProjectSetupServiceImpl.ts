import path from "path";
import fs from "fs-extra";
import { Answers } from "../../application/dtos/answers.js";
import { SettingsProps } from "../../application/dtos/setting.js";
import {
	backendDependenciesSetup,
	frontendDependenciesSetup,
} from "../../configs/dependenciesInstallerSetup/index.js";
import { DependencyInstallerService } from "../../core/contracts/DependencyInstallerService.js";
import { FileTemplateService } from "../../core/contracts/FileTemplateService.js";
import { ProjectInitializationService } from "../../core/contracts/ProjectInitializationService.js";
import { ProjectSetupService } from "../../core/contracts/ProjectSetupService.js";
import { NoPackageJsonError } from "../../core/errors/NoPackageJsonError.js";
import { NotFoundPackageJsonError } from "../../core/errors/NotFoundPackageJsonError.js";
import { managers } from "../../infrastructure/cli/managers.js";
import { generateScripts } from "../../templates/backend/scripts/generateScripts.js";

export class ProjectSetupServiceImpl implements ProjectSetupService {
	constructor(
		private projectInitializationService: ProjectInitializationService,
		private dependencyInstallerService: DependencyInstallerService,
		private fileTemplateService: FileTemplateService,
	) {}

	async installDependencies({
		wichLanguage,
		wichLinter,
		wichManager,
		wichTest,
		stack,
		wichStack,
	}: Pick<
		Answers,
		| "wichLanguage"
		| "wichLinter"
		| "wichManager"
		| "wichTest"
		| "wichStack"
		| "stack"
	>): Promise<void> {
		const { installCommand } = managers[wichManager];
		const isTypescript: boolean = wichLanguage === "Typescript";
		const stackChoiced: SettingsProps =
			stack === "Backend"
				? backendDependenciesSetup
				: frontendDependenciesSetup;

		const installDependency = async (dependency: string) => {
			await this.dependencyInstallerService.install(
				installCommand,
				dependency,
				stackChoiced,
			);
		};

		if (isTypescript) {
			await installDependency(wichLanguage);
		}

		if (wichLinter !== "No") {
			let linterChoiced = "";
			const lintDependency = isTypescript ? "EslintTS" : "Eslint";
			switch (wichLinter) {
				case "Eslint":
					switch (wichStack) {
						case "React":
							linterChoiced = isTypescript ? "eslintReactTs" : "eslintReact";
							break;
						case "Next.js":
							linterChoiced = isTypescript ? "eslintNextTs" : "eslintNext";
							break;
						case "Vue.js":
							linterChoiced = isTypescript ? "eslintVueTs" : "eslintVue";
							break;
						case "N/A":
							linterChoiced = isTypescript ? "eslintTs" : "eslintJs";
							break;
						default:
							break;
					}
					await installDependency(linterChoiced);
					await installDependency(lintDependency);
					break;
				case "Biome":
					await installDependency(wichLinter);
					break;
				default:
					break;
			}
		}

		if (wichTest === "Vitest") {
			const testDependency = isTypescript ? "VitestTS" : "Vitest";
			await installDependency(testDependency);
		}
	}

	async setupFrontendEnvironment({
		wichLanguage,
		wichLinter,
		isVscode,
		wichStack,
		hasPackageJson,
		wichManager,
	}: Pick<
		Answers,
		| "isVscode"
		| "wichLanguage"
		| "wichLinter"
		| "wichStack"
		| "hasPackageJson"
		| "wichManager"
	>): Promise<void> {
		const isDevelopment = process.env.NODE_ENV === "development";
		const isTypescript: boolean = wichLanguage === "Typescript";
		const linterSelected = wichLinter;
		const stackSelected = wichStack;
		const { initCommand } = managers[wichManager];

		const installTemplate = async (
			templatePath: string[],
			outputPath: string,
		) => {
			await this.fileTemplateService.copyTemplate(templatePath, outputPath);
		};

		if (hasPackageJson === "No" && wichStack !== "N/A") {
			throw new Error(new NoPackageJsonError().message);
		}

		const PackageJsonExists = fs.existsSync(
			isDevelopment ? `./mock/package.json` : "package.json",
		);

		if (!PackageJsonExists && wichStack !== "N/A") {
			throw new Error(new NotFoundPackageJsonError().message);
		}

		if (wichStack === "N/A") {
			await this.projectInitializationService.initialize(initCommand);
		}

		await Promise.all([
			installTemplate(["git", "gitignore"], ".gitignore"),
			installTemplate(["git", "README.md"], "README.md"),
		]);

		if (isVscode === "Yes") {
			await installTemplate(
				frontendDependenciesSetup.editorconfig.configFiles.configFilePath,
				frontendDependenciesSetup.editorconfig.configFiles.configFileName,
			);

			const vscodeConfigPath = path.join(".vscode", "settings.json");
			const linterTemplatePath =
				linterSelected === "Biome"
					? frontendDependenciesSetup.biome.configFiles.configFilePath
					: frontendDependenciesSetup.vscode.configFiles.configFilePath;
			await installTemplate(linterTemplatePath, vscodeConfigPath);
		}

		if (linterSelected !== "No") {
			if (stackSelected === "React") {
				const linterChoiced = isTypescript ? "eslintReactTs" : "eslintReact";
				const linterConfigPath =
					frontendDependenciesSetup[linterChoiced.toLowerCase()].configFiles
						.configFilePath;
				const linterConfigFileName =
					frontendDependenciesSetup[linterChoiced.toLowerCase()].configFiles
						.configFileName;

				return await installTemplate(linterConfigPath, linterConfigFileName);
			}

			if (stackSelected === "Next.js") {
				const linterChoiced = isTypescript ? "eslintNextTs" : "eslintNext";
				const linterConfigPath =
					frontendDependenciesSetup[linterChoiced.toLowerCase()].configFiles
						.configFilePath;
				const linterConfigFileName =
					frontendDependenciesSetup[linterChoiced.toLowerCase()].configFiles
						.configFileName;

				return await installTemplate(linterConfigPath, linterConfigFileName);
			}

			if (stackSelected === "Vue.js") {
				const linterChoiced = isTypescript ? "eslintVueTs" : "eslintVue";
				const linterConfigPath =
					frontendDependenciesSetup[linterChoiced.toLowerCase()].configFiles
						.configFilePath;
				const linterConfigFileName =
					frontendDependenciesSetup[linterChoiced.toLowerCase()].configFiles
						.configFileName;

				return await installTemplate(linterConfigPath, linterConfigFileName);
			}

			if (stackSelected === "N/A") {
				const linterChoiced = isTypescript ? "eslintTs" : "eslintJs";
				const linterConfigPath =
					frontendDependenciesSetup[linterChoiced.toLowerCase()].configFiles
						.configFilePath;
				const linterConfigFileName =
					frontendDependenciesSetup[linterChoiced.toLowerCase()].configFiles
						.configFileName;

				return await installTemplate(linterConfigPath, linterConfigFileName);
			}

			await installTemplate(
				frontendDependenciesSetup.biome.configFiles.configFilePath,
				frontendDependenciesSetup.biome.configFiles.configFileName,
			);
		}
	}

	async setupBackendEnvironment({
		hasPackageJson,
		isVscode,
		wichManager,
		wichLanguage,
		wichLinter,
		wichTest,
		createDirectories,
		addScripts,
	}: Pick<
		Answers,
		| "hasPackageJson"
		| "isVscode"
		| "wichLanguage"
		| "wichManager"
		| "wichTest"
		| "wichLinter"
		| "createDirectories"
		| "addScripts"
	>): Promise<void> {
		const isDevelopment = process.env.NODE_ENV === "development";
		const isTypescript = wichLanguage === "Typescript";
		const willTest = wichTest === "Vitest";
		const willHaveSrcDirectory = createDirectories === "Yes";
		const willAddScripts = addScripts === "Yes";
		const linterChoiced = wichLinter;

		const createDirectory = async (directory: string) => {
			await fs.mkdir(isDevelopment ? `./mock/${directory}` : directory, {
				recursive: true,
			});
		};

		const installTemplate = async (
			templatePath: string[],
			outputPath: string,
		) => {
			await this.fileTemplateService.copyTemplate(templatePath, outputPath);
		};

		await Promise.all([
			installTemplate(["git", "gitignore"], ".gitignore"),
			installTemplate(["git", "README.md"], "README.md"),
		]);

		if (hasPackageJson === "No") {
			const { initCommand } = managers[wichManager];
			await this.projectInitializationService.initialize(initCommand);
		}

		if (willAddScripts) {
			const packageJsonPath = isDevelopment
				? "./mock/package.json"
				: "package.json";

			const scripts = generateScripts(
				willTest,
				willHaveSrcDirectory,
				isTypescript,
			);

			const packageJson = await fs.readJson(packageJsonPath);

			packageJson.scripts = { ...packageJson.scripts, ...scripts };

			await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
		}

		if (willHaveSrcDirectory) {
			await createDirectory("src");
			willTest && (await createDirectory("src/test"));

			const configFilePath =
				backendDependenciesSetup.greetings.configFiles.configFilePath;
			const configFileName = isTypescript ? "app.ts" : "app.js";
			await installTemplate(configFilePath, path.join("src", configFileName));
		}

		if (isVscode === "Yes") {
			await installTemplate(
				backendDependenciesSetup.editorconfig.configFiles.configFilePath,
				backendDependenciesSetup.editorconfig.configFiles.configFileName,
			);

			const vscodeConfigPath = path.join(".vscode", "settings.json");
			const linterTemplatePath =
				linterChoiced === "Biome"
					? backendDependenciesSetup.biome.configFiles.configFilePath
					: backendDependenciesSetup.vscode.configFiles.configFilePath;
			await installTemplate(linterTemplatePath, vscodeConfigPath);
		}

		if (isTypescript) {
			const languageConfig =
				backendDependenciesSetup[wichLanguage.toLowerCase()].configFiles;
			await installTemplate(
				languageConfig.configFilePath,
				languageConfig.configFileName,
			);

			if (willTest) {
				const testConfig = backendDependenciesSetup.vitestts.configFiles;
				await installTemplate(
					testConfig.configFilePath,
					testConfig.configFileName,
				);
			}
		}

		if (willTest && !isTypescript) {
			const testConfig =
				backendDependenciesSetup[wichTest.toLowerCase()].configFiles;
			await installTemplate(
				testConfig.configFilePath,
				testConfig.configFileName,
			);
		}

		if (linterChoiced !== "No") {
			const linterConfigPath =
				backendDependenciesSetup[linterChoiced.toLowerCase()].configFiles
					.configFilePath;
			const linterConfigFileName =
				backendDependenciesSetup[linterChoiced.toLowerCase()].configFiles
					.configFileName;

			if (linterChoiced === "Eslint") {
				const lintDependency = isTypescript ? "eslintts" : "eslint";
				await installTemplate(
					backendDependenciesSetup[lintDependency.toLowerCase()].configFiles
						.configFilePath,
					linterConfigFileName,
				);
			} else {
				await installTemplate(linterConfigPath, linterConfigFileName);
			}
		}
	}
}
