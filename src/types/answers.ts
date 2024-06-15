export type Answers = {
  hasPackageJson: 'Yes' | 'No';
  wichManager: 'NPM' | 'Yarn' | 'Bun' | 'PNPM';
  isVscode: 'Yes' | 'No';
  wichLanguage: 'Javascript' | 'Typescript';
  wichLinter: 'Eslint' | 'Biome' | 'No';
  wichTest: 'Vitest' | 'No';
  createDirectories: 'Yes' | 'No';
  addScripts: 'Yes' | 'No';
  wichStack: 'N/A' | 'React' | 'Next.js' | 'Vue.js';
  stack: 'Frontend' | 'Backend';
};
