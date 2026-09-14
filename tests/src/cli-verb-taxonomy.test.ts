import { Command } from "commander";
import { describe, expect, it } from "vitest";
import { registerCatalogCommands } from "../../src/catalog.js";
import { registerDeliverableCommands } from "../../src/deliverable.js";
import { registerExecCommands } from "../../src/exec.js";
import { registerGradeCommand } from "../../src/grade.js";
import { registerConfigCommands } from "../../src/specdojo-config.js";

function subcommandNames(program: Command, name: string): string[] {
  return (
    program.commands
      .find((command) => command.name() === name)
      ?.commands.map((command) => command.name()) ?? []
  );
}

describe("CLI generation verb taxonomy", () => {
  it("offers provider setup under config while retaining the exec compatibility entry", () => {
    const program = new Command();
    registerConfigCommands(program);
    registerExecCommands(program);

    expect(subcommandNames(program, "config")).toEqual(["init", "scaffold"]);
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

  it("registers the grade list/plan/apply/validate workflow", () => {
    const program = new Command();
    registerGradeCommand(program);

    expect(subcommandNames(program, "grade")).toEqual([
      "list",
      "plan",
      "apply",
      "validate",
      "state",
    ]);
    const apply = program.commands
      .find((command) => command.name() === "grade")
      ?.commands.find((command) => command.name() === "apply");
    expect(apply?.options.find((option) => option.long === "--by")?.mandatory).toBe(true);
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
    expect(plan?.options.find((option) => option.long === "--random-reference")?.defaultValue).toBe(
      false,
    );
  });

  it("offers stored-result filters on every grade workflow command", () => {
    const program = new Command();
    registerGradeCommand(program);
    const grade = program.commands.find((command) => command.name() === "grade");

    for (const command of (grade?.commands ?? []).filter((command) => command.name() !== "state")) {
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
