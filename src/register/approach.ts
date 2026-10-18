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

function catalogDeliverableDocIds(
  catalogPath: string,
  repoRoot: string,
  projectId: string,
): Set<string> {
  const ids = new Set<string>();
  if (!existsSync(catalogPath)) return ids;

  for (const loaded of loadCatalogDocs(catalogPath)) {
    const deliverables: Parameters<typeof collectResolvedDeliverables>[2] = [];
    collectResolvedDeliverables(
      loaded.doc.groups,
      resolveBasePath("", loaded.doc.base_path),
      deliverables,
    );
    for (const deliverable of deliverables) {
      // register の対象指定では、PJR-H72A が定める成果物 local_id の canonical 形式も
      // 受け付ける。文書が既にあれば、その frontmatter の実 ID も同じ成果物として扱う。
      ids.add(`${projectId}:${deliverable.item.local_id}`);
      const path = resolve(repoRoot, deliverable.resolvedPath);
      if (existsSync(path)) {
        try {
          const id = readSpecdojoNamespace(readFileSync(path, "utf8")).id;
          if (typeof id === "string" && id.trim()) {
            ids.add(id.trim());
            continue;
          }
        } catch {
          // 読み取り不能・不正 frontmatter は配置規約による ID へフォールバックする。
        }
      }

      const normalizedPath = deliverable.resolvedPath.replaceAll("\\", "/").replace(/^\/+/, "");
      if (/^docs\/[a-z]{2}\/product(?:\/|$)/.test(normalizedPath)) {
        ids.add(deliverable.item.local_id);
      }
    }
  }
  return ids;
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
// kata は都度 docs から収集した索引、成果物は DCT を正本として解決し、生成済みの
// .specdojo/doc-index.json の鮮度や成果物文書の作成済み・未作成には依存しない。
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
  if (!approach) {
    for (const target of targets) {
      if (!entries[target]) {
        throw new Error(`Target document id is not resolvable via the document index: ${target}`);
      }
    }
    return;
  }

  const expectedKind = MAINTENANCE_TARGET_KIND[approach];
  const [targetId] = targets;
  if (expectedKind) {
    const indexedPath = entries[targetId];
    if (!indexedPath) {
      throw new Error(`Target document id is not resolvable via the document index: ${targetId}`);
    }
    const actualKind = targetDocumentType(resolvedIndexPath(opts.repoRoot, indexedPath));
    if (actualKind !== expectedKind) {
      throw new Error(
        `Approach "${approach}" requires a ${expectedKind} document target, but ${targetId} has type "${actualKind ?? "unknown"}"`,
      );
    }
    return;
  }

  if (!opts.catalogPath) {
    throw new Error(
      `Approach "${approach}" requires a deliverable target, but catalog_path is not configured for project ${opts.projectId}`,
    );
  }
  const deliverableDocIds = catalogDeliverableDocIds(
    opts.catalogPath,
    opts.repoRoot,
    opts.projectId,
  );
  if (!deliverableDocIds.has(targetId)) {
    throw new Error(
      `Approach "${approach}" requires a deliverable document from the project catalog, but ${targetId} is not a catalog deliverable`,
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
