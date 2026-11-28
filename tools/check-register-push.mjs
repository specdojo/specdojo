#!/usr/bin/env node
// pre-push で、register のブランチへ push する commit を検査する（PJR-FBP0）。
// Git が標準入力へ渡す `<local ref> <local sha> <remote ref> <remote sha>` ごとに
// `register branch-check` を流す。register のブランチ以外への push は branch-check 側で飛ばす。
// hook の入口なので Node 標準だけで動かし、依存（tsx）がなければ検査を飛ばす。
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ZERO_OBJECT = /^0+$/u;

// 削除の push（local sha がすべて 0）は対象にしない。
export function pushedUpdates(input) {
  return input
    .split(/\r?\n/u)
    .map((line) => line.trim().split(/\s+/u))
    .filter((fields) => fields.length >= 4 && !ZERO_OBJECT.test(fields[1]))
    .map(([, commit, remoteRef, base]) => ({ commit, remoteRef, base }));
}

export function parseProject(argv) {
  const index = argv.indexOf("--project");
  const project = index >= 0 ? argv[index + 1] : undefined;
  if (!project || project.startsWith("-")) throw new Error("--project <project-id> is required");
  return project;
}

function checkUpdate(root, project, update) {
  const result = spawnSync(
    process.execPath,
    [
      "--import",
      "tsx",
      join(root, "src", "specdojo.ts"),
      "register",
      "branch-check",
      "--project",
      project,
      "--commit",
      update.commit,
      "--base",
      update.base,
      "--remote-ref",
      update.remoteRef,
    ],
    { cwd: root, stdio: ["ignore", "inherit", "inherit"] },
  );
  if (result.error) throw result.error;
  return result.status ?? 1;
}

export async function runCheckRegisterPush({
  argv = process.argv.slice(2),
  input = process.stdin,
  root = repoRoot,
  check = checkUpdate,
  report = (message) => process.stderr.write(message),
} = {}) {
  const project = parseProject(argv);
  input.setEncoding("utf8");
  let pushInput = "";
  for await (const chunk of input) pushInput += chunk;
  const updates = pushedUpdates(pushInput);
  if (updates.length === 0) return 0;

  if (!existsSync(join(root, "node_modules", "tsx"))) {
    report("[register-push] skipped: node_modules/tsx is not installed (run npm ci)\n");
    return 0;
  }
  const failed = updates.filter((update) => check(root, project, update) !== 0).length;
  if (failed === 0) return 0;
  report(
    `ERROR: ${failed} push update(s) fail register branch-check. CI の register push 検査も同じ理由で失敗します。\n`,
  );
  return 1;
}

const isEntryPoint =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isEntryPoint) {
  try {
    process.exitCode = await runCheckRegisterPush();
  } catch (error) {
    process.stderr.write(
      `[register-push] ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
}
