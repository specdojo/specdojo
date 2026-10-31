import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { dump, load } from "../shared/yaml.js";
import { type ResolvedDeliverable, collectResolvedDeliverables } from "./build.js";
import { resolveBasePath } from "./paths.js";
import {
  buildSpecdojoFrontmatter,
  parseSpecdojoDocument,
  readSpecdojoNamespace,
} from "../docs/frontmatter-namespace.js";
import { parsePracticeId, practiceLocalId } from "../shared/practice-id.js";
import { resolveKataDocumentPathIfExists } from "../kata/kata.js";
import { flattenTemplateFrontmatter } from "../docs/template-frontmatter.js";
import { isDctCatalogFileName, type DctDeliverableItem, type DctDoc } from "./types.js";
import {
  resolveSpecdojoPathIfExists,
  type SpecdojoResolutionRoots,
} from "../docs/template-resolution.js";
import { resolveDeliverableByDocId } from "./document-target.js";
import { validateDeliverableTargetPath } from "../register/deliverable-target.js";

const PROJECT_ID_PLACEHOLDER = "_PROJECT_ID_";
const LOCAL_ID_PLACEHOLDER = "_LOCAL_ID_";
const DELIVERABLE_NAME_PLACEHOLDER = "_DELIVERABLE_NAME_";
const DELIVERABLE_OVERVIEW_PLACEHOLDER = "_DELIVERABLE_OVERVIEW_";
const BASED_ON_PLACEHOLDER = "_BASED_ON_";

// Template-own metadata keys are dropped when flattening a YAML template into its
// generated form; the generated metadata comes from `metadata_template` instead
// (document-metadata-standard.md「生成物メタ情報雛形（metadata_template）」).
const TEMPLATE_OWN_META_KEYS = new Set([
  "id",
  "type",
  "status",
  "title",
  "rulebook",
  "metadata_template",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function replaceGeneratedPlaceholders(
  value: unknown,
  item: DctDeliverableItem,
  projectId: string,
): unknown {
  if (typeof value === "string") {
    const basedOn = (item.depends_on ?? []).map((dependency) => `${projectId}:${dependency}`);
    if (value === BASED_ON_PLACEHOLDER) return basedOn;
    return value
      .replaceAll(PROJECT_ID_PLACEHOLDER, projectId)
      .replaceAll(LOCAL_ID_PLACEHOLDER, item.local_id)
      .replaceAll(DELIVERABLE_NAME_PLACEHOLDER, item.name)
      .replaceAll(DELIVERABLE_OVERVIEW_PLACEHOLDER, item.overview)
      .replaceAll(BASED_ON_PLACEHOLDER, JSON.stringify(basedOn));
  }
  if (Array.isArray(value)) {
    return value.map((nested) => replaceGeneratedPlaceholders(nested, item, projectId));
  }
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [
        key,
        replaceGeneratedPlaceholders(nested, item, projectId),
      ]),
    );
  }
  return value;
}

function isYamlPath(path: string): boolean {
  return /\.ya?ml$/i.test(path);
}

// Normalize a dct file name or `--dct` token to its domain part so `dct-project-definition.yaml`,
// `dct-project-definition`, and `project-definition` all compare equal.
function normalizeDctName(name: string): string {
  return name
    .trim()
    .replace(/\.ya?ml$/i, "")
    .replace(/^dct-/, "");
}

// Resolve the path to a rulebook file. The declaration is the SSOT.
function resolveRulebookPath(
  rulebooksPath: string,
  repoRoot: string,
  rulebookId: string | undefined,
  resourceRoots?: SpecdojoResolutionRoots,
): string | null {
  if (
    !rulebookId ||
    rulebookId === "none" ||
    rulebookId === "not-needed" ||
    rulebookId === "undecided"
  ) {
    return null;
  }

  const rulebookFileName = `${practiceLocalId(rulebookId)}.md`;
  const rulebookAuthority = parsePracticeId(rulebookId).authority;
  const localRulebook = rulebookAuthority !== undefined && rulebookAuthority !== "specdojo";
  const rulebookPath = localRulebook
    ? resolveKataDocumentPathIfExists("rulebook", rulebookId, "md", {
        ...resourceRoots,
        repositoryRoot: repoRoot,
      })
    : resourceRoots
      ? resolveSpecdojoPathIfExists(`docs/ja/specdojo/rulebooks/${rulebookFileName}`, resourceRoots)
      : join(rulebooksPath, rulebookFileName);
  if (!rulebookPath || !existsSync(rulebookPath)) return null;
  return rulebookPath;
}

