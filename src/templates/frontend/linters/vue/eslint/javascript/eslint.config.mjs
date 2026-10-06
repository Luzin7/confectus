import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

export default [
	{ ignores: ["eslint.config.mjs", "dist/**", "node_modules/**"] },
	js.configs.recommended,
	...pluginVue.configs["flat/essential"],
	{
		plugins: {
			prettier: eslintPluginPrettier,
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
	eslintConfigPrettier,
];
