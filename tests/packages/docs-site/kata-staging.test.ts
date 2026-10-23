import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  KATA_STAGING_DIR_NAME,
  stageBundledKata,
} from "../../../packages/docs-site/.vitepress/kata-staging.js";

describe("docs-site kata staging", () => {
  const originalPackageRoot = process.env.SPECDOJO_PACKAGE_ROOT;
  let root: string | undefined;

  afterEach(() => {
    if (originalPackageRoot === undefined) delete process.env.SPECDOJO_PACKAGE_ROOT;
    else process.env.SPECDOJO_PACKAGE_ROOT = originalPackageRoot;
    if (root) rmSync(root, { recursive: true, force: true });
    root = undefined;
  });

  it("core の直下文書だけをステージし authority サブディレクトリを除外する", () => {
    root = mkdtempSync(join(tmpdir(), "specdojo-kata-staging-"));
    const workspaceRoot = join(root, "workspace");
    const packageRoot = join(root, "package");
    const corePath = "docs/ja/specdojo/rulebooks/core-rulebook.md";
    const userPath = "docs/ja/specdojo/rulebooks/customer/user-rulebook.md";
    mkdirSync(join(workspaceRoot, ".specdojo"), { recursive: true });
    for (const relativePath of [corePath, userPath]) {
      const absolutePath = join(packageRoot, relativePath);
      mkdirSync(join(absolutePath, ".."), { recursive: true });
      writeFileSync(absolutePath, relativePath, "utf8");
    }
    process.env.SPECDOJO_PACKAGE_ROOT = packageRoot;

    const result = stageBundledKata(workspaceRoot);

    expect(result.staged).toBe(1);
    expect(existsSync(join(workspaceRoot, KATA_STAGING_DIR_NAME, corePath))).toBe(true);
    expect(existsSync(join(workspaceRoot, KATA_STAGING_DIR_NAME, userPath))).toBe(false);
  });
});
