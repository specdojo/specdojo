import { basename } from "node:path";
import { gitOutput, gitResult } from "../shared/git.js";
import { getProjectRegisterPath, loadConfig, specdojoRootDir } from "../shared/specdojo-config.js";
import type { RegisterPaths } from "./command-types.js";
import { resolveProjectIntegrationBranch } from "./cross-project.js";
import { parseRegisterItemRef } from "./derivation.js";
import { loadRegisterItemDocs, readRegisterItemContent, type PjrItem } from "./item.js";

export function normalizeDependsOn(values: string[] | undefined): string[] | undefined {
  if (values === undefined) return undefined;
  const refs = [...new Set(values.map((value) => value.trim()).filter(Boolean))];
  if (refs.includes("-")) {
    if (refs.length !== 1) throw new Error("--depends-on - cannot be combined with other item IDs");
    return undefined;
  }
  if (refs.length === 0) throw new Error("--depends-on must contain a register item ID");
  return refs;
}

// Each operation gets a fresh snapshot. Other projects are read from the same local
// integration branches used to verify derived_from, never from unrelated worktrees.
function dependencyGraph(paths: RegisterPaths, replacement?: PjrItem) {
  const projects = new Map<string, Map<string, PjrItem>>();
  const local = new Map(
    loadRegisterItemDocs(paths.projectRegisterPath).map((doc) => [doc.id, doc.item]),
  );
  if (replacement) local.set(replacement.id, replacement);
  projects.set(paths.projectId, local);
  const projectItems = (projectId: string): Map<string, PjrItem> => {
    const cached = projects.get(projectId);
    if (cached) return cached;
    const { config } = loadConfig();
    const project = config?.projects[projectId];
    if (!project) throw new Error(`depends_on: unknown project ${projectId}`);
    const registerPath = getProjectRegisterPath(project);
    if (!registerPath)
      throw new Error(`depends_on: project_register_path is not set for ${projectId}`);
    const root = specdojoRootDir();
    const branch = resolveProjectIntegrationBranch(projectId, project);
    if (gitResult(root, ["show-ref", "--verify", "--quiet", `refs/heads/${branch}`]).status !== 0) {
      throw new Error(`depends_on: integration branch does not exist locally: ${branch}`);
    }
    const files = gitOutput(root, [
      "ls-tree",
      "-r",
      "--name-only",
      branch,
      "--",
      registerPath.replaceAll("\\", "/"),
    ]);
    const items = new Map<string, PjrItem>();
    for (const file of files.split(/\r?\n/).filter(Boolean)) {
      if (!/^pjr-[0-9a-z]{4}-.+\.md$/.test(basename(file))) continue;
      const parsed = readRegisterItemContent(
        gitOutput(root, ["show", `${branch}:${file}`]),
        basename(file),
      );
      if (parsed) items.set(parsed.id, parsed.item);
    }
    projects.set(projectId, items);
    return items;
  };
  const lookup = (ref: string, projectId: string) => {
    const parsed = parseRegisterItemRef(ref, projectId);
    if (!parsed)
      throw new Error(
        `Invalid depends_on item ID: "${ref}". Use PJR-XXXX or <project-id>:PJR-XXXX`,
      );
    const item = projectItems(parsed.projectId).get(parsed.itemId);
    if (!item)
      throw new Error(
        `Depends-on item not found: ${ref} (searched configured project ${parsed.projectId})`,
      );
    return { ...parsed, key: `${parsed.projectId}:${parsed.itemId}`, item };
  };
  const visited = new Set<string>();
  const visiting: string[] = [];
  const visit = (item: PjrItem, projectId: string): void => {
    const key = `${projectId}:${item.id}`;
    if (visiting.includes(key))
      throw new Error(`depends_on cycle: ${[...visiting, key].join(" -> ")}`);
    if (visited.has(key)) return;
    visiting.push(key);
    for (const ref of item.dependsOn ?? []) {
      const target = lookup(ref, projectId);
      if (target.key === key) throw new Error(`Item ${key} cannot depend on itself`);
      visit(target.item, target.projectId);
    }
    visiting.pop();
    visited.add(key);
  };
  return { local, lookup, visit };
}

export function validateRegisterDependencies(paths: RegisterPaths, replacement?: PjrItem): void {
  const graph = dependencyGraph(paths, replacement);
  for (const item of graph.local.values()) graph.visit(item, paths.projectId);
}

export function validateRegisterDependencyDocs(paths: RegisterPaths): string[] {
  try {
    validateRegisterDependencies(paths);
    return [];
  } catch (error) {
    return [error instanceof Error ? error.message : String(error)];
  }
}

export function registerDependencyBlockReason(
  paths: RegisterPaths,
  item: PjrItem,
): string | undefined {
  if (!item.dependsOn?.length) return undefined;
  try {
    const graph = dependencyGraph(paths, item);
    graph.visit(item, paths.projectId);
    const pending = item.dependsOn.flatMap((ref) => {
      const target = graph.lookup(ref, paths.projectId);
      return ["done", "decided"].includes(target.item.status)
        ? []
        : [`${ref} (${target.item.status})`];
    });
    return pending.length ? `Unfinished depends_on: ${pending.join(", ")}` : undefined;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}
