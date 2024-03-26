import { SettingsProps } from "@/types/setting";

export const backendDependeciesSetup: SettingsProps = {
  greetings: {
    dependencies: null,
    devDependencies: null,
    configFiles: {
      configFileName: ".eslintrc.js",
      configFilePath: ["backend", "greetings", "helloWorld.ts"],
    },
  },
  editorconfig: {
    configFiles: {
      configFileName: ".editorconfig",
      configFilePath: ["ide", "vscode", ".editorconfig"],
    },
    dependencies: null,
    devDependencies: null,
  },
  vscode: {
    configFiles: {
      configFileName: ".vscode/settings.json",
      configFilePath: ["ide", "vscode", "settings", "eslint", "settings.json"],
    },
    dependencies: null,
    devDependencies: null,
  },
  typescript: {
    configFiles: {
      configFileName: "tsconfig.json",
      configFilePath: ["backend", "typescript", "tsconfig.json"],
    },

    dependencies: "tsx",
    devDependencies: "typescript @types/node ts-node tsup",
  },
  eslint: {
    configFiles: {
      configFileName: ".eslint.json",
      configFilePath: [
        "backend",
        "linters",
        "eslint",
        "javascript",
        ".eslint.json",
      ],
    },
    dependencies: null,
    devDependencies:
      "eslint eslint-config-airbnb-base eslint-plugin-import eslint-plugin-prettier eslint-config-prettier",
  },
  eslintts: {
    configFiles: {
      configFileName: ".eslint.json",
      configFilePath: [
        "backend",
        "linters",
        "eslint",
        "typescript",
        ".eslint.json",
      ],
    },

    dependencies: null,
    devDependencies:
      "eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-prettier eslint-config-standard eslint-plugin-import eslint-config-prettier prettier",
  },
  biome: {
    configFiles: {
      configFileName: "biome.json",
      configFilePath: ["ide", "vscode", "settings", "biome", "settings.json"],
    },

    dependencies: null,
    devDependencies: "@biomejs/biome",
  },
  vitest: {
    configFiles: {
      configFileName: "vitest.config.js",
      configFilePath: [
        "backend",
        "frameworks",
        "configs",
        "vitest",
        "vitest.config.ts",
      ],
    },
    dependencies: null,
    devDependencies: "vite vitest",
  },
  vitestts: {
    configFiles: {
      configFileName: "vitest.config.ts",
      configFilePath: [
        "backend",
        "frameworks",
        "configs",
        "vitest",
        "vitest.config.ts",
      ],
    },
    dependencies: null,
    devDependencies: "vite vitest",
  },
};

export const frontendDependeciesSetup: SettingsProps = {
  eslintreact: {
    configFiles: {
      configFileName: ".eslint.json",
      configFilePath: [
        "frontend",
        "linters",
        "react",
        "eslint",
        "javascript",
        ".eslint.json",
      ],
    },
    dependencies: null,
    devDependencies:
      "eslint eslint-plugin-react eslint-plugin-react-hooks prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-jsx-a11y eslint-config-standard",
  },
  eslintreactts: {
    configFiles: {
      configFileName: ".eslint.json",
      configFilePath: [
        "frontend",
        "linters",
        "react",
        "eslint",
        "typescript",
        ".eslint.json",
      ],
    },

    dependencies: null,
    devDependencies:
      "eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-jsx-a11y eslint-config-standard",
  },
  eslintnext: {
    configFiles: {
      configFileName: ".eslint.json",
      configFilePath: [
        "frontend",
        "linters",
        "next",
        "eslint",
        "javascript",
        ".eslint.json",
      ],
    },
    dependencies: null,
    devDependencies:
      "eslint eslint-plugin-react eslint-plugin-react-hooks prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-jsx-a11y eslint-config-standard",
  },
  eslintnextts: {
    configFiles: {
      configFileName: ".eslint.json",
      configFilePath: [
        "frontend",
        "linters",
        "next",
        "eslint",
        "typescript",
        ".eslint.json",
      ],
    },

    dependencies: null,
    devDependencies:
      "eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier eslint-config-prettier eslint-plugin-prettier eslint-config-standard",
  },
  eslintvue: {
    configFiles: {
      configFileName: ".eslint.json",
      configFilePath: [
        "frontend",
        "linters",
        "vue",
        "eslint",
        "javascript",
        ".eslint.json",
      ],
    },
    dependencies: null,
    devDependencies:
      "eslint eslint-plugin-vue prettier eslint-config-prettier eslint-plugin-prettier",
  },
  eslintvuets: {
    configFiles: {
      configFileName: ".eslint.json",
      configFilePath: [
        "frontend",
        "linters",
        "vue",
        "eslint",
        "typescript",
        ".eslint.json",
      ],
    },

    dependencies: null,
    devDependencies:
      "eslint eslint-plugin-vue @typescript-eslint/eslint-plugin @typescript-eslint/parser rettier eslint-config-prettier eslint-plugin-prettier",
  },
  biome: {
    configFiles: {
      configFileName: "biome.json",
      configFilePath: ["frontend", "linters", "biome", "biome.json"],
    },
    dependencies: null,
    devDependencies: "@biomejs/biome",
  },
};
