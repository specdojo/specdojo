import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import type { DctDeliverableItem, DctDoc, DctSection, DctTemplateDoc } from "./catalog-types.js";
import { practiceLocalId } from "./practice-id.js";

export type ProjectSize = "small" | "medium" | "large";
export type ScaffoldVariables = Record<string, string>;

type LoadedTemplate = {
  filename: string;
  path: string;
  template: DctTemplateDoc;
};

const PLACEHOLDER_RE = /_([A-Z][A-Z0-9_]*)_/g;

// js-yaml serializes all non-empty arrays in block style.
// Restore flow style for the `roles` field to match template formatting.
function applyFlowStyleRoles(yamlStr: string): string {
  return yamlStr.replace(/^(\s+roles):\n(\s+- [^\n]+\n)+/gm, (match, rolesPrefix) => {
    const items = [...match.matchAll(/^\s+- (.+)$/gm)].map((m) => m[1].trim());
    return `${rolesPrefix}: [${items.join(", ")}]\n`;
  });
}

const SIZE_ORDER: Record<ProjectSize, number> = { small: 0, medium: 1, large: 2 };

function meetsSize(minSize: string | undefined, target: ProjectSize): boolean {
  if (!minSize) return true;
  return (SIZE_ORDER[minSize as ProjectSize] ?? 0) <= SIZE_ORDER[target];
}

// Entries whose local_id retains an uppercase placeholder (e.g. pjr-_NNNN_-_TERM_)
// are excluded from the scaffolded project document.
function isPatternId(id: string): boolean {
  return /_[A-Z][A-Z0-9_]*_/.test(id);
}

function expandTemplateValue<T>(value: T, variables: ScaffoldVariables): T {
  if (typeof value === "string") {
    return value.replace(PLACEHOLDER_RE, (placeholder, name: string) => {
      return Object.hasOwn(variables, name) ? variables[name] : placeholder;
    }) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => expandTemplateValue(item, variables)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, expandTemplateValue(item, variables)]),
    ) as T;
  }
  return value;
}

function collectUnresolvedIds(sections: DctSection[], size: ProjectSize, out: string[]): void {
  for (const section of sections) {
    if (!meetsSize(section.min_size, size)) continue;
    for (const deliverable of section.deliverables ?? []) {
      if (meetsSize(deliverable.min_size, size) && isPatternId(deliverable.local_id)) {
        out.push(deliverable.local_id);
      }
    }
    if (section.groups) collectUnresolvedIds(section.groups, size, out);
  }
}

function filterDeliverable(item: DctDeliverableItem): DctDeliverableItem {
  const { min_size: _ms, depends_on, ...rest } = item;
  if (!depends_on) return rest;
  // Remove depends_on references that point to pattern entries.
  const filtered = depends_on.filter((id) => !isPatternId(id));
  return filtered.length > 0 ? { ...rest, depends_on: filtered } : rest;
}

function filterSection(section: DctSection, size: ProjectSize): DctSection | null {
  if (!meetsSize(section.min_size, size)) return null;

  const { min_size: _ms, ...rest } = section;

  const result: DctSection = {};
  if (rest.name !== undefined) result.name = rest.name;
  if (rest.base_path !== undefined) result.base_path = rest.base_path;
  if (rest.note !== undefined) result.note = rest.note;

  if (rest.deliverables) {
    const deliverables = rest.deliverables
      .filter((d) => meetsSize(d.min_size, size))
      .filter((d) => !isPatternId(d.local_id))
      .map(filterDeliverable);
    if (deliverables.length > 0) result.deliverables = deliverables;
  }

  if (rest.groups) {
    const groups = rest.groups
      .map((g) => filterSection(g, size))
      .filter((g): g is DctSection => g !== null);
    if (groups.length > 0) result.groups = groups;
  }

  if (!result.deliverables && !result.groups) return null;

  return result;
}

