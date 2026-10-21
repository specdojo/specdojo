import { type spawn } from "node:child_process";
import { EventEmitter } from "node:events";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { constants as osConstants, tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildOrchestratorLaunch,
  resolveOrchestratorLaunch,
  runOrchestratorLaunch,
  type OrchestratorLaunch,
} from "../../../src/commands/orchestrator.js";

const originalCwd = process.cwd();
const originalProject = process.env.SPECDOJO_PROJECT;

const testLaunch: OrchestratorLaunch = {
  command: "provider-cli",
  args: ["--interactive"],
  cwd: "/workspace/project",
  env: { PATH: "/bin" },
};

function launchTestProcess() {
  const child = Object.assign(new EventEmitter(), {
    kill: vi.fn(() => true),
  });
  const spawnProcess = vi.fn(() => child) as unknown as typeof spawn;
  const signalProcess = new EventEmitter();
  const result = runOrchestratorLaunch(testLaunch, spawnProcess, signalProcess);
  return { child, spawnProcess, signalProcess, result };
}

afterEach(() => {
  process.chdir(originalCwd);
  if (originalProject === undefined) delete process.env.SPECDOJO_PROJECT;
  else process.env.SPECDOJO_PROJECT = originalProject;
});

describe("buildOrchestratorLaunch", () => {
  const repoRoots = ["/workspace/app1", "/workspace/admin-ui"];

  it("reuses exec extra-root arguments for claude", () => {
    const launch = buildOrchestratorLaunch({
      provider: "claude",
      providerArgs: ["--agent", "specdojo-orchestrator", "--model", "opus", "--verbose"],
      repoRoots,
      cwd: "/workspace/project",
      env: { PATH: "/bin" },
    });

    expect(launch.command).toBe("claude");
    expect(launch.args).toEqual([
      "--agent",
      "specdojo-orchestrator",
      "--model",
      "opus",
      "--verbose",
      "--add-dir",
      "/workspace/app1",
      "/workspace/admin-ui",
      "--allowedTools",
      "Edit(//workspace/app1/**)",
      "Edit(//workspace/admin-ui/**)",
    ]);
  });

  it("reuses repeated --add-dir arguments for codex, antigravity, and copilot", () => {
    for (const [provider, executable] of [
      ["codex", "codex"],
      ["antigravity", "agy"],
      ["copilot", "copilot"],
    ] as const) {
      const launch = buildOrchestratorLaunch({
        provider,
        providerArgs: ["original", "--user-option"],
        repoRoots,
        cwd: "/workspace/project",
        env: {},
      });

      expect(launch.command).toBe(executable);
      expect(launch.args).toEqual([
        "original",
        "--user-option",
        "--add-dir",
        "/workspace/app1",
        "--add-dir",
        "/workspace/admin-ui",
      ]);
    }
  });

  it("injects an OpenCode agent override that denies undeclared external directories", () => {
    const launch = buildOrchestratorLaunch({
      provider: "opencode",
      providerArgs: ["--agent", "specdojo-orchestrator", "--print-logs"],
      repoRoots,
      cwd: "/workspace/project",
      env: {
        PATH: "/bin",
        OPENCODE_CONFIG_CONTENT: JSON.stringify({ autoupdate: false, agent: { other: {} } }),
      },
    });

    expect(launch.command).toBe("opencode");
    expect(launch.args).toEqual(["--agent", "specdojo-orchestrator", "--print-logs"]);
    const config = JSON.parse(launch.env.OPENCODE_CONFIG_CONTENT ?? "") as {
      autoupdate: boolean;
      agent: Record<
        string,
        {
          permission?: {
            external_directory?: Record<string, string>;
            edit?: Record<string, string>;
          };
        }
      >;
    };
    expect(config.autoupdate).toBe(false);
    expect(config.agent.other).toEqual({});
    expect(config.agent["specdojo-orchestrator"].permission?.external_directory).toEqual({
      "*": "deny",
      "/workspace/app1/**": "allow",
      "/workspace/admin-ui/**": "allow",
    });
    expect(config.agent["specdojo-orchestrator"].permission?.edit).toEqual({
      "/workspace/app1/**": "allow",
      "/workspace/admin-ui/**": "allow",
    });
    expect(launch.env.OPENCODE_CONFIG_CONTENT).not.toContain("/workspace/undeclared");
  });

  it("keeps every provider command unchanged when the project has no repos", () => {
    for (const provider of ["claude", "codex", "antigravity", "copilot", "opencode"] as const) {
      const env = { PATH: "/bin", OPENCODE_CONFIG_CONTENT: '{"autoupdate":false}' };
      const args = ["--agent", "specdojo-orchestrator", "--user-option"];
      const launch = buildOrchestratorLaunch({
        provider,
        providerArgs: args,
        repoRoots: [],
        cwd: "/workspace/project",
        env,
      });

      expect(launch.args).toEqual(args);
      expect(launch.env).toEqual(env);
    }
  });
});

