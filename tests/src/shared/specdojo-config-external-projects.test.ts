import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  loadConfig,
  requireExternalProjectRoot,
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
  vi.restoreAllMocks();
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
  it.each(["", "   ", null, 42])("rejects an invalid path %j", (path) => {
    expect(
      validateExternalProjects({ customer: { path, project_id: "prj-target" } }, [], root),
    ).toContain("external_projects.customer.path must be a non-empty string");
  });

  it("rejects a path pointing to a file", () => {
    writeFileSync(join(parent, "file"), "not a directory");
    expect(
      validateExternalProjects(
        { customer: { path: "../file", project_id: "prj-target" } },
        [],
        root,
      ),
    ).toEqual([
      `external_projects.customer.path "../file" is not a directory (resolved to ${join(parent, "file")})`,
    ]);
  });

  it("accepts an alias with a relative repository path and target project id", () => {
    expect(
      validateExternalProjects(
        { customer: { path: "../target", project_id: "prj-target" } },
        ["prj-local"],
        root,
      ),
    ).toEqual([]);
  });

  it("accepts an http(s) source_url for resolving wikilinks on the docs site", () => {
    expect(
      validateExternalProjects(
        {
          customer: {
            path: "../target",
            project_id: "prj-target",
            source_url: "https://github.com/example/target/blob/main",
          },
        },
        ["prj-local"],
        root,
      ),
    ).toEqual([]);
  });

  it("rejects a source_url that is not an http(s) URL", () => {
    expect(
      validateExternalProjects(
        { customer: { path: "../target", project_id: "prj-target", source_url: "../target" } },
        ["prj-local"],
        root,
      ),
    ).toEqual(["external_projects.customer.source_url must be an http(s) URL without spaces"]);
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
  it("loads a missing repository and warns on stderr only once across repeated loads", () => {
    const external = { customer: { path: "../missing", project_id: "prj-target" } };
    writeConfig(external);
    const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);

    expect(loadConfig(root).config?.external_projects).toEqual(external);
    expect(loadConfig(root).config?.external_projects).toEqual(external);

    expect(stderr).toHaveBeenCalledExactlyOnceWith(
      `WARN: external_projects.customer.path "../missing" does not exist ` +
        `(project_id "prj-target", resolved to ${join(parent, "missing")}). ` +
        "Operations using this external project will fail.\n",
    );
  });

  it("validates and warns after applying local path overrides and local-only aliases", () => {
    writeConfig({ customer: { path: "../missing", project_id: "prj-target" } });
    writeFileSync(
      join(root, ".specdojo/specdojo.local.config.json"),
      JSON.stringify({
        version: 1,
        external_projects: {
          customer: { path: "../target" },
          other: { path: "../other-missing", project_id: "prj-other" },
        },
      }),
    );
    const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);
    const { config } = loadConfig(root);

    expect(config?.external_projects).toEqual({
      customer: { path: "../target", project_id: "prj-target" },
      other: { path: "../other-missing", project_id: "prj-other" },
    });
    expect(stderr).toHaveBeenCalledTimes(1);
    expect(stderr.mock.calls[0]?.[0]).toContain("external_projects.other.path");
  });

  it("still rejects a local override that points to a file", () => {
    writeConfig({ customer: { path: "../missing", project_id: "prj-target" } });
    writeFileSync(join(parent, "file"), "not a directory");
    writeFileSync(
      join(root, ".specdojo/specdojo.local.config.json"),
      JSON.stringify({ version: 1, external_projects: { customer: { path: "../file" } } }),
    );

    expect(() => loadConfig(root)).toThrow(
      'external_projects.customer.path "../file" is not a directory',
    );
  });

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

  it("allows a missing target in config but rejects its use relative to the main worktree", () => {
    const worktree = linkWorktree();

    const errors = validateExternalProjects(
      { customer: { path: "../missing", project_id: "prj-target" } },
      ["prj-local"],
      worktree,
    );

    expect(errors).toEqual([]);
    expect(() =>
      requireExternalProjectRoot(worktree, "customer", {
        path: "../missing",
        project_id: "prj-target",
      }),
    ).toThrow(
      `external_projects.customer.path "../missing" does not exist ` +
        `(project_id "prj-target", resolved to ${join(parent, "missing")})`,
    );
    expect(() =>
      resolveExternalProjects(worktree, {
        external_projects: { customer: { path: "../missing", project_id: "prj-target" } },
      }),
    ).toThrow("external_projects.customer.path");
  });
});
