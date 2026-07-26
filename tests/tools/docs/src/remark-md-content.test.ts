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

async function setupWorkspace(
  schemaYaml: string = SCHEMA_YAML,
): Promise<{ dir: string; schemaRelPath: string }> {
  const dir = await mkdtemp(path.join(tmpdir(), "specdojo-md-content-"));
  const schemaRelPath = "schema.yaml";
  await writeFile(path.join(dir, schemaRelPath), schemaYaml, "utf8");
  return { dir, schemaRelPath };
}

const dirsToCleanup: string[] = [];

afterAll(async () => {
  for (const dir of dirsToCleanup) {
    await rm(dir, { recursive: true, force: true });
  }
});

async function validateMarkdown(
  markdown: string,
  schemaYaml: string = SCHEMA_YAML,
): Promise<string[]> {
  const { dir, schemaRelPath } = await setupWorkspace(schemaYaml);
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

const UNIQUE_SCHEMA_YAML = `
id: unique-content
sections:
  - heading:
      - "一覧"
    level: 2
    number: 1
    required: true
    table:
      required_columns:
        - ID
        - ticket
      unique_columns:
        - ID
      ticket_filename_check:
        id_column: ID
        ticket_column: ticket
`;

describe("remarkMdContent unique_columns", () => {
  it("reports a duplicate ID with the conflicting row positions", async () => {
    const markdown = [
      "## 1. 一覧",
      "",
      "| ID | ticket |",
      "| --- | --- |",
      "| PJR-0137 | - |",
      "| PJR-0138 | - |",
      "| PJR-0137 | - |",
      "",
    ].join("\n");

    const reasons = await validateMarkdown(markdown, UNIQUE_SCHEMA_YAML);

    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toMatch(/列 "ID" の値 "PJR-0137" が重複しています（1 行目と 3 行目）/);
  });

  it("accepts a table where every ID is unique", async () => {
    const markdown = [
      "## 1. 一覧",
      "",
      "| ID | ticket |",
      "| --- | --- |",
      "| PJR-0137 | - |",
      "| PJR-0138 | - |",
      "",
    ].join("\n");

    const reasons = await validateMarkdown(markdown, UNIQUE_SCHEMA_YAML);

    expect(reasons).toEqual([]);
  });
});

describe("remarkMdContent ticket_filename_check", () => {
  it("reports a ticket filename whose prefix does not match the row ID", async () => {
    const markdown = [
      "## 1. 一覧",
      "",
      "| ID | ticket |",
      "| --- | --- |",
      "| PJR-0137 | [pjr-0099-topic](./pjr-0099-topic.md) |",
      "",
    ].join("\n");

    const reasons = await validateMarkdown(markdown, UNIQUE_SCHEMA_YAML);

    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toMatch(
      /個票ファイル名 "pjr-0099-topic.md" が ID "PJR-0137" と一致しません/,
    );
  });

  it("accepts a ticket filename that starts with the lowercased row ID", async () => {
    const markdown = [
      "## 1. 一覧",
      "",
      "| ID | ticket |",
      "| --- | --- |",
      "| PJR-0137 | [pjr-0137-topic](./pjr-0137-topic.md) |",
      "",
    ].join("\n");

    const reasons = await validateMarkdown(markdown, UNIQUE_SCHEMA_YAML);

    expect(reasons).toEqual([]);
  });

  it("skips the ticket filename check when there is no ticket", async () => {
    const markdown = [
      "## 1. 一覧",
      "",
      "| ID | ticket |",
      "| --- | --- |",
      "| PJR-0137 | - |",
      "",
    ].join("\n");

    const reasons = await validateMarkdown(markdown, UNIQUE_SCHEMA_YAML);

    expect(reasons).toEqual([]);
  });
});
