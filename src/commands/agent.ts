import { type Command } from "commander";
import { assertProviderLaunchAllowed } from "../shared/antigravity-block.js";
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

/**
 * `agent launch` only ever wrapped agy, and 0.9.1 `init` wrote command templates that call it.
 * Since 0.9.2 it fails before spawning anything so those existing configurations stop here.
 */
export function runAgentLaunch(options: { provider: string }): never {
  assertProviderLaunchAllowed(options.provider, "agent launch");
  throw new Error(
    `agent launch supports no provider other than antigravity, which is no longer launched: ${options.provider}`,
  );
}

export function registerAgentCommands(program: Command): void {
  const agent = program
    .command("agent", { hidden: true })
    .description("Run a plan with a specific agent");

  agent
    .command("launch", { hidden: true })
    .description("Former agy launcher; refuses to launch Antigravity since 0.9.2")
    .requiredOption("--provider <name>", "Provider CLI (antigravity is no longer launched)")
    .option("--role <role>", "Pipeline role (edit|review|report); ignored")
    .argument("[providerArgs...]", "Provider arguments after --")
    .action((_providerArgs: string[], options: { provider: string }) => {
      try {
        runAgentLaunch(options);
      } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = 1;
      }
    });

  agent
    .command("run", { hidden: true })
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
