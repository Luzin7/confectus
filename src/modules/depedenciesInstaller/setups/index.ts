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
      "eslint eslint-config-airbnb-base eslint-plugin-import eslint-plugin-prettier eslint-config-prettier",
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
      "eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-prettier eslint-config-standard eslint-plugin-import eslint-config-prettier prettier",
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