describe("resolveOrchestratorLaunch", () => {
  it("uses --project before SPECDOJO_PROJECT and includes only that project's repos", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-orchestrator-"));
    try {
      mkdirSync(join(root, ".specdojo"), { recursive: true });
      mkdirSync(join(root, "explicit-app"));
      mkdirSync(join(root, "env-app"));
      mkdirSync(join(root, "current-app"));
      writeFileSync(
        join(root, ".specdojo", "specdojo.config.json"),
        JSON.stringify({
          version: 1,
          current_project: "current",
          projects: {
            explicit: { repos: [{ name: "explicit-app", path: "explicit-app" }] },
            env: { repos: [{ name: "env-app", path: "env-app" }] },
            current: { repos: [{ name: "current-app", path: "current-app" }] },
          },
        }),
      );
      process.chdir(root);
      process.env.SPECDOJO_PROJECT = "env";

      const launch = resolveOrchestratorLaunch({
        provider: "codex",
        providerArgs: ["prompt"],
        project: "explicit",
      });

      expect(launch.args).toEqual(["prompt", "--add-dir", join(root, "explicit-app")]);
      expect(launch.args).not.toContain(join(root, "env-app"));
      expect(launch.args).not.toContain(join(root, "current-app"));

      const fromEnvironment = resolveOrchestratorLaunch({
        provider: "codex",
        providerArgs: [],
      });
      expect(fromEnvironment.args).toEqual(["--add-dir", join(root, "env-app")]);

      delete process.env.SPECDOJO_PROJECT;
      const fromCurrent = resolveOrchestratorLaunch({
        provider: "codex",
        providerArgs: [],
      });
      expect(fromCurrent.args).toEqual(["--add-dir", join(root, "current-app")]);

      writeFileSync(
        join(root, ".specdojo", "specdojo.config.json"),
        JSON.stringify({
          version: 1,
          projects: {
            explicit: { repos: [{ name: "explicit-app", path: "explicit-app" }] },
            env: { repos: [{ name: "env-app", path: "env-app" }] },
          },
        }),
      );
      const fromFirstProject = resolveOrchestratorLaunch({
        provider: "codex",
        providerArgs: [],
      });
      expect(fromFirstProject.args).toEqual(["--add-dir", join(root, "explicit-app")]);
    } finally {
      process.chdir(originalCwd);
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("resolves configured repos from the main checkout while launching in an agent worktree", () => {
    const fixtureRoot = mkdtempSync(join(tmpdir(), "specdojo-orchestrator-worktree-"));
    const mainRoot = join(fixtureRoot, "repo");
    const worktreeRoot = join(fixtureRoot, "worktrees", "codex-work");
    const productRoot = join(fixtureRoot, "specdojo-lp");
    const config = JSON.stringify({
      version: 1,
      current_project: "prj-0002",
      projects: {
        "prj-0002": { repos: [{ name: "specdojo-lp", path: "../specdojo-lp" }] },
      },
    });
    try {
      mkdirSync(join(mainRoot, ".specdojo"), { recursive: true });
      mkdirSync(join(worktreeRoot, ".specdojo"), { recursive: true });
      mkdirSync(productRoot);
      writeFileSync(join(mainRoot, ".specdojo", "specdojo.config.json"), config);
      writeFileSync(join(worktreeRoot, ".specdojo", "specdojo.config.json"), config);
      process.chdir(worktreeRoot);

      const launch = resolveOrchestratorLaunch({
        provider: "codex",
        providerArgs: ["prompt"],
        env: {
          PATH: "/bin",
          SPECDOJO_ORCHESTRATOR_CONFIG_ROOT: mainRoot,
        },
      });

      expect(launch.cwd).toBe(worktreeRoot);
      expect(launch.args).toEqual(["prompt", "--add-dir", productRoot]);
      expect(launch.env.SPECDOJO_ORCHESTRATOR_CONFIG_ROOT).toBeUndefined();
    } finally {
      process.chdir(originalCwd);
      rmSync(fixtureRoot, { recursive: true, force: true });
    }
  });
});

describe("runOrchestratorLaunch", () => {
  const signals = ["SIGINT", "SIGQUIT", "SIGTERM", "SIGHUP"] as const;

  it("ignores SIGINT and SIGQUIT until the child exits and removes every handler", async () => {
    const { child, spawnProcess, signalProcess, result } = launchTestProcess();
    let resolved: number | undefined;
    void result.then((code) => {
      resolved = code;
    });

    expect(spawnProcess).toHaveBeenCalledWith("provider-cli", ["--interactive"], {
      cwd: "/workspace/project",
      env: { PATH: "/bin" },
      stdio: "inherit",
    });
    for (const signal of signals) expect(signalProcess.listenerCount(signal)).toBe(1);

    signalProcess.emit("SIGINT");
    signalProcess.emit("SIGQUIT");
    await Promise.resolve();

    expect(resolved).toBeUndefined();
    expect(child.kill).not.toHaveBeenCalled();

    child.emit("exit", 23, null);

    await expect(result).resolves.toBe(23);
    for (const signal of signals) expect(signalProcess.listenerCount(signal)).toBe(0);
  });

  it("forwards SIGTERM and SIGHUP and maps the child's signal exit code", async () => {
    const { child, signalProcess, result } = launchTestProcess();
    let resolved: number | undefined;
    void result.then((code) => {
      resolved = code;
    });

    signalProcess.emit("SIGTERM");
    signalProcess.emit("SIGHUP");
    await Promise.resolve();

    expect(child.kill).toHaveBeenNthCalledWith(1, "SIGTERM");
    expect(child.kill).toHaveBeenNthCalledWith(2, "SIGHUP");
    expect(resolved).toBeUndefined();

    child.emit("exit", null, "SIGTERM");

    await expect(result).resolves.toBe(128 + osConstants.signals.SIGTERM);
    for (const signal of signals) expect(signalProcess.listenerCount(signal)).toBe(0);
  });

  it("removes every handler when the child fails to start", async () => {
    const { child, signalProcess, result } = launchTestProcess();

    child.emit("error", new Error("spawn failed"));

    await expect(result).rejects.toThrow("spawn failed");
    for (const signal of signals) expect(signalProcess.listenerCount(signal)).toBe(0);
  });
});
