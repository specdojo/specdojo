import { existsSync } from "node:fs";
import { basename, resolve } from "node:path";
import { gitOutput, gitResult } from "../shared/git.js";
import {
  getProjectRegisterPath,
  loadConfig,
  specdojoRootDir,
  type SpecDojoConfig,
} from "../shared/specdojo-config.js";
import {
  displayIdFromTicketFilename,
  loadRegisterItemDocs,
  PJR_ID_RE,
  type PjrItem,
} from "./item.js";
import type { RegisterItemView, RegisterPaths } from "./command-types.js";
import { resolveProjectIntegrationBranch } from "./cross-project.js";

const QUALIFIED_REGISTER_ITEM_REF_RE = /^([a-z][a-z0-9-]*):(PJR-[0-9ABCDEFGHJKMNPQRSTVWXYZ]{4})$/;

export type ParsedRegisterItemRef = {
  projectId: string;
  itemId: string;
};

export type DerivedRegisterRelation = {
  sourceId: string;
  derivedProjectId: string;
  derivedItem: PjrItem;
  derivedTicketPath: string;
};

export function parseRegisterItemRef(
  value: string,
  currentProjectId: string,
): ParsedRegisterItemRef | undefined {
  if (PJR_ID_RE.test(value)) return { projectId: currentProjectId, itemId: value };
  const match = QUALIFIED_REGISTER_ITEM_REF_RE.exec(value);
  return match ? { projectId: match[1], itemId: match[2] } : undefined;
}

export function normalizeDerivedFrom(
  values: string[] | undefined,
  options: { allowRemove: boolean },
): string[] | undefined {
  if (values === undefined) return undefined;
  const refs = [...new Set(values.map((value) => value.trim()).filter(Boolean))];
  if (refs.includes("-")) {
    if (!options.allowRemove) throw new Error("--from - is only valid with register update");
    if (refs.length !== 1) throw new Error("--from - cannot be combined with other item IDs");
    return undefined;
  }
  if (refs.length === 0) throw new Error("--from must contain a register item ID");
  return refs;
}

function configuredItemIds(
  config: SpecDojoConfig,
  projectId: string,
  currentProjectId: string,
): Set<string> {
  const project = config.projects[projectId];
  if (!project) throw new Error(`Cannot verify derived_from item: unknown project ${projectId}`);
  const registerPath = getProjectRegisterPath(project);
  if (!registerPath) {
    throw new Error(
      `Cannot verify derived_from item in configured project ${projectId}: project_register_path is not set`,
    );
  }
  if (projectId !== currentProjectId) {
    const repoRoot = specdojoRootDir();
    const branch = resolveProjectIntegrationBranch(projectId, project);
    const exists = gitResult(repoRoot, ["show-ref", "--verify", "--quiet", `refs/heads/${branch}`]);
    if (exists.status !== 0) {
      throw new Error(
        `Cannot verify derived_from item in project ${projectId}: ` +
          `integration branch does not exist locally: ${branch}`,
      );
    }
    const files = gitOutput(repoRoot, [
      "ls-tree",
      "-r",
      "--name-only",
      branch,
      "--",
      registerPath.replaceAll("\\", "/"),
    ]);
    return new Set(
      files
        .split(/\r?\n/)
        .map((path) => displayIdFromTicketFilename(basename(path)))
        .filter((id): id is string => id !== undefined),
    );
  }
  const absolutePath = resolve(specdojoRootDir(), registerPath);
  return new Set(loadRegisterItemDocs(absolutePath).map((doc) => doc.id));
}

function validateDerivedFromWithConfig(
  opts: {
    projectId: string;
    itemId: string;
    derivedFrom: readonly string[];
  },
  config: SpecDojoConfig,
  idsByProject: Map<string, Set<string> | undefined>,
): void {
  for (const ref of opts.derivedFrom) {
    const parsed = parseRegisterItemRef(ref, opts.projectId);
    if (!parsed) {
      throw new Error(`Invalid --from item ID: "${ref}". Use PJR-XXXX or <project-id>:PJR-XXXX`);
    }
    if (parsed.projectId === opts.projectId && parsed.itemId === opts.itemId) {
      throw new Error(`Item ${opts.itemId} cannot derive from itself`);
    }
    let ids = idsByProject.get(parsed.projectId);
    if (!idsByProject.has(parsed.projectId)) {
      ids = configuredItemIds(config, parsed.projectId, opts.projectId);
      idsByProject.set(parsed.projectId, ids);
    }
    if (!ids?.has(parsed.itemId)) {
      throw new Error(
        `Derived-from item not found: ${ref} (searched configured project ${parsed.projectId})`,
      );
    }
  }
}

