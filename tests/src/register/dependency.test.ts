import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  normalizeDependsOn,
  registerDependencyBlockReason,
  validateRegisterDependencies,
  validateRegisterDependencyDocs,
} from "../../../src/register/dependency.js";
import { readRegisterItemContent } from "../../../src/register/item.js";
import { resolveRegisterPaths } from "../../../src/register/core.js";
import { gitOutput, gitResult } from "../../../src/shared/git.js";
import type * as GitModule from "../../../src/shared/git.js";
import {
  runSingleRegisterItem,
  type RegisterRunContext,
} from "../../../src/exec/run/register-core.js";
import { runSingleRegisterItemWorktree } from "../../../src/exec/run/register-worktree.js";
import { resumeSingleRegisterItemWorktree } from "../../../src/exec/run/register-resume.js";
import { runRegisterMode } from "../../../src/exec/run/register-mode.js";
import type { RunOpts } from "../../../src/exec/run/shared.js";
import { Command } from "commander";
import { registerNightOrchestratorCommand } from "../../../src/commands/night-orchestrator.js";

vi.mock("../../../src/shared/git.js", async (importOriginal) => ({
  ...(await importOriginal<typeof GitModule>()),
  gitOutput: vi.fn(),
  gitResult: vi.fn(),
}));

function ticket(id: string, status = "open", refs: string[] = [], projectId = "prj-test"): string {
  return `---
specdojo:
  id: ${projectId}:${id.toLowerCase()}-test
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of: [${projectId}:pjr-index]
  item_type: todo
  item_status: ${status}
  priority: medium
  autopilot: approved
${refs.length ? `  depends_on: ${JSON.stringify(refs)}\n` : ""}---

# ${id} Test

## 1. 概要

Test.
`;
}

async function withRegister<T>(fn: (directory: string) => T | Promise<T>): Promise<T> {
  const cwd = process.cwd();
  const previousSchedule = process.env.SPECDOJO_SCHEDULE_PATH;
  const previousExecution = process.env.SPECDOJO_EXECUTION_PATH;
  const root = mkdtempSync(join(tmpdir(), "specdojo-dependency-"));
  mkdirSync(join(root, ".specdojo"));
  mkdirSync(join(root, "register"));
  writeFileSync(
    join(root, ".specdojo/specdojo.config.json"),
    JSON.stringify({
      version: 1,
      current_project: "prj-test",
      projects: {
        "prj-test": { project_register_path: "register" },
        "prj-other": {
          project_register_path: "other",
          integration_branch: "project/prj-other/develop",
        },
      },
    }),
  );
  process.chdir(root);
  try {
    return await fn("register");
  } finally {
    process.chdir(cwd);
    if (previousSchedule === undefined) delete process.env.SPECDOJO_SCHEDULE_PATH;
    else process.env.SPECDOJO_SCHEDULE_PATH = previousSchedule;
    if (previousExecution === undefined) delete process.env.SPECDOJO_EXECUTION_PATH;
    else process.env.SPECDOJO_EXECUTION_PATH = previousExecution;
    rmSync(root, { recursive: true, force: true });
  }
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
  process.exitCode = undefined;
});

