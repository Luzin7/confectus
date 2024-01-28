import { DepedenciesInstallerRepositoryImplementations } from "./modules/depedenciesInstaller/repositories/implementations/DepedenciesInstallerRepositoryImplementations";
import { InitializeNewProjectRepositoryImplementations } from "./modules/initializeNewProject/repositories/implementations/InitializeNewProjectRepositoryImplementations";
import { QuestionnaireRepositoryImplementations } from "./modules/questionnaire/repositories/implementations/QuestionnaireRepositoryImplementations";
import Questionnaire from "./modules/questionnaire/useCases/questionnaire";
import { SetupManagerRepositoryImplementation } from "./modules/setupManager/repositories/implementations/SetupManagerRepositoryImplementations";
import { SetupManager } from "./modules/setupManager/useCases/SetupManager";
import { TemplatesManagerRepositoryImplementations } from "./modules/templatesManager/repositories/implementations/TemplatesManagerRepositoryImplementations";

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
  const setupManager = new SetupManager(setupManagerRepositoryImplementation);

  await questionnaire.execute();
  const answers = questionnaireRepository.Answers;

  await setupManager.execute(answers);
}
