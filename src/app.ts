import { CollectProjectRequirements } from "@application/useCases/CollectProjectRequirements.js";
import { InstallProjectDependencies } from "@application/useCases/InstallProjectDependencies.js";
import { SetupProjectEnvironment } from "@application/useCases/SetupProjectEnvironment.js";
import { QuestionnaireServiceImpl } from "@infrastructure/cli/QuestionnaireServiceImpl.js";
import { FileTemplateServiceImpl } from "@infrastructure/filesystem/FileTemplateServiceImpl.js";
import { DependencyInstallerServiceImpl } from "@infrastructure/services/DependencyInstallerServiceImpl.js";
import { LoadingServiceImpl } from "@infrastructure/services/LoadingServiceImpl.js";
import { ProjectInitializationServiceImpl } from "@infrastructure/services/ProjectInitializationServiceImpl.js";
import { ProjectSetupServiceImpl } from "@infrastructure/services/ProjectSetupServiceImpl.js";

export async function app() {
	try {
		const questionnaireService = new QuestionnaireServiceImpl();
		const projectInitializationService = new ProjectInitializationServiceImpl();
		const dependencyInstallerService = new DependencyInstallerServiceImpl();
		const fileTemplateService = new FileTemplateServiceImpl();
		const loadingService = new LoadingServiceImpl();

		const projectSetupService = new ProjectSetupServiceImpl(
			projectInitializationService,
			dependencyInstallerService,
			fileTemplateService,
		);

		const collectProjectRequirements = new CollectProjectRequirements(
			questionnaireService,
		);
		const setupProjectEnvironment = new SetupProjectEnvironment(
			projectSetupService,
			loadingService,
		);
		const installProjectDependencies = new InstallProjectDependencies(
			projectSetupService,
			loadingService,
		);

		await collectProjectRequirements.execute();
		const answers = questionnaireService.answers;

		await setupProjectEnvironment.execute({ answers });
		await installProjectDependencies.execute({ answers });

		// Mensagem final de sucesso
		console.log("\n🎉 Projeto configurado com sucesso!");
		console.log("✨ Tudo pronto para começar a desenvolver!");
	} catch (error) {
		console.log("\n❌ Falha na configuração do projeto");
		
		if (process.env.NODE_ENV === "development") {
			console.error({ error });
		} else {
			console.error("Ocorreu um erro durante a configuração. Tente novamente.");
		}
		
		process.exit(1);
	}
}
