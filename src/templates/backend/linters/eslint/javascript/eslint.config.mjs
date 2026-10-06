import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";
import globals from "globals";

export default [
	{ ignores: ["eslint.config.mjs", "dist/**", "node_modules/**"] },
	js.configs.recommended,
	{
		plugins: {
			prettier: eslintPluginPrettier,
		},
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.node,
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
				},
			],
		},
	},
	eslintConfigPrettier,
];
