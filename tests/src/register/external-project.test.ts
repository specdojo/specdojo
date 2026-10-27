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
  source: ["docs/examples/*.md"],
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
  it("forwards dependency IDs and rewrites the external project alias", () => {
    const args = buildExternalRegisterAddArgs(
      "customer",
      { path: "../target", project_id: "prj-target" },
      { ...baseOptions, dependsOn: ["customer:PJR-AB12", "PJR-CD34"] },
    );
    const start = args.indexOf("--depends-on");
    expect(args.slice(start, start + 4)).toEqual([
      "--depends-on",
      "prj-target:PJR-AB12",
      "--depends-on",
      "PJR-CD34",
    ]);
  });

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
      "--source",
      "docs/examples/*.md",
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

  function createFixture(installTargetCli = true): string {
    fixtureRoot = mkdtempSync(join(tmpdir(), "specdojo-external-register-unit-"));
    const source = join(fixtureRoot, "source");
    const target = join(fixtureRoot, "target");
    mkdirSync(join(source, ".specdojo"), { recursive: true });
    mkdirSync(join(target, "node_modules/.bin"), { recursive: true });
    if (installTargetCli) {
      writeFileSync(
        join(
          target,
          "node_modules/.bin",
          process.platform === "win32" ? "specdojo.cmd" : "specdojo",
        ),
        "test",
      );
    }
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

  function createSelfRepository(build = true): string {
    createFixture(false);
    const target = join(fixtureRoot, "target");
    writeFileSync(join(target, "package.json"), JSON.stringify({ name: "specdojo" }));
    if (build) {
      mkdirSync(join(target, "dist"));
      writeFileSync(join(target, "dist/specdojo.js"), "test");
    }
    return target;
  }

  function successfulRun(version = "0.4.5") {
    return vi.fn(() => ({
      status: 0,
      signal: null,
      output: [null, `${version}\n`, ""],
      pid: 1,
      stdout: `${version}\n`,
      stderr: "",
    }));
  }

  it("uses Node and the self repository's dist entrypoint for version inspection and add", () => {
    const target = createSelfRepository();
    const run = successfulRun();

    expect(delegateExternalRegisterAdd(baseOptions, run)).toBe(true);
    expect(run).toHaveBeenCalledTimes(2);
    expect(run.mock.calls).toEqual([
      [
        process.execPath,
        [join(target, "dist/specdojo.js"), "--version"],
        { cwd: target, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
      ],
      [
        process.execPath,
        [
          join(target, "dist/specdojo.js"),
          ...buildExternalRegisterAddArgs(
            "customer",
            { path: "../target", project_id: "target" },
            baseOptions,
          ),
        ],
        { cwd: target, encoding: "utf8", stdio: "inherit" },
      ],
    ]);
  });

  it("prefers an installed CLI over the self repository fallback", () => {
    const source = createFixture();
    const target = join(fixtureRoot, "target");
    // No dist entrypoint: the fallback would fail if selected.
    writeFileSync(join(target, "package.json"), JSON.stringify({ name: "specdojo" }));
    const run = successfulRun();

    expect(delegateExternalRegisterAdd(baseOptions, run)).toBe(true);
    expect(run.mock.calls[0]).toEqual([
      join(target, "node_modules/.bin", process.platform === "win32" ? "specdojo.cmd" : "specdojo"),
      ["--version"],
      { cwd: join(source, "../target"), encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    ]);
  });

  it("asks to build an unbuilt self repository before invoking any CLI", () => {
    createSelfRepository(false);
    const run = successfulRun();

    expect(() => delegateExternalRegisterAdd(baseOptions, run)).toThrow("Run npm run build");
    expect(run).not.toHaveBeenCalled();
  });

  it.each(["0.4.1", "unknown"])("still rejects self repository version %s", (version) => {
    createSelfRepository();
    const run = successfulRun(version);

    expect(() => delegateExternalRegisterAdd(baseOptions, run)).toThrow("0.4.2 or newer");
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("still requires 0.4.5 for --source when using the self repository", () => {
    createSelfRepository();
    const run = successfulRun("0.4.4");

    expect(() => delegateExternalRegisterAdd(baseOptions, run)).toThrow(
      "0.4.5 or newer is required for --source",
    );
    expect(run).toHaveBeenCalledTimes(1);
  });

  it.each([{}, { name: "another-package" }, null])(
    "does not run dist from an unrelated repository with package metadata %j",
    (pkg) => {
      const target = createSelfRepository();
      writeFileSync(join(target, "package.json"), JSON.stringify(pkg));
      const run = successfulRun();

      expect(() => delegateExternalRegisterAdd(baseOptions, run)).toThrow(
        "does not have SpecDojo installed",
      );
      expect(run).not.toHaveBeenCalled();
    },
  );

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

  it("stops after version inspection when --source is sent to a target older than 0.4.5", () => {
    createFixture();
    const run = vi.fn(() => ({
      status: 0,
      signal: null,
      output: [null, "0.4.4\n", ""],
      pid: 1,
      stdout: "0.4.4\n",
      stderr: "",
    })) as unknown as Parameters<typeof delegateExternalRegisterAdd>[1];

    expect(() => delegateExternalRegisterAdd(baseOptions, run)).toThrow(
      "0.4.5 or newer is required for --source",
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
        output: [null, "0.4.5\n", ""],
        pid: 1,
        stdout: "0.4.5\n",
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
