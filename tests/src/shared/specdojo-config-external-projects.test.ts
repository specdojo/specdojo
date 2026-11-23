import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  loadConfig,
  resolveExternalProjects,
  validateExternalProjects,
} from "../../../src/shared/specdojo-config.js";

const originalCwd = process.cwd();
let parent: string;
let root: string;

beforeEach(() => {
  parent = mkdtempSync(join(tmpdir(), "specdojo-external-projects-"));
  root = join(parent, "source");
  mkdirSync(join(root, ".specdojo"), { recursive: true });
  mkdirSync(join(parent, "target"));
});

afterEach(() => {
  process.chdir(originalCwd);
  rmSync(parent, { recursive: true, force: true });
});

function writeConfig(externalProjects: unknown): void {
  writeFileSync(
    join(root, ".specdojo/specdojo.config.json"),
    JSON.stringify({
      version: 1,
      current_project: "prj-local",
      projects: { "prj-local": {} },
      external_projects: externalProjects,
    }),
  );
}

describe("validateExternalProjects", () => {
  it("accepts an alias with a relative repository path and target project id", () => {
    expect(
      validateExternalProjects(
        { customer: { path: "../target", project_id: "prj-target" } },
        ["prj-local"],
        root,
      ),
    ).toEqual([]);
  });

  it("rejects an alias that collides with a local project id", () => {
    expect(
      validateExternalProjects(
        { "prj-local": { path: "../target", project_id: "prj-target" } },
        ["prj-local"],
        root,
      ),
    ).toContain('external_projects.prj-local collides with local project id "prj-local"');
  });

  it("rejects invalid aliases, paths, project ids, and unknown keys together", () => {
    const errors = validateExternalProjects(
      {
        Customer_A: {
          path: resolve(parent, "target"),
          project_id: "",
          branch: "main",
        },
      },
      ["prj-local"],
      root,
    );

    expect(errors).toContain('external project alias "Customer_A" must match /^[a-z0-9-]+$/');
    expect(errors).toContain('external_projects.Customer_A: unknown key "branch"');
    expect(errors).toContain(
      `external_projects.Customer_A.path must be relative to the SpecDojo root (got absolute "${resolve(parent, "target")}")`,
    );
    expect(errors).toContain("external_projects.Customer_A.project_id must be a non-empty string");
  });
});

describe("loadConfig with external_projects", () => {
  it("loads and resolves external project declarations", () => {
    writeConfig({ customer: { path: "../target", project_id: "prj-target" } });
    process.chdir(root);

    const { config } = loadConfig();

    expect(resolveExternalProjects(root, config ?? { external_projects: {} })).toEqual([
      {
        alias: "customer",
        path: "../target",
        project_id: "prj-target",
        repoRoot: join(parent, "target"),
      },
    ]);
  });

  it("reports alias collisions while loading the configuration", () => {
    writeConfig({ "prj-local": { path: "../target", project_id: "prj-target" } });
    process.chdir(root);

    expect(() => loadConfig()).toThrow(
      'external_projects.prj-local collides with local project id "prj-local"',
    );
  });
});

function linkWorktree(): string {
  const worktree = join(parent, "worktrees", "task", "project");
  const gitdir = join(root, ".git", "worktrees", "task");
  mkdirSync(worktree, { recursive: true });
  mkdirSync(gitdir, { recursive: true });
  writeFileSync(join(worktree, ".git"), `gitdir: ${gitdir}\n`, "utf8");
  return worktree;
}

describe("external_projects in a linked worktree", () => {
  it("resolves path from the main working tree root instead of the worktree", () => {
    const worktree = linkWorktree();
    const external = { customer: { path: "../target", project_id: "prj-target" } };

    const errors = validateExternalProjects(external, ["prj-local"], worktree);
    const resolved = resolveExternalProjects(worktree, { external_projects: external });

    expect(errors).toEqual([]);
    expect(resolved[0]?.repoRoot).toBe(join(parent, "target"));
  });

  it("still reports a missing target when the main working tree has none", () => {
    const worktree = linkWorktree();

    const errors = validateExternalProjects(
      { customer: { path: "../missing", project_id: "prj-target" } },
      ["prj-local"],
      worktree,
    );

    expect(errors[0]).toContain(`does not exist (resolved to ${join(parent, "missing")})`);
  });
});
