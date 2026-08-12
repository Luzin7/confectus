import path from "node:path";
import { TemplateCopyError } from "@errors";
import type { FileOp } from "@pipeline/templateMapper";
import type { Env } from "@shared/env";
import fs from "fs-extra";

export type CopyResult = {
	readonly copied: string[];
	readonly skipped: string[];
};

const resolveAndCopy = async (op: FileOp, env: Env, cwd: string) => {
	const src = path.join(env.templatesRoot, ...op.src);
	const dest = path.join(cwd, op.dest);
	const destDir = path.dirname(dest);
	await fs.ensureDir(destDir);
	await fs.copy(src, dest, { overwrite: true, errorOnExist: false });
	return dest;
};

export const fileWriter = async (
	ops: readonly FileOp[],
	env: Env,
): Promise<void> => {
	const target = env.isDev ? path.join(env.cwd, "mock") : env.cwd;
	await fs.ensureDir(target);

	const results = await Promise.all(
		ops.map(async (op) => {
			try {
				const dest = await resolveAndCopy(op, env, target);
				return { src: op.src.join("/"), dest, error: null as string | null };
			} catch (e) {
				return {
					src: op.src.join("/"),
					dest: op.dest,
					error: (e as Error).message,
				};
			}
		}),
	);

	const failures = results.filter((r) => r.error !== null);
	if (failures.length > 0) {
		const [first] = failures;
		const op = ops.find((o) => o.src.join("/") === first?.src);
		if (op) {
			throw new TemplateCopyError(
				op.src,
				op.dest,
				new Error(first.error ?? "unknown"),
			);
		}
	}
};
