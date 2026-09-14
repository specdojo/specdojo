import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";

const fixtureDirectories: string[] = [];
const script = resolve("tools/grade/run-per-document.sh");

function makeFixture(): {
  root: string;
  fakeSpecdojo: string;
  stateFile: string;
  pipelineStateFile: string;
  argsFile: string;
  target: string;
} {
  const root = mkdtempSync(join(tmpdir(), "specdojo-grade-per-document-"));
  fixtureDirectories.push(root);
  const rulebooks = join(root, "docs/ja/specdojo/rulebooks");
  const target = join(rulebooks, "fixture-rulebook.md");
  const stateFile = join(root, "fake-apply-count.txt");
  const pipelineStateFile = join(root, "fake-pipeline-state.json");
  const argsFile = join(root, "fake-args.log");
  const fakeSpecdojo = join(root, "fake-specdojo.mjs");

  const markdown = (id: string, type: string) =>
    `---\nspecdojo:\n  id: ${id}\n  type: ${type}\n  status: draft\n---\n\n# Fixture\n`;
  for (const [kind, directory] of [
    ["rulebook", "rulebooks"],
    ["recipe", "recipes"],
    ["sample", "samples"],
    ["template", "templates"],
  ]) {
    const kindDirectory = join(root, "docs/ja/specdojo", directory);
    mkdirSync(kindDirectory, { recursive: true });
    writeFileSync(
      join(kindDirectory, `prj-overview-${kind}.md`),
      markdown(`specdojo:prj-overview-${kind}`, kind),
    );
  }
  writeFileSync(target, markdown("specdojo:fixture-rulebook", "rulebook"));
  writeFileSync(
    fakeSpecdojo,
    `#!/usr/bin/env node
import { appendFileSync, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const args = process.argv.slice(2);
if (process.env.FAKE_ARGS_FILE) appendFileSync(process.env.FAKE_ARGS_FILE, args.join(" ") + "\\n");
const value = (option) => {
  const index = args.indexOf(option);
  return index < 0 ? undefined : args[index + 1];
};
if (args[0] === "grade" && args[1] === "state") {
  const statePath = process.env.FAKE_PIPELINE_STATE_FILE;
  const previous = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) : undefined;
  if (args.includes("--exhausted")) {
    if (previous && previous.consecutive_failures >= previous.max_failures) {
      process.stdout.write(previous.document + "\\n");
    }
    process.exit(0);
  }
  const status = value("--status");
  if (!status) {
    if (previous) process.stdout.write(JSON.stringify(previous) + "\\n");
    process.exit(0);
  }
  const stage = Number(value("--stage"));
  if (status === "complete" || (status === "passed" && stage >= 3)) {
    if (existsSync(statePath)) unlinkSync(statePath);
    process.exit(0);
  }
  const failed = status === "failed";
  const state = {
    stage_completed: failed ? Math.min(previous?.stage_completed ?? 0, stage - 1) : stage,
    stage_failed: failed ? stage : null,
    consecutive_failures: failed
      ? previous?.stage_failed === stage ? previous.consecutive_failures + 1 : 1
      : 0,
    max_failures: Number(value("--max-failures")),
    document: value("--path"),
  };
  writeFileSync(statePath, JSON.stringify(state));
  process.stdout.write(JSON.stringify(state) + "\\n");
  process.exit(0);
}
if (args[0] === "grade" && args[1] === "list") {
  const mode = process.env.FAKE_GRADE_LIST_MODE ?? "changed";
  if (mode === "empty") process.exit(0);
  if (args.includes("--changed-only")) {
    process.stdout.write("docs/ja/specdojo/rulebooks/fixture-rulebook.md\\n");
    process.stdout.write("docs/ja/specdojo/recipes/prj-overview-recipe.md\\n");
  }
  if (args.includes("--ungraded")) {
    process.stdout.write("docs/ja/specdojo/rulebooks/fixture-rulebook.md\\n");
    process.stdout.write("docs/ja/specdojo/samples/prj-overview-sample.md\\n");
  }
  if (args.includes("--incomplete")) {
    const statePath = process.env.FAKE_PIPELINE_STATE_FILE;
    if (existsSync(statePath)) {
      const state = JSON.parse(readFileSync(statePath, "utf8"));
      if (state.consecutive_failures < state.max_failures) {
        process.stdout.write(state.document + "\\n");
      }
    }
  }
  process.exit(0);
}
if (args[0] === "grade" && args[1] === "plan") {
  const out = value("--out");
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, "fixture-grade-plan.md"), "executor plan\\n");
  writeFileSync(join(out, "fixture-grade-reporter-plan.md"), "reporter plan\\n");
  process.exit(0);
}
if (args[0] === "agent" && args[1] === "run") {
  const limiter = process.env.FAKE_RATE_LIMIT_FILE;
  if (limiter && existsSync(limiter)) {
    unlinkSync(limiter);
    process.exit(75);
  }
  const out = value("--out");
  mkdirSync(dirname(out), { recursive: true });
  const plan = readFileSync(value("--plan"), "utf8");
  writeFileSync(out, plan.includes("<grade_executor_output>")
    ? "{\\\"rubric\\\":\\\"fixture\\\",\\\"documents\\\":[]}\\n"
    : "[VIEWPOINT fixture]\\nLEVEL: 4\\n[END VIEWPOINT]\\n");
  process.exit(0);
}
if (args[0] === "grade" && args[1] === "apply") {
  const countPath = process.env.FAKE_STATE_FILE;
  const count = existsSync(countPath) ? Number(readFileSync(countPath, "utf8")) + 1 : 1;
  writeFileSync(countPath, String(count));
  const failFrom = Number(process.env.FAKE_APPLY_FAIL_FROM ?? 0);
  if (failFrom > 0 && count >= failFrom) process.exit(1);
  const score = count === 1 ? 80 : count === 2 ? 100 : 95;
  const target = value("--path");
  writeFileSync(target,
    "---\\nspecdojo:\\n  id: specdojo:fixture-rulebook\\n  type: rulebook\\n  status: draft\\n" +
    "  grade:\\n    verdict: pass\\n    score: " + score +
    "\\n    findings: { blocker: 0, major: 0, minor: 0, note: 0 }\\n---\\n\\n# Fixture\\n");
  process.exit(0);
}
process.exit(1);
`,
  );
  chmodSync(fakeSpecdojo, 0o755);
  return { root, fakeSpecdojo, stateFile, pipelineStateFile, argsFile, target };
}

