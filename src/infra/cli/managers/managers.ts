import { Managers } from "src/types/manager";

export const managers: Managers = {
  npm: {
    initCommand: "npm init -y",
    installCommand: "npm install",
  },
  yarn: {
    initCommand: "yarn init -y",
    installCommand: "yarn add",
  },
  bun: {
    initCommand: "npm init -y",
    installCommand: "bun add",
  },
};
