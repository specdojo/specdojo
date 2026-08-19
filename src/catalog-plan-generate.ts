// Deterministic DCT generator: turns an agent-authored dct-plan-<domain>.yaml plus the domain's
// DCT template(s) into dct-<domain>.yaml (or the dct-<domain>-<part>.yaml files of a physically
// split domain). The agent decides which instances exist and what the placeholders mean; every
// structural rule (min_size, placeholder expansion, part_of, domain, base_path, physical split,
// section order) is reused from the catalog scaffold implementation so no second expansion
// implementation exists.

import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import { collectCatalogLocalIds, validateDctDoc } from "./catalog-build.js";
import {
  collectTemplateEntries,
  diffPlanText,
  loadTemplatesForDomain,
  validateDctPlan,
  type DctPlan,
  type DctPlanDeliverable,
  type LoadedTemplateForDomain,
} from "./catalog-plan.js";
import {
  catalogFileNameFromTemplate,
  dumpDctDoc,
  scaffoldDoc,
  type PlannedInstance,
  type ProjectSize,
  type ScaffoldPlanOverlay,
  type ScaffoldVariables,
} from "./catalog-scaffold.js";
import type { DctDeliverableItem, DctDoc, DctSection, DctTemplateDoc } from "./catalog-types.js";

export type GeneratedCatalogFile = {
  /** Absolute output path. */
  path: string;
  fileName: string;
  doc: DctDoc;
  content: string;
};

export type CatalogWriteOutcome = {
  path: string;
  written: boolean;
  /** Set when the write was suppressed instead of performed. */
  skippedReason?: "exists" | "dry-run" | "unchanged";
  diff: string[];
};

export type GenerateCatalogResult = {
  files: GeneratedCatalogFile[];
  errors: string[];
  warnings: string[];
};

function newOverlay(): ScaffoldPlanOverlay {
  return {
    instances: new Map(),
    excluded: new Set(),
    applied: new Set(),
    sizeBlocked: new Set(),
    unresolved: [],
  };
}

function variablesFor(plan: DctPlan, deliverable: DctPlanDeliverable): ScaffoldVariables {
  const variables: ScaffoldVariables = {};
  for (const variable of plan.variables ?? []) variables[variable.name] = variable.value;
  for (const variable of deliverable.variables ?? []) variables[variable.name] = variable.value;
  return variables;
}

// A single synthetic template used for plan validation. A physically split domain has one
// template per part, but the plan references template entries by local_id only, so validation
// works against the union of every part.
function mergeTemplates(templates: LoadedTemplateForDomain[]): DctTemplateDoc {
  const first = templates[0].template;
  const groups: DctSection[] = templates.flatMap(({ template }) => template.groups ?? []);
  return { ...first, groups };
}

function collectDocLocalIds(doc: DctDoc): string[] {
  const ids: string[] = [];
  const walk = (sections: DctSection[]): void => {
    for (const section of sections) {
      for (const item of section.deliverables ?? []) ids.push(item.local_id);
      if (section.groups) walk(section.groups);
    }
  };
  walk(doc.groups);
  return ids;
}

// Blocking conditions that must stop generation before anything is written. A plan is an agent
// judgment, so an unanswered question or a low-confidence instance is a reason to stop rather
// than to emit a partially guessed catalog.
function collectPlanBlockers(plan: DctPlan): string[] {
  const errors: string[] = [];
  if (plan.deliverables.length === 0) {
    errors.push(
      `dct-plan-${plan.domain}.yaml: deliverables が空のため生成できない（agent 判定を先に行う）。`,
    );
  }
  for (const question of plan.open_questions) {
    if (!question.blocking) continue;
    errors.push(
      `dct-plan-${plan.domain}.yaml: 未確定の blocking な open_questions がある (${question.topic}): ` +
        `${question.question}${question.next_action ? ` / next: ${question.next_action}` : ""}`,
    );
  }
  return errors;
}

