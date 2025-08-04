import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CollectProjectRequirements } from '../../../src/application/useCases/CollectProjectRequirements.js';
import { QuestionnaireService } from '../../../src/core/contracts/QuestionnaireService.js';

const createMockQuestionnaireService = (): QuestionnaireService => ({
  collectAnswers: vi.fn(),
  get answers() {
    return { stack: 'Frontend', language: 'TypeScript' };
  }
});

describe('CollectProjectRequirements Use Case', () => {
  let useCase: CollectProjectRequirements;
  let mockQuestionnaireService: QuestionnaireService;

  beforeEach(() => {
    mockQuestionnaireService = createMockQuestionnaireService();
    useCase = new CollectProjectRequirements(mockQuestionnaireService);
  });

  describe('Success Cases', () => {
    it('should execute questionnaire collection successfully', async () => {
      vi.mocked(mockQuestionnaireService.collectAnswers).mockResolvedValue({
        stack: 'Frontend',
        language: 'TypeScript'
      });

      await useCase.execute();

      expect(mockQuestionnaireService.collectAnswers).toHaveBeenCalledWith([]);
      expect(mockQuestionnaireService.collectAnswers).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Cases', () => {
    it('should handle questionnaire service errors', async () => {
      const errorMessage = 'Questionnaire collection failed';
      vi.mocked(mockQuestionnaireService.collectAnswers).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(useCase.execute()).rejects.toThrow(errorMessage);
    });
  });
});
