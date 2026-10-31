import { createHash, randomUUID } from "node:crypto";
import {
  existsSync,
  linkSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { isValidBranchName } from "../shared/branch-template.js";
import { gitOutput, gitResult, worktreeNameFromTaskId } from "./worktree.js";

/** Shared by all worktrees and all projects using this product repository. */
export type ProductBranchRecord = { taskId: string; branch: string; startCommit?: string };

function recordDirectory(repoRoot: string): string {
  const common = gitOutput(repoRoot, ["rev-parse", "--git-common-dir"]).trim();
  return resolve(repoRoot, common, "specdojo", "product-branches");
}

function recordPath(repoRoot: string, branch: string): string {
  return join(
    recordDirectory(repoRoot),
    `${createHash("sha256").update(branch).digest("hex")}.json`,
  );
}

export function productBranchRecords(repoRoot: string): ProductBranchRecord[] {
  const directory = recordDirectory(repoRoot);
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const record: unknown = JSON.parse(readFileSync(join(directory, name), "utf8"));
      if (
        !record ||
        typeof record !== "object" ||
        !("taskId" in record) ||
        !("branch" in record) ||
        typeof record.taskId !== "string" ||
        typeof record.branch !== "string"
      ) {
        throw new Error(`Invalid runner product branch record: ${name}`);
      }
      return {
        taskId: record.taskId,
        branch: record.branch,
        ...("startCommit" in record && typeof record.startCommit === "string"
          ? { startCommit: record.startCommit }
          : {}),
      };
    });
}

export function recordedProductBranch(repoRoot: string, taskId: string): string | undefined {
  const records = productBranchRecords(repoRoot).filter((record) => record.taskId === taskId);
  if (records.length > 1)
    throw new Error(`Multiple runner product branches recorded for ${taskId}`);
  return records[0]?.branch;
}

export function productBranchExists(repoRoot: string, branch: string): boolean {
  return (
    gitResult(repoRoot, ["show-ref", "--verify", "--quiet", `refs/heads/${branch}`]).status === 0
  );
}

/** A legacy name is usable only when no other task has explicitly claimed it. */
export function existingProductTaskBranch(repoRoot: string, taskId: string): string | undefined {
  const recorded = recordedProductBranch(repoRoot, taskId);
  if (recorded) return recorded;
  const legacy = `exec/${worktreeNameFromTaskId(taskId)}`;
  if (productBranchRecords(repoRoot).some((record) => record.branch === legacy)) return undefined;
  return productBranchExists(repoRoot, legacy) ? legacy : undefined;
}

/** Legacy runs may be adopted only under their exact conventional branch name. */
export function assertProductBranchAvailable(
  repoRoot: string,
  taskId: string,
  branch: string,
): void {
  if (!isValidBranchName(repoRoot, branch)) {
    throw new Error(`Invalid product branch name: ${branch}; use --branch <repo>=<name>`);
  }
  const owner = productBranchRecords(repoRoot).find((record) => record.branch === branch)?.taskId;
  const legacy = branch === `exec/${worktreeNameFromTaskId(taskId)}`;
  if ((owner && owner !== taskId) || (!owner && !legacy && productBranchExists(repoRoot, branch))) {
    throw new Error(
      `Product branch ${branch} already exists or is reserved for ${owner ?? "another item"}; ` +
        `change topic or use exec run --branch <repo>=<name> (no automatic suffix is added)`,
    );
  }
}

/** Exclusive creation also prevents concurrent tasks from reserving the same branch. */
export function reserveProductBranch(
  repoRoot: string,
  taskId: string,
  branch: string,
  startPoint = "HEAD",
): void {
  assertProductBranchAvailable(repoRoot, taskId, branch);
  const previous = recordedProductBranch(repoRoot, taskId);
  if (previous && previous !== branch) {
    throw new Error(
      `Product branch for ${taskId} is already recorded as ${previous}; resume that branch or discard the old lifecycle before choosing ${branch}`,
    );
  }
  mkdirSync(recordDirectory(repoRoot), { recursive: true });
  const path = recordPath(repoRoot, branch);
  if (existsSync(path)) return;
  const temporary = `${path}.${randomUUID()}.tmp`;
  try {
    const startCommit = gitOutput(repoRoot, [
      "rev-parse",
      "--verify",
      `${startPoint}^{commit}`,
    ]).trim();
    // Publish a complete record atomically; readers never observe partial JSON.
    writeFileSync(temporary, JSON.stringify({ taskId, branch, startCommit }), { flag: "wx" });
    linkSync(temporary, path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    assertProductBranchAvailable(repoRoot, taskId, branch);
  } finally {
    if (existsSync(temporary)) unlinkSync(temporary);
  }
}

export function forgetProductBranch(repoRoot: string, branch: string): void {
  const path = recordPath(repoRoot, branch);
  if (existsSync(path)) unlinkSync(path);
}
