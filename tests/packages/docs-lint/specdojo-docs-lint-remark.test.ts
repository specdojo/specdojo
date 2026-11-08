import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const tempFiles: string[] = [];
afterEach(() => {
  for (const file of tempFiles.splice(0)) {
    rmSync(file, { force: true });
  }
});

describe("specdojo-docs-lint remark with .remarkignore", () => {
  it("silently ignores files matching .remarkignore under generated directories", () => {
    const dummyPath = resolve(
      "docs/ja/projects/prj-0001/execution/grade/generated/runs/pjr-ftrc-dummy-generated.md",
    );
    mkdirSync(dirname(dummyPath), { recursive: true });
    writeFileSync(
      dummyPath,
      "---\nspecdojo:\n  id: invalid-id\n  type: invalid-type\n---\n\n# Dummy\n",
      "utf8",
    );
    tempFiles.push(dummyPath);

    const result = spawnSync(
      process.execPath,
      [
        resolve("packages/docs-lint/bin/specdojo-docs-lint.js"),
        "remark",
        dummyPath,
        "--quiet",
        "--frail",
      ],
      { encoding: "utf8" },
    );

    expect(result.status).toBe(0);
  });

  it("still flags schema errors in non-ignored markdown files", () => {
    const dummyPath = resolve(
      "docs/ja/projects/prj-0001/controls/project-register/pjr-ftrc-dummy-tracked.md",
    );
    mkdirSync(dirname(dummyPath), { recursive: true });
    writeFileSync(
      dummyPath,
      "---\nspecdojo:\n  id: invalid-id\n  type: invalid-type\n---\n\n# Dummy\n",
      "utf8",
    );
    tempFiles.push(dummyPath);

    const result = spawnSync(
      process.execPath,
      [
        resolve("packages/docs-lint/bin/specdojo-docs-lint.js"),
        "remark",
        dummyPath,
        "--quiet",
        "--frail",
      ],
      { encoding: "utf8" },
    );

    expect(result.status).toBe(1);
    expect(result.stdout + result.stderr).toContain("Frontmatter schema error");
  });
});
