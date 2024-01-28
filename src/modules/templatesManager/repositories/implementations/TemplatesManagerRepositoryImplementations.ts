import { TemplatesManagerRepository } from "../contracts/TemplatesManagerRepository";
import path from "path";
import fs from "fs-extra";
import { FileCopyError } from "../../errors/FileCopyError";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TemplatesManagerRepositoryImplementations
  implements TemplatesManagerRepository
{
  async install(
    templateSource: string[],
    templateDestination: string,
  ): Promise<void> {
    const isDevelopment = process.env.NODE_ENV === "development";
    const rootPath = isDevelopment
      ? path.resolve(__dirname, "../../../../")
      : __dirname;

    const templatesPath = (...subpaths: string[]) =>
      path.join(rootPath, "templates", ...subpaths);

    const copyFiles = async (
      source: string,
      destination: string,
      fileCopyError: FileCopyError,
    ) => {
      const sourcePath = source;
      const destinationPath = destination;

      try {
        fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
        fs.copyFileSync(sourcePath, destinationPath);
      } catch (error) {
        throw new Error(fileCopyError.message);
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
