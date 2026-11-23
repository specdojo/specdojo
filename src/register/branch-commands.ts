import type { Command } from "commander";
import { checkRegisterGuard, mergeRegisterBranch } from "../shared/register-merge.js";
import type { RegisterCommandDependencies } from "./command-types.js";

/** One-way intake of the register branch into develop and its guard (PJR-1JF6). */
export function registerBranchCommands(
  reg: Command,
  dependencies: Pick<
    RegisterCommandDependencies,
    "addProjectOption" | "printCommandError" | "resolveRegisterPaths"
  >,
): void {
  const { addProjectOption, printCommandError, resolveRegisterPaths } = dependencies;

  const mergeCmd = reg
    .command("branch-merge")
    .description(
      "Merge the register branch (register_sync) into the current branch one way with --no-ff",
    );
  addProjectOption(mergeCmd);
  mergeCmd.action((opts: { project?: string }) => {
    try {
      const { projectId } = resolveRegisterPaths(opts);
      const outcome = mergeRegisterBranch(projectId);
      const messages: Record<RegisterMergeStatus, string> = {
        disabled: `register_sync is not enabled for ${projectId}; nothing to merge.`,
        "on-register-branch": "Current branch is the register branch; nothing to merge.",
        "up-to-date": "Register branch is already merged.",
        merged: "Merged register branch.",
      };
      const suffix =
        outcome.status === "merged" ? ` (${outcome.branch} ${outcome.commit.slice(0, 12)})` : "";
      process.stdout.write(`${messages[outcome.status]}${suffix}\n`);
    } catch (error) {
      printCommandError(error);
    }
  });

  const guardCmd = reg
    .command("branch-guard")
    .description(
      "Fail when register files are changed directly outside the register branch (register_sync)",
    );
  addProjectOption(guardCmd);
  guardCmd.option("--staged", "Check the staged changes (pre-commit)", false);
  guardCmd.option("--range <range>", "Check commits in a revision range (pre-push / CI)");
  guardCmd.action((opts: { project?: string; staged?: boolean; range?: string }) => {
    try {
      const range = opts.range?.trim();
      if (Boolean(opts.staged) === Boolean(range)) {
        throw new Error("Specify exactly one of --staged or --range <range>.");
      }
      const { projectId } = resolveRegisterPaths(opts);
      const result = checkRegisterGuard(
        projectId,
        range ? { kind: "range", range } : { kind: "staged" },
      );
      if (result.status === "disabled") {
        process.stdout.write(`register_sync is not enabled for ${projectId}; skipped.\n`);
        return;
      }
      if (result.violations.length === 0) {
        process.stdout.write("No direct register file changes found.\n");
        return;
      }
      throw new Error(
        "Register files must be changed only on the register branch and merged with " +
          "`specdojo register branch-merge`:\n" +
          result.violations.map((violation) => `  ${violation}`).join("\n"),
      );
    } catch (error) {
      printCommandError(error);
    }
  });
}

type RegisterMergeStatus = ReturnType<typeof mergeRegisterBranch>["status"];
