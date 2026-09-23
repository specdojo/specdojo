import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { gitEnvironment } from "../../src/exec-worktree.js";
import {
  agentProtectedConfigPaths,
  captureAgentProtectedConfigSnapshot,
  changedAgentProtectedConfigPaths,
  describeAgentProtectedConfigChanges,
  isAgentProtectedConfigPath,
} from "../../src/exec-agent-protected-config.js";

const roots: string[] = [];

function write(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function initRepository(root: string): void {
  // git hook 経由でテストが動くと GIT_DIR が linked worktree の gitdir を指す。その環境で
  // `git init` すると、cwd の一時ディレクトリではなく GIT_DIR 側が bare として再初期化され、
  // 共有されているメインリポジトリの config へ core.bare=true が書き込まれてしまう。
  // gitEnvironment() は GIT_DIR / GIT_WORK_TREE を除去するため、必ず経由する。
  const env = gitEnvironment();
  execFileSync("git", ["init"], { cwd: root, stdio: "ignore", env });
}

afterEach(() => {
  while (roots.length > 0) rmSync(roots.pop()!, { recursive: true, force: true });
});

describe("agent protected configuration paths", () => {
  it.each([
    "package.json",
    "lefthook.yml",
    ".specdojo/exec-defaults.yaml",
    ".specdojo/claude/settings.edit.json",
    ".agents/rules/markdown.md",
    ".agents/skills/example/SKILL.md",
    ".claude/agents/executor.md",
    ".codex/agents/executor.toml",
    ".opencode/agents/executor.md",
    ".github/agents/executor.md",
    "AGENTS.md",
    "CLAUDE.md",
    "GEMINI.md",
    "commitlint.config.cjs",
    ".commitlintrc.yaml",
    ".github/workflows/ci.yml",
    ".gitlab-ci.yml",
    ".circleci/config.yml",
    "azure-pipelines.yml",
    "Jenkinsfile",
  ])("protects %s with one provider-independent definition", (path) => {
    expect(isAgentProtectedConfigPath(path)).toBe(true);
  });

  it.each([
    "package-lock.json",
    "docs/package.json",
    ".agents/specdojo-orchestrator.agent.md",
    ".github/CODEOWNERS",
    "src/config.ts",
  ])("does not overmatch %s", (path) => {
    expect(isAgentProtectedConfigPath(path)).toBe(false);
  });

  it("reports only changes made after the agent baseline", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-protected-config-"));
    roots.push(root);
    write(join(root, "package.json"), '{"scripts":{"test":"before"}}\n');
    write(join(root, ".specdojo", "exec-defaults.yaml"), "providers: {}\n");

    const before = captureAgentProtectedConfigSnapshot(root);
    expect(changedAgentProtectedConfigPaths(root, before)).toEqual([]);

    write(join(root, "package.json"), '{"scripts":{"test":"after"}}\n');
    write(join(root, ".github", "workflows", "ci.yml"), "jobs: {}\n");

    expect(changedAgentProtectedConfigPaths(root, before)).toEqual([
      ".github/workflows/ci.yml",
      "package.json",
    ]);
  });

  it("detects changes and additions under agent instruction directories", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-protected-config-"));
    roots.push(root);
    write(join(root, "AGENTS.md"), "# Before\n");
    write(join(root, ".agents", "rules", "existing.md"), "before\n");

    const before = captureAgentProtectedConfigSnapshot(root);
    write(join(root, "AGENTS.md"), "# After\n");
    write(join(root, ".agents", "rules", "existing.md"), "after\n");
    write(join(root, ".codex", "agents", "new.toml"), 'name = "new"\n');

    expect(changedAgentProtectedConfigPaths(root, before)).toEqual([
      ".agents/rules/existing.md",
      ".codex/agents/new.toml",
      "AGENTS.md",
    ]);
  });

  it("ignores gitignored generated files under a protected directory", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-protected-config-"));
    roots.push(root);
    initRepository(root);
    write(join(root, ".gitignore"), ".specdojo/doc-index.json\n");
    write(join(root, ".specdojo", "exec-defaults.yaml"), "providers: {}\n");
    write(join(root, ".specdojo", "doc-index.json"), '{"entries":[]}\n');

    const before = captureAgentProtectedConfigSnapshot(root);
    // agent が共通規約どおり index build を実行して生成物を書き換えても違反にしない。
    write(join(root, ".specdojo", "doc-index.json"), '{"entries":[{"id":"a"}]}\n');

    expect(changedAgentProtectedConfigPaths(root, before)).toEqual([]);
  });

  it("excludes a known generated path even when it is already tracked", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-protected-config-"));
    roots.push(root);
    initRepository(root);
    write(join(root, ".gitignore"), ".specdojo/doc-index.json\n.specdojo/*.yaml\n");
    write(join(root, ".specdojo", "doc-index.json"), '{"entries":[]}\n');
    execFileSync("git", ["add", ".gitignore"], {
      cwd: root,
      stdio: "ignore",
      env: gitEnvironment(),
    });
    execFileSync("git", ["add", "--force", ".specdojo/doc-index.json"], {
      cwd: root,
      stdio: "ignore",
      env: gitEnvironment(),
    });

    expect(
      agentProtectedConfigPaths(root, [".specdojo/doc-index.json", ".specdojo/exec-defaults.yaml"]),
    ).toEqual([".specdojo/exec-defaults.yaml"]);
  });

  it("still protects an untracked config file that is not gitignored", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-protected-config-"));
    roots.push(root);
    initRepository(root);
    write(join(root, ".gitignore"), ".specdojo/doc-index.json\n");
    write(join(root, ".specdojo", "exec-defaults.yaml"), "providers: {}\n");

    const before = captureAgentProtectedConfigSnapshot(root);
    // 未追跡でも ignore されていない新規の設定ファイルは、すり抜けを防ぐため保護対象に残す。
    write(join(root, ".specdojo", "claude", "settings.report.json"), "{}\n");

    expect(changedAgentProtectedConfigPaths(root, before)).toEqual([
      ".specdojo/claude/settings.report.json",
    ]);
  });

  it("protects every candidate when the directory is not a Git repository", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-protected-config-"));
    roots.push(root);
    write(join(root, ".specdojo", "doc-index.json"), '{"entries":[]}\n');

    const before = captureAgentProtectedConfigSnapshot(root);
    write(join(root, ".specdojo", "doc-index.json"), '{"entries":[{"id":"a"}]}\n');

    expect(changedAgentProtectedConfigPaths(root, before)).toEqual([".specdojo/doc-index.json"]);
  });

  it("records a git failure reason without copying the whole file", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-protected-config-"));
    roots.push(root);
    write(join(root, "package.json"), '{"private":"full-content-must-not-be-copied"}\n');

    const description = describeAgentProtectedConfigChanges(root, ["package.json"]);

    expect(description).toContain("差分を取得できませんでした（git status:");
    expect(description).toContain("not a git repository");
    expect(description).not.toContain("full-content-must-not-be-copied");
  });
});