// Resolve a rulebook's declared deliverable_type from its frontmatter.
// Falls back to "project" if the rulebook is absent, unreadable, or omits deliverable_type.
function resolveDeliverableType(
  rulebooksPath: string,
  repoRoot: string,
  rulebookId: string | undefined,
  resourceRoots?: SpecdojoResolutionRoots,
): string {
  const rulebookPath = resolveRulebookPath(rulebooksPath, repoRoot, rulebookId, resourceRoots);
  if (!rulebookPath) return "project";

  try {
    const meta = readSpecdojoNamespace(readFileSync(rulebookPath, "utf8"));
    if (typeof meta.deliverable_type === "string" && meta.deliverable_type.trim().length > 0) {
      return meta.deliverable_type.trim();
    }
  } catch {
    return "project";
  }

  return "project";
}

// Resolve a deliverable template from the rulebook frontmatter declaration. The declaration is
// the SSOT, so local_id naming conventions are deliberately not used as a fallback. This lets
// every deliverable in one rulebook lineage share a single template.
function findTemplate(
  templatesPath: string,
  rulebooksPath: string,
  repoRoot: string,
  rulebookId: string | undefined,
  ext: ".md" | ".yaml",
  resourceRoots?: SpecdojoResolutionRoots,
): string | null {
  const rulebookPath = resolveRulebookPath(rulebooksPath, repoRoot, rulebookId, resourceRoots);
  if (!rulebookPath) return null;

  let templateId: unknown;
  try {
    templateId = readSpecdojoNamespace(readFileSync(rulebookPath, "utf8")).template;
  } catch {
    return null;
  }
  if (
    typeof templateId !== "string" ||
    templateId === "none" ||
    templateId === "not-needed" ||
    templateId === "undecided"
  ) {
    return null;
  }

  const templateFileName = `${practiceLocalId(templateId)}${ext}`;
  const templateAuthority = parsePracticeId(templateId).authority;
  const localTemplate = templateAuthority !== undefined && templateAuthority !== "specdojo";
  const candidate = localTemplate
    ? resolveKataDocumentPathIfExists("template", templateId, ext.slice(1), {
        ...resourceRoots,
        repositoryRoot: repoRoot,
      })
    : resourceRoots
      ? resolveSpecdojoPathIfExists(`docs/ja/specdojo/templates/${templateFileName}`, resourceRoots)
      : join(templatesPath, templateFileName);
  if (!candidate) return null;
  return existsSync(candidate) ? candidate : null;
}

// Minimal Markdown scaffold built from catalog metadata when no template exists.
// Fills the generated Frontmatter, an H1 from `name`, the catalog `overview`, and a
// single `_TODO_` line so the author knows the body is unwritten.
function fallbackMarkdown(
  item: DctDeliverableItem,
  projectId: string,
  deliverableType = "project",
): string {
  const inner: Record<string, unknown> = {
    id: `${projectId}:${item.local_id}`,
    type: deliverableType,
    status: "draft",
  };
  if (item.rulebook && item.rulebook !== "undecided") {
    inner.rulebook = item.rulebook === "not-needed" ? "none" : item.rulebook;
  }
  const basedOn = (item.depends_on ?? []).map((dep) => `${projectId}:${dep}`);
  if (basedOn.length > 0) inner.based_on = basedOn;

  const innerLines = dump(inner, { lineWidth: 120, noRefs: true }).replace(/\n+$/, "").split("\n");
  const frontmatter = buildSpecdojoFrontmatter(innerLines);

  return `${frontmatter}\n\n# ${item.name}\n\n${item.overview}\n\n_TODO_: 本文を記述する\n`;
}

// Minimal YAML scaffold built from catalog metadata when no template exists.
function fallbackYaml(
  item: DctDeliverableItem,
  projectId: string,
  deliverableType = "project",
): string {
  const doc: Record<string, unknown> = {
    id: `${projectId}:${item.local_id}`,
    type: deliverableType,
    status: "draft",
  };
  if (item.rulebook && item.rulebook !== "undecided") {
    doc.rulebook = item.rulebook === "not-needed" ? "none" : item.rulebook;
  }
  return dump(doc, { lineWidth: 120, noRefs: true });
}

// Flatten a YAML deliverable template (`metadata_template` + body, minus own-meta)
// into its generated form, replacing catalog-derived generation placeholders.
function expandYamlTemplate(
  templatePath: string,
  item: DctDeliverableItem,
  projectId: string,
): string {
  const loaded = load(readFileSync(templatePath, "utf8"));
  if (!isRecord(loaded)) {
    throw new Error(`Template is not a YAML mapping: ${templatePath}`);
  }
  const metadataTemplate = loaded["metadata_template"];
  const body = Object.fromEntries(
    Object.entries(loaded).filter(([key]) => !TEMPLATE_OWN_META_KEYS.has(key)),
  );
  const merged = isRecord(metadataTemplate) ? { ...metadataTemplate, ...body } : body;
  const doc = replaceGeneratedPlaceholders(merged, item, projectId);
  return dump(doc, { lineWidth: 120, noRefs: true });
}

