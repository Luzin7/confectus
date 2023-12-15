export interface ManagerProps {
  initCommand: string;
  installCommand: string;
}

export interface Managers {
  NPM: ManagerProps;
  Yarn: ManagerProps;
  Bun: ManagerProps;
}
