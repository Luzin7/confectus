import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import vue from "eslint-plugin-vue";
import globals from "globals";
import parser from "vue-eslint-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	...compat.extends(
		"eslint:recommended",
		"plugin:vue/vue3-recommended",
		"@vue/eslint-config-typescript/recommended",
		"prettier",
	),
	{
		plugins: {
			vue,
			"@typescript-eslint": typescriptEslint,
			prettier,
		},

		languageOptions: {
			globals: {
				...globals.browser,
			},

			parser: parser,
			ecmaVersion: 2021,
			sourceType: "module",
		},

		rules: {
			"prettier/prettier": [
				"error",
				{
					printWidth: 80,
					tabWidth: 2,
					singleQuote: true,
					trailingComma: "all",
					arrowParens: "always",
					semi: true,
				},
			],
		},
	},
];
