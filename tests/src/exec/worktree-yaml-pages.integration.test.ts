import { execFileSync, spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildYamlPages } from "../../../src/docs/yaml-pages.js";
import type { ExecDefaultsConfig } from "../../../src/exec/agent-config.js";
import type { ParentValidationDefinition } from "../../../src/exec/parent-validation.js";
import { failedParentValidationReason } from "../../../src/exec/parent-validation.js";
import { runConfiguredParentValidationBatch } from "../../../src/exec/run/agent.js";
import {
  refreshWorktreeYamlPages,
  staleYamlPageSources,
} from "../../../src/exec/worktree-yaml-pages.js";
import { gitEnvironment } from "../../../src/shared/git-environment.js";

const repoRoot = resolve(__dirname, "../../..");
const yamlPath = "docs/ja/product/ifx-index.yaml";
const pagePath = "docs/ja/product/generated/ifx-index.md";

function git(cwd: string, args: string[]): void {
  execFileSync("git", args, { cwd, env: gitEnvironment(), stdio: "pipe" });
}

// worktree の準備（依存の install の直後の build）と同じく、表示のページを作った状態を用意する。
function prepareWorktree(root: string): void {
  git(root, ["init", "--quiet"]);
  mkdirSync(join(root, ".specdojo"), { recursive: true });
  writeFileSync(join(root, ".specdojo", "specdojo.config.json"), "{}\n", "utf8");
  writeFileSync(join(root, ".gitignore"), "generated/\n/packages/\n", "utf8");
  copyFileSync(join(repoRoot, ".markdownlint.yaml"), join(root, ".markdownlint.yaml"));
  mkdirSync(join(root, "packages"), { recursive: true });
  symlinkSync(join(repoRoot, "packages", "docs-lint"), join(root, "packages", "docs-lint"));
  mkdirSync(join(root, "docs", "ja", "product"), { recursive: true });
  copyFileSync(
    join(repoRoot, "docs/ja/specdojo/samples/ifx-index-sample.yaml"),
    join(root, yamlPath),
  );
  git(root, ["add", "-A"]);
  git(root, ["commit", "--quiet", "--no-verify", "-m", "init"]);
  buildYamlPages(join(root, "docs"), root);
  // 後で YAML を変えたことが時刻で分かるよう、ページを作った時刻を少し前にする。
  const checkedOut = new Date(Date.now() - 10_000);
  const generated = new Date(Date.now() - 5_000);
  utimesSync(join(root, yamlPath), checkedOut, checkedOut);
  utimesSync(join(root, pagePath), generated, generated);
}

// RS2P と同じ壊れ方: YAML のコメントを `# #` にすると、表示のページに H1 が増える。
function breakYamlComment(root: string): void {
  const source = join(root, yamlPath);
  const content = readFileSync(source, "utf8").replace(/^(\s*)# /m, "$1# # ");
  writeFileSync(source, content, "utf8");
}

// 親の検証の lint-md-changed を、作業中のリポジトリの tools/lint-changed.mjs で流す。
async function invokeLintChanged(definition: ParentValidationDefinition, cwd: string) {
  const result = spawnSync(
    process.execPath,
    [
      join(repoRoot, "tools", "lint-changed.mjs"),
      definition.id === "lint-md-changed" ? "md" : "fm",
    ],
    { cwd, env: gitEnvironment(), encoding: "utf8" },
  );
  return { exitCode: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe("YAML display pages before parent validations", () => {
  let root: string;
  const builds: string[] = [];
  const execDefaults: ExecDefaultsConfig = {
    pipeline: { parent_validations: ["lint-md-changed"] },
  };
  const refreshYamlPages = (path: string) =>
    refreshWorktreeYamlPages(path, {
      build: (worktreePath) => {
        builds.push(worktreePath);
        buildYamlPages(join(worktreePath, "docs"), worktreePath);
        return { exitCode: 0, output: "" };
      },
    });

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "specdojo-yaml-pages-refresh-"));
    builds.length = 0;
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    rmSync(root, { recursive: true, force: true });
  });

  it(
    "rebuilds the page of a broken YAML and stops the run at lint-md-changed",
    { timeout: 60_000 },
    async () => {
      prepareWorktree(root);
      breakYamlComment(root);

      const batch = await runConfiguredParentValidationBatch(execDefaults, root, {
        label: "PJR-AAAA",
        refreshYamlPages,
        invoke: invokeLintChanged,
      });

      expect(builds).toEqual([root]);
      expect(readFileSync(join(root, pagePath), "utf8")).toContain("\n# # yaml-language-server");
      expect(batch.validations.map((validation) => validation.status)).toEqual(["failed"]);
      const output = batch.failureOutputs
        .map((failure) => failure.stdout + failure.stderr)
        .join("");
      expect(output).toContain(`${pagePath}:`);
      expect(output).toContain("MD025");
      expect(failedParentValidationReason(batch.validations)).toBe(
        "parent validation failed: lint-md-changed",
      );
    },
  );

  it(
    "does not rebuild the pages when the run leaves YAML unchanged",
    { timeout: 60_000 },
    async () => {
      prepareWorktree(root);
      writeFileSync(join(root, "docs", "ja", "product", "readme.md"), "# Readme\n", "utf8");

      const batch = await runConfiguredParentValidationBatch(execDefaults, root, {
        label: "PJR-BBBB",
        refreshYamlPages,
        invoke: invokeLintChanged,
      });

      expect(builds).toEqual([]);
      expect(batch.validations.map((validation) => validation.status)).toEqual(["passed"]);
    },
  );

  it("finds YAML changed by a merged commit after the pages were generated", () => {
    prepareWorktree(root);
    breakYamlComment(root);
    git(root, ["commit", "--quiet", "--no-verify", "-am", "merge integration target"]);

    expect(staleYamlPageSources(root)).toEqual([yamlPath]);
    expect(refreshYamlPages(root)).toEqual({ status: "rebuilt", sources: [yamlPath] });
    expect(staleYamlPageSources(root)).toEqual([]);
  });
});