export function validateDerivedFrom(opts: {
  projectId: string;
  itemId: string;
  derivedFrom: readonly string[] | undefined;
}): void {
  if (!opts.derivedFrom) return;
  const { config } = loadConfig();
  if (!config) throw new Error("register commands require specdojo.config.json");
  validateDerivedFromWithConfig({ ...opts, derivedFrom: opts.derivedFrom }, config, new Map());
}

export function validateDerivedFromDocs(paths: RegisterPaths): string[] {
  const docs = loadRegisterItemDocs(paths.projectRegisterPath);
  const derivedDocs = docs.filter((doc) => doc.item.derivedFrom !== undefined);
  if (derivedDocs.length === 0) return [];

  let config: SpecDojoConfig | null;
  try {
    ({ config } = loadConfig());
  } catch (error) {
    return [`derived_from: ${error instanceof Error ? error.message : String(error)}`];
  }
  if (!config) return ["derived_from: register commands require specdojo.config.json"];

  const errors: string[] = [];
  const idsByProject = new Map<string, Set<string> | undefined>([
    [paths.projectId, new Set(docs.map((doc) => doc.id))],
  ]);
  for (const doc of derivedDocs) {
    try {
      validateDerivedFromWithConfig(
        {
          projectId: paths.projectId,
          itemId: doc.id,
          derivedFrom: doc.item.derivedFrom!,
        },
        config,
        idsByProject,
      );
    } catch (error) {
      errors.push(`${doc.filename}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return errors;
}

function configuredExternalRegisterDirectories(paths: RegisterPaths): Array<{
  projectId: string;
  registerPath: string;
}> {
  let config: SpecDojoConfig | null;
  try {
    ({ config } = loadConfig());
  } catch {
    // `init --dry-run` may intentionally preserve an existing, non-SpecDojo config file.
    // The current project can still produce an empty/local derivation view in that case.
    return [];
  }
  if (!config) return [];
  const configuredCurrent = config.projects[paths.projectId];
  const configuredCurrentPath = configuredCurrent
    ? getProjectRegisterPath(configuredCurrent)
    : undefined;
  if (
    !configuredCurrentPath ||
    resolve(specdojoRootDir(), configuredCurrentPath) !== resolve(paths.projectRegisterPath)
  ) {
    return [];
  }

  return Object.entries(config.projects).flatMap(([projectId, project]) => {
    if (projectId === paths.projectId) return [];
    const registerPath = getProjectRegisterPath(project);
    if (!registerPath) return [];
    const absolutePath = resolve(specdojoRootDir(), registerPath);
    return existsSync(absolutePath) ? [{ projectId, registerPath: absolutePath }] : [];
  });
}

export function collectDerivedRegisterRelations(
  paths: RegisterPaths,
  currentItems: readonly RegisterItemView[],
): DerivedRegisterRelation[] {
  const relations: DerivedRegisterRelation[] = [];
  const collect = (
    projectId: string,
    items: ReadonlyArray<{ item: PjrItem; ticketPath: string }>,
  ): void => {
    for (const item of items) {
      for (const ref of item.item.derivedFrom ?? []) {
        const source = parseRegisterItemRef(ref, projectId);
        if (!source || source.projectId !== paths.projectId) continue;
        relations.push({
          sourceId: source.itemId,
          derivedProjectId: projectId,
          derivedItem: item.item,
          derivedTicketPath: item.ticketPath,
        });
      }
    }
  };

  collect(
    paths.projectId,
    currentItems.flatMap((view) =>
      view.ticketPath ? [{ item: view.item, ticketPath: view.ticketPath }] : [],
    ),
  );
  for (const project of configuredExternalRegisterDirectories(paths)) {
    collect(
      project.projectId,
      loadRegisterItemDocs(project.registerPath).map((doc) => ({
        item: doc.item,
        ticketPath: doc.path,
      })),
    );
  }
  return relations.sort((left, right) => {
    if (left.sourceId !== right.sourceId) return left.sourceId < right.sourceId ? -1 : 1;
    if (left.derivedProjectId !== right.derivedProjectId) {
      return left.derivedProjectId < right.derivedProjectId ? -1 : 1;
    }
    if (left.derivedItem.id === right.derivedItem.id) return 0;
    return left.derivedItem.id < right.derivedItem.id ? -1 : 1;
  });
}
