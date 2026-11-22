import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { executeAgent } from "../../../../src/exec/run/agent.js";
import { waitForAgentExit } from "../../../../src/exec/run/agent-timeout.js";

// 眠り続ける偽の agent。孫のプロセスを起こし、その pid をファイルへ書いてから眠る（PJR-K8F1）。
const GRANDCHILD_SCRIPT = `
import { writeFileSync } from "node:fs";
const [pidFile, ignoreTerm] = process.argv.slice(2);
if (ignoreTerm === "ignore-term") process.on("SIGTERM", () => {});
writeFileSync(pidFile, String(process.pid), "utf8");
setInterval(() => {}, 1000);
`;

const AGENT_SCRIPT = `
import { spawn } from "node:child_process";
const [grandchild, pidFile, ignoreTerm] = process.argv.slice(2);
if (ignoreTerm === "ignore-term") process.on("SIGTERM", () => {});
spawn(process.execPath, [grandchild, pidFile, ignoreTerm], { stdio: "ignore" });
setInterval(() => {}, 1000);
`;

const SHORT_AGENT_SCRIPT = `
setTimeout(() => {
  process.stdout.write("finished\\n");
  process.exit(0);
}, 1500);
`;

const directories: string[] = [];
const leftovers: number[] = [];

afterEach(async () => {
  for (const pid of leftovers.splice(0)) {
    try {
      process.kill(pid, "SIGKILL");
    } catch {
      // 既に終わっている。
    }
  }
  for (const directory of directories.splice(0)) {
    await rm(directory, { recursive: true, force: true });
  }
});

async function fixtureDirectory(): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), "agent-timeout-"));
  directories.push(directory);
  await writeFile(path.join(directory, "grandchild.mjs"), GRANDCHILD_SCRIPT, "utf8");
  await writeFile(path.join(directory, "agent.mjs"), AGENT_SCRIPT, "utf8");
  await writeFile(path.join(directory, "short.mjs"), SHORT_AGENT_SCRIPT, "utf8");
  return directory;
}

function isAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function waitUntilGone(pid: number, timeoutMs = 2_000): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (!isAlive(pid)) return true;
    await new Promise((resolveWait) => setTimeout(resolveWait, 50));
  }
  return !isAlive(pid);
}

async function grandchildPid(directory: string): Promise<number> {
  const pid = Number(await readFile(path.join(directory, "grandchild.pid"), "utf8"));
  leftovers.push(pid);
  return pid;
}

function quoted(value: string): string {
  return `'${value.replaceAll("'", "'\\''")}'`;
}

describe.skipIf(process.platform === "win32")("executeAgent time limit", () => {
  it("stops a sleeping agent and its grandchild at the limit and blocks with the key", async () => {
    const directory = await fixtureDirectory();
    const command = [
      quoted(process.execPath),
      quoted(path.join(directory, "agent.mjs")),
      quoted(path.join(directory, "grandchild.mjs")),
      quoted(path.join(directory, "grandchild.pid")),
    ].join(" ");

    const execution = await executeAgent(
      command,
      "prompt",
      { stderr_patterns: ["timed out"] },
      "claude",
      undefined,
      directory,
      { PATH: process.env.PATH ?? "" },
      true,
      "executor",
      { seconds: 2, key: "providers.claude.agent_timeout_seconds" },
    );

    expect(execution).toMatchObject({ result: "failure", timedOut: true });
    expect(execution.stderr).toContain(
      "blocked: agent timed out after 2s (providers.claude.agent_timeout_seconds)",
    );
    expect(await waitUntilGone(await grandchildPid(directory))).toBe(true);
  });

  it("keeps waiting until the agent exits when no limit is configured", async () => {
    const directory = await fixtureDirectory();
    const command = `${quoted(process.execPath)} ${quoted(path.join(directory, "short.mjs"))}`;

    const execution = await executeAgent(
      command,
      "prompt",
      undefined,
      "claude",
      undefined,
      directory,
      { PATH: process.env.PATH ?? "" },
      true,
    );

    expect(execution).toEqual({
      result: "success",
      exitCode: 0,
      stdout: "finished\n",
      stderr: "",
    });
  });
});

describe.skipIf(process.platform === "win32")("waitForAgentExit process group stop", () => {
  it("sends SIGKILL to a group that ignores SIGTERM after the grace period", async () => {
    const directory = await fixtureDirectory();
    const child = spawn(
      process.execPath,
      [
        path.join(directory, "agent.mjs"),
        path.join(directory, "grandchild.mjs"),
        path.join(directory, "grandchild.pid"),
        "ignore-term",
      ],
      { cwd: directory, stdio: ["ignore", "pipe", "pipe"], detached: true },
    );
    if (child.pid !== undefined) leftovers.push(child.pid);

    const exit = await waitForAgentExit(
      child,
      { seconds: 2, key: "providers.claude.agent_timeout_seconds" },
      { killGraceMs: 300, closeGraceMs: 1_000 },
    );

    expect(exit).toMatchObject({ timedOut: true });
    expect(await waitUntilGone(await grandchildPid(directory))).toBe(true);
  });
});
