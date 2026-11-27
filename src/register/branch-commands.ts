import type { Command } from "commander";
import { SYNC_BRANCH_KINDS, type SyncBranchKind } from "../shared/specdojo-config.js";
import {
  checkRegisterGuard,
  mergeRegisterBranch,
  type RegisterBranchMergeOutcome,
} from "../shared/register-merge.js";
import { pushSyncBranchesForProject } from "./branch-push.js";
import type { RegisterCommandDependencies } from "./command-types.js";
import { checkRegisterPush, formatRegisterPushReport } from "./push-check.js";

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
      "Merge the sync branches (register, then exec-events) into the current branch one way with --no-ff",
    );
  addProjectOption(mergeCmd);
  mergeCmd.action((opts: { project?: string }) => {
    try {
      const { projectId } = resolveRegisterPaths(opts);
      const outcome = mergeRegisterBranch(projectId);
      if (outcome.status === "disabled") {
        process.stdout.write(`register_sync is not enabled for ${projectId}; nothing to merge.\n`);
        return;
      }
      const messages: Record<RegisterMergeStatus, string> = {
        "on-register-branch": "Current branch is a sync branch; nothing to merge.",
        "up-to-date": "Register branch is already merged.",
        merged: "Merged register branch.",
      };
      for (const entry of outcome.branches) {
        const suffix =
          entry.status === "merged" ? ` (${entry.branch} ${entry.commit.slice(0, 12)})` : "";
        process.stdout.write(`${messages[entry.status]} [${entry.source}]${suffix}\n`);
      }
    } catch (error) {
      printCommandError(error);
    }
  });

  const guardCmd = reg
    .command("branch-guard")
    .description(
      "Fail when register files or exec events are changed directly outside the sync branches (sync / register_sync)",
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

  const checkCmd = reg
    .command("branch-check")
    .description(
      "Check a commit pushed to a sync branch: files outside its scope and, on the register branch, register record shape",
    );
  addProjectOption(checkCmd);
  checkCmd.requiredOption("--commit <commit>", "Tip commit being pushed");
  checkCmd.option("--base <commit>", "Current remote tip (all zeros or omitted: new commits only)");
  checkCmd.option(
    "--remote-ref <ref>",
    "Remote ref being updated; skipped unless it is a sync branch (omitted: the register branch)",
  );
  checkCmd.action(
    (opts: { project?: string; commit: string; base?: string; remoteRef?: string }) => {
      try {
        const paths = resolveRegisterPaths(opts);
        const result = checkRegisterPush(paths.projectId, paths.registerDateTimeZone, {
          commit: opts.commit,
          base: opts.base,
          remoteRef: opts.remoteRef,
        });
        if (result.status === "disabled") {
          process.stdout.write(`register_sync is not enabled for ${paths.projectId}; skipped.\n`);
          return;
        }
        if (result.status === "skipped") {
          process.stdout.write(`Not the register branch (${result.reason}); skipped.\n`);
          return;
        }
        if (result.scopeViolations.length === 0 && result.shapeViolations.length === 0) {
          process.stdout.write("Register push checks passed.\n");
          return;
        }
        throw new Error(formatRegisterPushReport(result.target, result));
      } catch (error) {
        printCommandError(error);
      }
    },
  );

  const pushCmd = reg
    .command("branch-push")
    .description(
      "Create, publish or recover the sync branches (sync / register_sync); pushes only to their configured remote and branches",
    );
  addProjectOption(pushCmd);
  // The push targets come only from sync / register_sync; no argument can point at another ref.
  pushCmd.allowExcessArguments(false);
  pushCmd.option(
    "--dry-run",
    "Show the branch to create, the commits to push and the check result",
    false,
  );
  pushCmd.option(
    "--sync <kind>",
    `Only this sync branch (${SYNC_BRANCH_KINDS.join(" | ")}); default: every sync branch in that order`,
  );
  pushCmd.action(async (opts: { project?: string; dryRun?: boolean; sync?: string }) => {
    try {
      const kind = parseSyncKind(opts.sync);
      const paths = resolveRegisterPaths(opts);
      const outcomes = await pushSyncBranchesForProject(
        paths.projectId,
        paths.registerDateTimeZone,
        { dryRun: Boolean(opts.dryRun), sync: kind },
      );
      process.stdout.write(`${outcomes.flatMap((outcome) => outcome.lines).join("\n")}\n`);
      if (outcomes.some((outcome) => outcome.wouldStop)) process.exitCode = 1;
    } catch (error) {
      printCommandError(error);
    }
  });
}

type RegisterMergeStatus = RegisterBranchMergeOutcome["status"];

function parseSyncKind(value: string | undefined): SyncBranchKind | undefined {
  if (value === undefined) return undefined;
  const kind = SYNC_BRANCH_KINDS.find((candidate) => candidate === value.trim());
  if (!kind) {
    throw new Error(`--sync must be one of ${SYNC_BRANCH_KINDS.join(", ")}: ${value}`);
  }
  return kind;
}
