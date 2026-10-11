// agent CLI を各ツールの自己更新コマンドで更新する。
//
// 導入方式は CLI ごとに異なる（npm global、standalone バイナリ、独自パッケージ）。方式ごとの
// 更新手順を script 側で再現すると導入経路の変更に追従できないため、各 CLI が提供する update
// サブコマンドへ委ねる。npm global の CLI も npm i -g で上書きせず公式経路に従う。
//
// 1 つの失敗で残りを止めない。CLI は書き込み先の権限が異なり（例: /usr/local/bin が別 uid 所有）、
// 一部だけ失敗する状況が通常運転である。失敗は集約して最後に報告し、終了コードで示す。
//
// 依存は Node 標準のみとする。devDependency が未インストールの環境でも実行できる必要がある。
// 前例は tools/install-lefthook.mjs である。

import { spawnSync } from "node:child_process";

/** 更新対象。command は PATH 上の実行ファイル名、updateArgs は自己更新の引数。 */
const TARGETS = [
  { name: "claude", command: "claude", updateArgs: ["update"] },
  { name: "codex", command: "codex", updateArgs: ["update"] },
  { name: "copilot", command: "copilot", updateArgs: ["update"] },
  { name: "agy", command: "agy", updateArgs: ["update"] },
  { name: "opencode", command: "opencode", updateArgs: ["upgrade"] },
];

const NOT_INSTALLED = "not installed";
const UNKNOWN_VERSION = "unknown";

/**
 * `--version` の出力から版だけを取り出す。CLI ごとに前後へ製品名を付ける（例: "codex-cli 0.155.1"、
 * "GitHub Copilot CLI 1.0.87."）ため、最初の数値列を版とみなす。取れない場合は全体を返さずに
 * unknown とし、比較で誤った差分を出さない。
 */
function readVersion(command) {
  const result = spawnSync(command, ["--version"], { encoding: "utf8" });
  if (result.error || result.status !== 0) return NOT_INSTALLED;
  const text = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  const match = text.match(/\d+\.\d+(?:\.\d+)*/u);
  return match ? match[0] : UNKNOWN_VERSION;
}

function runUpdate(target) {
  process.stdout.write(`\n--- ${target.name} ${target.updateArgs.join(" ")}\n`);
  const result = spawnSync(target.command, target.updateArgs, { stdio: "inherit" });
  if (result.error) return { ok: false, reason: result.error.message };
  if (result.status !== 0) return { ok: false, reason: `exit ${result.status ?? "unknown"}` };
  return { ok: true, reason: "" };
}

const rows = [];

for (const target of TARGETS) {
  const before = readVersion(target.command);
  if (before === NOT_INSTALLED) {
    rows.push({ name: target.name, before: "—", after: "—", state: "not installed", reason: "" });
    continue;
  }
  const outcome = runUpdate(target);
  const after = outcome.ok ? readVersion(target.command) : "—";
  const state = !outcome.ok ? "FAILED" : before === after ? "up to date" : "updated";
  rows.push({ name: target.name, before, after, state, reason: outcome.reason });
}

const nameWidth = Math.max(...rows.map((row) => row.name.length));
const beforeWidth = Math.max(...rows.map((row) => row.before.length));
const afterWidth = Math.max(...rows.map((row) => row.after.length));

process.stdout.write("\n");
for (const row of rows) {
  const detail = row.reason ? ` (${row.reason})` : "";
  process.stdout.write(
    `${row.name.padEnd(nameWidth)}  ${row.before.padStart(beforeWidth)} → ` +
      `${row.after.padStart(afterWidth)}  ${row.state}${detail}\n`,
  );
}

const failed = rows.filter((row) => row.state === "FAILED");
if (failed.length > 0) {
  process.stderr.write(
    `\n${failed.length} failed: ${failed.map((row) => row.name).join(", ")}. See messages above.\n`,
  );
  process.exit(1);
}
process.stdout.write("\nAll installed agent CLIs are up to date.\n");