describe("register execution dependencies", () => {
  it("normalizes repeated IDs and supports removing dependencies", () => {
    expect(normalizeDependsOn([" PJR-AB12 ", "PJR-AB12", "PJR-CD34"])).toEqual([
      "PJR-AB12",
      "PJR-CD34",
    ]);
    expect(normalizeDependsOn(["-"])).toBeUndefined();
    expect(() => normalizeDependsOn(["-", "PJR-AB12"])).toThrow("cannot be combined");
  });

  it.each([
    { refs: ["PJR-ZZ99"], message: "Depends-on item not found" },
    { refs: ["PJR-AB12"], message: "cannot depend on itself" },
    { refs: ["prj-test:PJR-AB12"], message: "cannot depend on itself" },
    { refs: ["invalid"], message: "Invalid depends_on item ID" },
    { refs: ["unknown:PJR-AB12"], message: "unknown project unknown" },
  ])("rejects invalid dependencies: $message", ({ refs, message }) =>
    withRegister((dir) => {
      writeFileSync(join(dir, "pjr-ab12-test.md"), ticket("PJR-AB12", "open", refs));
      const paths = resolveRegisterPaths({ project: "prj-test" });
      expect(() => validateRegisterDependencies(paths)).toThrow(message);
      expect(validateRegisterDependencyDocs(paths)[0]).toContain(message);
    }),
  );

  it("detects transitive cycles, including an update before it is written", () =>
    withRegister((dir) => {
      writeFileSync(join(dir, "pjr-ab12-test.md"), ticket("PJR-AB12", "open", ["PJR-CD34"]));
      writeFileSync(join(dir, "pjr-cd34-test.md"), ticket("PJR-CD34", "open", ["PJR-EF56"]));
      writeFileSync(join(dir, "pjr-ef56-test.md"), ticket("PJR-EF56"));
      const paths = resolveRegisterPaths({ project: "prj-test" });
      expect(() => validateRegisterDependencies(paths)).not.toThrow();
      const updated = readRegisterItemContent(
        ticket("PJR-EF56", "open", ["PJR-AB12"]),
        "pjr-ef56-test.md",
      )!.item;
      expect(() => validateRegisterDependencies(paths, updated)).toThrow("depends_on cycle");
      expect(readFileSync(join(dir, "pjr-ef56-test.md"), "utf8")).not.toContain("depends_on");
    }));

  it.each(["open", "in-progress", "waiting", "review", "rejected", "deferred", "done", "decided"])(
    "only successful terminal predecessors allow execution: %s",
    (status) =>
      withRegister((dir) => {
        writeFileSync(join(dir, "pjr-ab12-test.md"), ticket("PJR-AB12", status));
        const current = readRegisterItemContent(
          ticket("PJR-CD34", "open", ["PJR-AB12"]),
          "pjr-cd34-test.md",
        )!.item;
        const reason = registerDependencyBlockReason(
          resolveRegisterPaths({ project: "prj-test" }),
          current,
        );
        if (["done", "decided"].includes(status)) expect(reason).toBeUndefined();
        else expect(reason).toContain(`PJR-AB12 (${status})`);
      }),
  );

  it("uses another project's integration tree and detects cross-project cycles", () =>
    withRegister((dir) => {
      writeFileSync(
        join(dir, "pjr-ab12-test.md"),
        ticket("PJR-AB12", "open", ["prj-other:PJR-CD34"]),
      );
      const branch = "project/prj-other/develop";
      vi.mocked(gitResult).mockReturnValue({ status: 0 } as ReturnType<typeof gitResult>);
      let external = ticket("PJR-CD34", "decided", [], "prj-other");
      vi.mocked(gitOutput).mockImplementation((_root, args) =>
        args[0] === "ls-tree" ? "other/pjr-cd34-test.md" : external,
      );
      const paths = resolveRegisterPaths({ project: "prj-test" });
      const current = readRegisterItemContent(
        readFileSync(join(dir, "pjr-ab12-test.md"), "utf8"),
        "pjr-ab12-test.md",
      )!.item;
      expect(registerDependencyBlockReason(paths, current)).toBeUndefined();
      expect(gitOutput).toHaveBeenCalledWith(expect.any(String), [
        "show",
        `${branch}:other/pjr-cd34-test.md`,
      ]);
      external = ticket("PJR-CD34", "open", ["prj-test:PJR-AB12"], "prj-other");
      expect(() => validateRegisterDependencies(paths)).toThrow("depends_on cycle");
    }));

  it("blocks when a configured predecessor project has no local integration branch", () =>
    withRegister((dir) => {
      writeFileSync(
        join(dir, "pjr-ab12-test.md"),
        ticket("PJR-AB12", "open", ["prj-other:PJR-CD34"]),
      );
      vi.mocked(gitResult).mockReturnValue({ status: 1 } as ReturnType<typeof gitResult>);
      expect(() =>
        validateRegisterDependencies(resolveRegisterPaths({ project: "prj-test" })),
      ).toThrow("integration branch does not exist locally");
    }));

  it.each([runSingleRegisterItem, runSingleRegisterItemWorktree, resumeSingleRegisterItemWorktree])(
    "skips before creating plans, worktrees, or transitions",
    async (run) =>
      withRegister(async (dir) => {
        const before = ticket("PJR-CD34", "open", ["PJR-AB12"]);
        writeFileSync(join(dir, "pjr-ab12-test.md"), ticket("PJR-AB12", "rejected"));
        writeFileSync(join(dir, "pjr-cd34-test.md"), before);
        const context = { projectId: "prj-test" } as RegisterRunContext;
        const result = await run(context, {} as RunOpts, "PJR-CD34");
        expect(result).toMatchObject({
          outcome: "skipped",
          transition: "none",
          reason: expect.stringContaining("PJR-AB12 (rejected)"),
        });
        expect(readFileSync(join(dir, "pjr-cd34-test.md"), "utf8")).toBe(before);
      }),
  );

  it("refuses a direct run and logs a sweep skip without needing an agent", async () =>
    withRegister(async (dir) => {
      writeFileSync(join(dir, "pjr-ab12-test.md"), ticket("PJR-AB12", "deferred"));
      writeFileSync(join(dir, "pjr-cd34-test.md"), ticket("PJR-CD34", "open", ["PJR-AB12"]));
      const stdout = vi.spyOn(process.stdout, "write").mockReturnValue(true);
      await expect(
        runRegisterMode({ project: "prj-test", register: ["PJR-CD34"], dryRun: true } as RunOpts),
      ).rejects.toThrow("PJR-AB12 (deferred)");
      await runRegisterMode({
        project: "prj-test",
        registerFilter: true,
        registerStatuses: "open",
        dryRun: true,
      } as RunOpts);
      expect(stdout.mock.calls.flat().join("")).toContain(
        "Skipping PJR-CD34: Unfinished depends_on",
      );
    }));

  it("records blocked night queue items in the morning report without changing their status", async () =>
    withRegister(async (dir) => {
      writeFileSync(join(dir, "pjr-ab12-test.md"), ticket("PJR-AB12", "review"));
      const before = ticket("PJR-CD34", "open", ["PJR-AB12"]);
      writeFileSync(join(dir, "pjr-cd34-test.md"), before);
      vi.spyOn(process.stdout, "write").mockReturnValue(true);
      const command = new Command();
      registerNightOrchestratorCommand(command);
      await command.parseAsync(
        ["night", "--project", "prj-test", "--scheduled-at", "2026-10-28T00:00:00Z"],
        { from: "user" },
      );
      const report = readFileSync(
        "execution/reports/night-orchestrator/night-orchestrator-20261028T000000000Z.md",
        "utf8",
      );
      expect(report).toContain(
        "| PJR-CD34 | skipped | none | Unfinished depends_on: PJR-AB12 (review) |",
      );
      expect(readFileSync(join(dir, "pjr-cd34-test.md"), "utf8")).toBe(before);
    }));
});
