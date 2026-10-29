import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";
import Ajv2020Module from "ajv/dist/2020.js";
import addFormatsModule from "ajv-formats";
import type { ValidateFunction } from "ajv";
import { describe, expect, it } from "vitest";

const Ajv2020 = Ajv2020Module.default;
const addFormats = addFormatsModule.default;
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const schemaDir = join(repoRoot, "docs", "specdojo", "schemas", "v1");
const schemaPath = join(schemaDir, "dct.schema.yaml");
const samplePath = join(repoRoot, "docs", "ja", "specdojo", "samples", "dct-sample.yaml");

type JsonObject = Record<string, unknown>;

function compileDctSchema(): ValidateFunction {
  const schema = load(readFileSync(schemaPath, "utf8")) as JsonObject;
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  for (const entry of readdirSync(schemaDir)) {
    if (!entry.endsWith(".schema.yaml") || entry === "dct.schema.yaml") continue;
    ajv.addSchema(load(readFileSync(join(schemaDir, entry), "utf8")) as JsonObject, entry);
  }
  return ajv.compile(schema);
}

describe("dct.schema.yaml brief property", () => {
  const validate = compileDctSchema();

  it("validates dct-sample.yaml including brief and YAML anchors", () => {
    const sample = load(readFileSync(samplePath, "utf8"));
    const valid = validate(sample);
    expect(validate.errors).toBeNull();
    expect(valid).toBe(true);
  });

  it("accepts a deliverable with a single-line brief", () => {
    const doc = load(`
id: prj-0001:dct-test
type: project
status: draft
title: Test Catalog
rulebook: specdojo:dct-rulebook
project_id: prj-0001
domain: test
groups:
  - deliverables:
      - local_id: test-item
        name: テスト成果物
        kind: work
        overview: 成果物の目的
        brief: "静的サイトで主流の技術スタックで書く。"
        path: test.md
        done_criteria:
          - text: 検証可能な条件
            roles: [DEV]
            viewpoint: vp-dev-implementation
`);
    const valid = validate(doc);
    expect(validate.errors).toBeNull();
    expect(valid).toBe(true);
  });

  it("accepts multiple deliverables sharing brief via YAML anchors", () => {
    const doc = load(`
id: prj-0001:dct-test
type: project
status: draft
title: Test Catalog
rulebook: specdojo:dct-rulebook
project_id: prj-0001
domain: test
groups:
  - deliverables:
      - local_id: item-one
        name: 成果物1
        kind: work
        overview: 成果物1の概要
        brief: &shared_brief |
          - TypeScript と Node.js を採用する。
          - 標準ライブラリの活用を優先する。
        path: item-1.md
        done_criteria:
          - text: 条件1
            roles: [DEV]
            viewpoint: vp-dev-implementation
      - local_id: item-two
        name: 成果物2
        kind: work
        overview: 成果物2の概要
        brief: *shared_brief
        path: item-2.md
        done_criteria:
          - text: 条件2
            roles: [DEV]
            viewpoint: vp-dev-implementation
`);
    const valid = validate(doc);
    expect(validate.errors).toBeNull();
    expect(valid).toBe(true);
  });

  it("rejects brief with empty string due to minLength: 1", () => {
    const doc = load(`
id: prj-0001:dct-test
type: project
status: draft
title: Test Catalog
rulebook: specdojo:dct-rulebook
project_id: prj-0001
domain: test
groups:
  - deliverables:
      - local_id: test-item
        name: テスト成果物
        kind: work
        overview: 成果物の目的
        brief: ""
        path: test.md
        done_criteria:
          - text: 検証可能な条件
            roles: [DEV]
            viewpoint: vp-dev-implementation
`);
    const valid = validate(doc);
    expect(valid).toBe(false);
    expect(validate.errors?.some((e) => e.instancePath.includes("brief"))).toBe(true);
  });

  it("rejects non-string brief", () => {
    const doc = load(`
id: prj-0001:dct-test
type: project
status: draft
title: Test Catalog
rulebook: specdojo:dct-rulebook
project_id: prj-0001
domain: test
groups:
  - deliverables:
      - local_id: test-item
        name: テスト成果物
        kind: work
        overview: 成果物の目的
        brief: 12345
        path: test.md
        done_criteria:
          - text: 検証可能な条件
            roles: [DEV]
            viewpoint: vp-dev-implementation
`);
    const valid = validate(doc);
    expect(valid).toBe(false);
    expect(validate.errors?.some((e) => e.instancePath.includes("brief"))).toBe(true);
  });
});
