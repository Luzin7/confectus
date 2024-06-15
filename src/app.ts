import { DepedenciesInstallerRepositoryImplementations } from "@modules/depedenciesInstaller/repositories/implementations/DepedenciesInstallerRepositoryImplementations.js";
import { InitializeNewProjectRepositoryImplementations } from "@modules/initializeNewProject/repositories/implementations/InitializeNewProjectRepositoryImplementations.js";
import { QuestionnaireRepositoryImplementations } from "@modules/questionnaire/repositories/implementations/QuestionnaireRepositoryImplementations.js";
import { Questionnaire } from "@modules/questionnaire/useCases/Questionnaire.js";
import { SetupManagerRepositoryImplementation } from "@modules/setupManager/repositories/implementations/SetupManagerRepositoryImplementations.js";
import { EnvironmentSettings } from "@modules/setupManager/useCases/environmentSettings/EnvironmentSettings.js";
import { InstallDependencies } from "@modules/setupManager/useCases/installDependencies/installDependencies.js";
import { TemplatesManagerRepositoryImplementations } from "@modules/templatesManager/repositories/implementations/TemplatesManagerRepositoryImplementations.js";

export async function app() {
  const questionnaireRepository = new QuestionnaireRepositoryImplementations();
  const initializeNewProjectRepository =
    new InitializeNewProjectRepositoryImplementations();
  const depedenciesRepository =
    new DepedenciesInstallerRepositoryImplementations();
  const templatesManagerRepository =
    new TemplatesManagerRepositoryImplementations();
  const setupManagerRepositoryImplementation =
    new SetupManagerRepositoryImplementation(
      initializeNewProjectRepository,
      depedenciesRepository,
      templatesManagerRepository,
    );
  const questionnaire = new Questionnaire(questionnaireRepository);
  const environmentSettings = new EnvironmentSettings(
    setupManagerRepositoryImplementation,
  );
  const installDependencies = new InstallDependencies(
    setupManagerRepositoryImplementation,
  );

  await questionnaire.execute();
  const answers = questionnaireRepository.Answers;

  await environmentSettings.execute(answers);
  await installDependencies.execute(answers);
}
