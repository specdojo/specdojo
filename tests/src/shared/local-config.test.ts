import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildExecutorEvidence } from "../../../src/exec/evidence.js";
import { worktreeBuildEnvironment } from "../../../src/exec/worktree.js";
import {
  formatConfigShow,
  LOCAL_CONFIG_ENV,
  localConfigEnvironment,
  resolveLocalConfigPath,
} from "../../../src/shared/local-config.js";
import { loadConfig } from "../../../src/shared/specdojo-config.js";
import { DEFAULT_GITIGNORE_PATTERNS } from "../../../src/shared/specdojo-gitignore.js";
import { buildValidator } from "../../helpers/schema.js";

let parent: string;
let root: string;

beforeEach(() => {
  // <tmp>/app1-specdojo is the SpecDojo root; app1, app1-alt and tools sit beside it.
  parent = mkdtempSync(join(tmpdir(), "specdojo-local-config-"));
  root = join(parent, "app1-specdojo");
  mkdirSync(join(root, ".git"), { recursive: true });
  for (const name of ["app1", "app1-alt", "tools"]) mkdirSync(join(parent, name));
  writeJson(join(root, ".specdojo", "specdojo.config.json"), {
    version: 1,
    current_project: "prj-0001",
    projects: {
      "prj-0001": {
        base_path: "docs/ja/projects/prj-0001",
        repos: [{ name: "app1", path: "../app1", integration_branch: "main" }],
      },
    },
  });
});

afterEach(() => {
  rmSync(parent, { recursive: true, force: true });
});

