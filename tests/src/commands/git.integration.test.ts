import { execFileSync, spawn, type ChildProcess } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { execLifecyclePoolPath } from "../../../src/exec/run/lock.js";
import {
  acquirePoolSlot,
  delay,
  releaseLock,
  tryAcquirePoolSlot,
} from "../../../src/shared/cross-process-lock.js";
import { gitEnvironment } from "../../../src/shared/git-environment.js";

const entry = resolve("src/specdojo.ts");
const tsxLoader = import.meta.resolve("tsx");

function git(root: string, args: string[]): string {
  return execFileSync("git", args, {
    cwd: root,
    env: gitEnvironment(),
    encoding: "utf8",
    stdio: "pipe",
  });
}

function launch(cwd: string, args: string[]) {
  const child = spawn(process.execPath, ["--import", tsxLoader, entry, "git", ...args], {
    cwd,
    env: gitEnvironment(),
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", (chunk: Buffer) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk: Buffer) => {
    output += chunk.toString();
  });
  const result = new Promise<number | null>((resolveExit, reject) => {
    child.once("error", reject);
    child.once("close", resolveExit);
  });
  return { child, result, output: () => output };
}

async function until(check: () => boolean): Promise<void> {
  const deadline = Date.now() + 10_000;
  while (!check()) {
    if (Date.now() > deadline) throw new Error("Timed out waiting for Git fixture");
    await delay(20);
  }
}

async function fixture(
  test: (root: string, execution: string, children: ChildProcess[]) => Promise<void>,
): Promise<void> {
  const root = mkdtempSync(join(tmpdir(), "specdojo-git-integration-"));
  const children: ChildProcess[] = [];
  try {
    git(root, ["init"]);
    mkdirSync(join(root, ".specdojo"));
    writeFileSync(
      join(root, ".specdojo/specdojo.config.json"),
      JSON.stringify({
        version: 1,
        current_project: "p",
        projects: { p: { execution_path: "execution" } },
      }),
    );
    writeFileSync(join(root, "file.txt"), "content\n");
    await test(root, join(root, "execution"), children);
  } finally {
    writeFileSync(join(root, ".git/release-hook"), "release");
    for (const child of children) {
      if (child.exitCode === null && child.signalCode === null) {
        child.kill("SIGTERM");
        await new Promise<void>((done) => child.once("close", () => done()));
      }
    }
    rmSync(root, { recursive: true, force: true });
  }
}

