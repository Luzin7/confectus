import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import { FileTemplateService } from "../../core/contracts/FileTemplateService.js";
import { FileCopyError } from "../../core/errors/FileCopyError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class FileTemplateServiceImpl implements FileTemplateService {
	async copyTemplate(
		templateSource: string[],
		templateDestination: string,
	): Promise<void> {
		const isDevelopment = process.env.NODE_ENV === "development";

		let rootPath: string;
		if (isDevelopment) {
			rootPath = path.resolve(__dirname, "../../../");
		} else {
			const currentModulePath = path.dirname(fileURLToPath(import.meta.url));

			const possiblePaths = [
				currentModulePath,
				path.resolve(currentModulePath, ".."),
				path.resolve(currentModulePath, "../.."),
				path.resolve(currentModulePath, "..", "templates"),
				path.resolve(currentModulePath, "../..", "templates"),
			];

			const foundPath = possiblePaths.find((checkPath) => {
				const templatesDir = path.join(checkPath, "templates");
				return fs.existsSync(templatesDir);
			});

			if (!foundPath) {
				rootPath = currentModulePath;
			} else {
				rootPath = foundPath;
			}
		}

		const templatesPath = (...subpaths: string[]) =>
			path.join(
				rootPath,
				isDevelopment ? "src/templates" : "templates",
				...subpaths,
			);

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
				if (isDevelopment) {
					return console.error(error);
				}

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
