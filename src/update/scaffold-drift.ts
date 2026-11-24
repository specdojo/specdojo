import { existsSync } from "node:fs";
import { copyFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  buildProviderScaffoldPlan,
  listProviderTemplates,
  type ProviderScaffoldEntry,
} from "../shared/provider-scaffold.js";

// config scaffold で配ったファイルが、新しい版の配る原本と違わないかを調べる。

const SHARED_SKILL_PREFIX = ".agents/skills/";

export type DriftKind = "changed" | "missing";
/**
 * 利用リポジトリの写しの由来。
 * - `stale`: 今の版の原本のまま（手で直していない）。
 * - `modified`: 今の版の原本とも違う（手で直した可能性がある）。
 * - `new-file`: 今の版の原本には無かった、新しく配るファイル。
 * - `unknown`: 今の版の原本が分からない（同じ版の確かめなど）。
 */
export type DriftOrigin = "stale" | "modified" | "new-file" | "unknown";

export interface DriftCandidate {
  provider: string;
  kind: DriftKind;
  origin: DriftOrigin;
  entry: ProviderScaffoldEntry;
  /** 利用リポジトリの今の中身。missing のときは undefined。 */
  currentContent: string | undefined;
  /** 新しい版の原本の中身。 */
  nextContent: string;
}

/** 原本のうち、provider に固有の写し（共有の skill 以外）が 1 つでもある provider を使っているとみなす。 */
export async function detectProvidersInUse(opts: {
  packageRoot: string;
  repoRoot: string;
}): Promise<string[]> {
  const providers: string[] = [];
  for (const provider of await listProviderTemplates(opts.packageRoot)) {
    const plan = await buildProviderScaffoldPlan({ ...opts, provider });
    const used = plan.entries.some(
      (entry) =>
        !entry.destinationRelPath.startsWith(SHARED_SKILL_PREFIX) &&
        existsSync(entry.destinationPath),
    );
    if (used) providers.push(provider);
  }
  return providers;
}

/** 今の版の原本の中身を、配る先の相対パスで引けるように読んでおく。 */
export async function snapshotScaffoldSources(opts: {
  packageRoot: string;
  repoRoot: string;
  providers: readonly string[];
}): Promise<Map<string, string>> {
  const snapshot = new Map<string, string>();
  const available = new Set(await listProviderTemplates(opts.packageRoot));
  for (const provider of opts.providers) {
    if (!available.has(provider)) continue;
    const plan = await buildProviderScaffoldPlan({ ...opts, provider });
    for (const entry of plan.entries) {
      if (snapshot.has(entry.destinationRelPath)) continue;
      snapshot.set(entry.destinationRelPath, await readFile(entry.sourcePath, "utf8"));
    }
  }
  return snapshot;
}

function classifyChanged(previous: string | undefined, current: string): DriftOrigin {
  if (previous === undefined) return "unknown";
  return previous === current ? "stale" : "modified";
}

/**
 * provider ごとの原本と利用リポジトリの写しを比べ、違うファイルと無いファイルを返す。
 * previousSources は今の版の原本。渡したときは、今の版にもあったのに無いファイルを利用者が
 * 消したものとみなして候補にしない。
 */
export async function collectDriftCandidates(opts: {
  packageRoot: string;
  repoRoot: string;
  providers: readonly string[];
  previousSources?: ReadonlyMap<string, string>;
}): Promise<DriftCandidate[]> {
  const candidates: DriftCandidate[] = [];
  const seen = new Set<string>();
  const available = new Set(await listProviderTemplates(opts.packageRoot));
  for (const provider of opts.providers) {
    if (!available.has(provider)) continue;
    const plan = await buildProviderScaffoldPlan({
      packageRoot: opts.packageRoot,
      repoRoot: opts.repoRoot,
      provider,
    });
    for (const entry of plan.entries) {
      if (seen.has(entry.destinationRelPath)) continue;
      seen.add(entry.destinationRelPath);
      if (path.resolve(entry.sourcePath) === path.resolve(entry.destinationPath)) continue;
      const nextContent = await readFile(entry.sourcePath, "utf8");
      const previous = opts.previousSources?.get(entry.destinationRelPath);
      if (!existsSync(entry.destinationPath)) {
        if (opts.previousSources && previous !== undefined) continue;
        const origin: DriftOrigin = opts.previousSources ? "new-file" : "unknown";
        candidates.push({
          provider,
          kind: "missing",
          origin,
          entry,
          currentContent: undefined,
          nextContent,
        });
        continue;
      }
      const currentContent = await readFile(entry.destinationPath, "utf8");
      if (currentContent === nextContent) continue;
      candidates.push({
        provider,
        kind: "changed",
        origin: classifyChanged(previous, currentContent),
        entry,
        currentContent,
        nextContent,
      });
    }
  }
  return candidates;
}

