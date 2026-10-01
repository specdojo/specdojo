import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getProjectRepos,
  loadConfig,
  resolveRepoQualifiedPath,
  resolveRepoQualifiedRef,
  validateProjectRepos,
} from "../../src/specdojo-config.js";
import type { SpecDojoProjectConfig } from "../../src/specdojo-config.js";

const originalCwd = process.cwd();
let root: string;

beforeEach(() => {
  // <tmp>/app1-specdojo is the SpecDojo root; <tmp>/app1 is the product repository beside it.
  const parent = mkdtempSync(join(tmpdir(), "specdojo-config-repos-"));
  root = join(parent, "app1-specdojo");
  mkdirSync(join(root, ".git"), { recursive: true });
  mkdirSync(join(parent, "app1"));
  writeFileSync(join(parent, "README.md"), "not a directory\n", "utf8");
});

afterEach(() => {
  process.chdir(originalCwd);
  try {
    rmSync(resolve(root, ".."), { recursive: true, force: true });
  } finally {
    root = "";
  }
});

function writeConfig(projects: Record<string, unknown>): void {
  mkdirSync(join(root, ".specdojo"), { recursive: true });
  writeFileSync(
    join(root, ".specdojo", "specdojo.config.json"),
    JSON.stringify({ version: 1, current_project: "prj-0001", projects }, null, 2),
    "utf8",
  );
}

function withRepos(repos: unknown): SpecDojoProjectConfig {
  return { base_path: "docs/ja/projects/prj-0001", repos } as SpecDojoProjectConfig;
}

describe("validateProjectRepos", () => {
  it("accepts a fully specified repository whose path exists", () => {
    const project = withRepos([
      {
        name: "app1",
        path: "../app1",
        integration_branch: "main",
        setup: { install: true, build: false },
      },
    ]);

    expect(validateProjectRepos("prj-0001", project, ["prj-0001"], root)).toEqual([]);
  });

  it("returns no errors when repos is omitted", () => {
    expect(validateProjectRepos("prj-0001", {}, ["prj-0001"], root)).toEqual([]);
  });

  it("rejects a name outside [a-z0-9-] and names the offending entry", () => {
    const errors = validateProjectRepos(
      "prj-0001",
      withRepos([{ name: "App_1", path: "../app1" }]),
      ["prj-0001"],
      root,
    );

    expect(errors).toEqual([
      'projects.prj-0001.repos[0].name must match /^[a-z0-9-]+$/ (got "App_1")',
    ]);
  });

  it("rejects a repository name equal to a project id", () => {
    const errors = validateProjectRepos(
      "prj-0001",
      withRepos([{ name: "prj-0002", path: "../app1" }]),
      ["prj-0001", "prj-0002"],
      root,
    );

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(
      /^projects\.prj-0001\.repos\[0\]\.name "prj-0002" collides with project id "prj-0002"/,
    );
  });

  it("rejects a duplicated name and points at the first declaration", () => {
    const errors = validateProjectRepos(
      "prj-0001",
      withRepos([
        { name: "app1", path: "../app1" },
        { name: "app1", path: "../app1" },
      ]),
      ["prj-0001"],
      root,
    );

    expect(errors).toEqual([
      'projects.prj-0001.repos[1].name "app1" duplicates projects.prj-0001.repos[0].name',
    ]);
  });

  it("rejects a path that does not exist and shows where it was resolved", () => {
    const errors = validateProjectRepos(
      "prj-0001",
      withRepos([{ name: "app2", path: "../app2" }]),
      ["prj-0001"],
      root,
    );

    expect(errors).toEqual([
      `projects.prj-0001.repos[0].path "../app2" does not exist (resolved to ${resolve(root, "../app2")})`,
    ]);
  });

  it("rejects a path that points at a file instead of a directory", () => {
    const errors = validateProjectRepos(
      "prj-0001",
      withRepos([{ name: "app1", path: "../README.md" }]),
      ["prj-0001"],
      root,
    );

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/repos\[0\]\.path "\.\.\/README\.md" is not a directory/);
  });

  it("rejects an absolute path because paths are relative to the SpecDojo root", () => {
    const errors = validateProjectRepos(
      "prj-0001",
      withRepos([{ name: "app1", path: resolve(root, "../app1") }]),
      ["prj-0001"],
      root,
    );

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/repos\[0\]\.path must be relative to the SpecDojo root/);
  });

  it("rejects unknown keys and non-boolean setup flags", () => {
    const errors = validateProjectRepos(
      "prj-0001",
      withRepos([
        {
          name: "app1",
          path: "../app1",
          branch: "main",
          integration_branch: "",
          setup: { install: "yes", lint: true },
        },
      ]),
      ["prj-0001"],
      root,
    );

    expect(errors).toEqual([
      'projects.prj-0001.repos[0]: unknown key "branch"',
      "projects.prj-0001.repos[0].integration_branch must be a non-empty string when present",
      "projects.prj-0001.repos[0].setup.install must be a boolean",
      'projects.prj-0001.repos[0].setup: unknown key "lint"',
    ]);
  });

  it("rejects repos that is not an array", () => {
    expect(
      validateProjectRepos("prj-0001", withRepos({ app1: "../app1" }), ["prj-0001"], root),
    ).toEqual(["projects.prj-0001.repos must be an array"]);
  });
});

