import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import yaml from "js-yaml";
import { type ResolvedDeliverable, collectResolvedDeliverables } from "./catalog-build.js";
import { resolveBasePath } from "./catalog-paths.js";
import { buildSpecdojoFrontmatter } from "./frontmatter-namespace.js";
import { flattenTemplateFrontmatter } from "./template-frontmatter.js";
import { isDctCatalogFileName, type DctDeliverableItem, type DctDoc } from "./catalog-types.js";

const PROJECT_ID_PLACEHOLDER = "_PROJECT_ID_";

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

function replaceProjectIdDeep(value: unknown, projectId: string): unknown {
  if (typeof value === "string") return value.replaceAll(PROJECT_ID_PLACEHOLDER, projectId);
  if (Array.isArray(value)) return value.map((item) => replaceProjectIdDeep(item, projectId));
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, replaceProjectIdDeep(item, projectId)]),
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

// Locate a deliverable template `<local_id>-template.<ext>` under the templates dir.
function findTemplate(templatesPath: string, localId: string, ext: ".md" | ".yaml"): string | null {
  const candidate = join(templatesPath, `${localId}-template${ext}`);
  return existsSync(candidate) ? candidate : null;
}

// Minimal Markdown scaffold built from catalog metadata when no template exists.
// Fills the generated Frontmatter, an H1 from `name`, the catalog `overview`, and a
// single `_TODO_` line so the author knows the body is unwritten.
function fallbackMarkdown(item: DctDeliverableItem, projectId: string): string {
  const inner: Record<string, unknown> = {
    id: `${projectId}:${item.local_id}`,
    type: "project",
    status: "draft",
  };
  if (item.rulebook && item.rulebook !== "undecided") {
    inner.rulebook = item.rulebook === "not-needed" ? "none" : item.rulebook;
  }
  const basedOn = (item.depends_on ?? []).map((dep) => `${projectId}:${dep}`);
  if (basedOn.length > 0) inner.based_on = basedOn;

  const innerLines = yaml
    .dump(inner, { lineWidth: 120, noRefs: true })
    .replace(/\n+$/, "")
    .split("\n");
  const frontmatter = buildSpecdojoFrontmatter(innerLines);

  return `${frontmatter}\n\n# ${item.name}\n\n${item.overview}\n\n_TODO_: 本文を記述する\n`;
}

// Minimal YAML scaffold built from catalog metadata when no template exists.
function fallbackYaml(item: DctDeliverableItem, projectId: string): string {
  const doc: Record<string, unknown> = {
    id: `${projectId}:${item.local_id}`,
    type: "project",
    status: "draft",
  };
  if (item.rulebook && item.rulebook !== "undecided") {
    doc.rulebook = item.rulebook === "not-needed" ? "none" : item.rulebook;
  }
  return yaml.dump(doc, { lineWidth: 120, noRefs: true });
}

// Flatten a YAML deliverable template (`metadata_template` + body, minus own-meta)
// into its generated form, replacing `_PROJECT_ID_` with the real project id.
function expandYamlTemplate(templatePath: string, projectId: string): string {
  const loaded = yaml.load(readFileSync(templatePath, "utf8"));
  if (!isRecord(loaded)) {
    throw new Error(`Template is not a YAML mapping: ${templatePath}`);
  }
  const metadataTemplate = loaded["metadata_template"];
  const body = Object.fromEntries(
    Object.entries(loaded).filter(([key]) => !TEMPLATE_OWN_META_KEYS.has(key)),
  );
  const merged = isRecord(metadataTemplate) ? { ...metadataTemplate, ...body } : body;
  const doc = replaceProjectIdDeep(merged, projectId);
  return yaml.dump(doc, { lineWidth: 120, noRefs: true });
}

function generateContent(
  item: DctDeliverableItem,
  resolvedPath: string,
  projectId: string,
  templatesPath: string,
): string {
  if (isYamlPath(resolvedPath)) {
    const template = findTemplate(templatesPath, item.local_id, ".yaml");
    return template ? expandYamlTemplate(template, projectId) : fallbackYaml(item, projectId);
  }
  const template = findTemplate(templatesPath, item.local_id, ".md");
  if (template) {
    const raw = readFileSync(template, "utf8");
    return flattenTemplateFrontmatter(raw).replaceAll(PROJECT_ID_PLACEHOLDER, projectId);
  }
  return fallbackMarkdown(item, projectId);
}

// Materialize the deliverable files a project's catalog points to. Only `kind: work`
// items are generated; `control` deliverables have dedicated scaffolds (e.g. register
// scaffold) and `generated` deliverables are produced by build/schedule/exec.
export function runGenerate(opts: {
  catalogPath: string;
  templatesPath: string;
  repoRoot: string;
  projectId: string | null;
  force: boolean;
  dryRun?: boolean;
  dctNames?: string[];
}): { written: string[]; skipped: string[]; errors: string[] } {
  const { catalogPath, templatesPath, repoRoot, force, dryRun = false, dctNames = [] } = opts;
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
      doc = yaml.load(readFileSync(filePath, "utf8")) as DctDoc;
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
        const content = generateContent(item, resolvedPath, projectId, templatesPath);
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
