import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readdirSync,
	statSync,
} from "node:fs";
import path, { join } from "node:path";
import { fileURLToPath } from "node:url";

function copyFolder(originPath, _destinationPath) {
	if (!existsSync(_destinationPath)) {
		mkdirSync(_destinationPath);
	}

	const files = readdirSync(originPath);
	files.forEach((file) => {
		const orangePath = join(originPath, file);
		const destinationPath = join(_destinationPath, file);

		if (statSync(orangePath).isDirectory()) {
			return copyFolder(orangePath, destinationPath);
		}

		copyFileSync(orangePath, destinationPath);
	});
}

function build() {
	const currentPath = path.dirname(fileURLToPath(import.meta.url));

	const originPath = join(currentPath, "./src/templates");
	const destinationPath = join(currentPath, "./dist/templates");

	copyFolder(originPath, destinationPath);
}

build();
