import managers from "@infra/cli/managers";

export function validateManagerInitCommand(managerInitCommand: string) {
  const isValidManagerInitCommand = Object.values(managers).some(
    (manager) => manager.initCommand === managerInitCommand,
  );

  if (!isValidManagerInitCommand) {
    // desenvolver essa logica de erro
  }
}
