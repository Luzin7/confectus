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
		console.log("\n🎉 \x1b[32mProject setup completed successfully!\x1b[0m");
		console.log("✨ \x1b[36mEverything is ready to start developing!\x1b[0m");
	} catch (error) {
		console.log("\n💥 \x1b[31mProject setup failed!\x1b[0m");
		
		if (process.env.NODE_ENV === "development") {
			console.error({ error });
		} else {
			console.error("🔴 \x1b[31mAn error occurred during setup. Please try again.\x1b[0m");
		}
		
		process.exit(1);
	}
}
