import { vi } from "vitest";

vi.mock("chalk", () => {
	const chalk = {
		green: vi.fn((text: string) => text),
		red: vi.fn((text: string) => text),
		yellow: vi.fn((text: string) => text),
		blue: vi.fn((text: string) => text),
		cyan: vi.fn((text: string) => text),
		magenta: vi.fn((text: string) => text),
		white: vi.fn((text: string) => text),
		whiteBright: vi.fn((text: string) => text),
		gray: vi.fn((text: string) => text),
		bold: vi.fn((text: string) => text),
		italic: vi.fn((text: string) => text),
		underline: vi.fn((text: string) => text),
		blueBright: vi.fn((text: string) => text),
		greenBright: vi.fn((text: string) => text),
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

process.env.NODE_ENV = "test";
