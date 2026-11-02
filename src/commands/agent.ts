import { type Command } from "commander";
import { antigravityRole, antigravitySessionArguments } from "../exec/antigravity-session.js";
import { productRootsFromEnvironment } from "../exec/task-repos.js";
import { runOrchestratorLaunch } from "./orchestrator.js";
import {
  AGENT_RUN_RATE_LIMIT_EXIT_CODE,
  runAgentPlan,
  writeAgentOutput,
} from "../exec/agent-plan.js";
export {
  AGENT_RUN_RATE_LIMIT_EXIT_CODE,
  resolveAgentMember,
  resolveAgentCommand,
  readAgentPlan,
  writeAgentOutput,
  runAgentPlan,
} from "../exec/agent-plan.js";

export function registerAgentCommands(program: Command): void {
  const agent = program.command("agent").description("Run a plan with a specific agent");

  agent
    .command("launch")
    .description("Launch agy with role-specific session permissions and runner-declared roots")
    .requiredOption("--provider <name>", "Provider CLI (antigravity)")
    .requiredOption("--role <role>", "Pipeline role (edit|review|report)")
    .argument("[providerArgs...]", "agy arguments after --")
    .action(async (providerArgs: string[], options: { provider: string; role: string }) => {
      try {
        if (options.provider !== "antigravity" || options.role === "orchestrator") {
          throw new Error(
            "agent launch requires antigravity and a pipeline role (edit|review|report)",
          );
        }
        const cwd = process.cwd();
        const args = antigravitySessionArguments({
          role: antigravityRole(options.role),
          cwd,
          repoRoots: productRootsFromEnvironment(process.env).map((repo) => repo.path),
          providerArgs,
        });
        process.exitCode = await runOrchestratorLaunch({
          command: "agy",
          args,
          cwd,
          env: { ...process.env },
        });
      } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = 1;
      }
    });

  agent
    .command("run")
    .description("Feed a plan to one agent and capture its stdout")
    .requiredOption("--plan <path>", "Plan file passed to the agent on stdin")
    .requiredOption("--by <nickname>", "Agent nickname defined in agent-members.yaml")
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
