import { Command, CommanderError } from "commander";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { spawnSync } from "node:child_process";
import { registerBuildCommand } from "../../../src/commands/build.js";
import { loadConfig, loadEnv } from "../../../src/shared/specdojo-config.js";
import type { SpecDojoConfig } from "../../../src/shared/specdojo-config.js";

vi.mock("node:child_process", () => ({ spawnSync: vi.fn() }));
vi.mock("../../../src/shared/specdojo-config.js", () => ({
  loadEnv: vi.fn(),
  loadConfig: vi.fn(),
  specdojoRootDir: () => ".",
}));
vi.mock("../../../src/shared/spawn-self.js", () => ({
  selfRunArgs: (args: string[]) => ["specdojo", args],
}));

const config: SpecDojoConfig = {
  version: 1,
  projects: {
    "prj-test": {
      base_path: "docs/ja/projects/prj-test",
      schedule_path: "schedule",
      execution_path: "execution",
      catalog_path: "catalog",
      project_register_path: "register",
    },
  },
};

function program(): Command {
  const cli = new Command().exitOverride().configureOutput({ writeErr: () => {} });
  registerBuildCommand(cli);
  return cli;
}

function run(...args: string[]): void {
  program().parse(["build", "--project", "prj-test", ...args], { from: "user" });
}

function invokedArgs(): unknown[] {
  return vi.mocked(spawnSync).mock.calls.map((call) => call[1]);
}

beforeEach(() => {
  vi.mocked(loadConfig).mockReturnValue({ config, configPath: "specdojo.config.json" });
  vi.mocked(spawnSync).mockReturnValue({ status: 0 } as ReturnType<typeof spawnSync>);
  vi.spyOn(process.stdout, "write").mockImplementation(() => true);
  vi.spyOn(process.stderr, "write").mockImplementation(() => true);
  process.exitCode = 0;
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
  process.exitCode = 0;
});

describe("build --only", () => {
  it.each([
    ["index", ["index", "build"]],
    ["catalog", ["catalog", "build", "--project", "prj-test"]],
    ["register", ["register", "build", "--project", "prj-test"]],
    ["dashboard", ["dashboard", "build", "--project", "prj-test"]],
    ["yaml-pages", ["yaml-pages", "build"]],
    ["exec", ["exec", "refresh", "--project", "prj-test"]],
  ])("runs only %s using the existing internal entry", (category, expected) => {
    run("--only", category as string);
    expect(invokedArgs()).toEqual([expected]);
    expect(process.exitCode).toBe(0);
  });

  it("forwards schedule track and explicit overwrite without refreshing execution state", () => {
    run("--only", "schedule", "--track", "launch", "--force");
    expect(invokedArgs()).toEqual([
      ["schedule", "build", "--project", "prj-test", "--track", "launch", "--force"],
    ]);
  });

  it("preserves schedule overwrite protection by default", () => {
    run("--only", "schedule", "--track", "launch");
    expect(invokedArgs()).toEqual([
      ["schedule", "build", "--project", "prj-test", "--track", "launch"],
    ]);
  });

  it("preserves the default build order without overwriting track YAML", () => {
    run();
    expect(invokedArgs()).toEqual([
      ["exec", "refresh", "--project", "prj-test"],
      ["catalog", "build", "--project", "prj-test"],
      ["register", "build", "--project", "prj-test"],
      ["yaml-pages", "build"],
      ["dashboard", "build", "--project", "prj-test"],
      ["index", "build"],
    ]);
  });

  it("preserves --scope and --scope all as hidden compatibility options", () => {
    run("--scope", "catalog");
    expect(invokedArgs()).toEqual([["catalog", "build", "--project", "prj-test"]]);
    vi.mocked(spawnSync).mockClear();
    run("--scope", "all");
    expect(invokedArgs()).toHaveLength(6);
    const help = program().commands[0].helpInformation();
    expect(help).toContain("--only");
    expect(help).not.toContain("--scope");
  });

  it.each([
    ["--only", "unknown"],
    ["--only", "all"],
    ["--only", "index", "--scope", "catalog"],
  ])("rejects invalid or conflicting selection: %j", (...args) => {
    expect(() => run(...args)).toThrow(CommanderError);
    expect(spawnSync).not.toHaveBeenCalled();
    expect(loadEnv).not.toHaveBeenCalled();
  });

  it.each([
    ["--only", "schedule"],
    ["--only", "schedule", "--track", " "],
    ["--only", "catalog", "--track", "launch"],
    ["--force"],
    ["--root", "docs"],
    ["--only", "yaml-pages", "--output", "index.json"],
    ["--only", "catalog", "--register-scope", "controls"],
  ])("rejects inappropriate options before running any steps: %j", (...args) => {
    run(...args);
    expect(process.exitCode).toBe(1);
    expect(spawnSync).not.toHaveBeenCalled();
    expect(loadEnv).not.toHaveBeenCalled();
    expect(process.stderr.write).toHaveBeenCalled();
  });

  it("forwards the index scan root and output path", () => {
    run("--only", "index", "--root", "other-docs", "--output", "tmp/index.json");
    expect(invokedArgs()).toEqual([
      ["index", "build", "--root", "other-docs", "--output", "tmp/index.json"],
    ]);
  });

  it("forwards the YAML page scan root", () => {
    run("--only", "yaml-pages", "--root", "other-docs");
    expect(invokedArgs()).toEqual([["yaml-pages", "build", "--root", "other-docs"]]);
  });

  it("forwards the register view scope", () => {
    run("--only", "register", "--register-scope", "controls");
    expect(invokedArgs()).toEqual([
      ["register", "build", "--project", "prj-test", "--scope", "controls"],
    ]);
  });

  it("prints the schedule invocation without writing in dry-run mode", () => {
    run("--only", "schedule", "--track", "launch", "--force", "--dry-run");
    expect(spawnSync).not.toHaveBeenCalled();
    expect(process.stdout.write).toHaveBeenCalledWith(
      expect.stringContaining("schedule build --project prj-test --track launch --force"),
    );
  });

  it("fails for an unconfigured category", () => {
    vi.mocked(loadConfig).mockReturnValue({
      config: { version: 1, projects: { "prj-test": { base_path: "docs" } } },
      configPath: "specdojo.config.json",
    });
    run("--only", "schedule", "--track", "launch");
    expect(process.exitCode).toBe(1);
    expect(spawnSync).not.toHaveBeenCalled();
  });

  it("stops on a failed internal build", () => {
    vi.mocked(spawnSync).mockReturnValueOnce({ status: 2 } as ReturnType<typeof spawnSync>);
    run();
    expect(process.exitCode).toBe(1);
    expect(spawnSync).toHaveBeenCalledTimes(1);
  });
});
