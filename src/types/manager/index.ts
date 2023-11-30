export interface ManagerProps {
  initCommand: string;
  installCommand: string;
}

export interface Managers {
  npm: ManagerProps;
  yarn: ManagerProps;
  bun: ManagerProps;
}