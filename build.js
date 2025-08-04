import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { join } from "path";

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
	const currentPath = new URL(".", import.meta.url).pathname;
	const decodedCurrentPath = decodeURIComponent(currentPath);

	const originPath = join(decodedCurrentPath, "./src/templates");
	const destinationPath = join(decodedCurrentPath, "./dist/templates");

	copyFolder(originPath, destinationPath);
}

build();
