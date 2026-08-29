import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import { specdojoRootDir } from "./specdojo-config.js";
import type { ReviewViewpointsDoc } from "./review-types.js";

export const COMMON_VIEWPOINTS_ID = "specdojo:pm-review-viewpoints";

const COLLECTIONS = [
  ["categories", "id"],
  ["coverage_types", "id"],
  ["severity_levels", "id"],
  ["verdict_definitions", "id"],
  ["viewpoints", "id"],
  ["role_viewpoint_sets", "role"],
] as const;

type CollectionName = (typeof COLLECTIONS)[number][0];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function loadYamlMapping(path: string): Record<string, unknown> {
  const loaded = yaml.load(readFileSync(path, "utf8"));
  if (!isRecord(loaded)) throw new Error(`Review viewpoints file is not a YAML mapping: ${path}`);
  return loaded;
}

function recordArray(
  doc: Record<string, unknown>,
  name: CollectionName,
  path: string,
): Record<string, unknown>[] {
  const value = doc[name];
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((item) => !isRecord(item))) {
    throw new Error(`Review viewpoints '${name}' must be an array of mappings: ${path}`);
  }
  return value as Record<string, unknown>[];
}

function stringKey(item: Record<string, unknown>, key: string, context: string): string {
  const value = item[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Review viewpoints item is missing '${key}': ${context}`);
  }
  return value;
}

function disabledKeys(
  overlay: Record<string, unknown>,
  name: CollectionName,
  path: string,
): string[] {
  const disabled = overlay["disabled"];
  if (disabled === undefined) return [];
  if (!isRecord(disabled))
    throw new Error(`Review viewpoints 'disabled' must be a mapping: ${path}`);
  const value = disabled[name];
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || !item.trim())) {
    throw new Error(`Review viewpoints 'disabled.${name}' must be a string array: ${path}`);
  }
  return value as string[];
}

function mergeCollection(opts: {
  base: Record<string, unknown>[];
  patch: Record<string, unknown>[];
  disabled: string[];
  key: string;
  name: CollectionName;
  path: string;
}): Record<string, unknown>[] {
  const { base, patch, disabled, key, name, path } = opts;
  const order: string[] = [];
  const values = new Map<string, Record<string, unknown>>();

  for (const item of base) {
    const itemKey = stringKey(item, key, `common ${name}`);
    if (values.has(itemKey)) throw new Error(`Duplicate common ${name} key: ${itemKey}`);
    order.push(itemKey);
    values.set(itemKey, item);
  }

  const patchKeys = new Set<string>();
  for (const item of patch) {
    const itemKey = stringKey(item, key, `${path} ${name}`);
    if (patchKeys.has(itemKey)) throw new Error(`Duplicate project ${name} key: ${itemKey}`);
    patchKeys.add(itemKey);
    if (!values.has(itemKey)) order.push(itemKey);
    values.set(itemKey, item);
  }

  const disabledSet = new Set(disabled);
  for (const itemKey of disabledSet) {
    if (patchKeys.has(itemKey)) {
      throw new Error(`Project ${name} key cannot be both upserted and disabled: ${itemKey}`);
    }
    if (!values.has(itemKey)) {
      throw new Error(`Project disables unknown ${name} key: ${itemKey}`);
    }
  }

  return order
    .filter((itemKey) => !disabledSet.has(itemKey))
    .map((itemKey) => values.get(itemKey)!);
}

function validateResolvedInheritance(doc: Record<string, unknown>, projectPath: string): void {
  const categories = new Set(
    recordArray(doc, "categories", projectPath).map((item) => String(item.id)),
  );
  const coverageTypes = new Set(
    recordArray(doc, "coverage_types", projectPath).map((item) => String(item.id)),
  );
  const viewpoints = recordArray(doc, "viewpoints", projectPath);
  const viewpointRoles = new Map<string, string>();

  for (const viewpoint of viewpoints) {
    const id = stringKey(viewpoint, "id", `${projectPath} viewpoints`);
    const role = stringKey(viewpoint, "role", `${projectPath} viewpoint ${id}`);
    const category = stringKey(viewpoint, "category", `${projectPath} viewpoint ${id}`);
    if (!categories.has(category)) {
      throw new Error(`Viewpoint '${id}' refers to unknown category '${category}': ${projectPath}`);
    }
    const coverage = viewpoint["coverage_types"];
    if (coverage !== undefined) {
      if (!Array.isArray(coverage) || coverage.some((value) => typeof value !== "string")) {
        throw new Error(`Viewpoint '${id}' coverage_types must be a string array: ${projectPath}`);
      }
      for (const coverageId of coverage) {
        if (!coverageTypes.has(coverageId as string)) {
          throw new Error(
            `Viewpoint '${id}' refers to unknown coverage type '${String(coverageId)}': ${projectPath}`,
          );
        }
      }
    }
    viewpointRoles.set(id, role);
  }

  const assigned = new Set<string>();
  for (const roleSet of recordArray(doc, "role_viewpoint_sets", projectPath)) {
    const role = stringKey(roleSet, "role", `${projectPath} role_viewpoint_sets`);
    const refs = roleSet["viewpoints"];
    if (!Array.isArray(refs) || refs.some((value) => typeof value !== "string")) {
      throw new Error(`Role viewpoint set '${role}' must contain a string array: ${projectPath}`);
    }
    for (const ref of refs as string[]) {
      const viewpointRole = viewpointRoles.get(ref);
      if (!viewpointRole) {
        throw new Error(
          `Role viewpoint set '${role}' refers to unknown viewpoint '${ref}': ${projectPath}`,
        );
      }
      if (viewpointRole !== role) {
        throw new Error(
          `Role viewpoint set '${role}' contains viewpoint '${ref}' owned by '${viewpointRole}': ${projectPath}`,
        );
      }
      assigned.add(ref);
    }
  }

  for (const id of viewpointRoles.keys()) {
    if (!assigned.has(id)) {
      throw new Error(
        `Resolved viewpoint '${id}' is not assigned to a role_viewpoint_set: ${projectPath}`,
      );
    }
  }
}

export function commonViewpointsPath(): string {
  return join(specdojoRootDir(), "docs/ja/specdojo/defaults/pm-review-viewpoints.yaml");
}

/**
 * Resolve one inheritance level: common collections are loaded first, project arrays upsert by
 * id (or role), and disabled keys are removed last. A project cannot upsert and disable the same
 * key. Legacy full project files without `extends` remain readable as-is.
 */
export function resolveViewpointsDoc(
  projectPath: string,
  commonPath = commonViewpointsPath(),
): ReviewViewpointsDoc {
  const project = loadYamlMapping(projectPath);
  if (project["extends"] === undefined) return project as ReviewViewpointsDoc;
  if (project["extends"] !== COMMON_VIEWPOINTS_ID) {
    throw new Error(
      `Unsupported review viewpoints inheritance '${String(project["extends"])}'; expected '${COMMON_VIEWPOINTS_ID}': ${projectPath}`,
    );
  }

  const common = loadYamlMapping(commonPath);
  if (common["id"] !== COMMON_VIEWPOINTS_ID) {
    throw new Error(`Common review viewpoints id must be '${COMMON_VIEWPOINTS_ID}': ${commonPath}`);
  }

  const resolved: Record<string, unknown> = { ...common, ...project };
  for (const [name, key] of COLLECTIONS) {
    resolved[name] = mergeCollection({
      base: recordArray(common, name, commonPath),
      patch: recordArray(project, name, projectPath),
      disabled: disabledKeys(project, name, projectPath),
      key,
      name,
      path: projectPath,
    });
  }
  delete resolved["extends"];
  delete resolved["disabled"];
  validateResolvedInheritance(resolved, projectPath);
  return resolved as ReviewViewpointsDoc;
}

export function buildViewpointsOverlay(
  commonPath: string,
  projectId: string,
): Record<string, unknown> {
  const common = loadYamlMapping(commonPath);
  if (common["id"] !== COMMON_VIEWPOINTS_ID) {
    throw new Error(`Common review viewpoints id must be '${COMMON_VIEWPOINTS_ID}': ${commonPath}`);
  }
  return {
    id: `${projectId}:pm-review-viewpoints`,
    type: "project",
    status: "draft",
    title: "レビュー観点一覧",
    rulebook: "none",
    version: 1,
    project_id: projectId,
    extends: COMMON_VIEWPOINTS_ID,
    viewpoints: [],
    role_viewpoint_sets: [],
    disabled: { viewpoints: [], role_viewpoint_sets: [] },
  };
}

export function scaffoldViewpoints(opts: {
  commonPath: string;
  projectId: string;
  outputPath: string;
  force: boolean;
}): { written: boolean; skipped: boolean } {
  const { commonPath, projectId, outputPath, force } = opts;

  if (existsSync(outputPath) && !force) return { written: false, skipped: true };

  const doc = buildViewpointsOverlay(commonPath, projectId);
  const dir = outputPath.includes("/") ? outputPath.slice(0, outputPath.lastIndexOf("/")) : ".";
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  writeFileSync(outputPath, yaml.dump(doc, { lineWidth: 120, noRefs: true }), "utf8");
  return { written: true, skipped: false };
}
