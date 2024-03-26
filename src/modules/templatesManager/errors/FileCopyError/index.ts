import { UseCaseError } from "@/shared/core/errors/ErrorUseCase";

export class FileCopyError extends Error implements UseCaseError {
  constructor() {
    super("An error occurred during the files creation process. Sorry!");
  }
}
