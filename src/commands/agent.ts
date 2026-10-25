import { type Command } from "commander";
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
