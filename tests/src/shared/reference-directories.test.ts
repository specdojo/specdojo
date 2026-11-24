import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resolveOrchestratorLaunch } from "../../../src/commands/orchestrator.js";
import { resolveProductRepos } from "../../../src/exec/task-repos.js";
import { formatConfigShow, LOCAL_CONFIG_ENV } from "../../../src/shared/local-config.js";
import { resolveReferences } from "../../../src/shared/reference-directories.js";
import { loadConfig } from "../../../src/shared/specdojo-config.js";

let parent: string;
let root: string;
const originalCwd = process.cwd();
const originalLocalConfig = process.env[LOCAL_CONFIG_ENV];

function writeJson(path: string, value: unknown): void {
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, JSON.stringify(value));
}

function writeConfig(references: unknown, extra: Record<string, unknown> = {}): void {
  writeJson(join(root, ".specdojo/specdojo.config.json"), {
    version: 1,
    current_project: "local",
    projects: { local: {} },
    references,
    ...extra,
  });
}

beforeEach(() => {
  delete process.env[LOCAL_CONFIG_ENV];
  parent = mkdtempSync(join(tmpdir(), "specdojo-references-"));
  root = join(parent, "source");
  mkdirSync(join(root, ".git"), { recursive: true });
  for (const dir of ["reference", "alternate", "added", "product"]) mkdirSync(join(parent, dir));
  writeConfig({ library: { path: "../reference" } });
});

afterEach(() => {
  process.chdir(originalCwd);
  if (originalLocalConfig === undefined) delete process.env[LOCAL_CONFIG_ENV];
  else process.env[LOCAL_CONFIG_ENV] = originalLocalConfig;
  rmSync(parent, { recursive: true, force: true });
});

