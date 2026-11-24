import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import {
  applyRegisterItemFields,
  CELL_NONE,
  readRegisterItemContent,
  registerItemFieldsFromItem,
} from "../../register/item.js";
import {
  assertRegisterBranchPaths,
  inRegisterBranch,
  pushRegisterBranch,
  resolveRegisterBranchTarget,
} from "../../shared/register-branch.js";
import { gitOutput, gitResult, repoRelative, worktreeStatusPaths } from "../../shared/git.js";
import { stabilizeCommitTargets } from "../worktree-ops.js";

/** Keep lifecycle fields authoritative while merging the executor's edits against its HEAD. */
function withLifecycle(content: string, lifecycle: string, path: string): string {
  const parsed = readRegisterItemContent(lifecycle, basename(path));
  if (!parsed) throw new Error(`Could not parse register ticket: ${path}`);
  return applyRegisterItemFields(content, {
    ...registerItemFieldsFromItem(parsed.item),
    block_reason: parsed.blockReason === CELL_NONE ? null : parsed.blockReason,
  });
}

/** Publish validated ticket edits before the exec commit; retain the source on any failure. */
export async function publishRegisterTicket(
  projectId: string,
  sourceRoot: string,
  ticketPath: string | null,
): Promise<void> {
  const target = resolveRegisterBranchTarget(projectId);
  if (!target || !ticketPath) return;
  const path = repoRelative(sourceRoot, ticketPath);
  assertRegisterBranchPaths(target, [path]);
  const source = resolve(sourceRoot, path);
  if (!existsSync(source)) throw new Error(`Executor deleted register ticket: ${path}`);
  const base = gitOutput(sourceRoot, ["show", `HEAD:${path}`]);
  const edited = readFileSync(source, "utf8");
  if (edited === base) {
    assertNoSyncedRegisterChanges(projectId, sourceRoot);
    return;
  }

  await inRegisterBranch(target, async (worktree) => {
    const destination = resolve(worktree, path);
    const current = readFileSync(destination, "utf8");
    const scratch = mkdtempSync(join(tmpdir(), "specdojo-ticket-merge-"));
    let merged: string;
    try {
      const files = ["current", "base", "edited"].map((name) => join(scratch, name));
      [current, base, edited].forEach((content, index) =>
        writeFileSync(files[index]!, withLifecycle(content, current, path), "utf8"),
      );
      const result = gitResult(worktree, ["merge-file", "-p", ...files]);
      if (result.status !== 0) {
        throw new Error(`Concurrent register ticket edits conflict: ${path}; resolve and resume`);
      }
      merged = String(result.stdout);
    } finally {
      rmSync(scratch, { recursive: true, force: true });
    }
    if (merged !== current) {
      writeFileSync(destination, merged, "utf8");
      gitOutput(worktree, ["add", "--", path]);
      gitOutput(worktree, [
        "commit",
        "-m",
        `exec(register): publish response for ${basename(path)}`,
        "--",
        path,
      ]);
      stabilizeCommitTargets(worktree, () =>
        worktreeStatusPaths(worktree).filter((changed) => changed === path),
      );
    }
    pushRegisterBranch(target, worktree);
  });
  // Restore only after the remote has acknowledged the response. Product edits stay untouched.
  gitOutput(sourceRoot, ["restore", "--source=HEAD", "--staged", "--worktree", "--", path]);
  assertNoSyncedRegisterChanges(projectId, sourceRoot);
}

function assertNoSyncedRegisterChanges(projectId: string, sourceRoot: string): void {
  const paths = worktreeStatusPaths(sourceRoot).filter((path) =>
    isSyncedRegisterPath(projectId, sourceRoot, path),
  );
  if (paths.length)
    throw new Error(`Register edits cannot enter an exec commit: ${paths.join(", ")}`);
}

export function isSyncedRegisterPath(projectId: string, repoRoot: string, path: string): boolean {
  const target = resolveRegisterBranchTarget(projectId);
  if (!target) return false;
  const relative = repoRelative(repoRoot, resolve(repoRoot, path));
  return [target.registerPath, target.eventsPath].some((prefix) =>
    relative.startsWith(`${prefix}/`),
  );
}
