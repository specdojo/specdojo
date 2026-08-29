import { Command } from "commander";
import { describe, expect, it } from "vitest";
import { registerCatalogCommands } from "../../src/catalog.js";
import { registerDeliverableCommands } from "../../src/deliverable.js";
import { registerExecCommands } from "../../src/exec.js";
import { registerGradeCommand } from "../../src/grade.js";

function subcommandNames(program: Command, name: string): string[] {
  return (
    program.commands
      .find((command) => command.name() === name)
      ?.commands.map((command) => command.name()) ?? []
  );
}

describe("CLI generation verb taxonomy", () => {
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

  it("registers the grade prompt/apply/validate workflow", () => {
    const program = new Command();
    registerGradeCommand(program);

    expect(subcommandNames(program, "grade")).toEqual(["prompt", "apply", "validate"]);
  });
});
