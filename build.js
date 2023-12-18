import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync } from "fs";
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

  const originPath = join(currentPath, "./src/templates");
  const destinationPath = join(currentPath, "./dist/templates");

  copyFolder(originPath, destinationPath);

  copyFileSync(
    join(currentPath, "./run.sh"),
    join(currentPath, "./dist/run.sh"),
  );
}

build();