function runPipeline(
  fixture: ReturnType<typeof makeFixture>,
  extraEnv: Record<string, string> = {},
  extraArguments: string[] = [],
  runId = "fixture-run",
) {
  return spawnSync(
    "bash",
    [
      script,
      "--run-id",
      runId,
      "--kind",
      "rulebook",
      "--path",
      "docs/ja/specdojo/rulebooks/fixture-rulebook.md",
      "--specdojo-bin",
      fixture.fakeSpecdojo,
      ...extraArguments,
    ],
    {
      cwd: fixture.root,
      encoding: "utf8",
      env: {
        ...process.env,
        FAKE_STATE_FILE: fixture.stateFile,
        FAKE_PIPELINE_STATE_FILE: fixture.pipelineStateFile,
        FAKE_ARGS_FILE: fixture.argsFile,
        ...extraEnv,
      },
    },
  );
}

function runDryRun(
  fixture: ReturnType<typeof makeFixture>,
  kind: string,
  extraArguments: string[] = [],
  extraEnv: Record<string, string> = {},
) {
  return spawnSync(
    "bash",
    [script, "--run-id", "fixture-dry-run", "--kind", kind, "--dry-run", ...extraArguments],
    { cwd: fixture.root, encoding: "utf8", env: { ...process.env, ...extraEnv } },
  );
}