export async function applyDriftCandidate(candidate: DriftCandidate): Promise<void> {
  await mkdir(path.dirname(candidate.entry.destinationPath), { recursive: true });
  await copyFile(candidate.entry.sourcePath, candidate.entry.destinationPath);
}

/** CHANGELOG から関係する行を探す語。配る先のパスと、汎用でないパスの部分。 */
export function changelogTermsForPath(destinationRelPath: string): string[] {
  const generic = new Set(["agents", "rules", "skills", "README.md", "SKILL.md", ".specdojo"]);
  const parts = destinationRelPath
    .split("/")
    .filter((part) => part !== "" && !generic.has(part) && !/^\.[a-z]+$/u.test(part));
  const stems = parts.map((part) => part.replace(/\.(md|json|ya?ml|toml)$/u, ""));
  return [...new Set([destinationRelPath, ...stems])].filter((term) => term.length >= 4);
}

function splitLines(text: string): string[] {
  const lines = text.split("\n");
  if (lines.at(-1) === "") lines.pop();
  return lines;
}

type DiffOp = { type: " " | "-" | "+"; line: string };

function diffLines(before: string[], after: string[]): DiffOp[] {
  // LCS の表で差分を求める。配るファイルは小さいため O(n*m) で足りる。
  const rows = before.length;
  const cols = after.length;
  const table: number[][] = Array.from({ length: rows + 1 }, () =>
    new Array<number>(cols + 1).fill(0),
  );
  for (let i = rows - 1; i >= 0; i -= 1) {
    for (let j = cols - 1; j >= 0; j -= 1) {
      table[i][j] =
        before[i] === after[j]
          ? table[i + 1][j + 1] + 1
          : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const ops: DiffOp[] = [];
  let i = 0;
  let j = 0;
  while (i < rows && j < cols) {
    if (before[i] === after[j]) {
      ops.push({ type: " ", line: before[i] });
      i += 1;
      j += 1;
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      ops.push({ type: "-", line: before[i] });
      i += 1;
    } else {
      ops.push({ type: "+", line: after[j] });
      j += 1;
    }
  }
  while (i < rows) ops.push({ type: "-", line: before[i++] });
  while (j < cols) ops.push({ type: "+", line: after[j++] });
  return ops;
}

/** 前後 3 行の文脈を持つ unified 形式の差分。同じなら空文字を返す。 */
export function unifiedDiff(
  before: string,
  after: string,
  labels: { before: string; after: string },
  context = 3,
): string {
  const ops = diffLines(splitLines(before), splitLines(after));
  const changed = ops.map((op) => op.type !== " ");
  if (!changed.includes(true)) return "";
  const out = [`--- ${labels.before}`, `+++ ${labels.after}`];
  let index = 0;
  while (index < ops.length) {
    if (!changed[index]) {
      index += 1;
      continue;
    }
    const start = Math.max(0, index - context);
    let end = index;
    // 次の変更までの距離が文脈の 2 倍以内なら同じ hunk にまとめる。
    while (end < ops.length) {
      let next = end + 1;
      while (next < ops.length && !changed[next]) next += 1;
      if (next < ops.length && next - end <= context * 2) {
        end = next;
        continue;
      }
      break;
    }
    const stop = Math.min(ops.length, end + context + 1);
    let beforeLine = 1;
    let afterLine = 1;
    for (let k = 0; k < start; k += 1) {
      if (ops[k].type !== "+") beforeLine += 1;
      if (ops[k].type !== "-") afterLine += 1;
    }
    const hunk = ops.slice(start, stop);
    const beforeCount = hunk.filter((op) => op.type !== "+").length;
    const afterCount = hunk.filter((op) => op.type !== "-").length;
    out.push(`@@ -${beforeLine},${beforeCount} +${afterLine},${afterCount} @@`);
    for (const op of hunk) out.push(`${op.type}${op.line}`);
    index = stop;
  }
  return `${out.join("\n")}\n`;
}
