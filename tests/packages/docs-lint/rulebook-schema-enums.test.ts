import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  collectStringEnums,
  findReadyRulebookSchemaPairs,
  lintRulebookSchemaEnums,
  normativeRulebookBody,
} from "../../../packages/docs-lint/src/validate-rulebook-schema-enums.js";

const paths = {
  rulebook: "docs/ja/specdojo/rulebooks/example-rulebook.md",
  schema: "docs/specdojo/schemas/v1/example.schema.yaml",
};

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("rulebook schema enum coverage", () => {
  it("collects nested string enums with their JSON Pointer paths", () => {
    const schema = {
      properties: {
        mode: { enum: ["edit", "review", "_MODE_"] },
      },
      $defs: {
        status: { enum: ["draft", "ready", "deprecated"] },
      },
    };

    expect(collectStringEnums(schema)).toEqual([
      { enumPath: "/properties/mode/enum", values: ["edit", "review"] },
      { enumPath: "/$defs/status/enum", values: ["draft", "ready", "deprecated"] },
    ]);
  });

  it("reports a missing value with both target paths", () => {
    const markdown = "---\nspecdojo:\n  status: ready\n---\n\n`edit` / `review`\n";
    const schema = { properties: { mode: { enum: ["edit", "review", "report"] } } };

    expect(lintRulebookSchemaEnums(markdown, schema, paths.rulebook, paths.schema)).toEqual([
      {
        rulebookPath: paths.rulebook,
        schemaPath: paths.schema,
        enumPath: "/properties/mode/enum",
        missingValue: "report",
      },
    ]);
  });

  it("pairs ready structured rulebooks and schemas by their shared prefix", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-rulebook-enums-"));
    temporaryDirectories.push(root);
    const schemaDir = join(root, "schemas");
    const rulebookDir = join(root, "rulebooks");
    mkdirSync(schemaDir);
    mkdirSync(rulebookDir);
    writeFileSync(join(schemaDir, "ready.schema.yaml"), "enum: [one]\n");
    writeFileSync(join(schemaDir, "draft.schema.yaml"), "enum: [one]\n");
    writeFileSync(join(schemaDir, "unmatched.schema.yaml"), "enum: [one]\n");
    writeFileSync(
      join(rulebookDir, "ready-rulebook.md"),
      "---\nspecdojo:\n  status: ready\n  target_format: json\n---\n",
    );
    writeFileSync(
      join(rulebookDir, "draft-rulebook.md"),
      "---\nspecdojo:\n  status: draft\n  target_format: yaml\n---\n",
    );

    expect(findReadyRulebookSchemaPairs(schemaDir, rulebookDir)).toEqual([
      {
        rulebookPath: join(rulebookDir, "ready-rulebook.md"),
        schemaPath: join(schemaDir, "ready.schema.yaml"),
      },
    ]);
  });

  it("does not count a specdojo:finding comment as normative coverage", () => {
    const markdown = [
      "---",
      "specdojo:",
      "  status: ready",
      "---",
      "",
      "`edit` / `review`",
      "<!-- specdojo:finding id=F1 missing `report` from the rulebook -->",
      "pipeline reporter is a separate role.",
    ].join("\n");
    const schema = { enum: ["edit", "review", "report"] };

    expect(normativeRulebookBody(markdown)).not.toContain("missing `report`");
    expect(lintRulebookSchemaEnums(markdown, schema, paths.rulebook, paths.schema)).toHaveLength(1);
  });

  it("requires an enum value to appear as an independent token", () => {
    const schema = { enum: ["report"] };

    expect(
      lintRulebookSchemaEnums("A reporter runs here.", schema, paths.rulebook, paths.schema),
    ).toHaveLength(1);
    expect(
      lintRulebookSchemaEnums("Use `report` here.", schema, paths.rulebook, paths.schema),
    ).toHaveLength(0);
  });
});