// Generates the catalog document(s) for one plan. Nothing is written here: the caller inspects
// `errors` first so a plan that fails any check leaves the working tree untouched.
export function generateCatalogsFromPlan(opts: {
  catalogPath: string;
  templatesPath: string;
  repoRoot: string;
  projectId: string;
  size: ProjectSize;
  plan: DctPlan;
}): GenerateCatalogResult {
  const { catalogPath, templatesPath, repoRoot, projectId, size, plan } = opts;
  const errors: string[] = [...collectPlanBlockers(plan)];
  const warnings: string[] = [];

  const templates = loadTemplatesForDomain(templatesPath, plan.domain, repoRoot);
  if (templates.length === 0) {
    errors.push(`No DCT template found for domain '${plan.domain}' in ${templatesPath}.`);
    return { files: [], errors, warnings };
  }

  // Template entry -> owning template file. A duplicated local_id across parts would make the
  // output file ambiguous, so it is an error rather than a first-match win.
  const entryOwner = new Map<string, { template: LoadedTemplateForDomain; file: string }>();
  for (const loaded of templates) {
    const entries: Map<string, DctDeliverableItem> = collectTemplateEntries(
      loaded.template.groups ?? [],
    );
    for (const localId of entries.keys()) {
      const previous = entryOwner.get(localId);
      if (previous) {
        errors.push(
          `template_local_id '${localId}' が ${previous.file} と ${loaded.file} の両方に定義されている。` +
            `物理分割したテンプレート間で local_id を重複させない。`,
        );
        continue;
      }
      entryOwner.set(localId, { template: loaded, file: loaded.file });
    }
  }

  const planValidation = validateDctPlan(plan, {
    template: mergeTemplates(templates),
    knownLocalIds: collectCatalogLocalIds(catalogPath),
  });
  errors.push(...planValidation.errors);
  warnings.push(...planValidation.warnings);

  // Overlay per template file, keeping the plan order inside each template entry.
  const overlays = new Map<string, ScaffoldPlanOverlay>();
  for (const loaded of templates) overlays.set(loaded.file, newOverlay());

  for (const deliverable of plan.deliverables) {
    const owner = entryOwner.get(deliverable.template_local_id);
    if (!owner) {
      errors.push(
        `${deliverable.local_id}: template_local_id '${deliverable.template_local_id}' が domain ` +
          `'${plan.domain}' のテンプレートに存在しない。`,
      );
      continue;
    }
    const templateEntry = collectTemplateEntries(owner.template.template.groups ?? []).get(
      deliverable.template_local_id,
    );
    if (templateEntry && templateEntry.kind !== deliverable.kind) {
      errors.push(
        `${deliverable.local_id}: kind '${deliverable.kind}' がテンプレート項目 ` +
          `'${deliverable.template_local_id}' の kind '${templateEntry.kind}' と一致しない。`,
      );
      continue;
    }
    const overlay = overlays.get(owner.file)!;
    const instances = overlay.instances.get(deliverable.template_local_id) ?? [];
    const instance: PlannedInstance = {
      local_id: deliverable.local_id,
      name: deliverable.name,
      kind: deliverable.kind,
      variables: variablesFor(plan, deliverable),
      ...(deliverable.depends_on ? { depends_on: deliverable.depends_on } : {}),
      ...(deliverable.overview ? { overview: deliverable.overview } : {}),
    };
    instances.push(instance);
    overlay.instances.set(deliverable.template_local_id, instances);
  }

  // Exclusions bound to a template entry drop that entry from the generated catalog. Exclusions
  // without a template entry are documentation of rejected candidates only.
  for (const exclusion of plan.exclusions) {
    if (!exclusion.template_local_id) continue;
    const owner = entryOwner.get(exclusion.template_local_id);
    if (!owner) {
      warnings.push(
        `exclusions: template_local_id '${exclusion.template_local_id}' はテンプレートに存在しない（無視する）。`,
      );
      continue;
    }
    overlays.get(owner.file)!.excluded.add(exclusion.template_local_id);
  }

  const files: GeneratedCatalogFile[] = [];
  for (const loaded of templates) {
    const overlay = overlays.get(loaded.file)!;
    const doc = scaffoldDoc(loaded.template, projectId, size, {}, overlay);
    for (const message of overlay.unresolved) {
      errors.push(`${loaded.file}: ${message}`);
    }
    for (const templateLocalId of overlay.sizeBlocked) {
      errors.push(
        `${loaded.file}: template_local_id '${templateLocalId}' は min_size により size '${size}' の` +
          `対象外だが plan がインスタンスを要求している。size を上げるか plan から外す。`,
      );
    }
    if (doc.groups.length === 0) {
      warnings.push(`${loaded.file}: 生成対象の成果物が 0 件のため出力しない。`);
      continue;
    }
    const fileName = catalogFileNameFromTemplate(loaded.file);
    files.push({
      path: join(catalogPath, fileName),
      fileName,
      doc,
      content: dumpDctDoc(doc),
    });
  }

  const applied = new Set<string>();
  for (const overlay of overlays.values()) {
    for (const localId of overlay.applied) applied.add(localId);
  }
  const dropped = plan.deliverables.filter(
    (deliverable) =>
      entryOwner.has(deliverable.template_local_id) && !applied.has(deliverable.template_local_id),
  );
  for (const deliverable of dropped) {
    errors.push(
      `${deliverable.local_id}: テンプレート項目 '${deliverable.template_local_id}' が生成対象に含まれず、` +
        `インスタンスを出力できなかった（min_size / セクション条件を確認する）。`,
    );
  }

  // Cross-file checks: the generated documents must not collide with each other or with the
  // catalogs of other domains that stay in place.
  const generatedFileNames = new Set(files.map((file) => file.fileName));
  const otherDomainLocalIds = collectCatalogLocalIdsExcept(catalogPath, generatedFileNames);
  const seen = new Map<string, string>();
  const plannedLocalIds = new Set(plan.deliverables.map((deliverable) => deliverable.local_id));
  for (const file of files) {
    for (const localId of collectDocLocalIds(file.doc)) {
      const previous = seen.get(localId);
      if (previous) {
        errors.push(`local_id '${localId}' が ${previous} と ${file.fileName} で重複している。`);
        continue;
      }
      seen.set(localId, file.fileName);
      if (!plannedLocalIds.has(localId)) {
        errors.push(
          `${file.fileName}: template entry '${localId}' が plan の deliverables / exclusions で` +
            `明示的に判定されていない。採用する場合は deliverables、除外する場合は exclusions に記録する。`,
        );
      }
      if (otherDomainLocalIds.has(localId)) {
        errors.push(
          `local_id '${localId}' は別ドメインのカタログに既に存在する。プロジェクト内で一意にする。`,
        );
      }
    }
  }

  const knownLocalIds = new Set([...otherDomainLocalIds, ...seen.keys()]);
  for (const file of files) {
    const result = validateDctDoc(file.doc, file.path, knownLocalIds, repoRoot);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  return { files, errors, warnings };
}

// local_ids declared by the catalogs that are not regenerated by this run.
function collectCatalogLocalIdsExcept(catalogPath: string, skip: Set<string>): Set<string> {
  if (!existsSync(catalogPath)) return new Set();
  const all = collectCatalogLocalIds(catalogPath);
  if (skip.size === 0) return all;
  const skipped = new Set<string>();
  for (const fileName of skip) {
    const filePath = join(catalogPath, fileName);
    if (!existsSync(filePath)) continue;
    for (const localId of collectDocLocalIdsFromFile(filePath)) skipped.add(localId);
  }
  return new Set([...all].filter((localId) => !skipped.has(localId)));
}

function collectDocLocalIdsFromFile(filePath: string): string[] {
  let doc: DctDoc | null = null;
  try {
    doc = yaml.load(readFileSync(filePath, "utf8")) as DctDoc;
  } catch {
    return [];
  }
  return doc && Array.isArray(doc.groups) ? collectDocLocalIds(doc) : [];
}

// Writes the generated catalogs. Existing files are protected: without `force` the write is
// skipped and the diff is returned for review. Nothing is written when any file is blocked, so
// a domain never ends up half regenerated.
export function writeGeneratedCatalogs(opts: {
  catalogPath: string;
  files: GeneratedCatalogFile[];
  force: boolean;
  dryRun: boolean;
}): CatalogWriteOutcome[] {
  const { catalogPath, files, force, dryRun } = opts;
  const outcomes: CatalogWriteOutcome[] = [];

  const planned = files.map((file) => {
    const exists = existsSync(file.path);
    const current = exists ? readFileSync(file.path, "utf8") : "";
    const diff = diffPlanText(current, file.content);
    const unchanged = exists && diff.length === 0;
    const blocked = exists && !unchanged && !force;
    return { file, exists, diff, unchanged, blocked };
  });

  const anyBlocked = planned.some((entry) => entry.blocked);

  const writable = !dryRun && !anyBlocked ? planned.filter((entry) => !entry.unchanged) : [];
  let stagingDir: string | null = null;
  const staged = new Map<string, string>();

  try {
    if (writable.length > 0) {
      mkdirSync(catalogPath, { recursive: true });
      stagingDir = mkdtempSync(join(catalogPath, ".specdojo-catalog-generate-"));
      for (const entry of writable) {
        const temporaryPath = join(stagingDir, entry.file.fileName);
        writeFileSync(temporaryPath, entry.file.content, "utf8");
        staged.set(entry.file.path, temporaryPath);
      }
    }
    for (const entry of planned) {
      if (entry.unchanged) {
        outcomes.push({
          path: entry.file.path,
          written: false,
          skippedReason: "unchanged",
          diff: [],
        });
        continue;
      }
      if (entry.blocked) {
        outcomes.push({
          path: entry.file.path,
          written: false,
          skippedReason: "exists",
          diff: entry.diff,
        });
        continue;
      }
      if (dryRun || anyBlocked) {
        outcomes.push({
          path: entry.file.path,
          written: false,
          skippedReason: dryRun ? "dry-run" : "exists",
          diff: entry.diff,
        });
        continue;
      }
      const temporaryPath = staged.get(entry.file.path);
      if (!temporaryPath) {
        throw new Error(`internal error: staged catalog is missing for ${entry.file.path}`);
      }
      renameSync(temporaryPath, entry.file.path);
      outcomes.push({ path: entry.file.path, written: true, diff: entry.diff });
    }
  } finally {
    if (stagingDir) rmSync(stagingDir, { recursive: true, force: true });
  }

  return outcomes;
}