describe("resolveRepoQualifiedRef", () => {
  const repos = [{ name: "app1" }, { name: "web-ui" }];

  it("resolves a declared repository prefix to that repository's path", () => {
    expect(resolveRepoQualifiedRef("app1:src/auth/token.ts", repos)).toEqual({
      kind: "repo",
      repo: "app1",
      path: "src/auth/token.ts",
    });
    expect(resolveRepoQualifiedRef("web-ui:docs/", repos)).toEqual({
      kind: "repo",
      repo: "web-ui",
      path: "docs",
    });
  });

  it("treats a project-qualified doc id as a doc id", () => {
    expect(resolveRepoQualifiedRef("prj-0001:pjr-index", repos)).toEqual({
      kind: "project",
      value: "prj-0001:pjr-index",
    });
  });

  it("keeps un-prefixed values unchanged for the project repository", () => {
    expect(resolveRepoQualifiedRef("ifx-cmd", repos)).toEqual({
      kind: "project",
      value: "ifx-cmd",
    });
    expect(resolveRepoQualifiedRef("docs/ja/index.md", repos)).toEqual({
      kind: "project",
      value: "docs/ja/index.md",
    });
  });

  it("treats every value as project-scoped when no repository is declared", () => {
    expect(resolveRepoQualifiedRef("app1:src/main.ts", [])).toEqual({
      kind: "project",
      value: "app1:src/main.ts",
    });
  });

  it("rejects an empty path after a declared prefix", () => {
    expect(() => resolveRepoQualifiedRef("app1:", repos)).toThrow(
      /Invalid repository path "app1:": the path after "app1:" is empty/,
    );
  });

  it("rejects absolute and escaping paths", () => {
    expect(() => resolveRepoQualifiedRef("app1:/etc/passwd", repos)).toThrow(
      /must be relative to repository "app1"/,
    );
    expect(() => resolveRepoQualifiedRef("app1:src/../../secret", repos)).toThrow(
      /escapes repository "app1"/,
    );
  });
});

describe("resolveRepoQualifiedPath", () => {
  it("returns the absolute path inside the declared repository", () => {
    const project = withRepos([{ name: "app1", path: "../app1" }]);

    expect(resolveRepoQualifiedPath(root, project, "app1:src/main.ts")).toEqual({
      repo: "app1",
      path: "src/main.ts",
      absolutePath: resolve(root, "../app1/src/main.ts"),
    });
  });

  it("returns null for a doc id so callers keep their current handling", () => {
    const project = withRepos([{ name: "app1", path: "../app1" }]);

    expect(resolveRepoQualifiedPath(root, project, "prj-0001:pjr-index")).toBeNull();
    expect(resolveRepoQualifiedPath(root, {}, "app1:src/main.ts")).toBeNull();
  });
});

describe("loadConfig with repos", () => {
  it("loads a project without repos exactly as before", () => {
    const project = {
      base_path: "docs/ja/projects/prj-0001",
      project_register_path: "controls/project-register",
      project_context: ["prj-overview"],
      run: { worktree_base: "../app1-worktrees" },
    };
    writeConfig({ "prj-0001": project });
    process.chdir(root);

    const { config } = loadConfig();

    const loaded = config?.projects["prj-0001"];
    expect(loaded).toEqual(project);
    expect(getProjectRepos(loaded ?? {})).toEqual([]);
  });

  it("loads declared repositories", () => {
    writeConfig({
      "prj-0001": { repos: [{ name: "app1", path: "../app1", integration_branch: "main" }] },
    });
    process.chdir(root);

    const { config } = loadConfig();

    expect(getProjectRepos(config?.projects["prj-0001"] ?? {})).toEqual([
      { name: "app1", path: "../app1", integration_branch: "main" },
    ]);
  });

  it("reports every invalid repository across projects with the config path", () => {
    writeConfig({
      "prj-0001": { repos: [{ name: "prj-0002", path: "../app1" }] },
      "prj-0002": { repos: [{ name: "app9", path: "../app9" }] },
    });
    process.chdir(root);

    let message = "";
    try {
      loadConfig();
    } catch (error) {
      message = error instanceof Error ? error.message : String(error);
    }

    expect(message).toContain("specdojo.config.json");
    expect(message).toContain(
      'projects.prj-0001.repos[0].name "prj-0002" collides with project id "prj-0002"',
    );
    expect(message).toContain('projects.prj-0002.repos[0].path "../app9" does not exist');
  });
});
