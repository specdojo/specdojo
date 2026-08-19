// DCT plan (dct-plan-<domain>.yaml): the agent judgment artifact that precedes catalog
// generation. The agent decides which deliverable instances a domain needs, which template
// placeholders resolve to which values, which candidates are excluded, and what stays
// undecided. This module owns the plan's canonical location, schema validation, semantic
// rules, skeleton scaffolding, and overwrite protection. Catalog structure (groups,
// base_path, done_criteria) stays in the DCT template and is never copied into a plan.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import yaml from "js-yaml";
import Ajv2020Module from "ajv/dist/2020.js";
import type { ValidateFunction } from "ajv";
import { collectResolvedDeliverables, loadCatalogDocs } from "./catalog-build.js";
import { resolveBasePath } from "./catalog-paths.js";
import type {
  DctDeliverableItem,
  DctSection,
  DctTemplateDoc,
  DctValidationResult,
} from "./catalog-types.js";

export const DCT_PLAN_SCHEMA_VERSION = 1;
export const DCT_PLAN_SCHEMA_PATH = "docs/specdojo/schemas/v1/dct-plan.schema.yaml";

const PLACEHOLDER_RE = /_([A-Z][A-Z0-9_]*)_/g;
const DATA_FLOW_DOMAIN = "data-flow";

export type DctPlanConfidence = "high" | "medium" | "low";
export type DctPlanIterationPattern = "pattern-a" | "pattern-b";
export type DctPlanInputKind =
  | "data-flow"
  | "upstream-deliverable"
  | "existing-catalog"
  | "template"
  | "other";

export type DctPlanVariable = {
  name: string;
  value: string;
  evidence: string[];
  rationale: string;
};

export type DctPlanInput = {
  kind: DctPlanInputKind;
  id?: string;
  path: string;
  note?: string;
};

export type DctPlanDeliverable = {
  local_id: string;
  name: string;
  kind: "work" | "control" | "generated";
  template_local_id: string;
  variables?: DctPlanVariable[];
  depends_on?: string[];
  overview?: string;
  evidence: string[];
  rationale: string;
  confidence: DctPlanConfidence;
};

export type DctPlanExclusion = {
  candidate: string;
  template_local_id?: string;
  reason: string;
};

export type DctPlanOpenQuestion = {
  topic: string;
  question: string;
  blocking: boolean;
  reason: string;
  next_action?: string;
};

export type DctPlan = {
  id: string;
  type: "project";
  status: "draft" | "ready" | "deprecated";
  title: string;
  rulebook: string;
  part_of?: string[];
  schema_version: number;
  project_id: string;
  domain: string;
  template: { id: string; path: string };
  inputs: DctPlanInput[];
  iteration_pattern: DctPlanIterationPattern;
  variables?: DctPlanVariable[];
  deliverables: DctPlanDeliverable[];
  exclusions: DctPlanExclusion[];
  open_questions: DctPlanOpenQuestion[];
  confidence: DctPlanConfidence;
  notes?: string;
};

