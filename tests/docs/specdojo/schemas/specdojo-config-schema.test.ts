import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";
import Ajv2020Module from "ajv/dist/2020.js";
import type { ValidateFunction } from "ajv";

// ajv は CJS のため、NodeNext 解決では default import がモジュール名前空間になる。
const Ajv2020 = Ajv2020Module.default;

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const schemaPath = join(
  repoRoot,
  "docs",
  "specdojo",
  "schemas",
  "v1",
  "specdojo-config.schema.yaml",
);
const configPath = join(repoRoot, ".specdojo", "specdojo.config.json");

function compileConfigSchema(): ValidateFunction {
  const schema = load(readFileSync(schemaPath, "utf8")) as Record<string, unknown>;
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  return ajv.compile(schema);
}

function configWithRepos(repos: unknown): Record<string, unknown> {
  return {
    version: 1,
    current_project: "prj-0001",
    projects: { "prj-0001": { base_path: "docs/ja/projects/prj-0001", repos } },
  };
}

describe("specdojo-config.schema.yaml", () => {
  const validate = compileConfigSchema();

  it("accepts the repository's own config, which declares no repos", () => {
    const config = JSON.parse(readFileSync(configPath, "utf8")) as unknown;

    const valid = validate(config);

    expect(validate.errors ?? []).toEqual([]);
    expect(valid).toBe(true);
  });

  it("accepts a fully specified repository declaration", () => {
    const valid = validate(
      configWithRepos([
        {
          name: "app1",
          path: "../app1",
          integration_branch: "main",
          setup: { install: true, build: true },
        },
      ]),
    );

    expect(validate.errors ?? []).toEqual([]);
    expect(valid).toBe(true);
  });

  it("accepts a project integration branch and rejects a blank value", () => {
    expect(
      validate({
        version: 1,
        projects: { "prj-0001": { integration_branch: "project/custom/develop" } },
      }),
    ).toBe(true);
    expect(validate({ version: 1, projects: { "prj-0001": { integration_branch: " " } } })).toBe(
      false,
    );
  });

  it("accepts project-specific parent validations with product repository assignments", () => {
    const valid = validate({
      version: 1,
      projects: {
        "prj-0002": {
          repos: [{ name: "specdojo-lp", path: "../specdojo-lp" }],
          run: {
            exec_defaults: ".specdojo/exec-defaults.yaml",
            parent_validations: [
              { id: "typecheck", repo: "specdojo-lp" },
              { id: "lint-ts", repo: "specdojo-lp" },
            ],
          },
        },
      },
    });

    expect(validate.errors ?? []).toEqual([]);
    expect(valid).toBe(true);
  });

  it("rejects unknown project-specific parent validation IDs and command injection keys", () => {
    expect(
      validate({
        version: 1,
        projects: {
          "prj-0001": { run: { parent_validations: ["arbitrary-command"] } },
        },
      }),
    ).toBe(false);
    expect(
      validate({
        version: 1,
        projects: {
          "prj-0001": {
            run: {
              parent_validations: [{ id: "typecheck", repo: "app1", command: "npm run evil" }],
            },
          },
        },
      }),
    ).toBe(false);
  });

  it("accepts only protected repository-relative agent member paths", () => {
    expect(
      validate({
        version: 1,
        agent_members_path: ".specdojo/custom-agents.yaml",
        projects: { "prj-0001": {} },
      }),
    ).toBe(true);
    expect(
      validate({
        version: 1,
        agent_members_path: "docs/agent-members.yaml",
        projects: { "prj-0001": {} },
      }),
    ).toBe(false);
    expect(
      validate({
        version: 1,
        agent_members_path: ".specdojo/../agent-members.yaml",
        projects: { "prj-0001": {} },
      }),
    ).toBe(false);
  });

  it("rejects a repository name outside [a-z0-9-]", () => {
    expect(validate(configWithRepos([{ name: "App1", path: "../app1" }]))).toBe(false);
    expect(validate.errors?.map((error) => error.instancePath)).toContain(
      "/projects/prj-0001/repos/0/name",
    );
  });

  it("rejects the reserved repository name project", () => {
    expect(validate(configWithRepos([{ name: "project", path: "../app1" }]))).toBe(false);
    expect(validate.errors?.map((error) => error.instancePath)).toContain(
      "/projects/prj-0001/repos/0/name",
    );
  });

  it("rejects a repository without path and an absolute path", () => {
    expect(validate(configWithRepos([{ name: "app1" }]))).toBe(false);
    expect(validate(configWithRepos([{ name: "app1", path: "/srv/app1" }]))).toBe(false);
  });

  it("rejects unknown repository keys and non-boolean setup flags", () => {
    expect(validate(configWithRepos([{ name: "app1", path: "../app1", branch: "main" }]))).toBe(
      false,
    );
    expect(
      validate(configWithRepos([{ name: "app1", path: "../app1", setup: { install: "yes" } }])),
    ).toBe(false);
  });
});