describe("read-only reference directories", () => {
  it("loads a directory without requiring a Git repository or SpecDojo project", () => {
    const result = loadConfig(root);
    expect(resolveReferences(root, result.config!)).toEqual([
      { alias: "library", path: "../reference", root: join(parent, "reference") },
    ]);
    expect(formatConfigShow(result)).toContain(
      `reference library: ../reference -> ${join(parent, "reference")} (read-only; shared)`,
    );
    expect(resolveProductRepos(root, result.config!.projects.local)).toEqual([]);
    expect(result.config!.external_projects).toBeUndefined();
  });

  it.each([
    [null, "references must be an object"],
    [[], "references must be an object"],
    [{ Bad_Name: { path: "../reference" } }, "alias must match"],
    [{ library: null }, "must be an object with path"],
    [{ library: { path: " " } }, "path must be a non-empty string"],
    [{ library: { path: 42 } }, "path must be a non-empty string"],
    [{ library: { path: "/absolute" } }, "path must be relative"],
    [{ library: { path: "C:\\absolute" } }, "path must be relative"],
    [{ library: { path: "../missing" } }, "does not exist"],
    [{ library: { path: "../reference", write: true } }, 'unknown key "write"'],
  ])("rejects invalid shared references %j", (references, message) => {
    writeConfig(references);
    expect(() => loadConfig(root)).toThrow(String(message));
  });

  it("rejects a file instead of a directory", () => {
    writeFileSync(join(parent, "file"), "reference");
    writeConfig({ library: { path: "../file" } });
    expect(() => loadConfig(root)).toThrow("is not a directory");
  });

  it("replaces paths and adds aliases locally, without mutating the shared file", () => {
    const configPath = join(root, ".specdojo/specdojo.config.json");
    const before = readFileSync(configPath, "utf8");
    writeJson(join(root, ".specdojo/specdojo.local.config.json"), {
      version: 1,
      references: { library: { path: "../alternate" }, extra: { path: "../added" } },
    });
    const result = loadConfig(root);
    expect(result.config!.references).toEqual({
      library: { path: "../alternate" },
      extra: { path: "../added" },
    });
    expect(result.localOverrides).toEqual([
      {
        reference: "library",
        kind: "reference-path",
        path: "../alternate",
        shared_path: "../reference",
      },
      { reference: "extra", kind: "reference-added", path: "../added" },
    ]);
    const output = formatConfigShow(result, "local");
    expect(output).toContain(
      `../alternate -> ${join(parent, "alternate")} (read-only; local; shared: ../reference)`,
    );
    expect(output).toContain(`../added -> ${join(parent, "added")} (read-only; local; added)`);
    expect(readFileSync(configPath, "utf8")).toBe(before);
  });

  it("validates only the effective path after local replacement", () => {
    writeConfig({ library: { path: "../not-on-this-machine" } });
    writeJson(join(root, ".specdojo/specdojo.local.config.json"), {
      version: 1,
      references: { library: { path: "../alternate" } },
    });
    expect(loadConfig(root).config!.references!.library.path).toBe("../alternate");
  });

  it.each([
    null,
    { library: null },
    { library: { path: 1 } },
    { library: { path: "../missing" } },
    { extra: { path: "../missing" } },
    { library: { path: "../reference", write: true } },
    { extra: { path: "../reference", write: true } },
    { Bad_Name: { path: "../reference" } },
  ])("rejects invalid local references %j and reports the local file", (references) => {
    const local = join(root, ".specdojo/specdojo.local.config.json");
    writeJson(local, { version: 1, references });
    expect(() => loadConfig(root)).toThrow(local);
  });

  it.each([".", "..", "../product", "../product/docs"])(
    "rejects overlap with writable repositories: %s",
    (path) => {
      mkdirSync(join(parent, "product/docs"));
      writeConfig(
        { library: { path } },
        {
          projects: { local: { repos: [{ name: "product", path: "../product" }] } },
        },
      );
      expect(() => loadConfig(root)).toThrow("overlaps writable repository");
    },
  );

  it("rejects overlap with an external project's repository, including symlinks", () => {
    symlinkSync(join(parent, "product"), join(parent, "alias"), "dir");
    writeConfig(
      { library: { path: "../alias" } },
      {
        external_projects: { customer: { path: "../product", project_id: "remote" } },
      },
    );
    expect(() => loadConfig(root)).toThrow("overlaps writable repository");
  });

  it("rejects a reference that contains the launch cwd when using a separate config root", () => {
    const cwd = join(parent, "reference");
    mkdirSync(join(cwd, ".git"));
    process.chdir(cwd);
    expect(() =>
      resolveOrchestratorLaunch({
        provider: "codex",
        providerArgs: [],
        env: { SPECDOJO_ORCHESTRATOR_CONFIG_ROOT: root },
      }),
    ).toThrow("overlaps writable repository");
  });

  it("uses main-checkout local overrides in a linked worktree for show and launch", () => {
    const worktree = join(parent, "worktrees/task/project");
    const gitdir = join(root, ".git/worktrees/task");
    mkdirSync(gitdir, { recursive: true });
    mkdirSync(worktree, { recursive: true });
    writeFileSync(join(worktree, ".git"), `gitdir: ${gitdir}\n`);
    writeJson(join(worktree, ".specdojo/specdojo.config.json"), {
      version: 1,
      projects: { local: {} },
      references: { library: { path: "../reference" } },
    });
    writeJson(join(root, ".specdojo/specdojo.local.config.json"), {
      version: 1,
      references: { library: { path: "../alternate" } },
    });
    // A worktree-local file must never supply the override.
    writeJson(join(worktree, ".specdojo/specdojo.local.config.json"), {
      version: 1,
      references: { library: { path: "../missing" } },
    });
    const result = loadConfig(worktree);
    expect(resolveReferences(worktree, result.config!)[0].root).toBe(join(parent, "alternate"));
    expect(formatConfigShow(result)).toContain(`-> ${join(parent, "alternate")}`);
    process.chdir(worktree);
    const launch = resolveOrchestratorLaunch({
      provider: "claude",
      providerArgs: [],
      project: "local",
    });
    expect(launch.cwd).toBe(worktree);
    expect(launch.args).toEqual([
      "--add-dir",
      join(parent, "alternate"),
      "--disallowedTools",
      `Edit(/${join(parent, "alternate")}/**)`,
    ]);
  });
});
