// Deterministic strategy generator: turns the deliverable catalogs (DCT), the track plan
// (Timeline), intent declarations, current facts/grades and the standard strategy profiles into
// sch-strategy-<track>.yaml. Approach selection and all generated schedule structures are decided
// by code so `schedule build` and `exec refresh` stay deterministic.

import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { dump, load as loadYaml } from "./yaml.js";
import { resolveSpecdojoPath } from "./template-resolution.js";
import Ajv2020Module from "ajv/dist/2020.js";
import type { ValidateFunction } from "ajv";
import { diffPlanText } from "./catalog-plan.js";
import type { DctKind } from "./catalog-types.js";
import { readYaml } from "./exec-shared.js";
import { buildScheduleTrack } from "./schedule-build.js";
import {
  collectApproachFacts,
  deriveApproaches,
  type ApproachRule,
  type StrategyScope,
} from "./schedule-approach.js";
import {
  buildStrategyDocument,
  type PreservedStrategyFields,
} from "./schedule-strategy-generate-document.js";
import {
  collectScopeDeliverables,
  isRecord,
  loadKnownRoles,
  resolveDeliverableOwners,
  resolveTrackScopeCatalogs,
  type CatalogDeliverable,
} from "./schedule-strategy-generate-scope.js";

export const SCH_STRATEGY_SCHEMA_PATH = "docs/specdojo/schemas/v1/sch-strategy.schema.yaml";

export {
  artifactNameFromCatalogTitle,
  collectScopeDeliverables,
  loadKnownRoles,
  resolveDeliverableOwners,
  resolveTrackScopeCatalogs,
} from "./schedule-strategy-generate-scope.js";
export type {
  CatalogDeliverable,
  OwnerResolution,
  ScopeResolution,
  StrategyCatalogRef,
} from "./schedule-strategy-generate-scope.js";
export { buildStrategyDocument } from "./schedule-strategy-generate-document.js";
export type {
  BuildStrategyInput,
  BuildStrategyResult,
  PreservedStrategyFields,
  StrategyDeliverable,
} from "./schedule-strategy-generate-document.js";

// ---- serialization & validation ------------------------------------------------

export function dumpStrategy(doc: Record<string, unknown>): string {
  return dump(doc, {
    lineWidth: 120,
    noRefs: true,
    quoteStyle: "double",
    forceQuotes: false,
  });
}

const Ajv2020 = Ajv2020Module.default;

let compiledSchemaCache: { schemaPath: string; validate: ValidateFunction } | null = null;

function compileStrategySchema(repoRoot: string): ValidateFunction {
  const schemaPath = resolveSpecdojoPath(SCH_STRATEGY_SCHEMA_PATH, {
    repositoryRoot: repoRoot,
  });
  if (compiledSchemaCache && compiledSchemaCache.schemaPath === schemaPath) {
    return compiledSchemaCache.validate;
  }
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  const load = (fileName: string): unknown => {
    const filePath = resolveSpecdojoPath(`docs/specdojo/schemas/v1/${fileName}`, {
      repositoryRoot: repoRoot,
    });
    try {
      return loadYaml(readFileSync(filePath, "utf8"));
    } catch (error) {
      throw new Error(
        `Failed to read strategy schema: ${filePath} (${error instanceof Error ? error.message : String(error)})`,
      );
    }
  };
  // Relative $refs resolve against the empty base URI, so the referenced files are registered
  // under their bare file names first.
  ajv.addSchema(load("sch-common.schema.yaml") as object, "sch-common.schema.yaml");
  ajv.addSchema(load("exec-common.schema.yaml") as object, "exec-common.schema.yaml");
  const validate = ajv.compile(load(basename(SCH_STRATEGY_SCHEMA_PATH)) as object);
  compiledSchemaCache = { schemaPath, validate };
  return validate;
}

export function validateStrategySchema(doc: unknown, repoRoot: string): string[] {
  const validate = compileStrategySchema(repoRoot);
  if (validate(doc)) return [];
  return (validate.errors ?? []).map((error) => {
    const at = error.instancePath || "/";
    const params = isRecord(error.params) ? error.params : {};
    const detail =
      typeof params.additionalProperty === "string"
        ? ` (${params.additionalProperty})`
        : typeof params.missingProperty === "string"
          ? ` (${params.missingProperty})`
          : Array.isArray(params.allowedValues)
            ? ` (allowed: ${params.allowedValues.join(", ")})`
            : "";
    return `${at}: ${error.message ?? "schema violation"}${detail}`;
  });
}

