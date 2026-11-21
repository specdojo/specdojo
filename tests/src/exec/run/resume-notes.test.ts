import addFormatsModule from "ajv-formats";
import Ajv2020Module from "ajv/dist/2020.js";
import { Command } from "commander";
import { createHash } from "node:crypto";
import { load } from "js-yaml";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerExecCommands } from "../../../../src/exec/exec.js";
import {
  createPipelineState,
  readPipelineState,
  updatePipelineStage,
  writePipelineState,
} from "../../../../src/exec/pipeline-state.js";
import {
  appendResumeNotesToPlan,
  nextResumeNotes,
  resumeNoteOptionError,
} from "../../../../src/exec/run/resume-notes.js";
import { readPlanFile } from "../../../../src/shared/plan-conventions.js";

const Ajv2020 = Ajv2020Module.default;
const addFormats = addFormatsModule.default;
const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
  vi.restoreAllMocks();
});

function tempRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "specdojo-resume-notes-"));
  roots.push(root);
  return root;
}

const CONVENTIONS = "CONVENTIONS\n";
const HASH = createHash("sha256").update(CONVENTIONS).digest("hex");
const REFERENCE = `\`共通規約 sha256:${HASH}\` \`execution/conventions/${HASH}.txt\``;
const ENTRY = { at: "2026-11-20T15:00:00.000Z", notes: ["個票の完了条件 3 を先に直す", "a\nb"] };

describe("appendResumeNotesToPlan", () => {
  it("inserts the section before the conventions reference and keeps the reference unchanged", () => {
    const root = tempRoot();
    const conventions = join(root, "execution", "conventions", `${HASH}.txt`);
    mkdirSync(dirname(conventions), { recursive: true });
    writeFileSync(conventions, CONVENTIONS, "utf8");
    // The conventions path is resolved from the repository root marked by the config file.
    mkdirSync(join(root, ".specdojo"), { recursive: true });
    writeFileSync(join(root, ".specdojo", "specdojo.config.json"), "{}\n", "utf8");
    const body = "# Edit Plan: X\n\n## 1. 進め方\n\n- 作業する\n";
    const planPath = join(root, "plan.md");
    writeFileSync(planPath, `${body}\n${REFERENCE}\n`, "utf8");

    appendResumeNotesToPlan(planPath, ENTRY);

    const plan = readFileSync(planPath, "utf8");
    expect(plan).toBe(
      `${body}\n## 再開の指示（2026-11-20T15:00:00.000Z）\n\n` +
        "利用者が再開の前に足した指示である。これまでの申し送りとあわせて、この指示に従って作業を続ける。\n\n" +
        `- 個票の完了条件 3 を先に直す\n- a\n  b\n\n${REFERENCE}\n`,
    );
    // The reference is still the final paragraph, so expansion keeps working.
    expect(readPlanFile(planPath).trimEnd().endsWith("CONVENTIONS")).toBe(true);
  });

  it("appends the section to a plan without a conventions reference", () => {
    const root = tempRoot();
    const planPath = join(root, "plan.md");
    writeFileSync(planPath, "# Edit Plan: X\n\n本文\n", "utf8");

    appendResumeNotesToPlan(planPath, { at: "2026-11-20T15:00:00.000Z", notes: ["続ける"] });

    expect(readFileSync(planPath, "utf8")).toMatch(
      /^# Edit Plan: X\n\n本文\n\n## 再開の指示（2026-11-20T15:00:00\.000Z）\n\n.+\n\n- 続ける\n$/,
    );
  });
});

describe("resumeNoteOptionError", () => {
  const base = { register: "PJR-AAAA", resume: true, resumeFrom: "executor" };

  it("accepts a single register item resumed from the executor", () => {
    expect(resumeNoteOptionError({ ...base, resumeNote: ["x"] })).toBeUndefined();
  });

  it.each([
    { opts: { ...base, resumeFrom: undefined }, reason: "--resume --resume-from executor" },
    { opts: { ...base, resume: false }, reason: "--resume --resume-from executor" },
    { opts: { ...base, register: "PJR-AAAA,PJR-BBBB" }, reason: "single item ID" },
    { opts: { ...base, register: undefined, registerFilter: true }, reason: "single item ID" },
    { opts: { ...base, resumeNote: [" "] }, reason: "non-empty text" },
  ])("rejects $opts", ({ opts, reason }) => {
    const actual = resumeNoteOptionError({ resumeNote: ["x"], ...opts });

    expect(actual).toContain(reason);
  });
});

describe("exec run --resume-note", () => {
  it("stops before launching when --resume-from executor is missing", async () => {
    const stdout = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const program = new Command();
    program.exitOverride();
    registerExecCommands(program);

    await program.parseAsync([
      "node",
      "specdojo",
      "exec",
      "run",
      "--register",
      "PJR-AAAA",
      "--worktree",
      "--resume",
      "--resume-note",
      "x",
    ]);

    expect(process.exitCode).toBe(1);
    expect(stdout.mock.calls.flat().join("")).toContain(
      "--resume-note requires --resume --resume-from executor.",
    );
  });
});

describe("resume notes in the pipeline state", () => {
  it("records the notes with their time, carries earlier entries, and validates the schema", () => {
    const root = tempRoot();
    const statePath = join(root, "pipeline-state.json");
    const earlier = { at: "2026-11-19T00:00:00.000Z", notes: ["前回の指示"] };
    const notes = nextResumeNotes([earlier], ENTRY);
    const state = updatePipelineStage(
      createPipelineState({
        taskId: "PJR-AAAA",
        runId: "run-1",
        updatedAt: "2026-11-20T15:00:00.000Z",
        resumeNotes: notes,
      }),
      "executor",
      { status: "running", started_at: "2026-11-20T15:00:00.000Z" },
      "2026-11-20T15:00:00.000Z",
    );

    writePipelineState(statePath, state);

    expect(readPipelineState(statePath).resume_notes).toEqual([earlier, ENTRY]);
    const schemaPath = join(
      dirname(fileURLToPath(import.meta.url)),
      ...["..", "..", "..", "..", "docs", "specdojo", "schemas", "v1"],
      "pipeline-state.schema.yaml",
    );
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile(load(readFileSync(schemaPath, "utf8")) as Record<string, unknown>);
    expect(validate(state), JSON.stringify(validate.errors)).toBe(true);
  });

  it("keeps the recorded notes unchanged when no new note is given", () => {
    const earlier = { at: "2026-11-19T00:00:00.000Z", notes: ["前回の指示"] };

    expect(nextResumeNotes([earlier], undefined)).toEqual([earlier]);
    expect(nextResumeNotes(undefined, undefined)).toEqual([]);
  });

  it("rejects a state whose resume note is empty", () => {
    const root = tempRoot();
    const statePath = join(root, "pipeline-state.json");
    const state = createPipelineState({ taskId: "PJR-AAAA", runId: "run-1", updatedAt: "x" });
    writeFileSync(
      statePath,
      JSON.stringify({ ...state, resume_notes: [{ at: "x", notes: [""] }] }),
      "utf8",
    );

    expect(() => readPipelineState(statePath)).toThrow(/Invalid pipeline state/);
  });
});