function writeJson(path: string, value: unknown): void {
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeLocal(dir: string, value: unknown): string {
  const path = join(dir, ".specdojo", "specdojo.local.config.json");
  writeJson(path, value);
  return path;
}

// A linked worktree as git writes it: `.git` is a file pointing at <main>/.git/worktrees/<name>.
function makeLinkedWorktree(name: string): string {
  const worktree = join(parent, "worktrees", name);
  mkdirSync(join(root, ".git", "worktrees", name), { recursive: true });
  mkdirSync(worktree, { recursive: true });
  writeFileSync(
    join(worktree, ".git"),
    `gitdir: ${join(root, ".git", "worktrees", name)}\n`,
    "utf8",
  );
  return worktree;
}

describe("loadConfig with a local config", () => {
  it("returns the shared config unchanged when no local config exists", () => {
    const result = loadConfig(root);

    expect(result.localConfigPath).toBeUndefined();
    expect(result.config?.projects["prj-0001"].repos).toEqual([
      { name: "app1", path: "../app1", integration_branch: "main" },
    ]);
  });

  it("replaces a shared repository path by name and appends local repositories", () => {
    const localPath = writeLocal(root, {
      version: 1,
      projects: {
        "prj-0001": {
          repos: [
            { name: "app1", path: "../app1-alt" },
            { name: "tools", path: "../tools" },
          ],
        },
      },
    });

    const result = loadConfig(root);

    expect(result.localConfigPath).toBe(localPath);
    expect(result.config?.projects["prj-0001"].repos).toEqual([
      { name: "app1", path: "../app1-alt", integration_branch: "main" },
      { name: "tools", path: "../tools" },
    ]);
    expect(result.localOverrides).toEqual([
      {
        project: "prj-0001",
        repo: "app1",
        kind: "path",
        path: "../app1-alt",
        shared_path: "../app1",
      },
      { project: "prj-0001", repo: "tools", kind: "added", path: "../tools" },
    ]);
  });

  it("rejects a key outside the allowlist with the file and key", () => {
    const localPath = writeLocal(root, {
      version: 1,
      projects: { "prj-0001": { base_path: "elsewhere" } },
    });

    expect(() => loadConfig(root)).toThrow(localPath);
    expect(() => loadConfig(root)).toThrow(
      /projects\.prj-0001: key "base_path" cannot be overridden \(allowed: repos\)/,
    );
  });

  it("rejects overriding a shared repository key other than path", () => {
    writeLocal(root, {
      version: 1,
      projects: {
        "prj-0001": { repos: [{ name: "app1", path: "../app1", integration_branch: "dev" }] },
      },
    });

    expect(() => loadConfig(root)).toThrow(
      /repos\[0\]: key "integration_branch" cannot override shared repository "app1" \(allowed: name, path\)/,
    );
  });

  it("rejects a path of the wrong type and a project the shared config does not declare", () => {
    writeLocal(root, {
      version: 1,
      projects: { "prj-0001": { repos: [{ name: "app1", path: 1 }] }, "prj-9999": {} },
    });

    expect(() => loadConfig(root)).toThrow(
      /projects\.prj-0001\.repos\[0\]\.path must be a non-empty string/,
    );
    expect(() => loadConfig(root)).toThrow(/projects\.prj-9999: project is not declared/);
  });

  it("validates a local repository path like a shared one and names the local file", () => {
    const localPath = writeLocal(root, {
      version: 1,
      projects: { "prj-0001": { repos: [{ name: "missing", path: "../missing" }] } },
    });

    expect(() => loadConfig(root)).toThrow(`with local overrides from ${localPath}`);
    expect(() => loadConfig(root)).toThrow(/repos\[1\]\.path "\.\.\/missing" does not exist/);
  });
});

describe("loadConfig with a local external_projects override", () => {
  function writeExternalLocal(value: unknown): string {
    return writeLocal(root, value);
  }

  beforeEach(() => {
    // Add a shared external project so the "replace path" branch has something to merge against.
    mkdirSync(join(root, ".specdojo"), { recursive: true });
    mkdirSync(join(root, "..", "customer"), { recursive: true });
    mkdirSync(join(root, "..", "customer-alt"), { recursive: true });
    writeFileSync(
      join(root, ".specdojo/specdojo.config.json"),
      `${JSON.stringify(
        {
          version: 1,
          current_project: "prj-0001",
          projects: {
            "prj-0001": {
              base_path: "docs/ja/projects/prj-0001",
              repos: [{ name: "app1", path: "../app1", integration_branch: "main" }],
            },
          },
          external_projects: {
            customer: { path: "../customer", project_id: "prj-target" },
          },
        },
        null,
        2,
      )}\n`,
    );
  });

  it("replaces a shared external project path by alias and appends a local-only alias", () => {
    const localPath = writeExternalLocal({
      version: 1,
      external_projects: {
        customer: { path: "../customer-alt" },
        "specdojo-upstream": {
          path: "../app1",
          project_id: "prj-target",
        },
      },
    });

    const result = loadConfig(root);

    expect(result.localConfigPath).toBe(localPath);
    expect(result.config?.external_projects).toEqual(
      expect.objectContaining({
        customer: { path: "../customer-alt", project_id: "prj-target" },
        "specdojo-upstream": { path: "../app1", project_id: "prj-target" },
      }),
    );
    expect(result.localOverrides).toEqual([
      {
        external: "customer",
        kind: "external-path",
        path: "../customer-alt",
        shared_path: "../customer",
      },
      {
        external: "specdojo-upstream",
        kind: "external-added",
        path: "../app1",
      },
    ]);
  });

  it("rejects a key outside the allowlist on an external project", () => {
    writeExternalLocal({
      version: 1,
      external_projects: { customer: { path: "../customer-alt", extra: true } },
    });

    expect(() => loadConfig(root)).toThrow(
      /external_projects\.customer: key "extra" cannot override external project "customer" \(allowed: path\)/,
    );
  });

  it("rejects an empty or non-string path on the local override", () => {
    writeExternalLocal({
      version: 1,
      external_projects: { customer: { path: "   " } },
    });

    expect(() => loadConfig(root)).toThrow(
      /external_projects\.customer\.path must be a non-empty string/,
    );
  });
});

describe("resolveLocalConfigPath", () => {
  it("never trusts a file of the same name inside a linked worktree", () => {
    const mainLocal = writeLocal(root, { version: 1, projects: {} });
    const worktree = makeLinkedWorktree("task-1");
    writeLocal(worktree, { version: 1, projects: {} });

    expect(resolveLocalConfigPath(worktree, {})).toBe(mainLocal);
  });

  it("uses the path passed in the environment inside a linked worktree", () => {
    const worktree = makeLinkedWorktree("task-1");
    const passed = writeLocal(join(parent, "elsewhere"), { version: 1, projects: {} });

    expect(resolveLocalConfigPath(worktree, { [LOCAL_CONFIG_ENV]: passed })).toBe(passed);
  });

  it("ignores the environment in a main working tree", () => {
    const passed = writeLocal(join(parent, "elsewhere"), { version: 1, projects: {} });

    expect(resolveLocalConfigPath(root, { [LOCAL_CONFIG_ENV]: passed })).toBe(
      join(root, ".specdojo", "specdojo.local.config.json"),
    );
  });

  it("rejects a relative path in the environment", () => {
    const worktree = makeLinkedWorktree("task-1");

    expect(() =>
      resolveLocalConfigPath(worktree, { [LOCAL_CONFIG_ENV]: "specdojo.local.config.json" }),
    ).toThrow(/Invalid SPECDOJO_LOCAL_CONFIG="specdojo.local.config.json"/);
  });
});

describe("localConfigEnvironment", () => {
  it("passes the main tree's local config to a worktree child, and nothing without one", () => {
    const worktree = makeLinkedWorktree("task-1");
    expect(localConfigEnvironment(worktree, {})).toEqual({});

    const mainLocal = writeLocal(root, { version: 1, projects: {} });

    expect(localConfigEnvironment(worktree, {})).toEqual({ [LOCAL_CONFIG_ENV]: mainLocal });
    expect(worktreeBuildEnvironment(worktree)[LOCAL_CONFIG_ENV]).toBe(mainLocal);
  });
});

describe("formatConfigShow", () => {
  it("marks repositories that come from the local config", () => {
    const localPath = writeLocal(root, {
      version: 1,
      projects: {
        "prj-0001": {
          repos: [
            { name: "app1", path: "../app1-alt" },
            { name: "tools", path: "../tools" },
          ],
        },
      },
    });

    const output = formatConfigShow(loadConfig(root));

    expect(output).toBe(
      [
        `config: ${join(root, ".specdojo", "specdojo.config.json")}`,
        `local-config: ${localPath}`,
        "local-override: projects.prj-0001.repos[app1].path = ../app1-alt (local; shared: ../app1)",
        "local-override: projects.prj-0001.repos[tools] = ../tools (local; added)",
        "project: prj-0001",
        "  repo app1: ../app1-alt (local; shared: ../app1)",
        "  repo tools: ../tools (local; added)",
        "",
      ].join("\n"),
    );
  });
});

describe("local config records", () => {
  it("records local overrides in executor evidence that matches the schema", () => {
    const validate = buildValidator("docs/specdojo/schemas/v1/exec-evidence.schema.yaml");
    const { evidence } = buildExecutorEvidence({
      taskId: "prj-0001:PJR-NC9R",
      runId: "run-1",
      actor: "claude",
      status: "succeeded",
      startedAt: "2026-11-18T00:00:00Z",
      completedAt: "2026-11-18T00:01:00Z",
      exitCode: 0,
      attempts: 1,
      stdout: "",
      stderr: "",
      changes: [],
      diffStat: "",
      logRefPath: "executor.log",
      localConfigOverrides: [
        {
          project: "prj-0001",
          repo: "app1",
          kind: "path",
          path: "../app1-alt",
          shared_path: "../app1",
        },
        { project: "prj-0001", repo: "tools", kind: "added", path: "../tools" },
      ],
    });

    expect(evidence.local_config_overrides).toHaveLength(2);
    expect(validate(evidence), JSON.stringify(validate.errors)).toBe(true);
  });

  it("keeps the local config out of git through config init's defaults", () => {
    expect(DEFAULT_GITIGNORE_PATTERNS).toContain(".specdojo/specdojo.local.config.json");
  });
});
