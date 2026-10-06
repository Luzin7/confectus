import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginPrettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
	{ ignores: ["eslint.config.mjs", "dist/**", "node_modules/**"] },
	js.configs.recommended,
	react.configs.flat.recommended,
	react.configs.flat["jsx-runtime"],
	reactHooks.configs.flat.recommended,
	jsxA11y.flatConfigs.recommended,
	{
		files: ["**/*.{js,jsx,mjs,cjs}"],
		plugins: {
			prettier: eslintPluginPrettier,
		},
		languageOptions: {
			globals: {
				...globals.browser,
			},
			ecmaVersion: 2021,
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
		},
		rules: {
			"react/self-closing-comp": "error",
			"prettier/prettier": [
				"error",
				{
					printWidth: 80,
					tabWidth: 2,
					singleQuote: true,
					trailingComma: "all",
					arrowParens: "always",
					semi: false,
					endOfLine: "auto",
				},
			],
			"react/react-in-jsx-scope": "off",
			"react/prop-types": "off",
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
	eslintConfigPrettier,
];
