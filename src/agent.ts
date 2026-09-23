import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { type Command } from "commander";
import {
  defaultExecDefaultsPath,
  loadExecDefaultsConfig,
  resolveMemberCommand,
  resolveRateLimitDetection,
  resolveRateLimitPolicy,
  type ExecDefaultsConfig,
} from "./exec-agent-config.js";
import { resolveProjectPaths } from "./exec-project.js";
import { executeAgent, loadRosterForExecutionPath, type AgentExecution } from "./exec-run.js";
import { gitEnvironment } from "./git-environment.js";
import { specdojoRootDir, type MemberRoster, type ProjectMember } from "./specdojo-config.js";

// Rate limit は通常失敗と異なり、呼び出し側が処理済みにせず中断・再開する必要がある。
// shell script が出力文字列を解析せず分岐できるよう、一時失敗を表す専用コードにする。
export const AGENT_RUN_RATE_LIMIT_EXIT_CODE = 75;

export function resolveAgentMember(
  roster: MemberRoster | null,
  nickname: string,
): { member: ProjectMember } | { error: string } {
  const members = roster?.members.filter((candidate) => {
    return candidate.type === "agent" && candidate.nickname === nickname;
  });
  if (!members || members.length === 0) {
    return { error: `--by agent nickname not found in pm-members.yaml: ${nickname}` };
  }
  if (members.length !== 1) {
    return { error: `--by agent nickname is not unique in pm-members.yaml: ${nickname}` };
  }
  const [member] = members;
  if (member.disabled) {
    return { error: `--by agent is disabled in pm-members.yaml: ${nickname}` };
  }
  return { member };
}

export function resolveAgentCommand(
  execDefaults: ExecDefaultsConfig,
  member: ProjectMember,
): { command: string } | { error: string } {
  let command: string | undefined;
  try {
    command = resolveMemberCommand(execDefaults, member);
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
  if (!command) {
    return { error: `--by agent has no resolvable command: ${member.nickname}` };
  }
  return { command };
}

export function readAgentPlan(planPath: string): string {
  const absolutePath = resolve(planPath);
  if (!existsSync(absolutePath)) {
    throw new Error(`--plan not found: ${planPath}`);
  }
  const prompt = readFileSync(absolutePath, "utf8");
  if (!prompt.trim()) {
    throw new Error(`--plan is empty: ${planPath}`);
  }
  return prompt;
}

export function writeAgentOutput(outPath: string, stdout: string): string {
  const absolutePath = resolve(outPath);
  mkdirSync(dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, stdout, "utf8");
  return absolutePath;
}

export async function runAgentPlan(opts: {
  planPath: string;
  nickname: string;
  project?: string;
  execDefaultsPath?: string;
  dryRun?: boolean;
  quiet?: boolean;
}): Promise<{ execution?: AgentExecution; command: string; actor: string }> {
  const prompt = readAgentPlan(opts.planPath);
  const paths = resolveProjectPaths({ project: opts.project });
  const roster = loadRosterForExecutionPath(paths.executionPath);

  const memberResult = resolveAgentMember(roster, opts.nickname);
  if ("error" in memberResult) throw new Error(memberResult.error);
  const { member } = memberResult;

  const execDefaults = loadExecDefaultsConfig(
    opts.execDefaultsPath ?? defaultExecDefaultsPath(),
    paths.executionPath,
  );
  const commandResult = resolveAgentCommand(execDefaults, member);
  if ("error" in commandResult) throw new Error(commandResult.error);
  const { command } = commandResult;

  if (opts.dryRun) {
    process.stdout.write(`${command}\n`);
    return { command, actor: member.nickname };
  }

  const execution = await executeAgent(
    command,
    prompt,
    resolveRateLimitDetection(execDefaults, member.provider),
    member.provider,
    resolveRateLimitPolicy(execDefaults, member.provider)?.cooldown_seconds,
    specdojoRootDir(),
    {
      ...gitEnvironment(),
      SPECDOJO_SCHEDULE_PATH: paths.schedulePath,
      SPECDOJO_EXECUTION_PATH: paths.executionPath,
    },
    opts.quiet,
  );

  return { execution, command, actor: member.nickname };
}

export function registerAgentCommands(program: Command): void {
  const agent = program.command("agent").description("Run a plan with a specific agent");

  agent
    .command("run")
    .description("Feed a plan to one agent and capture its stdout")
    .requiredOption("--plan <path>", "Plan file passed to the agent on stdin")
    .requiredOption("--by <nickname>", "Agent nickname defined in pm-members.yaml")
    .option("--out <path>", "Write the agent stdout to this file instead of the terminal")
    .option("--project <projectId>", "Project id in specdojo.config.json")
    .option("--exec-defaults <path>", "Override the exec-defaults.yaml path")
    .option("--dry-run", "Print the resolved command without executing", false)
    .action(async (options) => {
      try {
        const { execution, command, actor } = await runAgentPlan({
          planPath: options.plan,
          nickname: options.by,
          project: options.project,
          execDefaultsPath: options.execDefaults,
          dryRun: options.dryRun,
          quiet: options.out !== undefined,
        });
        if (!execution) return;

        if (options.out) {
          const writtenPath = writeAgentOutput(options.out, execution.stdout);
          process.stdout.write(`Wrote agent stdout: ${writtenPath}\n`);
        }

        if (execution.result === "rate_limit") {
          process.stderr.write(
            `rate limit: ${actor} (${command})` +
              `${execution.limit?.resume_at ? ` resume_at=${execution.limit.resume_at}` : ""}\n`,
          );
          process.exitCode = AGENT_RUN_RATE_LIMIT_EXIT_CODE;
          return;
        }
        if (execution.result === "failure") {
          process.stderr.write(`agent failed: ${actor} exit=${execution.exitCode ?? "null"}\n`);
          process.exitCode = 1;
        }
      } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = 1;
      }
    });
}
