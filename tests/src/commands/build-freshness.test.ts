import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { mkdirSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { resolveSteps } from "../../../src/commands/build.js";
import {
  collectStepOutputs,
  freshnessScanRoots,
  freshnessStatePath,
  planFreshSteps,
  readFreshnessState,
  scanFileStats,
  writeFreshnessState,
} from "../../../src/commands/build-freshness.js";
import type {
  FreshStepDecision,
  FreshnessContext,
  FreshnessState,
} from "../../../src/commands/build-freshness.js";
import type { SpecDojoConfig } from "../../../src/shared/specdojo-config.js";

const PROJECT_BASE = "docs/ja/projects/prj-0001";
const TICKET = `${PROJECT_BASE}/controls/project-register/pjr-aaaa-sample.md`;
const PRODUCT_YAML = "docs/ja/product/glossary.yaml";

const CONFIG: SpecDojoConfig = {
  version: 1,
  projects: {
    "prj-0001": {
      base_path: PROJECT_BASE,
      catalog_path: "010-deliverables-catalog",
      schedule_path: "schedule",
      execution_path: "execution",
      project_register_path: "controls/project-register",
    },
  },
};

let repoRoot: string;

function write(relPath: string, content: string): void {
  const full = path.join(repoRoot, relPath);
  mkdirSync(path.dirname(full), { recursive: true });
  writeFileSync(full, content, "utf8");
}

// 編集を更新時刻の違いとして確実に見せるため、固定の時刻へずらす。
function edit(relPath: string, content: string): void {
  write(relPath, content);
  const later = new Date("2030-01-01T00:00:00Z");
  utimesSync(path.join(repoRoot, relPath), later, later);
}

function context(overrides: Partial<FreshnessContext> = {}): FreshnessContext {
  return {
    repoRoot,
    config: CONFIG,
    project: CONFIG.projects["prj-0001"],
    codeRoot: path.join(repoRoot, "cli"),
    now: new Date("2026-11-23T03:00:00Z"),
    env: {},
    ...overrides,
  };
}

function defaultSteps(config: SpecDojoConfig = CONFIG) {
  return resolveSteps("all", ["--project", "prj-0001"], config.projects["prj-0001"], ["prj-0001"]);
}

function plan(state: FreshnessState | null, ctx: FreshnessContext = context()) {
  const files = scanFileStats(repoRoot, freshnessScanRoots(ctx.config));
  return planFreshSteps(defaultSteps(ctx.config ?? CONFIG), ctx, files, state);
}

// 段が成功したものとして、鍵と出力を記録した状態を作る。
function record(decisions: FreshStepDecision[], ctx: FreshnessContext = context()): FreshnessState {
  const files = scanFileStats(repoRoot, freshnessScanRoots(ctx.config));
  const state: FreshnessState = { version: 1, steps: {} };
  for (const decision of decisions) {
    if (!decision.key) continue;
    state.steps[decision.id] = {
      key: decision.key,
      outputs: collectStepOutputs(decision.step, ctx, files),
    };
  }
  return state;
}

function rebuiltLabels(decisions: FreshStepDecision[]): string[] {
  return decisions.filter((decision) => decision.rebuild).map((decision) => decision.step.label);
}

beforeEach(async () => {
  repoRoot = await mkdtemp(path.join(tmpdir(), "specdojo-build-freshness-"));
  write("cli/specdojo.js", "// cli\n");
  write(".specdojo/specdojo.config.json", JSON.stringify(CONFIG));
  write(`${PROJECT_BASE}/schedule/sch-milestones.yaml`, "kind: milestones\n");
  write(`${PROJECT_BASE}/execution/exec/events/e1.json`, "{}\n");
  write(`${PROJECT_BASE}/010-deliverables-catalog/dct-index.yaml`, "groups: []\n");
  write(TICKET, "# PJR-AAAA\n");
  write(PRODUCT_YAML, "terms: []\n");
  // 各段の出力。
  write(`${PROJECT_BASE}/execution/generated/ready.json`, "{}\n");
  write(`${PROJECT_BASE}/execution/generated/dashboard.md`, "# dashboard\n");
  write(`${PROJECT_BASE}/010-deliverables-catalog/generated/dct-index.md`, "# catalog\n");
  write(`${PROJECT_BASE}/controls/project-register/generated/pjr-index.md`, "# index\n");
  write("docs/ja/product/generated/glossary.md", "# yaml page\n");
  write(".specdojo/doc-index.json", "{}\n");
});

afterEach(async () => {
  await rm(repoRoot, { recursive: true, force: true });
});

describe("planFreshSteps", () => {
  it("rebuilds every step when there is no previous state", () => {
    const decisions = plan(null);

    expect(rebuiltLabels(decisions)).toEqual([
      "exec refresh",
      "catalog build",
      "register build",
      "yaml-pages build",
      "dashboard build",
      "index build",
    ]);
    expect(decisions.every((decision) => decision.reason === "no previous state")).toBe(true);
  });

  it("skips every step when nothing changed since the recorded run", () => {
    const state = record(plan(null));

    const decisions = plan(state);

    expect(rebuiltLabels(decisions)).toEqual([]);
    expect(decisions.map((decision) => decision.reason)).toEqual(Array(6).fill("inputs unchanged"));
  });

  it("rebuilds only register, dashboard and index after a register ticket edit", () => {
    const state = record(plan(null));
    edit(TICKET, "# PJR-AAAA edited\n");

    const decisions = plan(state);

    expect(rebuiltLabels(decisions)).toEqual(["register build", "dashboard build", "index build"]);
  });

  it("rebuilds yaml-pages but not exec refresh after a product YAML edit", () => {
    const state = record(plan(null));
    edit(PRODUCT_YAML, "terms: [a]\n");

    const decisions = plan(state);

    expect(rebuiltLabels(decisions)).toContain("yaml-pages build");
    expect(rebuiltLabels(decisions)).not.toContain("exec refresh");
  });

  it("rebuilds exec refresh and its dependents after an exec event is added", () => {
    const state = record(plan(null));
    write(`${PROJECT_BASE}/execution/exec/events/e2.json`, "{}\n");

    const decisions = plan(state);

    expect(rebuiltLabels(decisions)).toEqual(expect.arrayContaining(["exec refresh"]));
    expect(rebuiltLabels(decisions)).toEqual(
      expect.arrayContaining(["dashboard build", "index build"]),
    );
    expect(rebuiltLabels(decisions)).not.toContain("yaml-pages build");
  });

  it("ignores changes to generated outputs when judging inputs", () => {
    const state = record(plan(null));
    edit(`${PROJECT_BASE}/controls/project-register/generated/pjr-index.md`, "# rewritten\n");

    expect(rebuiltLabels(plan(state))).toEqual([]);
  });

  it("rebuilds a step whose recorded output is missing, together with its dependents", () => {
    const state = record(plan(null));
    rmSync(path.join(repoRoot, `${PROJECT_BASE}/execution/generated/ready.json`));

    const decisions = plan(state);

    expect(rebuiltLabels(decisions)).toEqual(["exec refresh", "dashboard build", "index build"]);
    expect(decisions[0]?.reason).toBe("outputs missing");
    expect(decisions.find((d) => d.step.scope === "dashboard")?.reason).toBe(
      "dependency rebuilt (exec)",
    );
  });

  it("rebuilds the date-dependent steps when the date changes", () => {
    const state = record(plan(null));

    const decisions = plan(state, context({ now: new Date("2026-11-25T03:00:00Z") }));

    expect(rebuiltLabels(decisions)).toEqual([
      "exec refresh",
      "register build",
      "dashboard build",
      "index build",
    ]);
  });

  it("rebuilds every step when the CLI implementation changes", () => {
    const state = record(plan(null));
    edit("cli/specdojo.js", "// cli v2\n");

    expect(rebuiltLabels(plan(state))).toHaveLength(6);
  });

  it("rebuilds every step without a key when inputs reach another repository", () => {
    const config: SpecDojoConfig = {
      ...CONFIG,
      projects: {
        "prj-0001": { ...CONFIG.projects["prj-0001"], repos: [{ name: "app", path: "../app" }] },
      },
    };
    const ctx = context({ config, project: config.projects["prj-0001"] });
    const state = record(plan(null, ctx), ctx);

    const decisions = plan(state, ctx);

    expect(rebuiltLabels(decisions)).toHaveLength(6);
    expect(decisions.every((decision) => decision.key === null)).toBe(true);
    expect(decisions[0]?.reason).toBe("cannot determine inputs (project prj-0001 declares repos)");
  });
});

describe("freshness state", () => {
  it("round-trips a written state", () => {
    mkdirSync(path.join(repoRoot, "node_modules"));
    const statePath = freshnessStatePath(repoRoot);
    const state: FreshnessState = {
      version: 1,
      steps: { "index index build": { key: "k", outputs: [".specdojo/doc-index.json"] } },
    };

    writeFreshnessState(statePath, state);

    expect(readFreshnessState(statePath)).toEqual({ state });
  });

  it("reports a broken state file so every step is rebuilt", () => {
    mkdirSync(path.join(repoRoot, "node_modules"));
    const statePath = freshnessStatePath(repoRoot);
    write("node_modules/.cache/specdojo/build-steps.json", "{ broken");

    const { state, problem } = readFreshnessState(statePath);
    const files = scanFileStats(repoRoot, freshnessScanRoots(CONFIG));
    const decisions = planFreshSteps(defaultSteps(), context(), files, state, problem);

    expect(state).toBeNull();
    expect(problem).toMatch(/unreadable state file: .*build-steps\.json/);
    expect(rebuiltLabels(decisions)).toHaveLength(6);
  });

  it("keeps no state when the repository has no node_modules", () => {
    expect(freshnessStatePath(repoRoot)).toBeNull();
    expect(readFreshnessState(null)).toEqual({
      state: null,
      problem: "no node_modules to keep the state",
    });
  });
});
