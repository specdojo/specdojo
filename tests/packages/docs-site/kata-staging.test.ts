import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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
    expect(result.stagingRoot).toBe(join(workspaceRoot, ".vitepress/kata-staging"));
    expect(existsSync(join(workspaceRoot, "specdojo-kata-staging"))).toBe(false);
  });

  it("利用側 docs と同梱文書を重ね、eject・編集・削除・再起動を反映する", () => {
    root = mkdtempSync(join(tmpdir(), "specdojo-kata-staging-"));
    const workspace = join(root, "workspace");
    const bundled = join(root, "package");
    const relative = "docs/ja/specdojo/rulebooks/core-rulebook.md";
    const local = join(workspace, relative);
    const project = join(workspace, "docs/ja/projects/example.md");
    for (const directory of [
      join(local, ".."),
      join(project, ".."),
      join(bundled, relative, ".."),
    ]) {
      mkdirSync(directory, { recursive: true });
    }
    writeFileSync(join(bundled, relative), "bundled");
    writeFileSync(local, "ejected");
    writeFileSync(project, "project");
    process.env.SPECDOJO_PACKAGE_ROOT = bundled;

    const result = stageBundledKata(workspace);
    const staged = join(result.stagingRoot, relative);
    expect(result.ejected).toBe(1);
    expect(readFileSync(staged, "utf8")).toBe("ejected");
    expect(readFileSync(join(result.stagingRoot, "docs/ja/projects/example.md"), "utf8")).toBe(
      "project",
    );
    expect(readFileSync(join(result.stagingRoot, ".gitignore"), "utf8")).toContain("\n*\n");

    writeFileSync(local, "edited");
    result.syncFile(local);
    expect(readFileSync(staged, "utf8")).toBe("edited");
    rmSync(local);
    result.syncFile(local);
    expect(readFileSync(staged, "utf8")).toBe("bundled");
    writeFileSync(local, "ejected again");
    result.syncFile(local);
    expect(readFileSync(staged, "utf8")).toBe("ejected again");

    rmSync(project);
    result.syncFile(project);
    expect(existsSync(join(result.stagingRoot, "docs/ja/projects/example.md"))).toBe(false);
    writeFileSync(join(result.stagingRoot, "obsolete.md"), "old");
    stageBundledKata(workspace);
    expect(existsSync(join(result.stagingRoot, "obsolete.md"))).toBe(false);
    expect(readFileSync(local, "utf8")).toBe("ejected again");
  });

  it("同梱 package がない workspace も docs だけを閲覧用ツリーに置く", () => {
    root = mkdtempSync(join(tmpdir(), "specdojo-kata-staging-"));
    mkdirSync(join(root, "docs"));
    writeFileSync(join(root, "docs/index.md"), "# local");
    writeFileSync(join(root, "README.md"), "not a page");
    process.env.SPECDOJO_PACKAGE_ROOT = root;

    const result = stageBundledKata(root);
    expect(result.packageRoot).toBeUndefined();
    expect(readFileSync(join(result.stagingRoot, "docs/index.md"), "utf8")).toBe("# local");
    expect(existsSync(join(result.stagingRoot, "README.md"))).toBe(false);
  });
});
