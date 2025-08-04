import { tmpdir } from "os";
import path from "path";
import { vi } from "vitest";

// Mock chalk para evitar logs coloridos nos testes
vi.mock("chalk", () => {
	const chalk = {
		green: vi.fn((text: string) => text),
		red: vi.fn((text: string) => text),
		yellow: vi.fn((text: string) => text),
		blue: vi.fn((text: string) => text),
		cyan: vi.fn((text: string) => text),
		magenta: vi.fn((text: string) => text),
		white: vi.fn((text: string) => text),
		gray: vi.fn((text: string) => text),
		bold: vi.fn((text: string) => text),
		italic: vi.fn((text: string) => text),
		underline: vi.fn((text: string) => text),
		bgRed: vi.fn((text: string) => text),
		bgGreen: vi.fn((text: string) => text),
		bgYellow: vi.fn((text: string) => text),
	};

	return new Proxy(chalk, {
		get: (target, prop) => {
			if (prop in target) {
				return target[prop as keyof typeof target];
			}
			return vi.fn((text: string) => text);
		},
	});
});

// Mock global do fs-extra para evitar operações reais no sistema de arquivos
vi.mock("fs-extra", () => ({
	default: {
		mkdirSync: vi.fn(),
		copyFileSync: vi.fn(),
		writeFileSync: vi.fn(),
		readFileSync: vi.fn(() => "{}"),
		existsSync: vi.fn(() => true),
		copy: vi.fn(),
		dirname: vi.fn(),
		readJson: vi.fn(() => Promise.resolve({ scripts: {} })),
		writeJson: vi.fn(() => Promise.resolve()),
		pathExists: vi.fn(() => Promise.resolve(true)),
		mkdir: vi.fn(() => Promise.resolve()),
		ensureDir: vi.fn(() => Promise.resolve()),
		outputFile: vi.fn(() => Promise.resolve()),
	},
	mkdirSync: vi.fn(),
	copyFileSync: vi.fn(),
	writeFileSync: vi.fn(),
	readFileSync: vi.fn(() => "{}"),
	existsSync: vi.fn(() => true),
	copy: vi.fn(),
	dirname: vi.fn(),
	readJson: vi.fn(() => Promise.resolve({ scripts: {} })),
	writeJson: vi.fn(() => Promise.resolve()),
	pathExists: vi.fn(() => Promise.resolve(true)),
	mkdir: vi.fn(() => Promise.resolve()),
	ensureDir: vi.fn(() => Promise.resolve()),
	outputFile: vi.fn(() => Promise.resolve()),
}));

// Mock global de child_process para evitar execução real de comandos
vi.mock("child_process", () => ({
	exec: vi.fn(),
}));

// Mock global de util
vi.mock("util", () => ({
	promisify: vi.fn(() => vi.fn()),
}));

// Mock global de inquirer
vi.mock("inquirer", () => ({
	default: {
		prompt: vi.fn(),
	},
}));

// Configuração do ambiente de teste
process.env.NODE_ENV = "test";

// Redirecionar o diretório de trabalho para um diretório temporário
const TEMP_TEST_DIR = path.join(tmpdir(), "confectus-test");

vi.spyOn(process, "cwd").mockReturnValue(TEMP_TEST_DIR);
