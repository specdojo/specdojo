import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { load } from "../../../../src/shared/yaml.js";
import { buildValidator, formatErrors } from "../../../helpers/schema.js";

const validate = buildValidator("docs/specdojo/schemas/v1/exec-defaults.schema.yaml");

describe("exec-defaults.schema.yaml frontier", () => {
  it("accepts post-integration build-dist with paths", () => {
    expect(
      validate({
        pipeline: { post_integration: [{ id: "build-dist", paths: ["src/**", "tsconfig*.json"] }] },
      }),
      formatErrors(validate.errors),
    ).toBe(true);
  });

  it.each([
    { id: "build-dist", paths: [] },
    { id: "build-dist", paths: [" "] },
    { id: "build-dist", paths: "src/**" },
    { id: "build-dist" },
    { id: "unknown", paths: ["src/**"] },
    { id: "build-dist", paths: ["src/**"], command: "evil" },
    { id: "build-dist", paths: ["src/**"], args: ["evil"] },
  ])("rejects unsafe post-integration configuration: %j", (entry) => {
    expect(validate({ pipeline: { post_integration: [entry] } })).toBe(false);
  });

  it("accepts the shipped defaults with all frontier mappings", () => {
    expect(
      validate(load(readFileSync("templates/init-exec-defaults.yaml", "utf8"))),
      formatErrors(validate.errors),
    ).toBe(true);
  });

  it.each([{}, { effort: "xhigh" }])("accepts an explicit frontier mapping %j", (frontier) => {
    expect(
      validate({ providers: { codex: { command_params: { by_proficiency: { frontier } } } } }),
      formatErrors(validate.errors),
    ).toBe(true);
  });

  it.each([{ future: { effort: "xhigh" } }, { frontier: { effort: 1 } }])(
    "rejects invalid variable tables %j",
    (byProficiency) => {
      const valid = validate({
        providers: { codex: { command_params: { by_proficiency: byProficiency } } },
      });
      expect(valid).toBe(false);
    },
  );
});
