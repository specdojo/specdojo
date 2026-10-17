import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { collectResolvedDeliverables, loadCatalogDocs } from "../catalog/build.js";
import { resolveBasePath } from "../catalog/paths.js";
import { collectDocIndexEntries } from "../docs/doc-index.js";
import { readSpecdojoNamespace } from "../docs/frontmatter-namespace.js";
import { getProjectCatalogPath, loadConfig, specdojoRootDir } from "../shared/specdojo-config.js";
import { APPROACHES, type Approach } from "../shared/agent-types.js";
import { load } from "../shared/yaml.js";

const MAINTENANCE_TARGET_KIND: Partial<Record<Approach, string>> = {
  "rulebook-maintenance": "rulebook",
  "recipe-maintenance": "recipe",
  "sample-maintenance": "sample",
  "template-maintenance": "template",
};

function resolvedIndexPath(repoRoot: string, indexedPath: string): string {
  const withoutLine = indexedPath.replace(/:\d+$/, "");
  return resolve(isAbsolute(withoutLine) ? withoutLine : resolve(repoRoot, withoutLine));
}

function catalogDeliverablePaths(catalogPath: string, repoRoot: string): Set<string> {
  const paths = new Set<string>();
  if (!existsSync(catalogPath)) return paths;

  for (const loaded of loadCatalogDocs(catalogPath)) {
    const deliverables: Parameters<typeof collectResolvedDeliverables>[2] = [];
    collectResolvedDeliverables(
      loaded.doc.groups,
      resolveBasePath("", loaded.doc.base_path),
      deliverables,
    );
    for (const deliverable of deliverables) {
      paths.add(resolve(repoRoot, deliverable.resolvedPath));
    }
  }
  return paths;
}

function targetDocumentType(path: string): string | undefined {
  if (!existsSync(path)) return undefined;
  const content = readFileSync(path, "utf8");
  if (path.endsWith(".md")) {
    const type = readSpecdojoNamespace(content).type;
    return typeof type === "string" ? type : undefined;
  }
  const parsed = load(content);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return undefined;
  const type = (parsed as Record<string, unknown>).type;
  return typeof type === "string" ? type : undefined;
}

export type RegisterApproachValidationOptions = {
  repoRoot: string;
  projectId: string;
  catalogPath?: string;
  approach?: string;
  targets?: readonly string[];
  validateTargetsWithoutApproach?: boolean;
};

// register の個票に approach を書く時点で、対象が一意かつ実行方式に合うことを保証する。
// 索引は都度 docs から収集し、生成済みの .specdojo/doc-index.json の鮮度には依存しない。
export function validateRegisterApproachTargets(opts: RegisterApproachValidationOptions): void {
  const approachText = opts.approach?.trim();
  const targets = [...new Set((opts.targets ?? []).map((target) => target.trim()).filter(Boolean))];
  let approach: Approach | undefined;

  if (approachText !== undefined) {
    if (!(APPROACHES as readonly string[]).includes(approachText)) {
      throw new Error(
        `Invalid approach: "${approachText}". Must be one of: ${APPROACHES.join(", ")}`,
      );
    }
    approach = approachText as Approach;
    if (targets.length !== 1) {
      throw new Error(
        `Approach "${approach}" requires exactly one --target doc id (received ${targets.length})`,
      );
    }
  }

  if (!approach && !opts.validateTargetsWithoutApproach) return;
  if (targets.length === 0) return;

  const entries = collectDocIndexEntries(resolve(opts.repoRoot, "docs"), opts.repoRoot);
  const resolvedTargets = targets.map((target) => {
    const indexedPath = entries[target];
    if (!indexedPath) {
      throw new Error(`Target document id is not resolvable via the document index: ${target}`);
    }
    return { id: target, path: resolvedIndexPath(opts.repoRoot, indexedPath) };
  });

  if (!approach) return;
  const expectedKind = MAINTENANCE_TARGET_KIND[approach];
  const [target] = resolvedTargets;
  if (expectedKind) {
    const actualKind = targetDocumentType(target.path);
    if (actualKind !== expectedKind) {
      throw new Error(
        `Approach "${approach}" requires a ${expectedKind} document target, but ${target.id} has type "${actualKind ?? "unknown"}"`,
      );
    }
    return;
  }

  if (!opts.catalogPath) {
    throw new Error(
      `Approach "${approach}" requires a deliverable target, but catalog_path is not configured for project ${opts.projectId}`,
    );
  }
  const deliverablePaths = catalogDeliverablePaths(opts.catalogPath, opts.repoRoot);
  if (!deliverablePaths.has(target.path)) {
    throw new Error(
      `Approach "${approach}" requires a deliverable document from the project catalog, but ${target.id} is not a catalog deliverable`,
    );
  }
}

export function validateRegisterApproachTargetsForProject(opts: {
  projectId: string;
  approach?: string;
  targets?: readonly string[];
  validateTargetsWithoutApproach?: boolean;
}): void {
  const repoRoot = specdojoRootDir();
  const { config, configPath } = loadConfig();
  const project = config?.projects[opts.projectId];
  if (!project) {
    throw new Error(`Unknown project: ${opts.projectId} (check ${configPath})`);
  }
  const catalogPath = getProjectCatalogPath(project);
  validateRegisterApproachTargets({
    repoRoot,
    projectId: opts.projectId,
    ...(catalogPath ? { catalogPath: resolve(repoRoot, catalogPath) } : {}),
    ...(opts.approach !== undefined ? { approach: opts.approach } : {}),
    ...(opts.targets !== undefined ? { targets: opts.targets } : {}),
    ...(opts.validateTargetsWithoutApproach !== undefined
      ? { validateTargetsWithoutApproach: opts.validateTargetsWithoutApproach }
      : {}),
  });
}
