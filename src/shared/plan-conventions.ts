import { createHash, randomUUID } from "node:crypto";
import { existsSync, linkSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { planConventionsPath } from "./run-records.js";
import { specdojoRootDir } from "./specdojo-config.js";

const referencePattern = /\[共通規約 sha256:([a-f0-9]{64})\]\(([^\s)]+)\)/g;
const sha256 = (text: string): string => createHash("sha256").update(text).digest("hex");

function referencePath(from: string, to: string): string {
  return relative(dirname(from), to)
    .split(sep)
    .map((segment) =>
      encodeURIComponent(segment).replace(/[()]/g, (char) => `%${char.charCodeAt(0).toString(16)}`),
    )
    .join("/");
}

/** Store the resolved fragment once; prompts restore it without consulting current templates. */
export function storePlanConventions(
  conventions: string,
  executionPath: string,
  planPath: string,
): string {
  const content = `${conventions.trimEnd()}\n`;
  const hash = sha256(content);
  const path = planConventionsPath(executionPath, hash);
  const ref = referencePath(planPath, path);
  mkdirSync(dirname(path), { recursive: true });
  // Publish a complete file atomically, so concurrent runs never read a partial snapshot.
  const temporary = `${path}.${randomUUID()}.tmp`;
  writeFileSync(temporary, content, { encoding: "utf8", flag: "wx" });
  try {
    linkSync(temporary, path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    if (readFileSync(path, "utf8") !== content) {
      throw new Error(`Plan conventions SHA-256 mismatch: ${path} (expected ${hash})`);
    }
  } finally {
    unlinkSync(temporary);
  }
  return `[共通規約 sha256:${hash}](${ref})`;
}

/** Also used by checkpointing, so a referenced version travels with its plan. */
export function planConventionsFiles(plan: string, baseDirectory = specdojoRootDir()): string[] {
  if (plan.replace(referencePattern, "").includes("[共通規約 sha256:")) {
    throw new Error(
      "Invalid plan conventions reference: expected a SHA-256 hash and snapshot path",
    );
  }
  return [...plan.matchAll(referencePattern)].map(([, hash, ref]) => {
    const decoded = decodeURIComponent(ref);
    if (
      isAbsolute(decoded) ||
      decoded.includes("\\") ||
      !(decoded === `conventions/${hash}.txt` || decoded.endsWith(`/conventions/${hash}.txt`))
    ) {
      throw new Error(`Invalid plan conventions reference: ${ref}`);
    }
    const path = resolve(baseDirectory, decoded);
    if (!existsSync(path)) {
      throw new Error(`Plan conventions version not found: sha256:${hash}; path=${path}`);
    }
    if (sha256(readFileSync(path, "utf8")) !== hash) {
      throw new Error(`Plan conventions SHA-256 mismatch: ${path} (expected ${hash})`);
    }
    return path;
  });
}

export function expandPlanConventions(plan: string, baseDirectory = specdojoRootDir()): string {
  const paths = planConventionsFiles(plan, baseDirectory);
  let index = 0;
  return plan.replace(referencePattern, () => readFileSync(paths[index++], "utf8").slice(0, -1));
}

export function readPlanFile(planPath: string): string {
  return expandPlanConventions(readFileSync(planPath, "utf8"), dirname(planPath));
}

/** Include referenced snapshots wherever plan checkpoints are copied, committed or released. */
export function withPlanConventionsFiles(paths: readonly string[]): string[] {
  return [
    ...new Set(
      paths.flatMap((path) => [
        path,
        ...(path.endsWith(".md") && existsSync(path)
          ? planConventionsFiles(readFileSync(path, "utf8"), dirname(path))
          : []),
      ]),
    ),
  ];
}

export function rebasePlanConventions(plan: string, from: string, to: string): string {
  const files = planConventionsFiles(plan, dirname(from));
  let index = 0;
  return plan.replace(referencePattern, (_reference, hash: string) => {
    const ref = referencePath(to, files[index++]);
    return `[共通規約 sha256:${hash}](${ref})`;
  });
}
