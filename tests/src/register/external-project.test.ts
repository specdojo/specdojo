import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildExternalRegisterAddArgs,
  delegateExternalRegisterAdd,
  supportsExternalRegister,
  type ExternalRegisterAddOptions,
} from "../../../src/register/external-project.js";

const baseOptions: ExternalRegisterAddOptions = {
  project: "customer",
  type: "todo",
  title: "外部へ起票する",
  description: "説明",
  priority: "high",
  difficulty: "hard",
  status: "open",
  owner: "DEV",
  registered: "2026-10-22T01:02:03Z",
  due: "2026-11-01",
  completed: "-",
  conclusion: "-",
  approach: "deliverable-edit",
  target: ["target-doc"],
  from: ["customer:PJR-SRC1", "prj-other:PJR-SRC2"],
  id: "PJR-NEW1",
  topic: "external-item",
  by: "SpecDojo",
  reason: "test",
  force: true,
  dryRun: true,
  commit: true,
  message: "docs: add external item",
};

describe("buildExternalRegisterAddArgs", () => {
  it("forwards add options and rewrites the selected alias in --from", () => {
    expect(
      buildExternalRegisterAddArgs(
        "customer",
        { path: "../target", project_id: "prj-target" },
        baseOptions,
      ),
    ).toEqual([
      "register",
      "add",
      "--project",
      "prj-target",
      "--type",
      "todo",
      "--title",
      "外部へ起票する",
      "--description",
      "説明",
      "--priority",
      "high",
      "--status",
      "open",
      "--owner",
      "DEV",
      "--due",
      "2026-11-01",
      "--completed",
      "-",
      "--conclusion",
      "-",
      "--difficulty",
      "hard",
      "--registered",
      "2026-10-22T01:02:03Z",
      "--approach",
      "deliverable-edit",
      "--target",
      "target-doc",
      "--from",
      "prj-target:PJR-SRC1",
      "--from",
      "prj-other:PJR-SRC2",
      "--id",
      "PJR-NEW1",
      "--topic",
      "external-item",
      "--by",
      "SpecDojo",
      "--reason",
      "test",
      "--force",
      "--dry-run",
      "--commit",
      "--message",
      "docs: add external item",
    ]);
  });
});

describe("external SpecDojo version", () => {
  it("accepts W93C and newer versions only", () => {
    expect(supportsExternalRegister("0.4.1")).toBe(false);
    expect(supportsExternalRegister("0.4.2")).toBe(true);
    expect(supportsExternalRegister("specdojo 1.0.0")).toBe(true);
    expect(supportsExternalRegister("unknown")).toBe(false);
  });
});

describe("delegateExternalRegisterAdd preconditions", () => {
  const originalCwd = process.cwd();
  let fixtureRoot: string;

  afterEach(() => {
    process.chdir(originalCwd);
    if (fixtureRoot) rmSync(fixtureRoot, { recursive: true, force: true });
    fixtureRoot = "";
    process.exitCode = undefined;
  });

  function createFixture(): string {
    fixtureRoot = mkdtempSync(join(tmpdir(), "specdojo-external-register-unit-"));
    const source = join(fixtureRoot, "source");
    const target = join(fixtureRoot, "target");
    mkdirSync(join(source, ".specdojo"), { recursive: true });
    mkdirSync(join(target, "node_modules/.bin"), { recursive: true });
    writeFileSync(join(target, "node_modules/.bin/specdojo"), "test");
    writeFileSync(
      join(source, ".specdojo/specdojo.config.json"),
      JSON.stringify({
        version: 1,
        projects: { source: {} },
        external_projects: { customer: { path: "../target", project_id: "target" } },
      }),
    );
    process.chdir(source);
    return source;
  }

  it("stops before invoking the target CLI when --commit is absent", () => {
    createFixture();
    const run = vi.fn() as unknown as Parameters<typeof delegateExternalRegisterAdd>[1];

    expect(() => delegateExternalRegisterAdd({ ...baseOptions, commit: false }, run)).toThrow(
      "requires --commit",
    );
    expect(run).not.toHaveBeenCalled();
  });

  it("stops after version inspection when the target CLI is older than 0.4.2", () => {
    createFixture();
    const run = vi.fn(() => ({
      status: 0,
      signal: null,
      output: [null, "0.4.1\n", ""],
      pid: 1,
      stdout: "0.4.1\n",
      stderr: "",
    })) as unknown as Parameters<typeof delegateExternalRegisterAdd>[1];

    expect(() => delegateExternalRegisterAdd(baseOptions, run)).toThrow(
      "0.4.2 or newer is required",
    );
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("inherits target output and propagates a failed target exit code", () => {
    createFixture();
    const runMock = vi
      .fn()
      .mockReturnValueOnce({
        status: 0,
        signal: null,
        output: [null, "0.4.2\n", ""],
        pid: 1,
        stdout: "0.4.2\n",
        stderr: "",
      })
      .mockReturnValueOnce({
        status: 23,
        signal: null,
        output: [null, null, null],
        pid: 2,
        stdout: null,
        stderr: null,
      });
    const run = runMock as unknown as Parameters<typeof delegateExternalRegisterAdd>[1];

    expect(delegateExternalRegisterAdd(baseOptions, run)).toBe(true);
    expect(process.exitCode).toBe(23);
    expect(runMock).toHaveBeenCalledTimes(2);
    expect(runMock.mock.calls[1]?.[2]).toMatchObject({ stdio: "inherit" });
  });
});
