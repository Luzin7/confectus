export type PackageManager = "NPM" | "Yarn" | "Bun" | "PNPM";

export type PackageManagerConfig = {
	readonly initCommand: string;
	readonly installCommand: string;
	readonly installDevFlag: string;
};

export const packageManagers: Record<PackageManager, PackageManagerConfig> = {
	NPM: {
		initCommand: "npm init -y",
		installCommand: "npm install",
		installDevFlag: "--save-dev",
	},
	Yarn: {
		initCommand: "yarn init -y",
		installCommand: "yarn add",
		installDevFlag: "--dev",
	},
	Bun: {
		initCommand: "npm init -y",
		installCommand: "bun add",
		installDevFlag: "--dev",
	},
	PNPM: {
		initCommand: "pnpm init",
		installCommand: "pnpm add",
		installDevFlag: "--save-dev",
	},
};
