import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import { parseGradeDocument, parseMarkdown, pipelineContentHash } from "../../../src/grade/core.js";
import { deterministicResults } from "../../../src/grade/plan.js";
import { gradeDocumentId, markdownDocumentId } from "../../../src/shared/grade-result.js";
import type { ReviewViewpointsDoc } from "../../../src/review/types.js";

const require = createRequire(import.meta.url);
const selectMetadata = require("../../../docs/specdojo/lib/yaml-metadata.cjs") as (
  value: unknown,
) => Record<string, unknown> | undefined;
const metadata = { id: "test:data", type: "data", status: "draft", rulebook: "none" };
const topLevel = "# source\nid: test:data\ntype: data\nstatus: draft\nrulebook: none\nfields: []\n";
const external =
  "---\nopenapi: 3.1.0\nx-spec-meta:\n  id: test:data\n  type: data\n  status: draft\n  rulebook: none\npaths: {}\n";

describe("YAML grade documents", () => {
  it.each([
    ["top-level.yaml", topLevel, { ...metadata, fields: [] }],
    ["external.yml", external, metadata],
  ])("reads metadata and preserves every source line for %s", (path, content, expectedMetadata) => {
    const document = parseGradeDocument(content, path);
    expect(document.data.specdojo).toEqual(expectedMetadata);
    expect(document.body).toBe(content);
    expect(gradeDocumentId(content, path)).toBe("test:data");
    expect(pipelineContentHash(document)).toBe(createHash("sha256").update(content).digest("hex"));
    expect(pipelineContentHash(parseGradeDocument(`${content}\n`, path))).not.toBe(
      pipelineContentHash(document),
    );
  });

  it("uses the same external metadata precedence as validate:schema", () => {
    expect(selectMetadata({ id: "outer", "x-spec-meta": metadata })).toEqual(metadata);
    expect(selectMetadata({ ...metadata, "x-spec-meta": [] })).toEqual({
      ...metadata,
      "x-spec-meta": [],
    });
    expect(selectMetadata([])).toBeUndefined();
    expect(gradeDocumentId(`id: ignored\n${external.replace("---\n", "")}`, "api.yaml")).toBe(
      "test:data",
    );
  });

  it.each(["id", "type", "status", "rulebook"])("explains missing metadata %s", (key) => {
    const content = topLevel.replace(new RegExp(`^${key}:.*\\n`, "m"), "");
    expect(() => parseGradeDocument(content, "missing.yaml")).toThrow(`metadata ${key}`);
  });

  it("does not require a Markdown heading in YAML", () => {
    const definitions: ReviewViewpointsDoc = {
      id: "test:viewpoints",
      type: "standard",
      status: "draft",
      viewpoints: [
        {
          id: "vp-arc-document-structure",
          role: "ARC",
          category: "architecture",
          title: "Structure",
          check: "Structure",
          evidence: "Metadata",
          default_severity: "major",
          evaluation: "deterministic",
        },
      ],
    };
    expect(
      deterministicResults(parseGradeDocument(topLevel, "data.yaml"), definitions, "deliverable"),
    ).toEqual([{ id: "vp-arc-document-structure", level: 4, findings: [] }]);
  });

  it("keeps Markdown parsing and existing document IDs unchanged", () => {
    const content =
      "---\nspecdojo:\n  id: test:markdown\n  type: data\n  status: draft\n---\n\n# Title\n";
    expect(parseGradeDocument(content, "data.md")).toEqual(parseMarkdown(content, "data.md"));
    expect(gradeDocumentId(content, "data.md")).toBe(markdownDocumentId(content, "data.md"));
  });
});
