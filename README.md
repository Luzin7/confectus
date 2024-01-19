### This tool is currently in development :D

# Confectus

Welcome to Confectus, your friendly tool for automating development environment setup!

## About

Confectus is a Command Line Interface (CLI) designed to simplify the process of configuring development environments, especially for JavaScript and TypeScript backend projects.

### Project Configuration

Confectus simplifies the setup of backend projects with various configuration options:

#### TypeScript or JavaScript

- When running Confectus, you can choose to set up your backend project using TypeScript or JavaScript.

#### ESLint Integration

- Confectus allows you to include ESLint in your project setup if you prefer linting. You have the flexibility to enable or disable ESLint during the configuration process.

#### VSCode Integration

- If you are using VSCode, Confectus automatically creates a `settings.json` file within the `.vscode` directory of your project. This file includes configurations tailored for a seamless development experience within VSCode.

#### Git Integration

- Confectus automatically generates a `.gitignore` file tailored for Node.js and TypeScript/JavaScript projects, ensuring that unnecessary files are excluded from version control.

#### Package Manager Compatibility

- Confectus is compatible with various package managers, including npm, Yarn, pnpm, and bun. You can choose the package manager that best suits your workflow during the configuration process.


## Key Features

- **Simple Configuration:** Confectus makes setting up your development environment an easy and effective task.
- **Linux Compatibility:** Currently, Confectus supports Linux environments, making it even more user-friendly.

## Installation

To get started, ensure you have Node.js installed. Then, use the following command to install Confectus:

```bash
npm install confectus -g #recommended
```

## How to use Confectus
After installation, you can use Confectus as follows:

```bash
confectus #if installed globally

or

npx confectus
```

## Contribution

If you encounter issues, bugs, or want to contribute to Confectus development, feel free to open an [issue](https://github.com/Luzin7/confectus) or submit a [pull request](https://github.com/Luzin7/confectus).

#

Thank you for using Confectus!