function generateContent(
  item: DctDeliverableItem,
  resolvedPath: string,
  projectId: string,
  templatesPath: string,
  rulebooksPath: string,
  repoRoot: string,
  resourceRoots?: SpecdojoResolutionRoots,
): string {
  if (isYamlPath(resolvedPath)) {
    const template = findTemplate(
      templatesPath,
      rulebooksPath,
      repoRoot,
      item.rulebook,
      ".yaml",
      resourceRoots,
    );
    if (template) {
      return expandYamlTemplate(template, item, projectId);
    }
    const deliverableType = resolveDeliverableType(
      rulebooksPath,
      repoRoot,
      item.rulebook,
      resourceRoots,
    );
    return fallbackYaml(item, projectId, deliverableType);
  }
  const template = findTemplate(
    templatesPath,
    rulebooksPath,
    repoRoot,
    item.rulebook,
    ".md",
    resourceRoots,
  );
  if (template) {
    const raw = readFileSync(template, "utf8");
    return replaceGeneratedPlaceholders(flattenTemplateFrontmatter(raw), item, projectId) as string;
  }
  const deliverableType = resolveDeliverableType(
    rulebooksPath,
    repoRoot,
    item.rulebook,
    resourceRoots,
  );
  return fallbackMarkdown(item, projectId, deliverableType);
}

