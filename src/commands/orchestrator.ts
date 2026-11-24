import { spawn, type SpawnOptions } from "node:child_process";
import { constants as osConstants } from "node:os";
import { resolve } from "node:path";
import { type Command } from "commander";
import { resolveReferences, validateReferences } from "../shared/reference-directories.js";
import { agentExtraRootArguments, resolveProductRepos } from "../exec/task-repos.js";
import {
  OPENCODE_CONFIG_CONTENT_ENV,
  opencodeAgentNameFromArguments,
  opencodeExtraRootConfig,
} from "../exec/opencode-permissions.js";
import {
  loadConfig,
  resolveExternalProjects,
  specdojoRootDir,
  type AgentProvider,
  type SpecDojoConfig,
} from "../shared/specdojo-config.js";
import { registerNightOrchestratorCommand } from "./night-orchestrator.js";
import { registerOrchestratorHandoffCommand } from "./orchestrator-handoff.js";
import { registerNightlyIntegrationTestsCommand } from "./nightly-integration-tests.js";
import { registerWatchScanCommand } from "./watch-scan.js";

export type OrchestratorProvider = Exclude<AgentProvider, "custom">;

const ORCHESTRATOR_EXECUTABLES: Readonly<Record<OrchestratorProvider, string>> = {
  claude: "claude",
  codex: "codex",
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
  const selected = opencodeAgentNameFromArguments(args);
  if (!selected) {
    throw new Error(
      "OpenCode orchestrator launch requires --agent <name> so repository permissions can be scoped to that agent.",
    );
  }
  return selected;
}

export function buildOrchestratorLaunch(options: {
  provider: OrchestratorProvider;
  providerArgs: readonly string[];
  repoRoots: readonly string[];
  referenceRoots?: readonly string[];
  cwd: string;
  env?: NodeJS.ProcessEnv;
}): OrchestratorLaunch {
  const env = { ...(options.env ?? process.env) };
  const args = [...options.providerArgs];
  const references = [...new Set(options.referenceRoots ?? [])];
  if (options.provider === "opencode" && (options.repoRoots.length > 0 || references.length > 0)) {
    env[OPENCODE_CONFIG_CONTENT_ENV] = opencodeExtraRootConfig(
      env[OPENCODE_CONFIG_CONTENT_ENV],
      opencodeAgentName(args),
      options.repoRoots,
      options.cwd,
      "write",
      references,
    );
  } else {
    args.push(...agentExtraRootArguments(options.provider, options.repoRoots));
    if (references.length > 0) {
      switch (options.provider) {
        case "claude":
          args.push(
            "--add-dir",
            ...references,
            "--disallowedTools",
            ...references.map(
              (root) => `Edit(/${root.replaceAll("\\", "/").replace(/[?*[\]]/g, "\\$&")}/**)`,
            ),
          );
          break;
        case "copilot":
          for (const root of references) {
            const pattern = root.replaceAll("\\", "/").replace(/[?*[\]]/g, (char) => `[${char}]`);
            args.push("--add-dir", root, "--deny-tool", `write(${pattern}/**)`);
          }
          break;
        case "codex":
          // workspace-write already permits reads outside the workspace. --add-dir would
          // grant writes, so references must never be passed to that option.
          args.push(
            "--sandbox",
            "workspace-write",
            "-c",
            "sandbox_workspace_write.writable_roots=[]",
            "-c",
            "sandbox_workspace_write.exclude_slash_tmp=true",
            "-c",
            "sandbox_workspace_write.exclude_tmpdir_env_var=true",
          );
          break;
      }
    }
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
  if (configRootDir !== rootDir) {
    const errors = validateReferences(configRootDir, config, [rootDir]);
    if (errors.length > 0)
      throw new Error(`Invalid references (${configPath}):\n${errors.join("\n")}`);
  }
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
    referenceRoots: resolveReferences(configRootDir, config).map((entry) => entry.root),
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
  registerOrchestratorHandoffCommand(orchestrator);
  registerNightlyIntegrationTestsCommand(orchestrator);
  registerWatchScanCommand(orchestrator);

  orchestrator
    .command("launch")
    .description("Launch a provider CLI and allow only repositories declared by the project")
    .requiredOption("--provider <name>", "Provider CLI (claude|codex|copilot|opencode)")
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
