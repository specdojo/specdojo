// 導入の前提を確かめる `specdojo doctor`（PJR-GA72）。
//
// 環境のパターン（Dev Container か手元か、tmux を使うか）ごとに、要るコマンドとその状態を確かめ、
// 足りないものと入れ方を出す。必須のものが足りないときは終了コード 1 にする。
// コマンドの実行は差し替えられるようにし、判定は単体テストで確かめる。

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import type { Command } from "commander";
import { detectHostOs, hostOsLabel, type HostOs } from "../init/environment.js";

export type CheckStatus = "ok" | "missing" | "warn" | "info";

export type DoctorCheck = {
  name: string;
  status: CheckStatus;
  detail: string;
  /** 足りないときの入れ方。 */
  hint?: string;
};

export type DoctorOptions = {
  devcontainer?: boolean;
  tmux?: boolean;
};

export type CommandRunner = (command: string, args: string[]) => string | undefined;

export type DoctorContext = {
  run: CommandRunner;
  os: HostOs;
  cwd: string;
  insideContainer: boolean;
  nodeVersion: string;
};

const MIN_NODE = [22, 17] as const;
const AGENT_CLIS = ["claude", "codex", "opencode", "copilot"] as const;

const defaultRunner: CommandRunner = (command, args) => {
  const result = spawnSync(command, args, { encoding: "utf8", timeout: 15_000 });
  if (result.error || result.status !== 0) return undefined;
  return `${result.stdout ?? ""}`.trim() || `${result.stderr ?? ""}`.trim();
};

export function defaultDoctorContext(): DoctorContext {
  return {
    run: defaultRunner,
    os: detectHostOs(),
    cwd: process.cwd(),
    insideContainer:
      existsSync("/.dockerenv") ||
      !!process.env.REMOTE_CONTAINERS ||
      !!process.env.CODESPACES ||
      !!process.env.DEVCONTAINER,
    nodeVersion: process.versions.node,
  };
}

function firstLine(value: string): string {
  return value.split(/\r?\n/u)[0]?.trim() ?? "";
}

function nodeVersionOk(version: string): boolean {
  const [major = 0, minor = 0] = version.split(".").map((part) => Number.parseInt(part, 10));
  return major > MIN_NODE[0] || (major === MIN_NODE[0] && minor >= MIN_NODE[1]);
}

function installHint(os: HostOs, tool: "git" | "tmux" | "docker"): string {
  if (tool === "docker") {
    return os === "macos" || os === "wsl"
      ? "Install Docker Desktop (on WSL, enable the WSL integration)."
      : "Install Docker Engine and add your user to the docker group.";
  }
  return os === "macos" ? `brew install ${tool}` : `sudo apt install ${tool}`;
}

export function runDoctorChecks(options: DoctorOptions, context: DoctorContext): DoctorCheck[] {
  const { run, os } = context;
  const checks: DoctorCheck[] = [];

  checks.push({
    name: "environment",
    status: "info",
    detail: context.insideContainer
      ? `inside a container on ${hostOsLabel(os)}`
      : `${hostOsLabel(os)} (not in a container)`,
  });

  checks.push(
    nodeVersionOk(context.nodeVersion)
      ? { name: "node", status: "ok", detail: `v${context.nodeVersion}` }
      : {
          name: "node",
          status: "missing",
          detail: `v${context.nodeVersion} (needs >= ${MIN_NODE.join(".")})`,
          hint: "Install Node.js 22.17 or later (e.g. with nvm or the official installer).",
        },
  );

  const git = run("git", ["--version"]);
  if (!git) {
    checks.push({
      name: "git",
      status: "missing",
      detail: "not found",
      hint: installHint(os, "git"),
    });
  } else {
    checks.push({ name: "git", status: "ok", detail: firstLine(git) });
    for (const key of ["user.name", "user.email"]) {
      const value = run("git", ["config", "--get", key]);
      checks.push(
        value
          ? { name: `git ${key}`, status: "ok", detail: "set" }
          : {
              name: `git ${key}`,
              status: "missing",
              detail: "not set",
              hint: `git config --global ${key} "<your ${key === "user.name" ? "name" : "email"}>"`,
            },
      );
    }
  }

  const agents = AGENT_CLIS.filter((cli) => run(cli, ["--version"]) !== undefined);
  checks.push(
    agents.length > 0
      ? { name: "agent CLI", status: "ok", detail: agents.join(", ") }
      : {
          name: "agent CLI",
          status: "missing",
          detail: `none of ${AGENT_CLIS.join(", ")} found`,
          hint: "Install at least one agent CLI (e.g. npm install -g @anthropic-ai/claude-code or @openai/codex) and log in.",
        },
  );

  if (options.devcontainer && !context.insideContainer) {
    const docker = run("docker", ["--version"]);
    checks.push(
      docker
        ? { name: "docker", status: "ok", detail: firstLine(docker) }
        : {
            name: "docker",
            status: "missing",
            detail: "not found",
            hint: installHint(os, "docker"),
          },
    );
    const devcontainerCli = run("devcontainer", ["--version"]);
    checks.push(
      devcontainerCli
        ? { name: "devcontainer CLI", status: "ok", detail: firstLine(devcontainerCli) }
        : {
            name: "devcontainer CLI",
            status: options.tmux ? "missing" : "warn",
            detail: "not found",
            hint: "npm install -g @devcontainers/cli (needed to start the container from the tmux host script; VS Code users can open the container without it).",
          },
    );
  }

  if (options.tmux && !(options.devcontainer && context.insideContainer)) {
    const tmux = run("tmux", ["-V"]);
    checks.push(
      tmux
        ? { name: "tmux", status: "ok", detail: firstLine(tmux) }
        : {
            name: "tmux",
            status: "missing",
            detail: "not found",
            hint: installHint(os, "tmux"),
          },
    );
  }

  if (os === "wsl" && context.cwd.startsWith("/mnt/")) {
    checks.push({
      name: "WSL path",
      status: "warn",
      detail: `${context.cwd} is on the Windows file system`,
      hint: "Move the repository under your Linux home (e.g. ~/src) for speed and file permissions.",
    });
  }

  return checks;
}

const MARK: Record<CheckStatus, string> = { ok: "ok", missing: "NG", warn: "!!", info: "--" };

export function formatDoctorReport(checks: DoctorCheck[]): string {
  const width = Math.max(...checks.map((check) => check.name.length));
  const lines = checks.map((check) => {
    const head = `[${MARK[check.status]}] ${check.name.padEnd(width)}  ${check.detail}`;
    return check.hint && check.status !== "ok" ? `${head}\n      -> ${check.hint}` : head;
  });
  const missing = checks.filter((check) => check.status === "missing").length;
  lines.push(
    missing === 0
      ? "All required prerequisites are in place."
      : `${missing} required prerequisite(s) are missing.`,
  );
  return `${lines.join("\n")}\n`;
}

export function registerDoctorCommand(program: Command): void {
  program
    .command("doctor")
    .description("Check the prerequisites for the chosen environment (Dev Container / local, tmux)")
    .option("--devcontainer", "Check Docker and the Dev Container CLI", false)
    .option("--tmux", "Check tmux", false)
    .action((options: DoctorOptions) => {
      const checks = runDoctorChecks(options, defaultDoctorContext());
      process.stdout.write(formatDoctorReport(checks));
      if (checks.some((check) => check.status === "missing")) process.exitCode = 1;
    });
}
