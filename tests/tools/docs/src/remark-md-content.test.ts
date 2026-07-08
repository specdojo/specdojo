import { describe, expect, it, afterAll } from "vitest";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { remark } from "remark";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdContent from "../../../../tools/docs/src/remark-md-content.js";

const SCHEMA_YAML = `
id: test-content
column_aliases:
  due: [期限]
sections:
  - heading:
      - "一覧"
    level: 2
    number: 1
    required: true
    table:
      required_columns:
        - ID
        - due
      column_rules:
        due:
          pattern: "^(\\\\d{4}-\\\\d{2}-\\\\d{2}|-|_TODO_)$"
`;

async function setupWorkspace(): Promise<{ dir: string; schemaRelPath: string }> {
  const dir = await mkdtemp(path.join(tmpdir(), "specdojo-md-content-"));
  const schemaRelPath = "schema.yaml";
  await writeFile(path.join(dir, schemaRelPath), SCHEMA_YAML, "utf8");
  return { dir, schemaRelPath };
}

const dirsToCleanup: string[] = [];

afterAll(async () => {
  for (const dir of dirsToCleanup) {
    await rm(dir, { recursive: true, force: true });
  }
});

async function validateMarkdown(markdown: string): Promise<string[]> {
  const { dir, schemaRelPath } = await setupWorkspace();
  dirsToCleanup.push(dir);

  const processor = remark()
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkMdContent, {
      schemas: { [schemaRelPath]: ["**"] },
      workspaceRoot: dir,
    });

  const vfile = await processor.process({
    value: markdown,
    path: path.join(dir, "target.md"),
  });
  return vfile.messages.map((message) => message.reason);
}

describe("remarkMdContent column_rules", () => {
  it("accepts an emphasized _TODO_ cell as the literal placeholder value", async () => {
    const markdown = [
      "## 1. 一覧",
      "",
      "| ID | 期限 |",
      "| --- | --- |",
      "| X-1 | _TODO_ |",
      "",
    ].join("\n");

    const reasons = await validateMarkdown(markdown);

    expect(reasons).toEqual([]);
  });

  it("rejects a plain TODO cell that does not match the due pattern", async () => {
    const markdown = [
      "## 1. 一覧",
      "",
      "| ID | 期限 |",
      "| --- | --- |",
      "| X-1 | TODO |",
      "",
    ].join("\n");

    const reasons = await validateMarkdown(markdown);

    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toMatch(/列 "due" の値 "TODO" がパターン/);
  });

  it("accepts a date value in the due column", async () => {
    const markdown = [
      "## 1. 一覧",
      "",
      "| ID | 期限 |",
      "| --- | --- |",
      "| X-1 | 2026-07-08 |",
      "",
    ].join("\n");

    const reasons = await validateMarkdown(markdown);

    expect(reasons).toEqual([]);
  });
});
