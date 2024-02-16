import { UseCaseError } from "@/shared/core/errors/ErrorUseCase";

export class FileCopyError extends Error implements UseCaseError {
  constructor() {
    super(
      "An error occurred during the files creation process. If you are using Windows, please be patient, we are trying bring full compatibility to this system too ASAP.",
    );
  }
}
