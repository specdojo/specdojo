import { spawn, type SpawnOptions } from "node:child_process";
import { constants as osConstants } from "node:os";
import { resolve } from "node:path";
import { type Command } from "commander";
import { agentExtraRootArguments, resolveProductRepos } from "../exec/task-repos.js";
import {
  loadConfig,
  resolveExternalProjects,
  specdojoRootDir,
  type AgentProvider,
  type SpecDojoConfig,
} from "../shared/specdojo-config.js";
import { registerNightOrchestratorCommand } from "./night-orchestrator.js";

export type OrchestratorProvider = Exclude<AgentProvider, "custom">;

const ORCHESTRATOR_EXECUTABLES: Readonly<Record<OrchestratorProvider, string>> = {
  claude: "claude",
  codex: "codex",
  antigravity: "agy",
  copilot: "copilot",
  opencode: "opencode",
};

const ORCHESTRATOR_CONFIG_ROOT_ENV = "SPECDOJO_ORCHESTRATOR_CONFIG_ROOT";

export interface OrchestratorLaunch {
  command: string;
  args: string[];
  cwd: string;
  env: NodeJS.ProcessEnv;
}

interface OrchestratorSignalProcess {
  on(signal: NodeJS.Signals, listener: () => void): unknown;
  off(signal: NodeJS.Signals, listener: () => void): unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function resolveOrchestratorProjectId(
  config: SpecDojoConfig,
  projectOption: string | undefined,
  env: NodeJS.ProcessEnv,
): string {
  const projectId =
    projectOption?.trim() ||
    env.SPECDOJO_PROJECT?.trim() ||
    config.current_project?.trim() ||
    Object.keys(config.projects)[0];
  if (!projectId) {
    throw new Error(
      "No project specified. Use --project <id>, SPECDOJO_PROJECT, current_project, or define a project.",
    );
  }
  if (!config.projects[projectId]) {
    throw new Error(`Unknown project: ${projectId}`);
  }
  return projectId;
}

function opencodeAgentName(args: readonly string[]): string {
  let selected: string | undefined;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--agent") {
      selected = args[index + 1];
      index += 1;
    } else if (arg.startsWith("--agent=")) {
      selected = arg.slice("--agent=".length);
    }
  }
  if (!selected?.trim()) {
    throw new Error(
      "OpenCode orchestrator launch requires --agent <name> so repository permissions can be scoped to that agent.",
    );
  }
  return selected.trim();
}

