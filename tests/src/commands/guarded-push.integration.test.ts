import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { runGuardedPush } from "../../../src/commands/guarded-push.js";
import { executeAgent } from "../../../src/exec/run/agent.js";
import { spawnAgent } from "../../../src/exec/trial-core.js";
import { registerLifecyclePoolPath } from "../../../src/register/lifecycle-lock.js";
import { AGENT_ROLE_ENV } from "../../../src/shared/agent-role.js";
import { acquirePoolSlot, releaseLock } from "../../../src/shared/cross-process-lock.js";
import { gitEnvironment } from "../../../src/shared/git-environment.js";

const entry = resolve("src/specdojo.ts");
const loader = import.meta.resolve("tsx");

beforeEach(() => {
  vi.stubEnv(AGENT_ROLE_ENV, undefined);
});
afterEach(() => {
  vi.unstubAllEnvs();
});

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, {
    cwd,
    env: gitEnvironment(),
    encoding: "utf8",
    stdio: "pipe",
  }).trim();
}

async function fixture(test: (root: string, remote: string) => Promise<void>): Promise<void> {
  const temp = mkdtempSync(join(tmpdir(), "specdojo-guarded-push-"));
  const root = join(temp, "local");
  const remote = join(temp, "remote.git");
  mkdirSync(root);
  try {
    git(root, "init", "--initial-branch=project/p/develop");
    git(root, "init", "--bare", remote);
    git(root, "remote", "add", "origin", remote);
    mkdirSync(join(root, ".specdojo"));
    writeFileSync(
      join(root, ".specdojo/specdojo.config.json"),
      JSON.stringify({
        version: 1,
        projects: { p: { execution_path: "execution" } },
      }),
    );
    commit(root, "initial");
    await test(root, remote);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

function commit(root: string, content: string): string {
  writeFileSync(join(root, "file.txt"), content);
  git(root, "add", "file.txt");
  git(root, "commit", "-m", content);
  return git(root, "rev-parse", "HEAD");
}

describe("guarded-push with a local bare remote", () => {
  it("creates develop and feature refs, ignores configured mirror/refspec/tag pushes, and shows the range", async () => {
    await fixture(async (root, remote) => {
      const output = vi.spyOn(process.stdout, "write");
      try {
        const base = git(root, "rev-parse", "HEAD");
        expect(await runGuardedPush({ project: "p", cwd: root })).toBe(0);
        expect(git(remote, "rev-parse", "refs/heads/project/p/develop")).toBe(base);
        git(root, "switch", "-c", "feature/p/topic");
        const tip = commit(root, "feature");
        git(root, "tag", "-a", "v1", "-m", "tag");
        git(root, "config", "remote.origin.mirror", "true");
        git(root, "config", "remote.origin.push", "+HEAD:refs/heads/main");
        git(root, "config", "push.followTags", "true");
        expect(await runGuardedPush({ project: "p", cwd: root })).toBe(0);
        expect(git(remote, "rev-parse", "refs/heads/feature/p/topic")).toBe(tip);
        expect(git(remote, "for-each-ref", "--format=%(refname)")).toBe(
          "refs/heads/feature/p/topic\nrefs/heads/project/p/develop",
        );
        const next = commit(root, "next");
        expect(await runGuardedPush({ project: "p", cwd: root })).toBe(0);
        expect(output.mock.calls.map(([line]) => String(line)).join("")).toContain(
          `Branch: feature/p/topic\nRemote: origin\nRange: ${tip}..${next}\nCommits: 1`,
        );
      } finally {
        output.mockRestore();
      }
    });
  });

  it("dry-run checks the live push endpoint and leaves its refs and local tracking refs unchanged", async () => {
    await fixture(async (root, remote) => {
      const options = { project: "p", cwd: root };
      expect(await runGuardedPush({ ...options, dryRun: true })).toBe(0);
      expect(git(remote, "for-each-ref")).toBe("");
      expect(await runGuardedPush(options)).toBe(0);
      const base = git(root, "rev-parse", "HEAD");
      commit(root, "outgoing");
      // A stale/misleading remote-tracking ref must never serve as the fast-forward base.
      git(root, "update-ref", "refs/remotes/origin/project/p/develop", "HEAD");
      const refs = git(root, "for-each-ref");
      const fetchHead = join(root, ".git/FETCH_HEAD");
      const before = existsSync(fetchHead) ? readFileSync(fetchHead, "utf8") : undefined;
      expect(await runGuardedPush({ ...options, dryRun: true })).toBe(0);
      expect(git(remote, "rev-parse", "refs/heads/project/p/develop")).toBe(base);
      expect(git(root, "for-each-ref")).toBe(refs);
      expect(existsSync(fetchHead) ? readFileSync(fetchHead, "utf8") : undefined).toBe(before);
    });
  });

  it("sends the displayed commit even when a local branch changes before push", async () => {
    await fixture(async (root, remote) => {
      const displayed = git(root, "rev-parse", "HEAD");
      let changed = false;
      const output = vi.spyOn(process.stdout, "write").mockImplementation((line) => {
        if (!changed && String(line).startsWith("Branch:")) {
          changed = true;
          commit(root, "changed after inspection");
        }
        return true;
      });
      try {
        expect(await runGuardedPush({ project: "p", cwd: root })).toBe(0);
        expect(changed).toBe(true);
        expect(git(root, "rev-parse", "HEAD")).not.toBe(displayed);
        expect(git(remote, "rev-parse", "refs/heads/project/p/develop")).toBe(displayed);
      } finally {
        output.mockRestore();
      }
    });
  });

  it("rejects a remote tip not in local history, even when tracking refs claim otherwise", async () => {
    await fixture(async (root, remote) => {
      const options = { project: "p", cwd: root };
      await runGuardedPush(options);
      const base = git(root, "rev-parse", "HEAD");
      const tip = commit(root, "remote ahead");
      await runGuardedPush(options);
      git(root, "reset", "--hard", base);
      commit(root, "divergent");
      git(root, "update-ref", "refs/remotes/origin/project/p/develop", "HEAD");
      await expect(runGuardedPush(options)).rejects.toThrow("non-fast-forward");
      await expect(runGuardedPush({ ...options, dryRun: true })).rejects.toThrow(
        "non-fast-forward",
      );
      expect(git(remote, "rev-parse", "refs/heads/project/p/develop")).toBe(tip);
    });
  });

  it("checks the push URL rather than the fetch URL and refuses multiple push URLs", async () => {
    await fixture(async (root, remote) => {
      const second = join(root, "second.git");
      git(root, "init", "--bare", second);
      git(root, "remote", "set-url", "--push", "origin", second);
      await runGuardedPush({ project: "p", cwd: root });
      expect(git(remote, "for-each-ref")).toBe("");
      expect(git(second, "rev-parse", "refs/heads/project/p/develop")).toBe(
        git(root, "rev-parse", "HEAD"),
      );
      git(root, "remote", "set-url", "--add", "--push", "origin", remote);
      await expect(runGuardedPush({ project: "p", cwd: root })).rejects.toThrow(
        "exactly one push URL",
      );
    });
  });

  it("queues behind the same lifecycle lock as runner writes", async () => {
    await fixture(async (root, remote) => {
      const holder = await acquirePoolSlot(registerLifecyclePoolPath(join(root, "execution")), 1, {
        actor: "runner",
      });
      const env = gitEnvironment();
      delete env[AGENT_ROLE_ENV];
      const child = spawn(
        process.execPath,
        ["--import", loader, entry, "guarded-push", "--project", "p"],
        {
          cwd: root,
          env,
          stdio: ["ignore", "pipe", "pipe"],
        },
      );
      const exited = new Promise<number | null>((done, reject) => {
        child.once("error", reject);
        child.once("close", done);
      });
      try {
        await new Promise<void>((done, reject) => {
          child.stderr.on("data", (chunk: Buffer) => {
            if (chunk.toString().includes("Waiting for the exec-lifecycle lock")) done();
          });
          child.once("close", () => reject(new Error("Push exited before waiting for the lock")));
        });
        expect(git(remote, "for-each-ref")).toBe("");
      } finally {
        releaseLock(holder);
      }
      expect(await exited).toBe(0);
      expect(git(remote, "rev-parse", "refs/heads/project/p/develop")).toBe(
        git(root, "rev-parse", "HEAD"),
      );
    });
  });
});

describe("agent process role propagation", () => {
  it.each(["executor", "reporter"] as const)(
    "stamps %s in normal and trial child environments",
    async (role) => {
      await fixture(async (root) => {
        const command = `${process.execPath} -e 'process.stdout.write(process.env.SPECDOJO_AGENT_ROLE)'`;
        const env = { ...gitEnvironment(), [AGENT_ROLE_ENV]: "forged" };
        const normal = await executeAgent(
          command,
          "",
          undefined,
          undefined,
          undefined,
          root,
          env,
          true,
          role,
        );
        expect(normal.stdout).toBe(role);
        const trial = await spawnAgent(command, "", root, env, role);
        expect(trial.stdout).toBe(role);
        expect(env[AGENT_ROLE_ENV]).toBe("forged");
      });
    },
  );
});
