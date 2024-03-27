# Confectus

Welcome to Confectus, your friendly tool for automating development environment setup!

## About

Confectus is a Command Line Interface (CLI) designed to simplify the process of configuring development environments, whether for frontend or backend projects using JavaScript and TypeScript.

### Project Configuration

Confectus simplifies the setup of projects with various configuration options:

#### Backend and Frontend Configuration

- You can set up your project using **TypeScript** or **JavaScript**.

#### Linters Integration

- Confectus allows you to include `ESLint` or `Biome` in your project setup if you prefer linting.

#### VSCode Integration

- If you are using VSCode, Confectus automatically creates a `settings.json` file within the `.vscode` directory of your project. This file includes configurations tailored for a seamless development experience within VSCode.

#### Git Integration

- Confectus automatically generates a `.gitignore` and `README.md` file tailored for Node.js and TypeScript/JavaScript projects, ensuring that unnecessary files are excluded from version control.

#### Package Manager Compatibility

- Confectus is compatible with various package managers, including NPM, Yarn, PNPM, and Bun. You can choose the package manager that best suits your workflow during the configuration process.

#### Cross-Platform Compatibility

- **Linux and Windows Support:** Confectus works on both Linux and Windows environments, providing a consistent experience across different operating systems.

#### Testing Options

- Confectus introduces testing options for backend projects, allowing you to test your setup and configurations for a smoother development process.

## Key Features

- **Simple Configuration:** Confectus makes setting up your development environment an easy and effective task.
- **Cross-Platform Compatibility:** Confectus supports both Linux and Windows environments, making it even more user-friendly.
- **Fullstack:** Confectus helps you in both Frontend and Backend environments, making it even more useful.

## Installation

To get started, ensure you have Node.js installed. Then, use the following command to install Confectus:

```bash
npm install -g confectus  #recommended
```

Confectus is designed not to necessarily be a dependency on your project. Just run the command, select what you want to configure, and you're free!

## How to use Confectus

After installation, you can use Confectus as follows:

```bash
confectus #if installed globally

or

cf #if installed globally

or

npx confectus
```

After running the command, you just need to select the options that you want to and let's code!

## Contribution

If you encounter issues, bugs, or want to contribute to Confectus development, feel free to open an [issue](https://github.com/Luzin7/confectus) or submit a [pull request](https://github.com/Luzin7/confectus).

#

Thank you for using Confectus!