function inlineOpenCodeConfig(
  current: string | undefined,
  agentName: string,
  repoRoots: readonly string[],
): string {
  let config: Record<string, unknown> = {};
  if (current?.trim()) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(current);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Invalid OPENCODE_CONFIG_CONTENT: ${message}`);
    }
    if (!isRecord(parsed)) {
      throw new Error("Invalid OPENCODE_CONFIG_CONTENT: top-level value must be an object");
    }
    config = parsed;
  }

  const agents = config.agent === undefined ? {} : config.agent;
  if (!isRecord(agents)) {
    throw new Error("Invalid OPENCODE_CONFIG_CONTENT: agent must be an object");
  }
  const selectedAgent = agents[agentName] === undefined ? {} : agents[agentName];
  if (!isRecord(selectedAgent)) {
    throw new Error(`Invalid OPENCODE_CONFIG_CONTENT: agent.${agentName} must be an object`);
  }
  const permission = selectedAgent.permission === undefined ? {} : selectedAgent.permission;
  if (!isRecord(permission)) {
    throw new Error(
      `Invalid OPENCODE_CONFIG_CONTENT: agent.${agentName}.permission must be an object`,
    );
  }

  const externalDirectory: Record<string, "allow" | "deny"> = { "*": "deny" };
  const currentEdit = permission.edit;
  let edit: Record<string, unknown> = {};
  if (isRecord(currentEdit)) {
    edit = { ...currentEdit };
  } else if (typeof currentEdit === "string") {
    edit = { "*": currentEdit };
  } else if (currentEdit !== undefined) {
    throw new Error(
      `Invalid OPENCODE_CONFIG_CONTENT: agent.${agentName}.permission.edit must be a string or object`,
    );
  }
  for (const repoRoot of repoRoots) {
    const pattern = `${resolve(repoRoot).replaceAll("\\", "/")}/**`;
    externalDirectory[pattern] = "allow";
    edit[pattern] = "allow";
  }

  return JSON.stringify({
    ...config,
    agent: {
      ...agents,
      [agentName]: {
        ...selectedAgent,
        permission: {
          ...permission,
          external_directory: externalDirectory,
          edit,
        },
      },
    },
  });
}

export function buildOrchestratorLaunch(options: {
  provider: OrchestratorProvider;
  providerArgs: readonly string[];
  repoRoots: readonly string[];
  cwd: string;
  env?: NodeJS.ProcessEnv;
}): OrchestratorLaunch {
  const env = { ...(options.env ?? process.env) };
  const args = [...options.providerArgs];
  if (options.provider === "opencode" && options.repoRoots.length > 0) {
    env.OPENCODE_CONFIG_CONTENT = inlineOpenCodeConfig(
      env.OPENCODE_CONFIG_CONTENT,
      opencodeAgentName(args),
      options.repoRoots,
    );
  } else {
    args.push(...agentExtraRootArguments(options.provider, options.repoRoots));
  }
  return {
    command: ORCHESTRATOR_EXECUTABLES[options.provider],
    args,
    cwd: options.cwd,
    env,
  };
}

export function resolveOrchestratorLaunch(options: {
  provider: OrchestratorProvider;
  providerArgs: readonly string[];
  project?: string;
  env?: NodeJS.ProcessEnv;
}): OrchestratorLaunch {
  const env = options.env ?? process.env;
  const rootDir = specdojoRootDir();
  const configuredRoot = env[ORCHESTRATOR_CONFIG_ROOT_ENV]?.trim();
  const configRootDir = configuredRoot ? resolve(rootDir, configuredRoot) : rootDir;
  const { config, configPath } = loadConfig(configRootDir);
  if (!config) throw new Error(`No config found: ${configPath}`);
  const projectId = resolveOrchestratorProjectId(config, options.project, env);
  const repos = resolveProductRepos(configRootDir, config.projects[projectId]);
  const externalProjects = resolveExternalProjects(configRootDir, config);
  const repoRoots = [
    ...new Set([
      ...repos.map((repo) => repo.repoRoot),
      ...externalProjects.map((project) => project.repoRoot),
    ]),
  ];
  const launch = buildOrchestratorLaunch({
    provider: options.provider,
    providerArgs: options.providerArgs,
    repoRoots,
    cwd: rootDir,
    env,
  });
  delete launch.env[ORCHESTRATOR_CONFIG_ROOT_ENV];
  return launch;
}

function parseProvider(value: string): OrchestratorProvider {
  if (Object.hasOwn(ORCHESTRATOR_EXECUTABLES, value)) {
    return value as OrchestratorProvider;
  }
  throw new Error(
    `Unknown orchestrator provider: ${value}. Available: ${Object.keys(ORCHESTRATOR_EXECUTABLES).join(", ")}`,
  );
}

export async function runOrchestratorLaunch(
  launch: OrchestratorLaunch,
  spawnProcess: typeof spawn = spawn,
  signalProcess: OrchestratorSignalProcess = process,
): Promise<number> {
  return await new Promise<number>((resolveExit, reject) => {
    const spawnOptions: SpawnOptions = {
      cwd: launch.cwd,
      env: launch.env,
      stdio: "inherit",
    };
    const child = spawnProcess(launch.command, launch.args, spawnOptions);
    const signalHandlers: Array<[NodeJS.Signals, () => void]> = [];
    let settled = false;

    const addSignalHandler = (signal: NodeJS.Signals, handler: () => void): void => {
      signalHandlers.push([signal, handler]);
      signalProcess.on(signal, handler);
    };
    const cleanupSignalHandlers = (): void => {
      for (const [signal, handler] of signalHandlers) {
        signalProcess.off(signal, handler);
      }
    };
    const settle = (callback: () => void): void => {
      if (settled) return;
      settled = true;
      cleanupSignalHandlers();
      callback();
    };

    addSignalHandler("SIGINT", () => undefined);
    addSignalHandler("SIGQUIT", () => undefined);
    for (const signal of ["SIGTERM", "SIGHUP"] as const) {
      addSignalHandler(signal, () => {
        child.kill(signal);
      });
    }

    child.once("error", (error) => {
      settle(() => reject(error));
    });
    child.once("exit", (code, signal) => {
      settle(() => {
        resolveExit(code ?? (signal ? 128 + osConstants.signals[signal] : 0));
      });
    });
  });
}

export function registerOrchestratorCommands(program: Command): void {
  const orchestrator = program
    .command("orchestrator")
    .description("Launch an interactive orchestrator with declared repository access");

  registerNightOrchestratorCommand(orchestrator);

  orchestrator
    .command("launch")
    .description("Launch a provider CLI and allow only repositories declared by the project")
    .requiredOption("--provider <name>", "Provider CLI (antigravity|claude|codex|copilot|opencode)")
    .option("--project <projectId>", "Project id in specdojo.config.json")
    .argument("[providerArgs...]", "Provider arguments; put them after --")
    .action(async (providerArgs: string[], opts: { provider: string; project?: string }) => {
      try {
        const launch = resolveOrchestratorLaunch({
          provider: parseProvider(opts.provider),
          providerArgs,
          project: opts.project,
        });
        const exitCode = await runOrchestratorLaunch(launch);
        if (exitCode !== 0) process.exitCode = exitCode;
      } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = 1;
      }
    });
}
