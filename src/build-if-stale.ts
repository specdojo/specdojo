#!/usr/bin/env node
// src が dist より新しい（または dist が無い）場合だけ `npm run build` を実行する。
//
// specdojo の bin は dist/specdojo.js を指すため、merge / checkout で src が更新された
// あとに再ビルドしないと、古い挙動のまま CLI が動作する。Git hook（post-merge /
// post-checkout）や `npm run build:if-stale` から呼び出すことを想定し、失敗しても
// 呼び出し元を止めない best-effort な処理にしている。最終的な安全網は
// dist-freshness.ts による CLI 起動時の鮮度ガードである。
import { existsSync, lstatSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureFreshDistBuild } from "./dist-freshness.js";

function report(message: string): void {
  process.stderr.write(`[build-if-stale] ${message}\n`);
}

function isPrimaryWorktree(repoRoot: string): boolean {
  const gitEntry = path.join(repoRoot, ".git");
  return existsSync(gitEntry) && lstatSync(gitEntry).isDirectory();
}

function main(): void {
  const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  if (!isPrimaryWorktree(repoRoot)) {
    // linked worktree は dist を持たず、agent は tsx で src を直接実行するため対象外。
    return;
  }
  const result = ensureFreshDistBuild(repoRoot);
  if (result.message) report(result.message);
}

try {
  main();
} catch (error) {
  report(`鮮度判定に失敗した: ${error instanceof Error ? error.message : String(error)}`);
}
