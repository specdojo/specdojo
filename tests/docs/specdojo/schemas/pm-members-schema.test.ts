import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020Module from "ajv/dist/2020.js";
import addFormatsModule from "ajv-formats";
import type { ValidateFunction } from "ajv";
import { load } from "js-yaml";
import { describe, expect, it } from "vitest";

const Ajv2020 = Ajv2020Module.default;
const addFormats = addFormatsModule.default;
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const schemaDir = join(repoRoot, "docs", "specdojo", "schemas", "v1");

function compileSchema(name: string): ValidateFunction {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  for (const entry of readdirSync(schemaDir)) {
    if (!entry.endsWith(".schema.yaml") || entry === name) continue;
    ajv.addSchema(load(readFileSync(join(schemaDir, entry), "utf8")) as object, entry);
  }
  return ajv.compile(load(readFileSync(join(schemaDir, name), "utf8")) as object);
}

const human = {
  id: "prj-test:pm-members",
  type: "project",
  status: "draft",
  title: "Members",
  rulebook: "specdojo:pm-members-rulebook",
  version: 1,
  project_id: "prj-test",
  members: [
    {
      nickname: "alice",
      display_name: "Alice",
      email: null,
      roles: ["PO"],
      type: "human",
    },
  ],
};

const agent = {
  version: 1,
  members: [
    {
      nickname: "codex-executor",
      display_name: "Codex Executor",
      email: null,
      roles: [],
      type: "agent",
      provider: "codex",
      capabilities: ["exec"],
      proficiency: "expert",
      priority: 1,
      mode: "edit",
      stage_role: "executor",
    },
  ],
};

describe("member registry schemas", () => {
  const validateHumans = compileSchema("pm-members.schema.yaml");
  const validateAgents = compileSchema("agent-members.schema.yaml");

  it("accepts human and agent registries in their respective schemas", () => {
    expect(validateHumans(human), JSON.stringify(validateHumans.errors)).toBe(true);
    expect(validateAgents(agent), JSON.stringify(validateAgents.errors)).toBe(true);
  });

  it("rejects agents in pm-members.yaml", () => {
    expect(validateHumans({ ...human, members: agent.members })).toBe(false);
  });

  it("rejects humans in agent-members.yaml", () => {
    expect(validateAgents({ ...agent, members: human.members })).toBe(false);
  });

  it("rejects a nickname carrying shell metacharacters", () => {
    const injected = {
      ...agent,
      members: [{ ...agent.members[0], nickname: "x; rm -rf /" }],
    };
    expect(validateAgents(injected)).toBe(false);
  });
});
