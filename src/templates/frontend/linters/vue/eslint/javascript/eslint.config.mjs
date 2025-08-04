import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import vue from "eslint-plugin-vue";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	...compat.extends("eslint:recommended", "plugin:vue/vue3-essential"),
	{
		plugins: {
			vue,
			prettier,
		},

		languageOptions: {
			globals: {
				...globals.browser,
			},

			ecmaVersion: "latest",
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
