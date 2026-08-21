import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  captureAgentProtectedConfigSnapshot,
  changedAgentProtectedConfigPaths,
  isAgentProtectedConfigPath,
} from "../../src/exec-agent-protected-config.js";

const roots: string[] = [];

function write(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
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

  it.each(["package-lock.json", "docs/package.json", ".github/CODEOWNERS", "src/config.ts"])(
    "does not overmatch %s",
    (path) => {
      expect(isAgentProtectedConfigPath(path)).toBe(false);
    },
  );

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
});
