import { existsSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { collectResolvedDeliverables } from "../catalog/build.js";
import { resolveBasePath } from "../catalog/paths.js";
import type { DctDoc } from "../catalog/types.js";
import { readYaml } from "../exec/shared.js";
import { collectCatalogFilesByDomain, loadTimelineIndex } from "../dashboard/timeline-build.js";

export type StrategyCatalogRef = {
  id: string;
  /** Repository-root absolute path as required by sch-strategy.schema.yaml (leading slash). */
  path: string;
  /** Optional per-catalog deliverable selection. Omission keeps the legacy all-items behavior. */
  local_ids?: string[];
  domain: string;
  title?: string;
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toRepoAbsolute(absolutePath: string, repoRoot: string): string {
  return `/${relative(repoRoot, absolutePath).replace(/\\/g, "/")}`;
}

// ---- scope resolution ---------------------------------------------------------

// Artifact label shown in the timeline for gates and milestones. Catalog titles follow
// `成果物カタログ（<name>）`; anything else is left unset rather than guessed.
export function artifactNameFromCatalogTitle(title: string | undefined): string | undefined {
  const match = title?.match(/^成果物カタログ（(.+)）$/);
  return match ? match[1] : undefined;
}

export type ScopeResolution = {
  catalogs: StrategyCatalogRef[];
  source: "strategy" | "timeline";
  warnings: string[];
  errors: string[];
};

// Resolves the catalogs a track covers. An existing strategy is authoritative (a human may have
// narrowed the scope on purpose); otherwise the Timeline track plan decides which domains belong
// to the track, and every catalog file of those domains (including physical splits) is included.
export function resolveTrackScopeCatalogs(opts: {
  repoRoot: string;
  catalogPath: string;
  timelinePath: string;
  track: string;
  existingStrategy?: Record<string, unknown> | null;
}): ScopeResolution {
  const { repoRoot, catalogPath, timelinePath, track } = opts;
  const warnings: string[] = [];
  const errors: string[] = [];

  const byDomain = collectCatalogFilesByDomain(catalogPath);
  const refFor = (filePath: string, localIds?: string[]): StrategyCatalogRef | null => {
    const doc = readYaml(filePath) as DctDoc | null;
    if (!doc?.id || !doc.domain) {
      errors.push(`${filePath}: id / domain が読み取れないため scope に含められない。`);
      return null;
    }
    return {
      id: doc.id,
      path: toRepoAbsolute(filePath, repoRoot),
      ...(localIds ? { local_ids: localIds } : {}),
      domain: doc.domain,
      ...(doc.title ? { title: doc.title } : {}),
    };
  };

  const timelineCatalogs: StrategyCatalogRef[] = [];
  const indexFile = join(timelinePath, "tml-index.yaml");
  if (existsSync(indexFile)) {
    const { index, errors: loadErrors } = loadTimelineIndex(indexFile);
    if (loadErrors.length > 0) {
      warnings.push(`${basename(indexFile)}: ${loadErrors.join(" / ")}`);
    }
    const plan = index.tracks.find((entry) => entry.track === track);
    if (plan) {
      for (const domain of plan.domains) {
        const files = byDomain.get(domain) ?? [];
        if (files.length === 0) {
          warnings.push(
            `timeline: track '${track}' の domain '${domain}' に対応する dct-*.yaml が無い（scope から除外）。`,
          );
          continue;
        }
        for (const filePath of files) {
          const ref = refFor(filePath);
          if (ref) timelineCatalogs.push(ref);
        }
      }
      if (plan.catalog_status !== "primary") {
        warnings.push(
          `timeline: track '${track}' の catalog_status は '${plan.catalog_status}'。` +
            `strategy 生成では昇格させないため、確認後に人間が primary へ更新する。`,
        );
      }
    } else {
      warnings.push(`timeline: track '${track}' が tml-index.yaml に無い。`);
    }
  }

  const existingScope = isRecord(opts.existingStrategy?.scope)
    ? opts.existingStrategy.scope
    : undefined;
  const existingCatalogs = Array.isArray(existingScope?.catalogs) ? existingScope.catalogs : [];
  if (existingCatalogs.length > 0) {
    const catalogs: StrategyCatalogRef[] = [];
    for (const entry of existingCatalogs) {
      if (!isRecord(entry) || typeof entry.path !== "string") continue;
      let localIds: string[] | undefined;
      if (entry.local_ids !== undefined) {
        if (
          !Array.isArray(entry.local_ids) ||
          entry.local_ids.length === 0 ||
          entry.local_ids.some((localId) => typeof localId !== "string" || localId.length === 0)
        ) {
          errors.push(`scope.catalogs: ${entry.path} の local_ids は空でない文字列配列にする。`);
        } else {
          localIds = entry.local_ids as string[];
        }
      }
      const filePath = resolve(repoRoot, entry.path.replace(/^\//, ""));
      if (!existsSync(filePath)) {
        errors.push(`scope.catalogs: カタログが見つからない: ${entry.path}`);
        continue;
      }
      const ref = refFor(filePath, localIds);
      if (ref) catalogs.push(ref);
    }
    const known = new Set(catalogs.map((catalog) => catalog.id));
    for (const catalog of timelineCatalogs) {
      if (known.has(catalog.id)) continue;
      warnings.push(
        `timeline の domain から解決した ${catalog.id} が既存 scope に無い。scope を広げる場合は ` +
          `sch-strategy-${track}.yaml の scope.catalogs を先に更新する。`,
      );
    }
    return { catalogs, source: "strategy", warnings, errors };
  }

  if (timelineCatalogs.length === 0) {
    errors.push(
      `track '${track}' の scope を解決できない。tml-index.yaml の domains と ` +
        `dct-<domain>.yaml を用意するか、既存 strategy の scope.catalogs を先に定義する。`,
    );
  }
  return { catalogs: timelineCatalogs, source: "timeline", warnings, errors };
}

export type CatalogDeliverable = {
  local_id: string;
  catalog_id: string;
  depends_on: string[];
};

// Deliverables of the scoped catalogs, in catalog order. `include_kinds` mirrors the strategy
// scope (work by default).
export function collectScopeDeliverables(opts: {
  repoRoot: string;
  catalogs: StrategyCatalogRef[];
  includeKinds: string[];
}): { deliverables: CatalogDeliverable[]; errors: string[] } {
  const errors: string[] = [];
  const deliverables: CatalogDeliverable[] = [];
  for (const catalog of opts.catalogs) {
    const filePath = resolve(opts.repoRoot, catalog.path.replace(/^\//, ""));
    const doc = readYaml(filePath) as DctDoc | null;
    if (!doc?.groups) {
      errors.push(`${catalog.path}: groups が無い。`);
      continue;
    }
    const collected: Array<{ item: { local_id: string; kind: string; depends_on?: string[] } }> =
      [];
    collectResolvedDeliverables(doc.groups, resolveBasePath("", doc.base_path), collected as never);
    const catalogLocalIds = new Set(collected.map(({ item }) => item.local_id));
    for (const localId of catalog.local_ids ?? []) {
      if (!catalogLocalIds.has(localId)) {
        errors.push(`${catalog.id}: scope.local_ids の '${localId}' がカタログに存在しない。`);
      }
    }
    const selectedLocalIds = catalog.local_ids ? new Set(catalog.local_ids) : null;
    for (const { item } of collected) {
      if (!opts.includeKinds.includes(item.kind)) continue;
      if (selectedLocalIds && !selectedLocalIds.has(item.local_id)) continue;
      deliverables.push({
        local_id: item.local_id,
        catalog_id: catalog.id,
        depends_on: item.depends_on ?? [],
      });
    }
  }
  return { deliverables, errors };
}

// ---- owner resolution ---------------------------------------------------------

export type OwnerResolution = {
  owners: Map<string, string>;
  errors: string[];
  warnings: string[];
};

// Owner derivation rule, in priority order:
//   1. explicit --owner <local_id>=<ROLE>
//   2. the owner already recorded in the existing strategy's owner_rules
//   3. --default-owner <ROLE>
// `done_criteria.roles` is deliberately not consulted: those are review viewpoints, not the
// role that performs the work. When no rule applies, generation stops instead of guessing.
export function resolveDeliverableOwners(opts: {
  localIds: string[];
  overrides: Map<string, string>;
  previous: Map<string, string>;
  defaultOwner?: string;
  knownRoles?: Set<string>;
}): OwnerResolution {
  const owners = new Map<string, string>();
  const errors: string[] = [];
  const warnings: string[] = [];
  const unresolved: string[] = [];

  for (const localId of opts.localIds) {
    const owner = opts.overrides.get(localId) ?? opts.previous.get(localId) ?? opts.defaultOwner;
    if (!owner) {
      unresolved.push(localId);
      continue;
    }
    if (opts.knownRoles && opts.knownRoles.size > 0 && !opts.knownRoles.has(owner)) {
      errors.push(`owner '${owner}' は pm-roles.yaml に存在しない (${localId})。`);
      continue;
    }
    owners.set(localId, owner);
  }

  for (const localId of opts.overrides.keys()) {
    if (opts.localIds.includes(localId)) continue;
    warnings.push(`--owner ${localId} は scope に含まれない成果物を指している（無視する）。`);
  }

  if (unresolved.length > 0) {
    errors.push(
      `主担当ロールを決定できない成果物がある: ${unresolved.join(", ")}。` +
        `--owner <local_id>=<ROLE> または --default-owner <ROLE> で明示する` +
        `（done_criteria.roles はレビュー観点であり主担当ではない）。`,
    );
  }

  return { owners, errors, warnings };
}

export function loadKnownRoles(repoRoot: string, rolesPath: string | undefined): Set<string> {
  if (!rolesPath) return new Set();
  const filePath = resolve(repoRoot, rolesPath);
  if (!existsSync(filePath)) return new Set();
  const doc = readYaml(filePath);
  if (!isRecord(doc) || !Array.isArray(doc.roles)) return new Set();
  const codes = doc.roles
    .map((role) => (isRecord(role) && typeof role.code === "string" ? role.code : ""))
    .filter(Boolean);
  return new Set(codes);
}
