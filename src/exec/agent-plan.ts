import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  defaultExecDefaultsPath,
  loadExecDefaultsConfig,
  resolveMemberCommand,
  resolveRateLimitDetection,
  resolveRateLimitPolicy,
  type ExecDefaultsConfig,
} from "./agent-config.js";
import { resolveProjectPaths } from "./project.js";
import { selectCandidates, type AgentExecution } from "./run/shared.js";
import { executeAgent, loadRosterForExecutionPath } from "./run/agent.js";
import { gitEnvironment } from "../shared/git-environment.js";
import {
  resolveAgentMember as resolveRosterAgentMember,
  specdojoRootDir,
  loadMemberRoster,
  getProjectExecutionPath,
  loadConfig,
  type MemberRoster,
  type ProjectMember,
} from "../shared/specdojo-config.js";

// Rate limit は通常失敗と異なり、呼び出し側が処理済みにせず中断・再開する必要がある。
// shell script が出力文字列を解析せず分岐できるよう、一時失敗を表す専用コードにする。
export const AGENT_RUN_RATE_LIMIT_EXIT_CODE = 75;

/** Select a grading executor using the same roster eligibility and priority as exec. */
export function resolveGradingPlanActor(opts: {
  by?: string;
  project?: string;
  execDefaultsPath?: string;
}): string {
  const { config } = loadConfig();
  const projectId =
    opts.project ?? config?.current_project ?? Object.keys(config?.projects ?? {})[0];
  const project = projectId ? config?.projects[projectId] : undefined;
  if (!project) throw new Error(`Unknown project: ${projectId}`);
  const roster = loadMemberRoster(specdojoRootDir(), project);
  const defaults = loadExecDefaultsConfig(
    opts.execDefaultsPath ?? defaultExecDefaultsPath(),
    getProjectExecutionPath(project),
  );
  let nickname = opts.by;
  if (!nickname) {
    const candidates = selectCandidates(
      { capabilities: [], stage_role: "executor" },
      roster,
      "review",
      undefined,
      defaults,
    );
    const legacy = selectCandidates({ capabilities: [] }, roster, "review", undefined, defaults);
    nickname = (candidates[0] ?? legacy[0])?.nickname;
  }
  if (!nickname) throw new Error("No runnable grading agent in agent-members.yaml; supply --by");
  const found = resolveAgentMember(roster, nickname);
  if ("error" in found) throw new Error(found.error);
  if (found.member.stage_role === "reporter" || found.member.mode === "report")
    throw new Error(`Grading agent must be an executor: ${nickname}`);
  const command = resolveAgentCommand(defaults, found.member);
  if ("error" in command) throw new Error(command.error);
  return found.member.nickname;
}

export function resolveAgentMember(
  roster: MemberRoster | null,
  nickname: string,
): { member: ProjectMember } | { error: string } {
  const directMembers = roster?.members.filter((candidate) => {
    return candidate.type === "agent" && candidate.nickname === nickname;
  });
  if (directMembers && directMembers.length > 1) {
    return { error: `--by agent nickname is not unique in agent-members.yaml: ${nickname}` };
  }
  const member = resolveRosterAgentMember(roster, nickname);
  if (!member) {
    return { error: `--by agent nickname not found in agent-members.yaml: ${nickname}` };
  }
  if (member.disabled) {
    return { error: `--by agent is disabled in agent-members.yaml: ${nickname}` };
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
