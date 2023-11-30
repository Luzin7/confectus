import managers from "@infra/cli/managers";

export function validateManagerInstallCommand (managerInitCommand: string) {
  const isValidManagerInstallCommand = Object.values(managers).some(manager => manager.installCommand === managerInitCommand);

  if (!isValidManagerInstallCommand) {
    // desenvolver essa logica de erro
  }
}