// Materialize the deliverable files a project's catalog points to. Only `kind: work`
// items are generated; `control` deliverables have dedicated scaffolds (e.g. register
// scaffold) and `generated` deliverables are produced by build/schedule/exec.
export function runGenerate(opts: {
  catalogPath: string;
  templatesPath: string;
  rulebooksPath: string;
  repoRoot: string;
  projectId: string | null;
  force: boolean;
  dryRun?: boolean;
  dctNames?: string[];
  resourceRoots?: SpecdojoResolutionRoots;
}): { written: string[]; skipped: string[]; errors: string[] } {
  const {
    catalogPath,
    templatesPath,
    rulebooksPath,
    repoRoot,
    force,
    dryRun = false,
    dctNames = [],
    resourceRoots,
  } = opts;
  const written: string[] = [];
  const skipped: string[] = [];
  const errors: string[] = [];

  if (!existsSync(catalogPath)) {
    errors.push(`Catalog directory not found: ${catalogPath}`);
    return { written, skipped, errors };
  }

  const allFiles = readdirSync(catalogPath).filter(isDctCatalogFileName).sort();

  if (allFiles.length === 0) {
    errors.push(`No dct-*.yaml files found in: ${catalogPath}`);
    return { written, skipped, errors };
  }

  let files = allFiles;
  if (dctNames.length > 0) {
    const wanted = new Set(dctNames.map(normalizeDctName));
    files = allFiles.filter((f) => wanted.has(normalizeDctName(f)));
    const matched = new Set(files.map(normalizeDctName));
    const unmatched = [...wanted].filter((name) => !matched.has(name));
    if (unmatched.length > 0) {
      const available = allFiles.join(", ");
      errors.push(`No dct-*.yaml matches: ${unmatched.join(", ")}\nAvailable: ${available}`);
      return { written, skipped, errors };
    }
  }

  for (const f of files) {
    const filePath = join(catalogPath, f);
    let doc: DctDoc;
    try {
      doc = load(readFileSync(filePath, "utf8")) as DctDoc;
    } catch (err) {
      errors.push(`${filePath}: ${err instanceof Error ? err.message : String(err)}`);
      continue;
    }
    if (!doc || !Array.isArray(doc.groups)) continue;

    const projectId = opts.projectId ?? doc.project_id;
    if (!projectId) {
      errors.push(`${filePath}: project_id missing. Use --project-id <id> to specify it.`);
      continue;
    }

    const resolved: ResolvedDeliverable[] = [];
    collectResolvedDeliverables(doc.groups, resolveBasePath("", doc.base_path), resolved);

    for (const { item, resolvedPath } of resolved) {
      if (item.kind !== "work" || !item.path) continue;

      const outputPath = join(repoRoot, resolvedPath);
      if (existsSync(outputPath) && !force) {
        skipped.push(resolvedPath);
        continue;
      }

      try {
        const content = generateContent(
          item,
          resolvedPath,
          projectId,
          templatesPath,
          rulebooksPath,
          repoRoot,
          resourceRoots,
        );
        if (!dryRun) {
          mkdirSync(dirname(outputPath), { recursive: true });
          writeFileSync(outputPath, content, "utf8");
        }
        written.push(resolvedPath);
      } catch (err) {
        errors.push(`${resolvedPath}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  return { written, skipped, errors };
}

function ensureFrontmatterProperties(
  content: string,
  isYaml: boolean,
  expected: { id: string; status: string; rulebook?: string },
): string {
  if (isYaml) {
    const loaded = load(content) as Record<string, unknown> | undefined;
    const doc = loaded && typeof loaded === "object" && !Array.isArray(loaded) ? loaded : {};
    doc.id = expected.id;
    doc.status = expected.status;
    if (expected.rulebook && expected.rulebook !== "undecided") {
      doc.rulebook = expected.rulebook === "not-needed" ? "none" : expected.rulebook;
    }
    return dump(doc, { lineWidth: 120, noRefs: true });
  }

  const { data, body } = parseSpecdojoDocument(content);
  data.id = expected.id;
  data.status = expected.status;
  if (expected.rulebook && expected.rulebook !== "undecided") {
    data.rulebook = expected.rulebook === "not-needed" ? "none" : expected.rulebook;
  }
  const innerLines = dump(data, { lineWidth: 120, noRefs: true }).replace(/\n+$/, "").split("\n");
  const fm = buildSpecdojoFrontmatter(innerLines);
  return `${fm}\n\n${body.replace(/^\n+/, "")}`;
}

export type GenerateTargetOptions = {
  catalogPath?: string;
  templatesPath: string;
  rulebooksPath: string;
  repoRoot: string;
  projectId: string;
  targetId: string;
  targetPath?: string;
  targetRulebook?: string;
  force: boolean;
  dryRun?: boolean;
  resourceRoots?: SpecdojoResolutionRoots;
};

export function runGenerateTarget(opts: GenerateTargetOptions): {
  written: string[];
  skipped: string[];
  errors: string[];
} {
  const {
    catalogPath,
    templatesPath,
    rulebooksPath,
    repoRoot,
    projectId,
    targetId,
    targetPath,
    targetRulebook,
    force,
    dryRun = false,
    resourceRoots,
  } = opts;

  const written: string[] = [];
  const skipped: string[] = [];
  const errors: string[] = [];

  const localId = targetId.includes(":") ? targetId.slice(targetId.indexOf(":") + 1) : targetId;
  const canonicalDocId = targetId.includes(":") ? targetId : `${projectId}:${targetId}`;

  let item: DctDeliverableItem | undefined;
  let resolvedPath: string | undefined;

  if (catalogPath && existsSync(catalogPath)) {
    try {
      const resolved = resolveDeliverableByDocId(catalogPath, projectId, targetId, repoRoot);
      item = resolved.info.deliverable;
      resolvedPath = resolved.info.resolvedPath;
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !error.message.startsWith("catalog deliverable target not found")
      ) {
        errors.push(error instanceof Error ? error.message : String(error));
        return { written, skipped, errors };
      }
      if (!targetPath || !targetRulebook) {
        errors.push(error.message);
        return { written, skipped, errors };
      }
    }
  }

  if (!item || !resolvedPath) {
    if (!targetPath || !targetRulebook) {
      errors.push(
        `Catalog-less deliverable ${targetId} requires both --target-path and --target-rulebook`,
      );
      return { written, skipped, errors };
    }

    try {
      resolvedPath = validateDeliverableTargetPath(repoRoot, canonicalDocId, targetPath);
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
      return { written, skipped, errors };
    }

    item = {
      local_id: localId,
      name: localId,
      kind: "work",
      overview: "",
      path: resolvedPath,
      rulebook: targetRulebook,
    };
  }

  if (item.kind !== "work") {
    errors.push(
      `Deliverable ${targetId} is kind '${item.kind}', only 'work' deliverables can be scaffolded`,
    );
    return { written, skipped, errors };
  }

  const outputPath = join(repoRoot, resolvedPath);
  if (existsSync(outputPath) && !force) {
    skipped.push(resolvedPath);
    return { written, skipped, errors };
  }

  try {
    let content = generateContent(
      item,
      resolvedPath,
      projectId,
      templatesPath,
      rulebooksPath,
      repoRoot,
      resourceRoots,
    );

    content = ensureFrontmatterProperties(content, isYamlPath(resolvedPath), {
      id: canonicalDocId,
      status: "draft",
      rulebook: item.rulebook,
    });

    if (!dryRun) {
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, content, "utf8");
    }
    written.push(resolvedPath);
  } catch (err) {
    errors.push(`${resolvedPath}: ${err instanceof Error ? err.message : String(err)}`);
  }

  return { written, skipped, errors };
}
