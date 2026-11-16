import { createHash, randomUUID } from "node:crypto";
import { existsSync, linkSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { planConventionsPath } from "./run-records.js";
import { specdojoRootDir } from "./specdojo-config.js";

const legacyReferencePattern = /^\[共通規約 sha256:([a-f0-9]{64})\]\(([^\s)]+)\)$/;
const referencePattern = /^`共通規約 sha256:([a-f0-9]{64})` `([^`\r\n]+)`$/;
const sha256 = (text: string): string => createHash("sha256").update(text).digest("hex");

function repositoryRoot(baseDirectory: string): string {
  let directory = resolve(baseDirectory);
  while (true) {
    if (
      existsSync(join(directory, ".specdojo/specdojo.config.json")) ||
      existsSync(join(directory, ".git"))
    )
      return directory;
    const parent = dirname(directory);
    if (parent === directory) return specdojoRootDir();
    directory = parent;
  }
}

// Only the final, standalone paragraph belongs to the runner. Examples in the body,
// inline code, blockquotes and fenced code blocks must never be resolved as resources.
function conventionsReference(plan: string) {
  const tail = unified().use(remarkParse).parse(plan).children.at(-1);
  if (tail?.type !== "paragraph") return undefined;
  const start = tail.position?.start.offset;
  const end = tail.position?.end.offset;
  if (start === undefined || end === undefined) return undefined;
  const text = plan.slice(start, end);
  const match = referencePattern.exec(text) ?? legacyReferencePattern.exec(text);
  if (!match) {
    if (text.startsWith("[共通規約 sha256:") || text.startsWith("`共通規約 sha256:")) {
      throw new Error(
        "Invalid plan conventions reference: expected a SHA-256 hash and snapshot path",
      );
    }
    return undefined;
  }
  return { start, end, hash: match[1], ref: match[2], legacy: text.startsWith("[") };
}

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
  const ref = relative(repositoryRoot(dirname(planPath)), path)
    .split(sep)
    .join("/");
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
  return `\`共通規約 sha256:${hash}\` \`${ref}\``;
}

/** Also used by checkpointing, so a referenced version travels with its plan. */
export function planConventionsFiles(plan: string, baseDirectory = specdojoRootDir()): string[] {
  const reference = conventionsReference(plan);
  if (!reference) return [];
  const { hash, ref, legacy } = reference;
  const decoded = legacy ? decodeURIComponent(ref) : ref;
  if (
    isAbsolute(decoded) ||
    decoded.includes("\\") ||
    !(decoded === `conventions/${hash}.txt` || decoded.endsWith(`/conventions/${hash}.txt`))
  ) {
    throw new Error(`Invalid plan conventions reference: ${ref}`);
  }
  const path = resolve(legacy ? baseDirectory : repositoryRoot(baseDirectory), decoded);
  if (!existsSync(path)) {
    throw new Error(`Plan conventions version not found: sha256:${hash}; path=${path}`);
  }
  if (sha256(readFileSync(path, "utf8")) !== hash) {
    throw new Error(`Plan conventions SHA-256 mismatch: ${path} (expected ${hash})`);
  }
  return [path];
}

export function expandPlanConventions(plan: string, baseDirectory = specdojoRootDir()): string {
  const [path] = planConventionsFiles(plan, baseDirectory);
  if (!path) return plan;
  const reference = conventionsReference(plan)!;
  return (
    plan.slice(0, reference.start) +
    readFileSync(path, "utf8").slice(0, -1) +
    plan.slice(reference.end)
  );
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
  const [path] = planConventionsFiles(plan, dirname(from));
  const reference = conventionsReference(plan);
  if (!path || !reference?.legacy) return plan;
  const ref = referencePath(to, path);
  return (
    plan.slice(0, reference.start) +
    `[共通規約 sha256:${reference.hash}](${ref})` +
    plan.slice(reference.end)
  );
}
