import { Command } from "commander";
import { describe, expect, it } from "vitest";
import { registerCatalogCommands } from "../../src/catalog/catalog.js";
import { registerDeliverableCommands } from "../../src/deliverable/deliverable.js";
import { registerExecCommands } from "../../src/exec/exec.js";
import { registerGradeCommand } from "../../src/grade/grade.js";
import { registerConfigCommands } from "../../src/shared/specdojo-config.js";
import { registerScheduleCommands } from "../../src/schedule/schedule.js";
import { registerRegisterCommands } from "../../src/register/register.js";
import { registerIndexCommands } from "../../src/docs/index-command.js";
import { registerYamlPagesCommands } from "../../src/docs/yaml-pages-command.js";
import { registerDashboardCommands } from "../../src/dashboard/dashboard.js";
import { registerAgentCommands } from "../../src/commands/agent.js";

function subcommandNames(program: Command, name: string): string[] {
  return (
    program.commands
      .find((command) => command.name() === name)
      ?.commands.map((command) => command.name()) ?? []
  );
}

describe("CLI generation verb taxonomy", () => {
  it("retains all six build entries for automation while hiding them from command lists", () => {
    const program = new Command();
    registerCatalogCommands(program);
    registerScheduleCommands(program);
    registerRegisterCommands(program);
    registerIndexCommands(program);
    registerYamlPagesCommands(program);
    registerDashboardCommands(program);

    for (const name of ["catalog", "schedule", "register", "index", "yaml-pages", "dashboard"]) {
      const group = program.commands.find((command) => command.name() === name)!;
      const build = group.commands.find((command) => command.name() === "build");
      expect(build?.description()).toBe(`Internal compatibility entry for build --only ${name}`);
      expect(
        group
          .createHelp()
          .visibleCommands(group)
          .map((command) => command.name()),
      ).not.toContain("build");
    }
    const visible = program
      .createHelp()
      .visibleCommands(program)
      .map((command) => command.name());
    expect(visible).not.toContain("yaml-pages");
    expect(visible).not.toContain("dashboard");
  });

  it("offers provider setup under config while retaining the exec compatibility entry", () => {
    const program = new Command();
    registerConfigCommands(program);
    registerExecCommands(program);

    expect(subcommandNames(program, "config")).toEqual([
      "init",
      "show",
      "migrate-members",
      "scaffold",
    ]);
    expect(subcommandNames(program, "exec")).toContain("scaffold");
  });

  it("registers deliverable scaffold and removes catalog generate", () => {
    const program = new Command();
    registerCatalogCommands(program);
    registerDeliverableCommands(program);

    expect(subcommandNames(program, "deliverable")).toEqual(["scaffold", "trash"]);
    expect(subcommandNames(program, "catalog")).not.toContain("generate");
  });

  it("registers exec refresh and removes exec build", () => {
    const program = new Command();
    registerExecCommands(program);

    expect(subcommandNames(program, "exec")).toContain("refresh");
    expect(subcommandNames(program, "exec")).not.toContain("build");
  });

  it("registers the grade list/plan/apply/validate/run workflow", () => {
    const program = new Command();
    registerGradeCommand(program);

    expect(subcommandNames(program, "grade")).toEqual([
      "list",
      "plan",
      "apply",
      "translation-plan",
      "localize",
      "validate",
      "result",
      "state",
      "migrate",
      "run",
    ]);
    const apply = program.commands
      .find((command) => command.name() === "grade")
      ?.commands.find((command) => command.name() === "apply");
    expect(apply?.options.find((option) => option.long === "--by")?.mandatory).toBe(true);
  });

  it("hides internal commands from help while keeping them registered (PJR-R7BQ)", () => {
    // runner・job・orchestrator が部品として呼ぶコマンドは、登録を保ったまま一覧から外す。
    const program = new Command();
    registerGradeCommand(program);
    registerExecCommands(program);
    registerAgentCommands(program);
    const visible = (group: Command): string[] =>
      group
        .createHelp()
        .visibleCommands(group)
        .map((command) => command.name());
    const find = (name: string): Command =>
      program.commands.find((command) => command.name() === name)!;

    const internalGrade = ["plan", "apply", "translation-plan", "localize", "state", "result"];
    for (const name of [...internalGrade, "validate"]) {
      expect(subcommandNames(program, "grade")).toContain(name);
      expect(visible(find("grade"))).not.toContain(name);
    }
    expect(visible(find("grade"))).toEqual(expect.arrayContaining(["list", "run"]));
    for (const name of ["trial", "slots", "scheduler"]) {
      expect(subcommandNames(program, "exec")).toContain(name);
      expect(visible(find("exec"))).not.toContain(name);
    }
    expect(visible(find("exec"))).toEqual(expect.arrayContaining(["run", "status", "claim"]));
    expect(subcommandNames(program, "agent")).toEqual(["launch", "run"]);
    expect(visible(find("agent"))).toEqual(["help"]);
    expect(visible(program)).not.toContain("agent");
  });

  it("accepts the grading reference on grade apply", () => {
    // plan と apply は別コマンドのため、判定に用いたリファレンスを apply へも渡す。
    const program = new Command();
    registerGradeCommand(program);
    const apply = program.commands
      .find((command) => command.name() === "grade")
      ?.commands.find((command) => command.name() === "apply");

    expect((apply?.options ?? []).map((option) => option.long)).toContain("--reference");
  });

  it("offers reference selection as an opt-in on grade plan", () => {
    // 比較リファレンスは既定で付けない。効果が未実証であり、executor の読み込み
    // 対象も増えるため、利用する場合だけ明示的に指定させる。
    const program = new Command();
    registerGradeCommand(program);
    const plan = program.commands
      .find((command) => command.name() === "grade")
      ?.commands.find((command) => command.name() === "plan");
    const longs = (plan?.options ?? []).map((option) => option.long);

    expect(longs).toContain("--reference");
    expect(longs).toContain("--random-reference");
    expect(longs).toContain("--embed-documents");
    expect(plan?.options.find((option) => option.long === "--random-reference")?.defaultValue).toBe(
      false,
    );
    expect(plan?.options.find((option) => option.long === "--embed-documents")?.defaultValue).toBe(
      false,
    );
  });

  it("offers stored-result filters on every grade workflow command", () => {
    const program = new Command();
    registerGradeCommand(program);
    const grade = program.commands.find((command) => command.name() === "grade");

    for (const command of (grade?.commands ?? []).filter((command) =>
      ["list", "plan", "apply", "validate", "run"].includes(command.name()),
    )) {
      const longs = command.options.map((option) => option.long);
      expect(longs).toEqual(
        expect.arrayContaining([
          "--verdict",
          "--min-score",
          "--max-findings",
          "--ungraded",
          "--incomplete",
        ]),
      );
    }
  });
});
