import { SettingsProps } from "@@types/setting.js";

export const backendDependeciesSetup: SettingsProps = {
  greetings: {
    dependencies: null,
    devDependencies: null,
    configFiles: {
      configFileName: '.eslintrc.js',
      configFilePath: ['backend', 'greetings', 'helloWorld.ts'],
    },
  },
  editorconfig: {
    configFiles: {
      configFileName: '.editorconfig',
      configFilePath: ['ide', 'vscode', '.editorconfig'],
    },
    dependencies: null,
    devDependencies: null,
  },
  vscode: {
    configFiles: {
      configFileName: '.vscode/settings.json',
      configFilePath: ['ide', 'vscode', 'settings', 'eslint', 'settings.json'],
    },
    dependencies: null,
    devDependencies: null,
  },
  typescript: {
    configFiles: {
      configFileName: 'tsconfig.json',
      configFilePath: ['backend', 'typescript', 'tsconfig.json'],
    },

    dependencies: 'tsx',
    devDependencies: 'typescript @types/node ts-node tsup',
  },
  eslint: {
    configFiles: {
      configFileName: 'eslint.config.mjs',
      configFilePath: [
        'backend',
        'linters',
        'eslint',
        'javascript',
        'eslint.config.mjs',
      ],
    },
    dependencies: null,
    devDependencies:
      'eslint eslint-config-airbnb-base eslint-plugin-import eslint-plugin-prettier eslint-config-prettier',
  },
  eslintts: {
    configFiles: {
      configFileName: 'eslint.config.mjs',
      configFilePath: [
        'backend',
        'linters',
        'eslint',
        'typescript',
        'eslint.config.mjs',
      ],
    },

    dependencies: null,
    devDependencies:
      'eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-prettier eslint-config-standard eslint-plugin-import eslint-config-prettier prettier',
  },
  biome: {
    configFiles: {
      configFileName: 'biome.json',
      configFilePath: ['ide', 'vscode', 'settings', 'biome', 'settings.json'],
    },

    dependencies: null,
    devDependencies: '@biomejs/biome',
  },
  vitest: {
    configFiles: {
      configFileName: 'vitest.config.js',
      configFilePath: [
        'backend',
        'frameworks',
        'configs',
        'vitest',
        'vitest.config.ts',
      ],
    },
    dependencies: null,
    devDependencies: 'vite vitest',
  },
  vitestts: {
    configFiles: {
      configFileName: 'vitest.config.ts',
      configFilePath: [
        'backend',
        'frameworks',
        'configs',
        'vitest',
        'vitest.config.ts',
      ],
    },
    dependencies: null,
    devDependencies: 'vite vitest',
  },
};

export const frontendDependeciesSetup: SettingsProps = {
  eslintts: {
    configFiles: {
      configFileName: 'eslint.config.mjs',
      configFilePath: [
        'frontend',
        'linters',
        'typescript',
        'eslint',
        'eslint.config.mjs',
      ],
    },
    dependencies: null,
    devDependencies:
      'eslint eslint-plugin-prettier prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser',
  },
  eslintjs: {
    configFiles: {
      configFileName: 'eslint.config.mjs',
      configFilePath: [
        'frontend',
        'linters',
        'javascript',
        'eslint',
        'eslint.config.mjs',
      ],
    },
    dependencies: null,
    devDependencies: 'eslint eslint-plugin-prettier prettier',
  },
  eslintreact: {
    configFiles: {
      configFileName: 'eslint.config.mjs',
      configFilePath: [
        'frontend',
        'linters',
        'react',
        'eslint',
        'javascript',
        'eslint.config.mjs',
      ],
    },
    dependencies: null,
    devDependencies:
      'eslint eslint-plugin-react eslint-plugin-react-hooks prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-jsx-a11y eslint-config-standard',
  },
  eslintreactts: {
    configFiles: {
      configFileName: 'eslint.config.mjs',
      configFilePath: [
        'frontend',
        'linters',
        'react',
        'eslint',
        'typescript',
        'eslint.config.mjs',
      ],
    },

    dependencies: null,
    devDependencies:
      'eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-jsx-a11y eslint-config-standard',
  },
  eslintnext: {
    configFiles: {
      configFileName: 'eslint.config.mjs',
      configFilePath: [
        'frontend',
        'linters',
        'next',
        'eslint',
        'javascript',
        'eslint.config.mjs',
      ],
    },
    dependencies: null,
    devDependencies:
      'eslint eslint-plugin-react eslint-plugin-react-hooks prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-jsx-a11y eslint-config-standard',
  },
  eslintnextts: {
    configFiles: {
      configFileName: 'eslint.config.mjs',
      configFilePath: [
        'frontend',
        'linters',
        'next',
        'eslint',
        'typescript',
        'eslint.config.mjs',
      ],
    },

    dependencies: null,
    devDependencies:
      'eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier eslint-config-prettier eslint-plugin-prettier eslint-config-standard',
  },
  eslintvue: {
    configFiles: {
      configFileName: 'eslint.config.mjs',
      configFilePath: [
        'frontend',
        'linters',
        'vue',
        'eslint',
        'javascript',
        'eslint.config.mjs',
      ],
    },
    dependencies: null,
    devDependencies:
      'eslint eslint-plugin-vue prettier eslint-config-prettier eslint-plugin-prettier',
  },
  eslintvuets: {
    configFiles: {
      configFileName: 'eslint.config.mjs',
      configFilePath: [
        'frontend',
        'linters',
        'vue',
        'eslint',
        'typescript',
        'eslint.config.mjs',
      ],
    },

    dependencies: null,
    devDependencies:
      'eslint-config-prettier eslint @typescript-eslint/parser@5.59.0 @typescript-eslint/eslint-plugin@5.59.0 @vue/eslint-config-typescript@13.0.0 eslint-plugin-vue@9.11.0 eslint-plugin-prettier@5.0.0 prettier@2.8.8',
  },
  biome: {
    configFiles: {
      configFileName: 'biome.json',
      configFilePath: ['frontend', 'linters', 'biome', 'biome.json'],
    },
    dependencies: null,
    devDependencies: '@biomejs/biome',
  },
  editorconfig: {
    configFiles: {
      configFileName: '.editorconfig',
      configFilePath: ['ide', 'vscode', '.editorconfig'],
    },
    dependencies: null,
    devDependencies: null,
  },
  vscode: {
    configFiles: {
      configFileName: '.vscode/settings.json',
      configFilePath: ['ide', 'vscode', 'settings', 'eslint', 'settings.json'],
    },
    dependencies: null,
    devDependencies: null,
  },
};
