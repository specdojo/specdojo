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
const schemaPath = join(schemaDir, "sch-strategy.schema.yaml");
const scheduleDir = join(repoRoot, "docs", "ja", "projects", "prj-0001", "schedule");

type JsonObject = Record<string, unknown>;
type StrategyFixture = JsonObject & {
  phase_sets: Record<string, Array<Record<string, unknown>>>;
};

function compileStrategySchema(): ValidateFunction {
  const schema = load(readFileSync(schemaPath, "utf8")) as JsonObject;
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  for (const entry of readdirSync(schemaDir)) {
    if (!entry.endsWith(".schema.yaml") || entry === "sch-strategy.schema.yaml") continue;
    ajv.addSchema(load(readFileSync(join(schemaDir, entry), "utf8")) as JsonObject, entry);
  }
  return ajv.compile(schema);
}

function loadStrategyFixture(): StrategyFixture {
  return load(
    readFileSync(join(scheduleDir, "sch-strategy-launch.yaml"), "utf8"),
  ) as StrategyFixture;
}

function firstPhase(strategy: StrategyFixture): Record<string, unknown> {
  const phase = Object.values(strategy.phase_sets)[0]?.[0];
  if (!phase) throw new Error("test strategy must contain a phase");
  return phase;
}

describe("sch-strategy.schema.yaml agent_pipeline", () => {
  const validate = compileStrategySchema();

  it("keeps existing strategy files valid when agent_pipeline is omitted", () => {
    const strategyPaths = readdirSync(scheduleDir)
      .filter((entry) => /^sch-strategy-.*\.ya?ml$/.test(entry))
      .map((entry) => join(scheduleDir, entry));

    for (const strategyPath of strategyPaths) {
      const strategy = load(readFileSync(strategyPath, "utf8")) as JsonObject;
      expect(validate(strategy), `${strategyPath}: ${JSON.stringify(validate.errors)}`).toBe(true);
    }
  });

  it("accepts an executor-then-reporter pipeline with per-stage requirements", () => {
    const strategy = loadStrategyFixture();
    firstPhase(strategy).agent_pipeline = {
      stages: [
        { stage_role: "executor", capabilities: ["exec"], proficiency: "expert" },
        { stage_role: "reporter", capabilities: ["review"], proficiency: "normal" },
      ],
    };

    const valid = validate(strategy);

    expect(validate.errors ?? []).toEqual([]);
    expect(valid).toBe(true);
  });

  it("rejects reversed pipeline stages", () => {
    const strategy = loadStrategyFixture();
    firstPhase(strategy).agent_pipeline = {
      stages: [{ stage_role: "reporter" }, { stage_role: "executor" }],
    };

    expect(validate(strategy)).toBe(false);
  });

  it("rejects a pipeline on a human-executed phase", () => {
    const strategy = loadStrategyFixture();
    const phase = firstPhase(strategy);
    phase.execution = "human";
    phase.agent_pipeline = {
      stages: [{ stage_role: "executor" }, { stage_role: "reporter" }],
    };

    expect(validate(strategy)).toBe(false);
  });
});