describe("specdojo git CLI", () => {
  it("queues behind the runner, holds through the entire hook, then lets runner integration proceed", async () => {
    await fixture(async (root, execution, children) => {
      git(root, ["add", "file.txt"]);
      const pool = execLifecyclePoolPath(execution);
      const runner = await acquirePoolSlot(pool, 1, { actor: "runner" });
      writeFileSync(
        join(root, ".git/hooks/pre-commit"),
        "#!/bin/sh\nexec node .git/hook-check.cjs\n",
        { mode: 0o755 },
      );
      writeFileSync(
        join(root, ".git/hook-check.cjs"),
        `
const fs = require('node:fs');
const ownerPath = ${JSON.stringify(join(pool, "slot-1/owner.json"))};
function check() {
  const owner = JSON.parse(fs.readFileSync(ownerPath));
  if (!(process.env.SPECDOJO_GIT_LOCK_TOKENS || '').split(',').includes(owner.token)) process.exit(9);
}
check();
fs.writeFileSync('.git/hook-started', 'yes');
const deadline = Date.now() + 10000;
const timer = setInterval(() => {
  if (Date.now() > deadline) process.exit(10);
  if (!fs.existsSync('.git/release-hook')) return;
  check(); clearInterval(timer);
}, 20);
`,
      );
      const wrapper = launch(root, ["--", "commit", "-m", "message with spaces"]);
      children.push(wrapper.child);
      try {
        await until(() => wrapper.output().includes("Waiting for the exec-lifecycle lock"));
        expect(existsSync(join(root, ".git/hook-started"))).toBe(false);
      } finally {
        releaseLock(runner);
      }
      await until(() => existsSync(join(root, ".git/hook-started")));
      // The runner uses this exact pool, so it must wait while Git's hook is blocked.
      const contender = tryAcquirePoolSlot(pool, 1, { actor: "runner-integration" });
      if (contender) releaseLock(contender);
      expect(contender).toBeNull();
      writeFileSync(join(root, ".git/release-hook"), "release");
      expect(await wrapper.result, wrapper.output()).toBe(0);
      expect(git(root, ["log", "-1", "--format=%s"]).trim()).toBe("message with spaces");
      const next = await acquirePoolSlot(pool, 1, { actor: "runner-integration" });
      releaseLock(next);
    });
  });

  it("bypasses a held lifecycle lock for reads, including from a repository without config", async () => {
    await fixture(async (root, execution, children) => {
      const runner = await acquirePoolSlot(execLifecyclePoolPath(execution), 1, {
        actor: "runner",
      });
      try {
        rmSync(join(root, ".specdojo"), { recursive: true });
        const wrapper = launch(root, ["--", "status", "--short"]);
        children.push(wrapper.child);
        expect(await wrapper.result, wrapper.output()).toBe(0);
        expect(wrapper.output()).toContain("file.txt");
        expect(wrapper.output()).not.toContain("Waiting");
      } finally {
        releaseLock(runner);
      }
    });
  });

  it("takes over an abandoned lifecycle lock and resolves -C relative to the caller", async () => {
    await fixture(async (root, execution, children) => {
      const slot = join(execLifecyclePoolPath(execution), "slot-1");
      mkdirSync(slot, { recursive: true });
      writeFileSync(
        join(slot, "owner.json"),
        JSON.stringify({ actor: "crashed", pid: 0, token: "obsolete", acquired_at_utc: "" }),
      );
      const old = new Date(Date.now() - 60_000);
      utimesSync(slot, old, old);
      mkdirSync(join(root, "subdir"));
      const wrapper = launch(join(root, "subdir"), ["--", "-C", "..", "add", "--", "file.txt"]);
      children.push(wrapper.child);
      expect(await wrapper.result, wrapper.output()).toBe(0);
      expect(git(root, ["diff", "--cached", "--name-only"])).toBe("file.txt\n");
      expect(existsSync(slot)).toBe(false);
    });
  });

  it("preserves a failing hook exit code and releases the lifecycle lock", async () => {
    await fixture(async (root, execution, children) => {
      git(root, ["add", "file.txt"]);
      writeFileSync(join(root, ".git/hooks/pre-commit"), "#!/bin/sh\nexit 1\n", { mode: 0o755 });
      const wrapper = launch(root, ["--", "commit", "-m", "rejected"]);
      children.push(wrapper.child);
      expect(await wrapper.result).toBe(1);
      expect(existsSync(join(execLifecyclePoolPath(execution), "slot-1"))).toBe(false);
    });
  });

  it("refuses writes without project config before changing the index", async () => {
    await fixture(async (root, _execution, children) => {
      rmSync(join(root, ".specdojo"), { recursive: true });
      const wrapper = launch(root, ["--", "add", "file.txt"]);
      children.push(wrapper.child);
      expect(await wrapper.result).toBe(1);
      expect(wrapper.output()).toContain("No config found");
      expect(git(root, ["diff", "--cached", "--name-only"])).toBe("");
    });
  });

  it("returns a warning without blocking a direct commit while an exec run is active", async () => {
    await fixture(async (root, execution, children) => {
      const run = await acquirePoolSlot(join(execution, "exec/.locks/exec-run-join"), 1, {
        actor: "runner",
      });
      try {
        const warning = launch(root, ["--warn-unlocked"]);
        children.push(warning.child);
        expect(await warning.result).toBe(0);
        expect(warning.output()).toContain("warning: exec run is active");
      } finally {
        releaseLock(run);
      }
      expect(readFileSync(join(root, "file.txt"), "utf8")).toBe("content\n");
    });
  });
});
