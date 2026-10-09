import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { buildOrchestratorLaunch, resolveOrchestratorLaunch } from "../../src/orchestrator.js";

const originalCwd = process.cwd();
const originalProject = process.env.SPECDOJO_PROJECT;

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
});
