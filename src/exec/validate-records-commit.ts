import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { gitEnvironment } from "../shared/git-environment.js";
import { type RecordLayoutIssue, validateRunRecordLayout } from "./validate-records.js";

// commit の tree を対象に配置を検査する（PJR-1ZQK）。作業ツリーの検査は、ローカルにしかない
// 未 commit の run（中断中の plan 単独や空のディレクトリ）も拾うため、push の前の検査には使えない。
// tree を一時ディレクトリへ書き出し、同じ検査を流す。中身を読むのは `execution: human` を判定する
// result.md だけで、ほかのファイルは空で置く。

const GIT_MAX_BUFFER = 256 * 1024 * 1024;

type TreeEntry = { mode: string; type: string; object: string; path: string };

function git(repoRoot: string, args: string[], input?: string): string {
  const result = spawnSync("git", args, {
    cwd: repoRoot,
    env: gitEnvironment(),
    encoding: "utf8",
    maxBuffer: GIT_MAX_BUFFER,
    ...(input === undefined ? {} : { input }),
  });
  if (result.error)
    throw new Error(`git ${args[0]} failed in ${repoRoot}: ${result.error.message}`, {
      cause: result.error,
    });
  if (result.status !== 0)
    throw new Error(`git ${args.join(" ")} failed in ${repoRoot}: ${result.stderr.trim()}`);
  return result.stdout;
}

function listTree(repoRoot: string, commit: string, paths: readonly string[]): TreeEntry[] {
  const output = git(repoRoot, ["ls-tree", "-r", "-z", "--full-tree", commit, "--", ...paths]);
  return output
    .split("\0")
    .filter(Boolean)
    .map((line) => {
      const tab = line.indexOf("\t");
      const [mode = "", type = "", object = ""] = line.slice(0, tab).split(" ");
      return { mode, type, object, path: line.slice(tab + 1) };
    });
}

// `git cat-file --batch` の出力（`<oid> blob <size>\n<content>\n` の繰り返し）を順に切り出す。
function readBlobs(repoRoot: string, objects: readonly string[]): string[] {
  if (objects.length === 0) return [];
  const output = spawnSync("git", ["cat-file", "--batch"], {
    cwd: repoRoot,
    env: gitEnvironment(),
    input: `${objects.join("\n")}\n`,
    maxBuffer: GIT_MAX_BUFFER,
  });
  if (output.error || output.status !== 0)
    throw new Error(
      `git cat-file --batch failed in ${repoRoot}: ${output.error?.message ?? String(output.stderr)}`,
    );
  const buffer = output.stdout;
  const contents: string[] = [];
  let offset = 0;
  for (const object of objects) {
    const newline = buffer.indexOf(0x0a, offset);
    const header = buffer.subarray(offset, newline).toString("utf8").split(" ");
    if (header[0] !== object || header[1] !== "blob")
      throw new Error(`unexpected git cat-file output for ${object}: ${header.join(" ")}`);
    const size = Number(header[2]);
    contents.push(buffer.subarray(newline + 1, newline + 1 + size).toString("utf8"));
    offset = newline + 1 + size + 1;
  }
  return contents;
}

function materialize(root: string, entries: readonly TreeEntry[], contents: Map<string, string>) {
  for (const entry of entries) {
    const target = resolve(root, entry.path);
    if (!target.startsWith(`${root}${sep}`) && target !== root)
      throw new Error(`tree path escapes the check directory: ${entry.path}`);
    if (entry.type === "commit") {
      mkdirSync(target, { recursive: true });
      continue;
    }
    mkdirSync(dirname(target), { recursive: true });
    // symlink は通常のファイルとして数えない。検査が lstat で判定するので、宛先のない link で表す。
    if (entry.mode === "120000") symlinkSync("missing-symlink-target", target);
    else writeFileSync(target, contents.get(entry.path) ?? "", "utf8");
  }
}

export function validateRunRecordLayoutAtCommit(options: {
  repoRoot: string;
  executionPath: string;
  commit: string;
  routinesPath?: string;
}): RecordLayoutIssue[] {
  const repoRoot = resolve(options.repoRoot);
  const toRepo = (path: string) => relative(repoRoot, resolve(path)).replaceAll("\\", "/");
  const executionPath = toRepo(options.executionPath);
  const routineLocks = options.routinesPath ? `${toRepo(options.routinesPath)}/.locks` : undefined;
  const commit = git(repoRoot, [
    "rev-parse",
    "--verify",
    "--end-of-options",
    `${options.commit}^{commit}`,
  ]).trim();
  const entries = listTree(
    repoRoot,
    commit,
    routineLocks ? [executionPath, routineLocks] : [executionPath],
  );
  const results = entries.filter(
    (entry) =>
      entry.type === "blob" && entry.mode !== "120000" && basename(entry.path) === "result.md",
  );
  const blobs = readBlobs(
    repoRoot,
    results.map((entry) => entry.object),
  );
  const contents = new Map(results.map((entry, index) => [entry.path, blobs[index] ?? ""]));

  const root = mkdtempSync(join(tmpdir(), "specdojo-record-layout-commit-"));
  try {
    materialize(root, entries, contents);
    return validateRunRecordLayout({
      repoRoot: root,
      executionPath: join(root, executionPath),
      ...(options.routinesPath ? { routinesPath: join(root, toRepo(options.routinesPath)) } : {}),
      lockPolicy: "tracked",
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
