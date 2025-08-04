import { Managers } from "@/types/manager";

export const managers: Managers = {
	NPM: {
		initCommand: "npm init -y",
		installCommand: "npm install",
	},
	Yarn: {
		initCommand: "yarn init -y",
		installCommand: "yarn add",
	},
	Bun: {
		initCommand: "npm init -y",
		installCommand: "bun add",
	},
	PNPM: {
		initCommand: "pnpm init",
		installCommand: "pnpm install",
	},
};
