import { describe, expect, it } from "vitest";
import {
  formatDoctorReport,
  runDoctorChecks,
  type CommandRunner,
  type DoctorContext,
} from "../../../src/commands/doctor.js";

function context(installed: Record<string, string>, overrides: Partial<DoctorContext> = {}) {
  const run: CommandRunner = (command, args) => {
    if (command === "git" && args[0] === "config") return installed[`git ${args[2]}`];
    return installed[command];
  };
  return {
    run,
    os: "linux",
    cwd: "/home/alice/project",
    insideContainer: false,
    nodeVersion: "22.17.0",
    ...overrides,
  } satisfies DoctorContext;
}

const BASE = {
  git: "git version 2.50.0",
  "git user.name": "Alice",
  "git user.email": "alice@example.com",
  claude: "1.0.0",
};

function status(checks: ReturnType<typeof runDoctorChecks>, name: string) {
  return checks.find((check) => check.name === name)?.status;
}

describe("runDoctorChecks", () => {
  it("passes the local pattern when node, git identity, and an agent CLI are present", () => {
    const checks = runDoctorChecks({}, context(BASE));

    expect(checks.filter((check) => check.status === "missing")).toEqual([]);
    expect(checks.map((check) => check.name)).not.toContain("tmux");
    expect(checks.map((check) => check.name)).not.toContain("docker");
  });

  it("reports an old node and a missing git identity as missing", () => {
    const { "git user.email": _email, ...withoutEmail } = BASE;
    const checks = runDoctorChecks({}, context(withoutEmail, { nodeVersion: "22.16.0" }));

    expect(status(checks, "node")).toBe("missing");
    expect(status(checks, "git user.email")).toBe("missing");
    expect(status(checks, "git user.name")).toBe("ok");
  });

  it("requires at least one agent CLI", () => {
    const { claude: _claude, ...withoutAgent } = BASE;
    const checks = runDoctorChecks({}, context(withoutAgent));

    expect(status(checks, "agent CLI")).toBe("missing");
  });

  it("checks tmux with brew as the hint on macOS", () => {
    const checks = runDoctorChecks({ tmux: true }, context(BASE, { os: "macos" }));
    const tmux = checks.find((check) => check.name === "tmux");

    expect(tmux?.status).toBe("missing");
    expect(tmux?.hint).toBe("brew install tmux");
  });

  it("checks docker and the devcontainer CLI outside a container", () => {
    const checks = runDoctorChecks(
      { devcontainer: true, tmux: true },
      context({ ...BASE, docker: "Docker version 28.0.0", tmux: "tmux 3.5a" }),
    );

    expect(status(checks, "docker")).toBe("ok");
    expect(status(checks, "devcontainer CLI")).toBe("missing");
    expect(status(checks, "tmux")).toBe("ok");
  });

  it("only warns about the devcontainer CLI when tmux is not used", () => {
    const checks = runDoctorChecks(
      { devcontainer: true },
      context({ ...BASE, docker: "Docker version 28.0.0" }),
    );

    expect(status(checks, "devcontainer CLI")).toBe("warn");
  });

  it("skips host tools inside the Dev Container", () => {
    const checks = runDoctorChecks(
      { devcontainer: true, tmux: true },
      context(BASE, { insideContainer: true }),
    );

    expect(checks.map((check) => check.name)).not.toContain("docker");
    expect(checks.map((check) => check.name)).not.toContain("tmux");
  });

  it("warns when a WSL repository is on the Windows file system", () => {
    const checks = runDoctorChecks({}, context(BASE, { os: "wsl", cwd: "/mnt/c/work/project" }));

    expect(status(checks, "WSL path")).toBe("warn");
  });
});

describe("formatDoctorReport", () => {
  it("prints hints for problems and counts the missing prerequisites", () => {
    const report = formatDoctorReport(
      runDoctorChecks({ tmux: true }, context(BASE, { os: "wsl" })),
    );

    expect(report).toContain("[NG] tmux");
    expect(report).toContain("-> sudo apt install tmux");
    expect(report).toContain("1 required prerequisite(s) are missing.");
  });
});
