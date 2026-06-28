import { Command } from "commander";
import { describe, expect, it } from "vitest";
import { registerScheduleCommands } from "../../src/schedule.js";

describe("schedule command registration", () => {
  it("build コマンドを登録する", () => {
    const program = new Command();
    registerScheduleCommands(program);

    const schedule = program.commands.find((command) => command.name() === "schedule");
    const commandNames = schedule?.commands.map((command) => command.name());
    const help = schedule?.helpInformation();

    expect(commandNames).toEqual(["where", "build"]);
    expect(help).toContain("build");
  });
});
