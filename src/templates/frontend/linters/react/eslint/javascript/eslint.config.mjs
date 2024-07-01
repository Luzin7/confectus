import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/node_modules"],
}, ...fixupConfigRules(compat.extends(
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "standard",
    "plugin:prettier/recommended",
)), {
    plugins: {
        react: fixupPluginRules(react),
        "jsx-a11y": jsxA11Y,
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

        "prettier/prettier": ["error", {
            printWidth: 80,
            tabWidth: 2,
            singleQuote: true,
            trailingComma: "all",
            arrowParens: "always",
            semi: false,
            endOfLine: "auto",
        }],

        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",

        "jsx-a11y/alt-text": ["warn", {
            elements: ["img"],
            img: ["Image"],
        }],

        "jsx-a11y/aria-props": "warn",
        "jsx-a11y/aria-proptypes": "warn",
        "jsx-a11y/aria-unsupported-elements": "warn",
        "jsx-a11y/role-has-required-aria-props": "warn",
        "jsx-a11y/role-supports-aria-props": "warn",
    },
}];