export type LoadedTemplateForDomain = {
  file: string;
  /** Repository-root-relative template path. */
  relPath: string;
  template: DctTemplateDoc;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function planFileName(domain: string): string {
  return `dct-plan-${domain}.yaml`;
}

// Plans live in a dedicated directory so catalog validate / build, which read
// dct-*.yaml directly under the catalog directory, never treat them as catalogs.
export function resolvePlansDir(catalogPath: string): string {
  return join(catalogPath, "plans");
}

export function resolvePlanPath(catalogPath: string, domain: string): string {
  return join(resolvePlansDir(catalogPath), planFileName(domain));
}

// Plan files share the `dct-` prefix with catalogs, so every catalog file scan that
// walks subdirectories must exclude them explicitly.
export function isDctPlanFileName(fileName: string): boolean {
  return /^dct-plan-.+\.ya?ml$/i.test(basename(fileName));
}

export function domainFromPlanFileName(fileName: string): string | null {
  const match = basename(fileName).match(/^dct-plan-(.+)\.yaml$/);
  return match ? match[1] : null;
}

// ---- schema validation -------------------------------------------------------

const Ajv2020 = Ajv2020Module.default;

let compiledSchemaCache: { schemaPath: string; validate: ValidateFunction } | null = null;

function compilePlanSchema(repoRoot: string): ValidateFunction {
  const schemaPath = join(repoRoot, DCT_PLAN_SCHEMA_PATH);
  if (compiledSchemaCache && compiledSchemaCache.schemaPath === schemaPath) {
    return compiledSchemaCache.validate;
  }
  let schema: unknown;
  try {
    schema = yaml.load(readFileSync(schemaPath, "utf8"));
  } catch (error) {
    throw new Error(
      `Failed to read DCT plan schema: ${schemaPath} (${error instanceof Error ? error.message : String(error)})`,
    );
  }
  const validate = new Ajv2020({ allErrors: true, strict: false }).compile(schema as object);
  compiledSchemaCache = { schemaPath, validate };
  return validate;
}

// Validates a parsed plan against dct-plan.schema.yaml. Returns human-readable errors
// with the failing instance path so an agent can fix the exact field.
export function validatePlanSchema(plan: unknown, repoRoot: string): string[] {
  const validate = compilePlanSchema(repoRoot);
  if (validate(plan)) return [];
  return (validate.errors ?? []).map((error) => {
    const at = error.instancePath || "/";
    const params = isRecord(error.params) ? error.params : {};
    // Ajv omits the offending key from the message for these keywords, which is exactly
    // the detail an agent needs to fix its output.
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

// ---- template lookup ---------------------------------------------------------

// All templates that declare the domain, in file name order. A domain physically split into
// dct-<domain>-<part>-template.yaml keeps one template per part (dct-rulebook,
// 物理分割（1 ドメイン複数ファイル）), so callers that generate catalogs must handle the list.
export function loadTemplatesForDomain(
  templatesPath: string,
  domain: string,
  repoRoot: string,
): LoadedTemplateForDomain[] {
  const files = readdirSync(templatesPath)
    .filter((file) => /^dct-.+\.yaml$/.test(file))
    .sort();
  const loaded: LoadedTemplateForDomain[] = [];
  for (const file of files) {
    const filePath = join(templatesPath, file);
    let template: DctTemplateDoc;
    try {
      template = yaml.load(readFileSync(filePath, "utf8")) as DctTemplateDoc;
    } catch {
      continue;
    }
    if (!template || template.domain !== domain) continue;
    loaded.push({ file, relPath: toRepoRelative(filePath, repoRoot), template });
  }
  return loaded;
}

export function loadTemplateForDomain(
  templatesPath: string,
  domain: string,
  repoRoot: string,
): LoadedTemplateForDomain | null {
  return loadTemplatesForDomain(templatesPath, domain, repoRoot)[0] ?? null;
}

export function collectTemplateEntries(sections: DctSection[]): Map<string, DctDeliverableItem> {
  const entries = new Map<string, DctDeliverableItem>();
  const walk = (nodes: DctSection[]): void => {
    for (const node of nodes) {
      for (const item of node.deliverables ?? []) entries.set(item.local_id, item);
      if (node.groups) walk(node.groups);
    }
  };
  walk(sections);
  return entries;
}

export function placeholderNames(value: string): string[] {
  return [...value.matchAll(PLACEHOLDER_RE)].map((match) => match[1]);
}

export function expandPlaceholders(value: string, variables: Record<string, string>): string {
  return value.replace(PLACEHOLDER_RE, (placeholder, name: string) =>
    Object.hasOwn(variables, name) ? variables[name] : placeholder,
  );
}

function toRepoRelative(absolutePath: string, repoRoot: string): string {
  const normalizedRoot = repoRoot.replace(/\\/g, "/").replace(/\/$/, "");
  const normalized = absolutePath.replace(/\\/g, "/");
  return normalized.startsWith(`${normalizedRoot}/`)
    ? normalized.slice(normalizedRoot.length + 1)
    : normalized;
}

// ---- input resolution --------------------------------------------------------

function isTrashedPath(repoRelativePath: string): boolean {
  return repoRelativePath.split("/").includes("trash");
}

export type PlanInputResolution = {
  inputs: DctPlanInput[];
  warnings: string[];
  errors: string[];
};

// Collects the documents an agent may read for a domain:
//   - every existing data-flow deliverable document (the primary judgment source)
//   - the already generated dct-<domain>.yaml, when the domain was cataloged before
//   - explicitly passed upstream documents (--input)
// A domain without any data-flow document is an error rather than a silent empty input
// set, so the agent never has to guess the instances from the template alone.
export function resolvePlanInputs(opts: {
  catalogPath: string;
  repoRoot: string;
  domain: string;
  extraInputs?: string[];
}): PlanInputResolution {
  const { catalogPath, repoRoot, domain } = opts;
  const warnings: string[] = [];
  const errors: string[] = [];
  const inputs: DctPlanInput[] = [];

  const loaded = loadCatalogDocs(catalogPath);

  const dataFlowPaths = new Set<string>();
  for (const { doc } of loaded) {
    if (doc.domain !== DATA_FLOW_DOMAIN) continue;
    const resolved: Array<{ item: DctDeliverableItem; resolvedPath: string }> = [];
    collectResolvedDeliverables(doc.groups, resolveBasePath("", doc.base_path), resolved);
    for (const { item, resolvedPath } of resolved) {
      if (item.kind !== "work") continue;
      // Deprecated documents keep their catalog entry but move under trash/;
      // they must not become judgment evidence.
      if (isTrashedPath(resolvedPath)) continue;
      if (!existsSync(join(repoRoot, resolvedPath))) {
        warnings.push(`data-flow document not found on disk (skipped): ${resolvedPath}`);
        continue;
      }
      dataFlowPaths.add(resolvedPath);
    }
  }
  for (const path of [...dataFlowPaths].sort()) {
    inputs.push({ kind: DATA_FLOW_DOMAIN, path });
  }

  for (const { doc, filePath } of loaded) {
    if (doc.domain !== domain) continue;
    inputs.push({
      kind: "existing-catalog",
      ...(doc.id ? { id: doc.id } : {}),
      path: toRepoRelative(filePath, repoRoot),
      note: "既存カタログ。既存 local_id を落とす場合は exclusions に理由を残す",
    });
    warnings.push(
      `domain '${domain}' already has a catalog: ${toRepoRelative(filePath, repoRoot)}. ` +
        `Treat it as a baseline and review the diff before regenerating.`,
    );
  }

  for (const extra of [...new Set(opts.extraInputs ?? [])].sort()) {
    const relPath = toRepoRelative(extra, repoRoot);
    if (!existsSync(join(repoRoot, relPath))) {
      errors.push(`--input not found: ${relPath}`);
      continue;
    }
    inputs.push({ kind: "upstream-deliverable", path: relPath });
  }

  if (dataFlowPaths.size === 0 && (opts.extraInputs ?? []).length === 0) {
    errors.push(
      `No data-flow document found for domain '${domain}'.\n` +
        `Create the data-flow catalog and documents first, or pass explicit upstream ` +
        `documents with --input <path>.`,
    );
  }

  return { inputs, warnings, errors };
}

// ---- skeleton ----------------------------------------------------------------

export function buildPlanSkeleton(opts: {
  projectId: string;
  domain: string;
  template: { id: string; path: string };
  inputs: DctPlanInput[];
}): DctPlan {
  const { projectId, domain, template, inputs } = opts;
  return {
    id: `${projectId}:dct-plan-${domain}`,
    type: "project",
    status: "draft",
    title: `成果物カタログ判定計画（${domain}）`,
    rulebook: "none",
    schema_version: DCT_PLAN_SCHEMA_VERSION,
    project_id: projectId,
    domain,
    template,
    inputs,
    // dct-rulebook treats pattern-a as the default; the agent switches to pattern-b when
    // a single business area is split into fixed local_ids.
    iteration_pattern: "pattern-a",
    deliverables: [],
    exclusions: [],
    open_questions: [
      {
        topic: domain,
        question: `domain '${domain}' の成果物インスタンスを判定する`,
        blocking: true,
        reason: "agent 判定が未実施のため、成果物インスタンスが未確定",
        next_action: `specdojo catalog plan prompt --domain ${domain} の指示で agent 判定を行う`,
      },
    ],
    confidence: "low",
  };
}

// ---- semantic validation -----------------------------------------------------

export type PlanValidationOptions = {
  /** Template for the plan's domain, used to check template_local_id and placeholders. */
  template?: DctTemplateDoc;
  /** local_ids already present in the project catalog, used to resolve depends_on. */
  knownLocalIds?: Set<string>;
  /** File name the plan was loaded from, used to check the domain suffix. */
  fileName?: string;
};

function variableMap(plan: DctPlan, deliverable: DctPlanDeliverable): Record<string, string> {
  const map: Record<string, string> = {};
  for (const variable of plan.variables ?? []) map[variable.name] = variable.value;
  for (const variable of deliverable.variables ?? []) map[variable.name] = variable.value;
  return map;
}

// Semantic rules that the JSON schema cannot express: file/domain agreement, template
// traceability, placeholder resolution, pattern A/B distinction, local_id uniqueness,
// and dependency resolution.
export function validateDctPlan(
  plan: DctPlan,
  options: PlanValidationOptions = {},
): DctValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const prefix = plan.domain ? `dct-plan-${plan.domain}.yaml` : "dct-plan";

  if (options.fileName) {
    const fileDomain = domainFromPlanFileName(options.fileName);
    if (fileDomain && fileDomain !== plan.domain) {
      errors.push(
        `${options.fileName}: domain '${plan.domain}' does not match the file name domain '${fileDomain}'.`,
      );
    }
  }

  if (options.template && options.template.domain !== plan.domain) {
    errors.push(
      `${prefix}: template domain '${options.template.domain}' does not match plan domain '${plan.domain}'.`,
    );
  }

  if (plan.id !== `${plan.project_id}:dct-plan-${plan.domain}`) {
    errors.push(
      `${prefix}: id must be '${plan.project_id}:dct-plan-${plan.domain}' (found '${plan.id}').`,
    );
  }

  const templateEntries = options.template
    ? collectTemplateEntries(options.template.groups)
    : new Map<string, DctDeliverableItem>();

  const seen = new Map<string, number>();
  plan.deliverables.forEach((deliverable, index) => {
    const where = `${prefix}: deliverables[${index}] (${deliverable.local_id})`;

    const previous = seen.get(deliverable.local_id);
    if (previous !== undefined) {
      errors.push(`${where}: duplicate local_id (already defined at deliverables[${previous}]).`);
    } else {
      seen.set(deliverable.local_id, index);
    }

    if (options.template && !templateEntries.has(deliverable.template_local_id)) {
      errors.push(
        `${where}: template_local_id '${deliverable.template_local_id}' is not defined in ${options.template.id}.`,
      );
    }

    const templatePlaceholders = placeholderNames(deliverable.template_local_id);
    const variables = variableMap(plan, deliverable);
    const expanded = expandPlaceholders(deliverable.template_local_id, variables);

    if (plan.iteration_pattern === "pattern-a") {
      if (templatePlaceholders.length === 0) {
        errors.push(
          `${where}: pattern-a requires a placeholder in template_local_id ` +
            `(e.g. cdfd-_TERM_); '${deliverable.template_local_id}' has none. ` +
            `Use iteration_pattern: pattern-b for fixed template entries.`,
        );
      }
      const missing = templatePlaceholders.filter((name) => !Object.hasOwn(variables, name));
      if (missing.length > 0) {
        errors.push(
          `${where}: unresolved placeholder(s) ${missing.map((name) => `_${name}_`).join(", ")}. ` +
            `Record the value with evidence in variables, or drop the deliverable and ` +
            `record it in open_questions instead of guessing.`,
        );
      } else if (expanded !== deliverable.local_id) {
        errors.push(
          `${where}: local_id must equal the expanded template_local_id ('${expanded}').`,
        );
      }
    } else {
      if ((deliverable.variables ?? []).length > 0) {
        errors.push(
          `${where}: pattern-b entries must not define variables; use a fixed local_id per processing unit.`,
        );
      }
      if (templatePlaceholders.length > 0 && expanded === deliverable.template_local_id) {
        warnings.push(
          `${where}: template_local_id '${deliverable.template_local_id}' still carries a placeholder; ` +
            `pattern-b uses it only as the derivation source.`,
        );
      }
    }

    if (placeholderNames(deliverable.local_id).length > 0) {
      errors.push(`${where}: local_id still contains an unresolved placeholder.`);
    }

    if (deliverable.confidence === "low") {
      warnings.push(`${where}: confidence is low; a human must confirm before generation.`);
    }
  });

  const planLocalIds = new Set(plan.deliverables.map((deliverable) => deliverable.local_id));
  plan.deliverables.forEach((deliverable, index) => {
    for (const dependency of deliverable.depends_on ?? []) {
      if (planLocalIds.has(dependency)) continue;
      if (options.knownLocalIds?.has(dependency)) continue;
      errors.push(
        `${prefix}: deliverables[${index}] (${deliverable.local_id}): depends_on '${dependency}' ` +
          `is neither planned here nor present in the project catalog.`,
      );
    }
  });

  for (const question of plan.open_questions) {
    if (question.blocking) {
      warnings.push(
        `${prefix}: blocking open question (${question.topic}): ${question.question}. ` +
          `Catalog generation stops until it is answered.`,
      );
    }
  }

  if (plan.deliverables.length === 0) {
    warnings.push(`${prefix}: no deliverables planned yet (skeleton state).`);
  }

  if (plan.confidence === "low") {
    warnings.push(`${prefix}: overall confidence is low; review the plan before generation.`);
  }

  return { ok: errors.length === 0, errors, warnings };
}

// ---- serialization -----------------------------------------------------------

const PLAN_KEY_ORDER = [
  "id",
  "type",
  "status",
  "title",
  "rulebook",
  "part_of",
  "schema_version",
  "project_id",
  "domain",
  "template",
  "inputs",
  "iteration_pattern",
  "variables",
  "deliverables",
  "exclusions",
  "open_questions",
  "confidence",
  "notes",
] as const;

// Re-emits a plan with a fixed key order so re-running the agent produces reviewable
// diffs instead of noise from arbitrary key ordering.
export function normalizePlan(plan: DctPlan): DctPlan {
  const source = plan as unknown as Record<string, unknown>;
  const normalized: Record<string, unknown> = {};
  for (const key of PLAN_KEY_ORDER) {
    if (source[key] !== undefined) normalized[key] = source[key];
  }
  for (const key of Object.keys(source)) {
    if (!Object.hasOwn(normalized, key)) normalized[key] = source[key];
  }
  return normalized as unknown as DctPlan;
}

export function dumpPlan(plan: DctPlan): string {
  return yaml.dump(normalizePlan(plan), {
    lineWidth: 120,
    noRefs: true,
    quotingType: "'",
    forceQuotes: false,
  });
}

export function parsePlan(content: string, filePath: string): DctPlan {
  let parsed: unknown;
  try {
    parsed = yaml.load(content);
  } catch (error) {
    throw new Error(
      `${filePath}: failed to parse YAML (${error instanceof Error ? error.message : String(error)})`,
    );
  }
  if (!isRecord(parsed)) {
    throw new Error(`${filePath}: plan must be a YAML mapping.`);
  }
  return parsed as unknown as DctPlan;
}

export function loadPlan(filePath: string): DctPlan {
  return parsePlan(readFileSync(filePath, "utf8"), filePath);
}

// ---- diff --------------------------------------------------------------------

// Minimal LCS line diff so an existing plan is never overwritten without the operator
// seeing what would change.
export function diffPlanText(current: string, next: string): string[] {
  const splitLines = (text: string): string[] =>
    text === "" ? [] : text.replace(/\n$/, "").split("\n");
  const before = splitLines(current);
  const after = splitLines(next);

  const lengths: number[][] = Array.from({ length: before.length + 1 }, () =>
    new Array<number>(after.length + 1).fill(0),
  );
  for (let i = before.length - 1; i >= 0; i--) {
    for (let j = after.length - 1; j >= 0; j--) {
      lengths[i][j] =
        before[i] === after[j]
          ? lengths[i + 1][j + 1] + 1
          : Math.max(lengths[i + 1][j], lengths[i][j + 1]);
    }
  }

  const lines: string[] = [];
  let i = 0;
  let j = 0;
  while (i < before.length && j < after.length) {
    if (before[i] === after[j]) {
      i++;
      j++;
      continue;
    }
    if (lengths[i + 1][j] >= lengths[i][j + 1]) {
      lines.push(`- ${before[i++]}`);
    } else {
      lines.push(`+ ${after[j++]}`);
    }
  }
  while (i < before.length) lines.push(`- ${before[i++]}`);
  while (j < after.length) lines.push(`+ ${after[j++]}`);
  return lines;
}

// ---- write -------------------------------------------------------------------

export type WritePlanResult = {
  path: string;
  written: boolean;
  /** Set when an existing plan blocked the write or --dry-run suppressed it. */
  skippedReason?: "exists" | "dry-run" | "unchanged";
  diff: string[];
};

// Writes a plan to its canonical path. An existing plan is protected: the write is
// skipped and the diff is returned for review unless force is set.
export function writePlan(opts: {
  catalogPath: string;
  plan: DctPlan;
  force: boolean;
  dryRun: boolean;
}): WritePlanResult {
  const { catalogPath, plan, force, dryRun } = opts;
  const path = resolvePlanPath(catalogPath, plan.domain);
  const next = dumpPlan(plan);

  if (existsSync(path)) {
    const current = readFileSync(path, "utf8");
    const diff = diffPlanText(current, next);
    if (diff.length === 0) {
      return { path, written: false, skippedReason: "unchanged", diff };
    }
    if (!force) {
      return { path, written: false, skippedReason: "exists", diff };
    }
    if (dryRun) {
      return { path, written: false, skippedReason: "dry-run", diff };
    }
    writeFileSync(path, next, "utf8");
    return { path, written: true, diff };
  }

  const diff = diffPlanText("", next);
  if (dryRun) {
    return { path, written: false, skippedReason: "dry-run", diff };
  }
  mkdirSync(resolvePlansDir(catalogPath), { recursive: true });
  writeFileSync(path, next, "utf8");
  return { path, written: true, diff };
}

export function listPlanFiles(catalogPath: string): string[] {
  const plansDir = resolvePlansDir(catalogPath);
  if (!existsSync(plansDir)) return [];
  return readdirSync(plansDir).filter(isDctPlanFileName).sort();
}