export type StrategyDryRunResult = {
  taskCount: number;
  milestoneIds: string[];
  errors: string[];
  warnings: string[];
};

// `schedule build --dry-run` equivalent for a candidate strategy that is not on disk yet. The
// candidate is evaluated from a temporary file whose name does not match sch-strategy-*.yaml,
// so no other command can pick it up while it exists.
export function dryRunStrategy(opts: {
  repoRoot: string;
  schedulePath: string;
  track: string;
  projectId: string;
  content: string;
}): StrategyDryRunResult {
  const { repoRoot, schedulePath, track, projectId, content } = opts;
  const errors: string[] = [];
  const warnings: string[] = [];
  const candidateDir = mkdtempSync(join(tmpdir(), "specdojo-strategy-candidate-"));
  const candidatePath = join(candidateDir, `sch-strategy-${track}.yaml`);
  const targetFileName = `sch-strategy-${track}.yaml`;

  writeFileSync(candidatePath, content, "utf8");
  try {
    const result = buildScheduleTrack(candidatePath, repoRoot);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
    if (result.projectId !== projectId) {
      errors.push(
        `生成した strategy の project id '${result.projectId}' が '${projectId}' と一致しない。`,
      );
    }

    const milestoneIds = result.milestones.map((milestone) => milestone.id);
    const owners = new Map<string, string>();
    for (const id of milestoneIds) owners.set(id, targetFileName);

    const otherFiles = (existsSync(schedulePath) ? readdirSync(schedulePath) : [])
      .filter((file) => /^sch-strategy-.+\.yaml$/.test(file))
      .filter((file) => file !== targetFileName)
      .sort();
    for (const file of otherFiles) {
      try {
        const other = buildScheduleTrack(join(schedulePath, file), repoRoot);
        for (const milestone of other.milestones) {
          const previous = owners.get(milestone.id);
          if (previous) {
            errors.push(
              `Milestone ID '${milestone.id}' が ${previous} と ${file} で重複している。`,
            );
            continue;
          }
          owners.set(milestone.id, file);
        }
      } catch (error) {
        warnings.push(`${file}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return { taskCount: result.tasks.length, milestoneIds, errors, warnings };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    return { taskCount: 0, milestoneIds: [], errors, warnings };
  } finally {
    rmSync(candidateDir, { recursive: true, force: true });
  }
}

// ---- write ---------------------------------------------------------------------

export type WriteStrategyResult = {
  path: string;
  written: boolean;
  skippedReason?: "exists" | "dry-run" | "unchanged";
  diff: string[];
};

export function strategyPathFor(schedulePath: string, track: string): string {
  return join(schedulePath, `sch-strategy-${track}.yaml`);
}

// Writes the strategy to its canonical path with the same overwrite protection the other
// generators use: an existing file is never replaced without --force, and the diff is returned
// so the operator can review the change first.
export function writeStrategyFile(opts: {
  schedulePath: string;
  track: string;
  content: string;
  force: boolean;
  dryRun: boolean;
}): WriteStrategyResult {
  const path = strategyPathFor(opts.schedulePath, opts.track);
  const exists = existsSync(path);
  const current = exists ? readFileSync(path, "utf8") : "";
  const diff = diffPlanText(current, opts.content);

  if (exists && diff.length === 0) {
    return { path, written: false, skippedReason: "unchanged", diff };
  }
  if (exists && !opts.force) {
    return { path, written: false, skippedReason: "exists", diff };
  }
  if (opts.dryRun) {
    return { path, written: false, skippedReason: "dry-run", diff };
  }
  mkdirSync(opts.schedulePath, { recursive: true });
  const temporaryPath = join(opts.schedulePath, `.sch-strategy-${opts.track}.${process.pid}.tmp`);
  try {
    writeFileSync(temporaryPath, opts.content, "utf8");
    renameSync(temporaryPath, path);
  } finally {
    rmSync(temporaryPath, { force: true });
  }
  return { path, written: true, diff };
}

// Fields a regenerated strategy keeps from the existing file. They record human decisions
// (intent, start date, completed deliverables, extra ordering, owner assignments) that cannot be
// derived from the catalogs or the timeline.
export function readPreservedFields(strategyPath: string): PreservedStrategyFields {
  const ownerByLocalId = new Map<string, string>();
  if (!existsSync(strategyPath)) return { ownerByLocalId, approachRules: [] };
  const doc = readYaml(strategyPath);
  if (!isRecord(doc)) return { ownerByLocalId, approachRules: [] };

  const approachRules = (Array.isArray(doc.approach_rules) ? doc.approach_rules : []).filter(
    (rule): rule is ApproachRule =>
      isRecord(rule) && Array.isArray(rule.local_ids) && typeof rule.intent === "string",
  );

  for (const rule of Array.isArray(doc.owner_rules) ? doc.owner_rules : []) {
    if (!isRecord(rule) || typeof rule.owner !== "string") continue;
    for (const localId of Array.isArray(rule.local_ids) ? rule.local_ids : []) {
      if (typeof localId === "string") ownerByLocalId.set(localId, rule.owner);
    }
  }

  const crossDeps: Array<{ dependent: string; requires: string; note?: string }> = [];
  for (const dep of Array.isArray(doc.cross_domain_dependencies)
    ? doc.cross_domain_dependencies
    : []) {
    if (!isRecord(dep)) continue;
    if (typeof dep.dependent !== "string" || typeof dep.requires !== "string") continue;
    crossDeps.push({
      dependent: dep.dependent,
      requires: dep.requires,
      ...(typeof dep.note === "string" ? { note: dep.note } : {}),
    });
  }

  const firstOwner = (field: unknown): string | undefined => {
    if (!Array.isArray(field)) return undefined;
    const entry = field.find((item) => isRecord(item) && typeof item.owner === "string");
    return isRecord(entry) && typeof entry.owner === "string" ? entry.owner : undefined;
  };
  const milestoneEntries = Array.isArray(doc.group_milestones)
    ? doc.group_milestones.map((item) => (isRecord(item) ? item.milestone : undefined))
    : [];
  const gateOwner = firstOwner(doc.phase_gates);
  const milestoneOwner = firstOwner(milestoneEntries);
  const passOwner = firstOwner(doc.cross_deliverable_passes);

  return {
    ...(typeof doc.status === "string" ? { status: doc.status } : {}),
    ...(typeof doc.title === "string" ? { title: doc.title } : {}),
    ...(isRecord(doc.settings) ? { settings: doc.settings } : {}),
    ...(isRecord(doc.initial_state) ? { initial_state: doc.initial_state } : {}),
    ...(crossDeps.length > 0 ? { cross_domain_dependencies: crossDeps } : {}),
    ...(gateOwner ? { gateOwner } : {}),
    ...(milestoneOwner ? { milestoneOwner } : {}),
    ...(passOwner ? { passOwner } : {}),
    ownerByLocalId,
    approachRules,
  };
}

export function loadStrategyDocument(strategyPath: string): Record<string, unknown> | null {
  if (!existsSync(strategyPath)) return null;
  const doc = readYaml(strategyPath);
  return isRecord(doc) ? doc : null;
}

export type GenerateStrategyResult = {
  doc: Record<string, unknown> | null;
  content: string;
  taskCount: number;
  milestoneIds: string[];
  errors: string[];
  warnings: string[];
};

// Complete generation pipeline used by the CLI and tests. Every input is re-read and validated
// before a candidate is returned; missing intent, grade, scope coverage, owners or references stop
// generation instead of producing a guessed strategy.
export function generateStrategy(opts: {
  repoRoot: string;
  schedulePath: string;
  catalogPath: string;
  timelinePath: string;
  rolesPath?: string;
  projectId: string;
  track: string;
  ownerOverrides?: Map<string, string>;
  defaultOwner?: string;
  gateOwner?: string;
  milestoneOwner?: string;
  passOwnerOverride?: string;
  bootstrapOrdering?: boolean;
}): GenerateStrategyResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const targetPath = strategyPathFor(opts.schedulePath, opts.track);
  const existing = loadStrategyDocument(targetPath);
  const preserved = readPreservedFields(targetPath);

  const scope = resolveTrackScopeCatalogs({
    repoRoot: opts.repoRoot,
    catalogPath: opts.catalogPath,
    timelinePath: opts.timelinePath,
    track: opts.track,
    existingStrategy: existing,
  });
  errors.push(...scope.errors);
  warnings.push(...scope.warnings);

  const strategyScope: StrategyScope = {
    strategyId: `${opts.projectId}:sch-strategy-${opts.track}`,
    track: opts.track,
    projectId: opts.projectId,
    catalogs: scope.catalogs.map((catalog) => ({
      id: catalog.id,
      path: catalog.path,
      ...(catalog.local_ids ? { local_ids: catalog.local_ids } : {}),
    })),
    includeKinds: ["work"] as DctKind[],
  };
  const current = collectApproachFacts({ repoRoot: opts.repoRoot, scope: strategyScope });
  errors.push(...current.errors);
  warnings.push(...current.warnings);

  const catalogDeliverables = collectScopeDeliverables({
    repoRoot: opts.repoRoot,
    catalogs: scope.catalogs,
    includeKinds: ["work"],
  });
  errors.push(...catalogDeliverables.errors);
  const catalogByLocalId = new Map<string, CatalogDeliverable>();
  for (const deliverable of catalogDeliverables.deliverables) {
    const previous = catalogByLocalId.get(deliverable.local_id);
    if (previous) {
      errors.push(
        `local_id '${deliverable.local_id}' が ${previous.catalog_id} と ${deliverable.catalog_id} で重複している。`,
      );
      continue;
    }
    catalogByLocalId.set(deliverable.local_id, deliverable);
  }
  const approaches = deriveApproaches({
    facts: current.deliverables,
    rules: preserved.approachRules,
  });
  errors.push(...approaches.errors);
  warnings.push(...approaches.warnings);
  const approachIds = new Set(approaches.deliverables.map((deliverable) => deliverable.local_id));
  for (const localId of catalogByLocalId.keys()) {
    if (!approachIds.has(localId)) errors.push(`${localId}: strategy profile の選択結果が無い。`);
  }

  if (opts.rolesPath && !existsSync(resolve(opts.repoRoot, opts.rolesPath))) {
    errors.push(`roles_path が見つからない: ${opts.rolesPath}`);
  }
  const knownRoles = loadKnownRoles(opts.repoRoot, opts.rolesPath);
  const owners = resolveDeliverableOwners({
    localIds: [...catalogByLocalId.keys()],
    overrides: opts.ownerOverrides ?? new Map(),
    previous: preserved.ownerByLocalId,
    ...(opts.defaultOwner ? { defaultOwner: opts.defaultOwner } : {}),
    ...(knownRoles.size > 0 ? { knownRoles } : {}),
  });
  errors.push(...owners.errors);
  warnings.push(...owners.warnings);

  const gateOwner = opts.gateOwner ?? preserved.gateOwner ?? opts.defaultOwner ?? "";
  const milestoneOwner =
    opts.milestoneOwner ?? preserved.milestoneOwner ?? opts.defaultOwner ?? gateOwner;
  const passOwnerOverride = opts.passOwnerOverride ?? preserved.passOwner;
  for (const [label, owner] of [
    ["gate", gateOwner],
    ["milestone", milestoneOwner],
    ["cross-deliverable pass", passOwnerOverride],
  ] as const) {
    if (owner && knownRoles.size > 0 && !knownRoles.has(owner)) {
      errors.push(`${label} owner '${owner}' は pm-roles.yaml に存在しない。`);
    }
  }

  const dependsOn = new Map(
    catalogDeliverables.deliverables.map((deliverable) => [
      deliverable.local_id,
      deliverable.depends_on,
    ]),
  );
  const built = buildStrategyDocument({
    projectId: opts.projectId,
    track: opts.track,
    catalogs: scope.catalogs,
    deliverables: approaches.deliverables,
    dependsOn,
    owners: owners.owners,
    gateOwner,
    milestoneOwner,
    ...(passOwnerOverride ? { passOwnerOverride } : {}),
    bootstrapOrdering: opts.bootstrapOrdering ?? true,
    includeKinds: ["work"],
    preserved,
  });
  errors.push(...built.errors);
  warnings.push(...built.warnings);

  const strategySchemaErrors = validateStrategySchema(built.doc, opts.repoRoot);
  errors.push(...strategySchemaErrors.map((error) => `sch-strategy-${opts.track}.yaml${error}`));
  const content = dumpStrategy(built.doc);
  if (errors.length > 0) {
    return { doc: null, content, taskCount: 0, milestoneIds: [], errors, warnings };
  }

  const dryRun = dryRunStrategy({
    repoRoot: opts.repoRoot,
    schedulePath: opts.schedulePath,
    track: opts.track,
    projectId: opts.projectId,
    content,
  });
  errors.push(...dryRun.errors);
  warnings.push(...dryRun.warnings);
  return {
    doc: errors.length === 0 ? built.doc : null,
    content,
    taskCount: dryRun.taskCount,
    milestoneIds: dryRun.milestoneIds,
    errors,
    warnings,
  };
}
