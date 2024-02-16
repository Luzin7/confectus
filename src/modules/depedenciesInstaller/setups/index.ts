import { SettingsProps } from "@/types/setting";

export const dependeciesSetup: SettingsProps = {
  typescript: {
    configFiles: [
      {
        configFileName: "tsconfig.json",
        configFilePath: "typescript/tsconfig.json",
      },
    ],
    dependencies: "tsx",
    devDependencies: "typescript @types/node ts-node tsup",
  },
  eslint: {
    configFiles: [
      {
        configFileName: ".eslint.json",
        configFilePath: "lint/javascript/.eslint.json",
      },
    ],
    dependencies: null,
    devDependencies:
      "eslint prettier eslint-plugin-prettier eslint-config-prettier",
  },
  eslintts: {
    configFiles: [
      {
        configFileName: ".eslint.json",
        configFilePath: "lint/typescript/.eslint.json",
      },
    ],
    dependencies: null,
    devDependencies:
      "eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-prettier",
  },
  vitest: {
    configFiles: [
      {
        configFileName: "vitest.config.js",
        configFilePath: "frameworks/configs/vitest/vitest.config.ts",
      },
    ],
    dependencies: null,
    devDependencies: "vite vitest",
  },
  vitestts: {
    configFiles: [
      {
        configFileName: "vitest.config.ts",
        configFilePath: "frameworks/configs/vitest/vitest.config.ts",
      },
    ],
    dependencies: null,
    devDependencies: "vite vitest",
  },
};
