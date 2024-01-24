import { TemplatesManagerRepository } from "../contracts/TemplatesManagerRepository";
import path from "path";
import fs from "fs-extra";
import { FileCopyError } from "../../errors/FileCopyError";

export class TemplatesManagerRepositoryImplementations
  implements TemplatesManagerRepository
{
  async install(
    templateSource: string[],
    templateDestination: string,
  ): Promise<void> {
    const isDevelopment = process.env.NODE_ENV === "development";
    const currentPath = new URL(".", import.meta.url).pathname;
    const rootPath = isDevelopment
      ? path.resolve(currentPath, "../../../../")
      : path.resolve(currentPath);

    const templatesPath = (...subpaths: string[]) =>
      path.join(rootPath, "templates", ...subpaths);

    const copyFiles = async (
      source: string,
      destination: string,
      fileCopyError: unknown,
    ) => {
      const sourcePath = path.resolve(source);
      const destinationPath = path.resolve(destination);

      try {
        fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
        fs.copyFileSync(sourcePath, destinationPath);
      } catch (error) {
        throw new Error(fileCopyError as string);
      }
    };

    await copyFiles(
      templatesPath(...templateSource),
      isDevelopment
        ? path.resolve("mock", templateDestination)
        : templateDestination,
      new FileCopyError(),
    );
  }
}
