import { SettingsProps } from "src/types/setting";

export const dependeciesSetup: SettingsProps = {
  typescript: {
    dependencies: "tsx",
    devDependencies: "typescript @types/node ts-node tsup",
  },
  eslint: {
    dependencies: null,
    devDependencies:
      "eslint prettier eslint-plugin-prettier eslint-config-prettier",
  },
  eslintts: {
    dependencies: null,
    devDependencies:
      "@typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest",
  },
};
