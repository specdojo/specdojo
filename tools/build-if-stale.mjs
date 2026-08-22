#!/usr/bin/env node
// Git hook から、node_modules が無い新規 linked worktree でも安全に起動できる入口。
// primary worktree かつローカルの tsx が利用できる場合だけ、既存の TypeScript 実装へ
// 委譲する。hook を止めない best-effort 処理なので、起動失敗は報告して終了コード 0 にする。
import { spawnSync } from "node:child_process";
import { existsSync, lstatSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function report(message) {
  process.stderr.write(`[build-if-stale] ${message}\n`);
}

const entryPath = fileURLToPath(import.meta.url);
const defaultRepoRoot = path.dirname(path.dirname(entryPath));

export function runBuildIfStale(repoRoot, { runScript = spawnSync, reportMessage = report } = {}) {
  const gitEntry = path.join(repoRoot, ".git");

  if (!existsSync(gitEntry) || !lstatSync(gitEntry).isDirectory()) {
    // linked worktree では .git がファイルになる。依存確認より先に終了する。
    return { outcome: "not-primary-worktree" };
  }

  const tsxCli = path.join(repoRoot, "node_modules", "tsx", "dist", "cli.mjs");
  if (!existsSync(tsxCli)) {
    reportMessage("tsx が未インストールのため再ビルド判定をスキップした（npm install を実行する）");
    return { outcome: "dependency-missing" };
  }

  const result = runScript(
    process.execPath,
    [tsxCli, path.join(repoRoot, "src", "build-if-stale.ts")],
    {
      cwd: repoRoot,
      stdio: "inherit",
      shell: false,
    },
  );
  if (result.error) {
    reportMessage(`再ビルド判定を起動できなかった: ${result.error.message}`);
    return { outcome: "delegation-failed" };
  }
  if (result.status !== 0) {
    reportMessage(`再ビルド判定が失敗した（終了コード ${result.status ?? "unknown"}）`);
    return { outcome: "delegation-failed" };
  }

  return { outcome: "delegated" };
}

if (process.argv[1] && path.resolve(process.argv[1]) === entryPath) {
  try {
    runBuildIfStale(defaultRepoRoot);
  } catch (error) {
    report(`入口の判定に失敗した: ${error instanceof Error ? error.message : String(error)}`);
  }
}
