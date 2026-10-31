import { basename } from "node:path";
import { resolveItemCommitTypeAndScope } from "../register/item.js";
import type { PjrItem } from "../register/register.js";
import { DEFAULT_BRANCH_TEMPLATE, expandBranchTemplate } from "../shared/branch-template.js";
import type { SpecDojoProjectConfig } from "../shared/specdojo-config.js";
import { worktreeNameFromTaskId } from "./worktree.js";
import { assertProductBranchAvailable, recordedProductBranch } from "./product-branch-records.js";
import { parseIntegrationBranchOverrides, type ProductRepo } from "./task-repos.js";

export function parseProductBranchOverrides(
  values: string | readonly string[] | undefined,
): Map<string, string> {
  try {
    return parseIntegrationBranchOverrides(values);
  } catch (error) {
    throw new Error(
      (error instanceof Error ? error.message : String(error)).replaceAll(
        "--integration-branch",
        "--branch",
      ),
    );
  }
}

/** Resolve and preflight names before register start or stale-worktree removal. */
export function resolveProductBranches(
  products: readonly ProductRepo[],
  params: {
    projectId: string;
    taskId: string;
    item: Pick<PjrItem, "id" | "title" | "type" | "commitType" | "commitScope">;
    ticketPath: string | null;
    projectConfig?: SpecDojoProjectConfig;
    overrides?: readonly string[];
    resume?: boolean;
  },
): ProductRepo[] {
  const overrides = parseProductBranchOverrides(params.overrides);
  for (const repo of overrides.keys()) {
    if (!products.some((product) => product.name === repo)) {
      throw new Error(`--branch references undeclared product repository: ${repo}`);
    }
  }
  return products.map((product) => {
    const persisted = recordedProductBranch(product.repoRoot, params.taskId);
    const override = overrides.get(product.name);
    const resumedBranch = persisted ?? `exec/${worktreeNameFromTaskId(params.taskId)}`;
    if (params.resume && override && override !== resumedBranch) {
      throw new Error(
        `--branch cannot change the resumed run branch for ${product.name}: ${resumedBranch}`,
      );
    }
    const { type, scope } = resolveItemCommitTypeAndScope(params.item, {
      projectConfig: params.projectConfig,
      repoConfig: params.projectConfig?.repos?.find((repo) => repo.name === product.name),
    });
    const topic = params.ticketPath
      ? basename(params.ticketPath)
          .replace(/^pjr-[a-z0-9]{4}-/, "")
          .replace(/\.md$/, "")
      : params.item.id.toLowerCase();
    const branch =
      (params.resume ? resumedBranch : undefined) ??
      override ??
      expandBranchTemplate(product.branchTemplate ?? DEFAULT_BRANCH_TEMPLATE, {
        project: params.projectId,
        id: params.item.id,
        topic,
        type,
        scope: scope ?? "",
        title: params.item.title.replace(/\s+/g, " ").trim(),
      });
    assertProductBranchAvailable(product.repoRoot, params.taskId, branch);
    return { ...product, branch };
  });
}
