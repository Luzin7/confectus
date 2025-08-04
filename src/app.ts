import { DependencyInstallerServiceImpl } from "@infrastructure/services/DependencyInstallerServiceImpl.js";
import { ProjectInitializationServiceImpl } from "@infrastructure/services/ProjectInitializationServiceImpl.js";
import { QuestionnaireServiceImpl } from "@infrastructure/cli/QuestionnaireServiceImpl.js";
import { CollectProjectRequirements } from "@application/useCases/CollectProjectRequirements.js";
import { ProjectSetupServiceImpl } from "@infrastructure/services/ProjectSetupServiceImpl.js";
import { SetupProjectEnvironment } from "@application/useCases/SetupProjectEnvironment.js";
import { InstallProjectDependencies } from "@application/useCases/InstallProjectDependencies.js";
import { FileTemplateServiceImpl } from "@infrastructure/filesystem/FileTemplateServiceImpl.js";

export async function app() {
  const questionnaireService = new QuestionnaireServiceImpl();
  const projectInitializationService = new ProjectInitializationServiceImpl();
  const dependencyInstallerService = new DependencyInstallerServiceImpl();
  const fileTemplateService = new FileTemplateServiceImpl();
  
  const projectSetupService = new ProjectSetupServiceImpl(
    projectInitializationService,
    dependencyInstallerService,
    fileTemplateService,
  );

  const collectProjectRequirements = new CollectProjectRequirements(questionnaireService);
  const setupProjectEnvironment = new SetupProjectEnvironment(projectSetupService);
  const installProjectDependencies = new InstallProjectDependencies(projectSetupService);

  await collectProjectRequirements.execute();
  const answers = questionnaireService.answers;

  await setupProjectEnvironment.execute({ answers });
  await installProjectDependencies.execute({ answers });
}