// Extract project_id from resolved catalog path (e.g. .../projects/prj-0001/...)
export function deriveProjectId(catalogPath: string): string | null {
  const m = catalogPath.match(/\/projects\/([^/]+)\//);
  return m ? m[1] : null;
}

export function scaffoldDoc(
  template: DctTemplateDoc,
  projectId: string,
  size: ProjectSize,
  variables: ScaffoldVariables = {},
): DctDoc {
  const expanded = expandTemplateValue(template, { ...variables, PROJECT_ID: projectId });

  const groups = expanded.groups
    .map((g) => filterSection(g, size))
    .filter((g): g is DctSection => g !== null);

  const doc: DctDoc = {
    id: `${projectId}:${practiceLocalId(expanded.id).replace(/-template$/, "")}`,
    type: "project",
    status: expanded.status,
    ...(expanded.title ? { title: expanded.title } : {}),
    ...(expanded.rulebook ? { rulebook: expanded.rulebook } : {}),
    ...(expanded.part_of && expanded.part_of.length > 0 ? { part_of: expanded.part_of } : {}),
    project_id: projectId,
    domain: expanded.domain,
    ...(expanded.base_path ? { base_path: expanded.base_path } : {}),
    groups,
  };

  return doc;
}

export function runScaffold(opts: {
  catalogPath: string;
  templatesPath: string;
  size: ProjectSize;
  projectId: string | null;
  force: boolean;
  domains?: string[];
  variables?: ScaffoldVariables;
}): { written: string[]; skipped: string[]; warnings: string[]; errors: string[] } {
  const { catalogPath, templatesPath, size, force } = opts;
  const written: string[] = [];
  const skipped: string[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  const projectId = opts.projectId ?? deriveProjectId(catalogPath);
  if (!projectId) {
    errors.push(
      `Cannot derive project_id from catalog_path: ${catalogPath}\n` +
        `Use --project-id <id> to specify it explicitly.`,
    );
    return { written, skipped, warnings, errors };
  }

  const templateFiles = readdirSync(templatesPath)
    .filter((f) => /^dct-.+\.yaml$/.test(f))
    .sort();

  if (templateFiles.length === 0) {
    errors.push(`No dct-*.yaml template files found in: ${templatesPath}`);
    return { written, skipped, warnings, errors };
  }

  const loaded: LoadedTemplate[] = [];
  for (const f of templateFiles) {
    const templatePath = join(templatesPath, f);
    try {
      const raw = readFileSync(templatePath, "utf8");
      loaded.push({ filename: f, path: templatePath, template: yaml.load(raw) as DctTemplateDoc });
    } catch (err) {
      errors.push(`${templatePath}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  if (errors.length > 0) return { written, skipped, warnings, errors };

  const requestedDomains = [...new Set((opts.domains ?? []).map((d) => d.trim()).filter(Boolean))];
  const availableDomains = [...new Set(loaded.map(({ template }) => template.domain))].sort();
  const unknownDomains = requestedDomains.filter((domain) => !availableDomains.includes(domain));
  if (unknownDomains.length > 0) {
    errors.push(
      `Unknown --domain: ${unknownDomains.join(", ")}. Available: ${availableDomains.join(", ")}`,
    );
    return { written, skipped, warnings, errors };
  }

  const selected =
    requestedDomains.length === 0
      ? loaded
      : loaded.filter(({ template }) => requestedDomains.includes(template.domain));

  mkdirSync(catalogPath, { recursive: true });

  for (const { filename: f, path: templatePath, template } of selected) {
    const outputFilename = f.replace(/-template(\.yaml)$/, "$1");
    const outputPath = join(catalogPath, outputFilename);

    if (existsSync(outputPath) && !force) {
      skipped.push(outputPath);
      continue;
    }

    try {
      const variables = opts.variables ?? {};
      const expanded = expandTemplateValue(template, { ...variables, PROJECT_ID: projectId });
      const unresolvedIds: string[] = [];
      collectUnresolvedIds(expanded.groups, size, unresolvedIds);
      if (unresolvedIds.length > 0) {
        warnings.push(
          `${templatePath}: excluded unresolved deliverables: ${unresolvedIds.join(", ")}`,
        );
      }
      const scaffolded = scaffoldDoc(template, projectId, size, variables);
      const out = yaml.dump(scaffolded, {
        lineWidth: 120,
        noRefs: true,
        quotingType: "'",
        forceQuotes: false,
      });
      writeFileSync(outputPath, applyFlowStyleRoles(out), "utf8");
      written.push(outputPath);
    } catch (err) {
      errors.push(`${templatePath}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return { written, skipped, warnings, errors };
}
