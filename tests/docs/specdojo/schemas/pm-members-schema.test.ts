import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";
import Ajv2020Module from "ajv/dist/2020.js";
import addFormatsModule from "ajv-formats";
import type { ValidateFunction } from "ajv";

// ajv / ajv-formats は CJS のため、NodeNext 解決では default import がモジュール名前空間になる。
// 実体は名前空間の default に入っているので、ここで取り出してから使う。
const Ajv2020 = Ajv2020Module.default;
const addFormats = addFormatsModule.default;

// Repo-root-relative directories resolved from this test file's location so the test is
// independent of the process working directory.
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const schemaDir = join(repoRoot, "docs", "specdojo", "schemas", "v1");
const schemaPath = join(schemaDir, "pm-members.schema.yaml");
const rosterPath = join(
  repoRoot,
  "docs",
  "ja",
  "projects",
  "prj-0001",
  "030-project-management",
  "pm-members.yaml",
);

type JsonObject = Record<string, unknown>;

// Compile pm-members.schema.yaml the same way tools/docs/src/validate-yaml-schema.ts does:
// register every sibling *.schema.yaml under its filename so that relative $ref targets
// (e.g. ./exec-common.schema.yaml#/$defs/Capability) resolve.
function compileRosterSchema(): ValidateFunction {
  const schema = load(readFileSync(schemaPath, "utf8")) as JsonObject;
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  for (const entry of readdirSync(schemaDir)) {
    if (!entry.endsWith(".schema.yaml") || entry === "pm-members.schema.yaml") continue;
    ajv.addSchema(load(readFileSync(join(schemaDir, entry), "utf8")) as JsonObject, entry);
  }
  return ajv.compile(schema);
}

describe("pm-members.schema.yaml", () => {
  const validate = compileRosterSchema();

  it("accepts the project's real pm-members.yaml roster", () => {
    const roster = load(readFileSync(rosterPath, "utf8")) as JsonObject;

    const valid = validate(roster);

    expect(validate.errors ?? []).toEqual([]);
    expect(valid).toBe(true);
  });

  it("rejects a nickname carrying shell metacharacters", () => {
    const roster = load(readFileSync(rosterPath, "utf8")) as {
      members: Array<Record<string, unknown>>;
    };
    const injected = {
      ...roster,
      members: [{ ...roster.members[0], nickname: "x; rm -rf /" }, ...roster.members.slice(1)],
    };

    const valid = validate(injected);

    expect(valid).toBe(false);
    expect((validate.errors ?? []).some((error) => error.instancePath.includes("nickname"))).toBe(
      true,
    );
  });
});
