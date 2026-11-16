#!/usr/bin/env node
// pre-push で、push する各 ref の先端 commit の実行記録の配置を検査する（PJR-1ZQK）。
// CI の Check execution record layout と同じ `exec validate --records-only` を commit の tree に
// 対して流すため、作業ツリーにしかない未 commit の run（中断中の plan 単独や空のディレクトリ）では
// 失敗しない。hook の入口なので Node 標準だけで動かし、依存（tsx）がなければ検査を飛ばす。
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ZERO_OBJECT = /^0+$/u;

// Git が pre-push の標準入力へ渡す `<local ref> <local sha> <remote ref> <remote sha>` から、
// 検査する commit を重複なく返す。削除の push（local sha がすべて 0）は対象にしない。
export function pushedCommits(input) {
  const commits = input
    .split(/\r?\n/u)
    .map((line) => line.trim().split(/\s+/u))
    .filter((fields) => fields.length >= 4 && !ZERO_OBJECT.test(fields[1]))
    .map((fields) => fields[1]);
  return [...new Set(commits)];
}

export function parseProject(argv) {
  const index = argv.indexOf("--project");
  const project = index >= 0 ? argv[index + 1] : undefined;
  if (!project || project.startsWith("-")) throw new Error("--project <project-id> is required");
  return project;
}

function validateCommit(root, project, commit) {
  const result = spawnSync(
    process.execPath,
    [
      "--import",
      "tsx",
      join(root, "src", "specdojo.ts"),
      "exec",
      "validate",
      "--project",
      project,
      "--records-only",
      "--commit",
      commit,
    ],
    { cwd: root, stdio: ["ignore", "inherit", "inherit"] },
  );
  if (result.error) throw result.error;
  return result.status ?? 1;
}

export async function runCheckRunRecordLayoutPush({
  argv = process.argv.slice(2),
  input = process.stdin,
  root = repoRoot,
  validate = validateCommit,
  report = (message) => process.stderr.write(message),
} = {}) {
  const project = parseProject(argv);
  input.setEncoding("utf8");
  let pushInput = "";
  for await (const chunk of input) pushInput += chunk;
  const commits = pushedCommits(pushInput);
  if (commits.length === 0) return 0;

  if (!existsSync(join(root, "node_modules", "tsx"))) {
    report("[run-record-layout] skipped: node_modules/tsx is not installed (run npm ci)\n");
    return 0;
  }

  let failed = 0;
  for (const commit of commits) {
    if (validate(root, project, commit) !== 0) failed += 1;
  }
  if (failed === 0) return 0;
  report(
    [
      `ERROR: ${failed} pushed commit(s) have run records that fail exec validate --records-only.`,
      "CI の Check execution record layout も同じ理由で失敗します。plan・result・evidence がそろわない run を",
      "commit から外す（git rm --cached）か、記録をそろえてから push してください。",
      "",
    ].join("\n"),
  );
  return 1;
}

const isEntryPoint =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isEntryPoint) {
  try {
    process.exitCode = await runCheckRunRecordLayoutPush();
  } catch (error) {
    process.stderr.write(
      `[run-record-layout] ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
}
