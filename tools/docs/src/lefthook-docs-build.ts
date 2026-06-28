// lefthookでドキュメントをビルドするスクリプト（VitePressのビルドの終了が取得できない不具合に対応）

import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DEFAULT_TAIL_LINES = 80;

type MaybeNumber = number | null;

function tailLines(text: string, maxLines: number): string {
  if (!text) return "";
  const lines = text.split(/\r?\n/);
  const start = Math.max(0, lines.length - maxLines);
  return lines.slice(start).join("\n");
}

function readLogSafely(logPath: string): string {
  try {
    return fs.readFileSync(logPath, "utf8");
  } catch {
    return "";
  }
}

async function main(): Promise<void> {
  const logPath =
    process.env.LEFTHOOK_DOCS_BUILD_LOG ?? path.join(os.tmpdir(), "lefthook-docs-build.log");

  const out = fs.createWriteStream(logPath, { flags: "w" });

  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
  const child = spawn(npmCmd, ["run", "docs:build"], {
    stdio: ["ignore", "pipe", "pipe"],
    env: process.env,
  });

  child.stdout.on("data", (chunk) => out.write(chunk));
  child.stderr.on("data", (chunk) => out.write(chunk));

  child.on("error", (err) => {
    out.end();
    console.error(String(err));
    process.exit(1);
  });

  child.on("close", (code: MaybeNumber, signal: NodeJS.Signals | null) => {
    out.end();

    if (signal) {
      console.error(`docs-build terminated by signal: ${signal}`);
      console.error(`log: ${logPath}`);
      process.exit(1);
      return;
    }

    if (code === 0) {
      process.exit(0);
      return;
    }

    const log = readLogSafely(logPath);
    const tail = tailLines(log, DEFAULT_TAIL_LINES);

    if (tail) {
      console.error(tail);
    }
    console.error(`docs-build failed (exit=${code ?? "unknown"}), log: ${logPath}`);
    process.exit(code ?? 1);
  });
}

void main().catch((err) => {
  console.error(String(err));
  process.exit(1);
});
