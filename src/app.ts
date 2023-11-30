import { QuestionnaireRepositoryImplementations } from "@modules/questionnaire/repositories/implementations/QuestionnaireRepositoryImplementations";
import Questionnaire from "@modules/questionnaire/useCases/questionnaire";
import { SetupManagerRepositoryImplementation } from "@modules/setupManager/repositories/implementations/SetupManagerRepositoryImplementations";
import { SetupManager } from "@modules/setupManager/useCases/SetupManager";

const questionnaireRepository = new QuestionnaireRepositoryImplementations();
const setupManagerRepositoryImplementation =
  new SetupManagerRepositoryImplementation();
const questionnaire = new Questionnaire(questionnaireRepository);
const setupManager = new SetupManager(setupManagerRepositoryImplementation);

await questionnaire.execute();
const answers = questionnaireRepository.Answers;

await setupManager.execute(answers);
