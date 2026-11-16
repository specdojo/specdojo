import { resolveAgentMember, specdojoRootDir } from "../../shared/specdojo-config.js";
import { resolveProjectPaths } from "../project.js";
import { commitTrailingRunRecords, reportTrailingRunRecords } from "../trailing-records.js";
import { loadRosterForExecutionPath } from "./agent.js";
import { type RunOpts } from "./shared.js";

// Schedule の run（exec run --auto / --task --worktree、exec resume、exec cycle）の終わりに、
// runner が統合の後に書いたイベントと run の記録を記帳の commit にする（PJR-DVNV）。
// 前の run で残った runner の記録も同じ commit で拾う。dry-run では何もしない。
export function recordTrailingRunRecords(opts: RunOpts, label: string): void {
  if (opts.dryRun) return;
  try {
    const { schedulePath, executionPath } = resolveProjectPaths({ project: opts.project });
    const roster = loadRosterForExecutionPath(executionPath);
    const report = commitTrailingRunRecords({
      repoRoot: specdojoRootDir(),
      schedulePath,
      executionPath,
      isRunnerActor: (actor) => resolveAgentMember(roster, actor) !== undefined,
    });
    reportTrailingRunRecords(report, label);
  } catch (error) {
    process.stderr.write(
      `warning: could not record execution records after ${label}: ` +
        `${error instanceof Error ? error.message : String(error)}\n`,
    );
  }
}

// action が失敗・中断しても記帳する。記帳の失敗は run の終了コードを変えず、警告に留める。
export async function withTrailingRunRecords(
  opts: RunOpts,
  label: string,
  action: () => Promise<void>,
): Promise<void> {
  try {
    await action();
  } finally {
    recordTrailingRunRecords(opts, label);
  }
}