afterEach(() => {
  for (const directory of fixtureDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("grade per-document pipeline", () => {
  it.each([
    ["rulebook", "rulebooks"],
    ["recipe", "recipes"],
    ["sample", "samples"],
    ["template", "templates"],
  ])("uses the %s prj-overview document as the stage 1 default", (kind, directory) => {
    const fixture = makeFixture();

    const result = runDryRun(fixture, kind);

    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain(
      `stage=1 executor=gemma-expert-executor reporter=gemma-reporter reference=docs/ja/specdojo/${directory}/prj-overview-${kind}.md`,
    );
  });

  it("prefers an explicit same-kind stage 1 reference", () => {
    const fixture = makeFixture();
    const customReference = join(
      fixture.root,
      "docs/ja/specdojo/recipes/prj-overview-custom-recipe.md",
    );
    writeFileSync(customReference, "# Custom recipe reference\n");

    const result = runDryRun(fixture, "recipe", [
      "--stage-1-reference",
      "./docs/ja/specdojo/recipes/prj-overview-custom-recipe.md",
    ]);

    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain(
      "reference=./docs/ja/specdojo/recipes/prj-overview-custom-recipe.md",
    );
  });

  it("rejects an explicit stage 1 reference from another kind", () => {
    const fixture = makeFixture();

    const result = runDryRun(fixture, "sample", [
      "--stage-1-reference",
      "docs/ja/specdojo/recipes/prj-overview-recipe.md",
    ]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "--stage-1-reference must be a sample prj-overview document under docs/ja/specdojo/samples",
    );
  });

  it("warns and continues without a reference when the kind default is missing", () => {
    const fixture = makeFixture();
    rmSync(join(fixture.root, "docs/ja/specdojo/samples/prj-overview-sample.md"));

    const result = runDryRun(fixture, "sample");

    expect(result.status, result.stderr).toBe(0);
    expect(result.stderr).toContain(
      "default stage 1 reference not found for kind sample; continuing without a reference",
    );
    expect(result.stdout).toContain(
      "stage=1 executor=gemma-expert-executor reporter=gemma-reporter reference=none",
    );
  });

  it("selects the union of changed and ungraded documents across all kinds", () => {
    const fixture = makeFixture();

    const result = runDryRun(fixture, "all", [
      "--changed-only",
      "--ungraded",
      "--specdojo-bin",
      fixture.fakeSpecdojo,
    ]);

    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain(
      "kind=all changed_only=true ungraded=true incomplete=false max_stage_failures=3 documents=3",
    );
    expect(result.stdout).toContain("reference=per-kind");
    expect(result.stdout.match(/fixture-rulebook\.md/g)).toHaveLength(1);
    expect(result.stdout).toContain("docs/ja/specdojo/recipes/prj-overview-recipe.md");
    expect(result.stdout).toContain("docs/ja/specdojo/samples/prj-overview-sample.md");
  });

  it("treats an empty filtered selection as a successful no-op", () => {
    const fixture = makeFixture();

    const result = spawnSync(
      "bash",
      [
        script,
        "--run-id",
        "fixture-noop",
        "--kind",
        "all",
        "--changed-only",
        "--specdojo-bin",
        fixture.fakeSpecdojo,
      ],
      {
        cwd: fixture.root,
        encoding: "utf8",
        env: { ...process.env, FAKE_GRADE_LIST_MODE: "empty" },
      },
    );

    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain("documents=0");
    expect(result.stdout).toContain("grade pipeline complete: selected=0 processed=0");
  });

  it("runs all three stages for one document and skips it on resume", () => {
    const fixture = makeFixture();

    const first = runPipeline(fixture);
    expect(first.status, first.stderr).toBe(0);
    expect(readFileSync(fixture.stateFile, "utf8")).toBe("3");

    const results = readFileSync(
      join(fixture.root, "logs/grade/runs/per-document/fixture-run/results.tsv"),
      "utf8",
    );
    expect(results).toContain("\t1\tpassed\t");
    expect(results).toContain("\t2\tpassed\t");
    expect(results).toContain("\t3\tpassed\t");
    const stage2 = results.split("\n").find((line) => line.includes("\t2\tpassed\t"));
    expect(stage2?.split("\t").slice(5, 8)).toEqual(["pass", "100", "0"]);

    const resumed = runPipeline(fixture);
    expect(resumed.status, resumed.stderr).toBe(0);
    expect(resumed.stdout).toContain("resume skip document=");
    expect(readFileSync(fixture.stateFile, "utf8")).toBe("3");
  });

  it("routes deliverables through deliverable grade plans and apply", () => {
    const fixture = makeFixture();

    const result = runPipeline(fixture, {}, ["--target", "deliverable"]);

    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain("target=deliverable kind=none");
    expect(result.stdout).toContain(
      "stage=1 executor=gemma-expert-executor reporter=gemma-reporter reference=none",
    );
    const invocations = readFileSync(fixture.argsFile, "utf8");
    expect(invocations).toContain("grade plan --target deliverable");
    expect(invocations).toContain("grade apply --target deliverable");
  });

  it("retries a failed stage in a new run without repeating completed stages", () => {
    const fixture = makeFixture();

    const failed = runPipeline(fixture, { FAKE_APPLY_FAIL_FROM: "3" }, [], "fixture-failed");
    expect(failed.status, failed.stderr).toBe(0);
    expect(failed.stdout).toContain("document incomplete:");
    expect(failed.stdout).toContain("failed_stage=3");
    expect(JSON.parse(readFileSync(fixture.pipelineStateFile, "utf8"))).toMatchObject({
      stage_completed: 2,
      stage_failed: 3,
      consecutive_failures: 1,
    });

    const retried = runPipeline(fixture, {}, [], "fixture-retried");
    expect(retried.status, retried.stderr).toBe(0);
    expect(retried.stdout).toContain("start_stage=3");
    expect(retried.stdout).toContain("stage=1 document=");
    expect(retried.stdout).toContain("status=resumed_completed");
    expect(readFileSync(fixture.stateFile, "utf8")).toBe("4");
    expect(existsSync(fixture.pipelineStateFile)).toBe(false);
  });

  it("excludes an exhausted stage from retries and reports it", () => {
    const fixture = makeFixture();

    for (const runId of ["fixture-failure-1", "fixture-failure-2", "fixture-failure-3"]) {
      const result = runPipeline(fixture, { FAKE_APPLY_FAIL_FROM: "3" }, [], runId);
      expect(result.status, result.stderr).toBe(0);
    }
    expect(JSON.parse(readFileSync(fixture.pipelineStateFile, "utf8"))).toMatchObject({
      stage_completed: 2,
      stage_failed: 3,
      consecutive_failures: 3,
      max_failures: 3,
    });

    const reported = runPipeline(
      fixture,
      { FAKE_APPLY_FAIL_FROM: "3" },
      ["--incomplete"],
      "fixture-exhausted-report",
    );
    expect(reported.status, reported.stderr).toBe(0);
    expect(reported.stdout).toContain("documents=0 exhausted=1");
    expect(reported.stdout).toContain("selected=0 processed=0");
    expect(
      readFileSync(
        join(fixture.root, "logs/grade/runs/per-document/fixture-exhausted-report/results.tsv"),
        "utf8",
      ),
    ).toContain("\t3\tretry_exhausted\t");
    expect(readFileSync(fixture.stateFile, "utf8")).toBe("5");
  });

  it("does not reselect an exhausted ungraded document through the filter union", () => {
    const fixture = makeFixture();

    for (const runId of [
      "fixture-stage-1-failure-1",
      "fixture-stage-1-failure-2",
      "fixture-stage-1-failure-3",
    ]) {
      const result = runPipeline(fixture, { FAKE_APPLY_FAIL_FROM: "1" }, [], runId);
      expect(result.status, result.stderr).toBe(0);
    }
    expect(JSON.parse(readFileSync(fixture.pipelineStateFile, "utf8"))).toMatchObject({
      stage_completed: 0,
      stage_failed: 1,
      consecutive_failures: 3,
      max_failures: 3,
    });

    const reported = runPipeline(
      fixture,
      { FAKE_APPLY_FAIL_FROM: "1" },
      ["--ungraded", "--incomplete", "--limit", "1"],
      "fixture-exhausted-ungraded-report",
    );
    expect(reported.status, reported.stderr).toBe(0);
    expect(reported.stdout).toContain("documents=0 exhausted=1");
    expect(reported.stdout).toContain("selected=0 processed=0");
    expect(readFileSync(fixture.stateFile, "utf8")).toBe("3");
  });

  it("leaves the current stage incomplete on rate limit and resumes it", () => {
    const fixture = makeFixture();
    const limiter = join(fixture.root, "rate-limit-once");
    writeFileSync(limiter, "1");

    const limited = runPipeline(fixture, { FAKE_RATE_LIMIT_FILE: limiter });
    expect(limited.status).toBe(75);
    expect(existsSync(fixture.stateFile)).toBe(false);

    const resumed = runPipeline(fixture, { FAKE_RATE_LIMIT_FILE: limiter });
    expect(resumed.status, resumed.stderr).toBe(0);
    expect(readFileSync(fixture.stateFile, "utf8")).toBe("3");
  });

  it("reuses the initial filtered selection when resuming", () => {
    const fixture = makeFixture();
    const limiter = join(fixture.root, "rate-limit-filtered-once");
    writeFileSync(limiter, "1");

    const limited = runPipeline(
      fixture,
      { FAKE_RATE_LIMIT_FILE: limiter, FAKE_GRADE_LIST_MODE: "changed" },
      ["--changed-only"],
    );
    expect(limited.status).toBe(75);

    const resumed = runPipeline(
      fixture,
      { FAKE_RATE_LIMIT_FILE: limiter, FAKE_GRADE_LIST_MODE: "empty" },
      ["--changed-only"],
    );
    expect(resumed.status, resumed.stderr).toBe(0);
    expect(readFileSync(fixture.stateFile, "utf8")).toBe("3");
  });
});
