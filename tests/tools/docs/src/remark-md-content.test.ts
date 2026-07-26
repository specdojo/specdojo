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

const INTRO_SCHEMA_YAML = `
id: intro-content
intro_blocks:
  required:
    - 対象読者
    - この文書で分かること
    - 次に読む文書
`;

function introMarkdown(blocks: string[]): string {
  return [
    "# タイトル",
    "",
    "Title In English",
    "",
    "概要文。",
    "",
    ...blocks.flatMap((label) => [`**${label}**`, "", `- ${label} の内容`, ""]),
    "## 1. 最初の章",
    "",
  ].join("\n");
}

describe("remarkMdContent intro_blocks", () => {
  it("accepts the required blocks placed in the defined order", async () => {
    const markdown = introMarkdown(["対象読者", "この文書で分かること", "次に読む文書"]);

    const reasons = await validateMarkdown(markdown, INTRO_SCHEMA_YAML);

    expect(reasons).toEqual([]);
  });

  it("reports every missing block in one message", async () => {
    const markdown = introMarkdown(["対象読者"]);

    const reasons = await validateMarkdown(markdown, INTRO_SCHEMA_YAML);

    expect(reasons).toEqual([
      "H1 直後に必須の導入ブロックがありません: **この文書で分かること** / **次に読む文書**",
    ]);
  });

  it("reports blocks that appear in the wrong order", async () => {
    const markdown = introMarkdown(["次に読む文書", "対象読者", "この文書で分かること"]);

    const reasons = await validateMarkdown(markdown, INTRO_SCHEMA_YAML);

    expect(reasons).toEqual([
      "導入ブロックの順序が規約と異なります（期待: 対象読者 -> この文書で分かること -> 次に読む文書）",
    ]);
  });

  it("ignores bold labels that appear after the first chapter heading", async () => {
    const markdown = [
      introMarkdown(["対象読者", "この文書で分かること"]),
      "**次に読む文書**",
      "",
      "- 章の中に置いても導入ブロックとして数えない",
      "",
    ].join("\n");

    const reasons = await validateMarkdown(markdown, INTRO_SCHEMA_YAML);

    expect(reasons).toEqual(["H1 直後に必須の導入ブロックがありません: **次に読む文書**"]);
  });

  it("does not require intro blocks when the schema omits them", async () => {
    const markdown = introMarkdown([]);

    const reasons = await validateMarkdown(markdown, "id: no-intro\nsections: []\n");

    expect(reasons).toEqual([]);
  });
});

const ENGLISH_NAME_SCHEMA_YAML = `
id: english-name-content
require_english_name: true
`;

describe("remarkMdContent require_english_name", () => {
  it("accepts a Latin-only line directly after H1", async () => {
    const markdown = ["# タイトル", "", "Sample Guide Title", "", "概要文。", ""].join("\n");

    const reasons = await validateMarkdown(markdown, ENGLISH_NAME_SCHEMA_YAML);

    expect(reasons).toEqual([]);
  });

  it("rejects a Japanese line directly after H1", async () => {
    const markdown = ["# タイトル", "", "概要文だけがあり英語名がない。", ""].join("\n");

    const reasons = await validateMarkdown(markdown, ENGLISH_NAME_SCHEMA_YAML);

    expect(reasons).toEqual(["H1 直後に英語名（日本語を含まない1行）がありません"]);
  });

  it("rejects a missing block entirely after H1", async () => {
    const markdown = ["# タイトル", ""].join("\n");

    const reasons = await validateMarkdown(markdown, ENGLISH_NAME_SCHEMA_YAML);

    expect(reasons).toEqual(["H1 直後に英語名（日本語を含まない1行）がありません"]);
  });

  it("does not require an English name when the schema omits the flag", async () => {
    const markdown = ["# タイトル", "", "概要文だけ。", ""].join("\n");

    const reasons = await validateMarkdown(markdown, "id: no-english-name\n");

    expect(reasons).toEqual([]);
  });
});

const THEMATIC_BREAK_SCHEMA_YAML = `
id: thematic-break-content
forbid_thematic_break: true
`;

describe("remarkMdContent forbid_thematic_break", () => {
  it("reports every thematic break used as a section separator", async () => {
    const markdown = [
      "# タイトル",
      "",
      "## 1. セクションA",
      "",
      "内容。",
      "",
      "---",
      "",
      "## 2. セクションB",
      "",
      "内容。",
      "",
      "---",
      "",
    ].join("\n");

    const reasons = await validateMarkdown(markdown, THEMATIC_BREAK_SCHEMA_YAML);

    expect(reasons).toEqual([
      "本文中で `---` をセクション区切りに使わないでください（禁止事項）",
      "本文中で `---` をセクション区切りに使わないでください（禁止事項）",
    ]);
  });

  it("does not flag the frontmatter delimiter itself", async () => {
    const markdown = ["---", "id: sample", "---", "", "# タイトル", "", "本文。", ""].join("\n");

    const reasons = await validateMarkdown(markdown, THEMATIC_BREAK_SCHEMA_YAML);

    expect(reasons).toEqual([]);
  });

  it("allows thematic breaks when the schema omits the flag", async () => {
    const markdown = ["# タイトル", "", "---", ""].join("\n");

    const reasons = await validateMarkdown(markdown, "id: no-thematic-break-check\n");

    expect(reasons).toEqual([]);
  });
});
