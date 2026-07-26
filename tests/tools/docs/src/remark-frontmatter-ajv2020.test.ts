import { describe, expect, it, afterAll } from "vitest";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { remark } from "remark";

const require = createRequire(import.meta.url);
const remarkFrontmatterAjv2020 = require("../../../../tools/docs/src/remark-frontmatter-ajv2020.cjs");

const SCHEMA_YAML = `
$schema: "https://json-schema.org/draft/2020-12/schema"
type: object
required:
  - id
properties:
  id:
    type: string
`;

const dirsToCleanup: string[] = [];

afterAll(async () => {
  for (const dir of dirsToCleanup) {
    await rm(dir, { recursive: true, force: true });
  }
});

async function setupWorkspace(): Promise<{ dir: string; schemaRelPath: string }> {
  const dir = await mkdtemp(path.join(tmpdir(), "specdojo-frontmatter-ajv-"));
  dirsToCleanup.push(dir);
  const schemaRelPath = "schema.yaml";
  await writeFile(path.join(dir, schemaRelPath), SCHEMA_YAML, "utf8");
  return { dir, schemaRelPath };
}

async function validateMarkdown(markdown: string, requireFrontmatter: boolean): Promise<string[]> {
  const { dir, schemaRelPath } = await setupWorkspace();

  const processor = remark().use(remarkFrontmatterAjv2020, {
    workspaceRoot: dir,
    schemaRules: [{ glob: "**", schema: schemaRelPath, require_frontmatter: requireFrontmatter }],
  });

  const vfile = await processor.process({
    value: markdown,
    path: path.join(dir, "target.md"),
  });
  return vfile.messages.map((message) => message.reason);
}

describe("remarkFrontmatterAjv2020 missing frontmatter", () => {
  it("reports an error when require_frontmatter is set and no frontmatter block exists", async () => {
    const markdown = ["# タイトル", "", "本文。", ""].join("\n");

    const reasons = await validateMarkdown(markdown, true);

    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toMatch(/Frontmatter is required for this path/);
  });

  it("stays silent on missing frontmatter when require_frontmatter is not set (default, backward compatible)", async () => {
    const markdown = ["# タイトル", "", "本文。", ""].join("\n");

    const reasons = await validateMarkdown(markdown, false);

    expect(reasons).toEqual([]);
  });

  it("does not report the missing-frontmatter error once frontmatter is present and valid", async () => {
    const markdown = ["---", "id: sample", "---", "", "# タイトル", "", "本文。", ""].join("\n");

    const reasons = await validateMarkdown(markdown, true);

    expect(reasons).toEqual([]);
  });

  it("still reports schema violations when frontmatter is present but invalid", async () => {
    const markdown = ["---", "other: value", "---", "", "# タイトル", ""].join("\n");

    const reasons = await validateMarkdown(markdown, true);

    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toMatch(/Frontmatter schema error/);
  });
});
