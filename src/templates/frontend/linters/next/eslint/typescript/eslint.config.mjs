import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	...compat.extends(
		"standard",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended",
	),
	{
		plugins: {
			"jsx-a11y": jsxA11Y,
			"@typescript-eslint": typescriptEslint,
		},

		languageOptions: {
			globals: {
				...globals.browser,
			},

			parser: tsParser,
			ecmaVersion: "latest",
			sourceType: "module",

			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},

		settings: {
			react: {
				version: "detect",
			},

			"import/parsers": {
				"@typescript-eslint/parser": [".ts", ".tsx", ".d.ts"],
			},
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
					endOfLine: "auto",
				},
			],

			"jsx-a11y/alt-text": [
				"warn",
				{
					elements: ["img"],
					img: ["Image"],
				},
			],

			"jsx-a11y/aria-props": "warn",
			"jsx-a11y/aria-proptypes": "warn",
			"jsx-a11y/aria-unsupported-elements": "warn",
			"jsx-a11y/role-has-required-aria-props": "warn",
			"jsx-a11y/role-supports-aria-props": "warn",
		},
	},
];
