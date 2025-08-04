export type SettingsProps = {
	[key: string]: {
		configFiles: { configFileName: string; configFilePath: string[] };
		dependencies: string | null;
		devDependencies: string | null;
	};
};
