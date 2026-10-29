import { existsSync } from "node:fs";
import { join } from "node:path";
import { collectCatalogFilesByDomain } from "../shared/catalog-files.js";
import { resolveTimelineCatalogStatus } from "../register/catalog-status.js";
import {
  loadTimelineIndex,
  type CatalogStatus,
  type TimelineIndex,
  type TimelineTrackPlan,
} from "../shared/timeline-index.js";

export { collectCatalogFilesByDomain, loadTimelineIndex };
export type { CatalogStatus, TimelineIndex, TimelineTrackPlan };

// 1 つの着手単位。同じ wave のトラックは並行して着手できる。
export type TimelineWave = {
  wave: number;
  tracks: TimelineTrackPlan[];
};

export type CatalogScaffoldPlan = {
  track: string;
  domain: string;
  catalogFile: string;
};

export type TimelineBuildResult = {
  projectId: string;
  waves: TimelineWave[];
  scaffolds: CatalogScaffoldPlan[];
  scheduleReadyTracks: string[];
  errors: string[];
  warnings: string[];
};

// depends_on の未定義参照・循環・order との矛盾を検出する。
export function validateTimelineTracks(tracks: TimelineTrackPlan[]): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const byTrack = new Map<string, TimelineTrackPlan>();

  for (const track of tracks) {
    if (byTrack.has(track.track)) {
      errors.push(`Duplicate track id: ${track.track}`);
      continue;
    }
    byTrack.set(track.track, track);
  }

  for (const track of tracks) {
    for (const dependency of track.depends_on) {
      const target = byTrack.get(dependency);
      if (!target) {
        errors.push(`${track.track}: depends_on refers to undefined track '${dependency}'`);
        continue;
      }
      if (target.order >= track.order) {
        errors.push(
          `${track.track}: depends_on '${dependency}' must have a smaller order ` +
            `(${dependency}=${target.order}, ${track.track}=${track.order})`,
        );
      }
      if (target.catalog_status !== "primary" && track.catalog_status === "primary") {
        warnings.push(
          `${track.track}: catalog is primary while prerequisite '${dependency}' is ` +
            `still ${target.catalog_status}`,
        );
      }
    }
  }

  // 循環検出。order の矛盾検査だけでは自己ループを取りこぼすため独立して行う。
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string, path: string[]): void => {
    if (visited.has(id)) return;
    if (visiting.has(id)) {
      errors.push(`Cyclic depends_on detected: ${[...path, id].join(" -> ")}`);
      return;
    }
    visiting.add(id);
    for (const dependency of byTrack.get(id)?.depends_on ?? []) {
      if (byTrack.has(dependency)) visit(dependency, [...path, id]);
    }
    visiting.delete(id);
    visited.add(id);
  };
  for (const track of tracks) visit(track.track, []);

  return { errors, warnings };
}

// order を主キー、track 名を副キーにして着手 wave へ畳み込む。
export function buildTimelineWaves(tracks: TimelineTrackPlan[]): TimelineWave[] {
  const byOrder = new Map<number, TimelineTrackPlan[]>();
  for (const track of tracks) {
    const group = byOrder.get(track.order);
    if (group) group.push(track);
    else byOrder.set(track.order, [track]);
  }

  return [...byOrder.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, group], index) => ({
      wave: index + 1,
      tracks: [...group].sort((a, b) => a.track.localeCompare(b.track)),
    }));
}

// catalog_status と実カタログの有無から catalog scaffold の対象を決める。
export function buildCatalogScaffoldPlans(
  tracks: TimelineTrackPlan[],
  catalogPath: string,
): { scaffolds: CatalogScaffoldPlan[]; warnings: string[] } {
  const scaffolds: CatalogScaffoldPlan[] = [];
  const warnings: string[] = [];
  const byDomain = collectCatalogFilesByDomain(catalogPath);

  for (const track of tracks) {
    for (const domain of track.domains) {
      const existingFiles = byDomain.get(domain) ?? [];
      const exists = existingFiles.length > 0;

      if (track.catalog_status === "not_started" && exists) {
        warnings.push(
          `${track.track}: catalog_status is not_started but a catalog for domain ` +
            `'${domain}' already exists (${existingFiles.length} file(s))`,
        );
      }
      if (track.catalog_status !== "not_started" && !exists) {
        warnings.push(
          `${track.track}: catalog_status is ${track.catalog_status} but no catalog ` +
            `for domain '${domain}' was found`,
        );
      }
      if (exists) continue;

      scaffolds.push({
        track: track.track,
        domain,
        catalogFile: join(catalogPath, `dct-${domain}.yaml`),
      });
    }
  }

  return { scaffolds, warnings };
}

export function buildTimeline(opts: {
  timelinePath: string;
  catalogPath: string | null;
  registerPath?: string;
}): TimelineBuildResult {
  const indexFile = join(opts.timelinePath, "tml-index.yaml");
  if (!existsSync(indexFile)) {
    throw new Error(`Timeline index not found: ${indexFile}`);
  }

  const { index, errors: loadErrors } = loadTimelineIndex(indexFile);
  const errors = [...loadErrors];
  const warnings: string[] = [];

  const derived = resolveTimelineCatalogStatus(index.tracks, opts.registerPath);
  index.tracks = derived.tracks;
  warnings.push(...derived.warnings);

  const structure = validateTimelineTracks(index.tracks);
  errors.push(...structure.errors);
  warnings.push(...structure.warnings);

  let scaffolds: CatalogScaffoldPlan[] = [];
  if (opts.catalogPath) {
    const plans = buildCatalogScaffoldPlans(index.tracks, opts.catalogPath);
    scaffolds = plans.scaffolds;
    warnings.push(...plans.warnings);
  } else {
    warnings.push(`catalog_path is not configured; skipped catalog scaffold planning`);
  }

  const scheduleReadyTracks = index.tracks
    .filter((track) => track.catalog_status === "primary")
    .map((track) => track.track)
    .sort((a, b) => a.localeCompare(b));

  return {
    projectId: index.project_id,
    waves: buildTimelineWaves(index.tracks),
    scaffolds,
    scheduleReadyTracks,
    errors,
    warnings,
  };
}

function formatEstimate(track: TimelineTrackPlan): string {
  return track.catalog_duration_estimate_days === undefined
    ? "-"
    : String(track.catalog_duration_estimate_days);
}

export function renderTimelineOrderMarkdown(result: TimelineBuildResult): string {
  const lines: string[] = [];
  lines.push(`# トラック着手順序`);
  lines.push("");
  lines.push(`- project_id: \`${result.projectId}\``);
  lines.push(`- wave_count: \`${result.waves.length}\``);
  lines.push(`- schedule_ready_tracks: \`${result.scheduleReadyTracks.length}\``);
  lines.push(`- catalog_scaffold_targets: \`${result.scaffolds.length}\``);
  lines.push("");
  lines.push(
    `この文書は \`tml-index.yaml\` から \`specdojo timeline build\` が生成した派生ビューです。` +
      `直接編集せず、計画は \`tml-index.yaml\`、カタログ作成の完了は register の todo に記録してください。`,
  );

  for (const wave of result.waves) {
    lines.push("");
    lines.push(`## ${wave.wave}. Wave ${wave.wave}`);
    lines.push("");
    lines.push(`| track | domains | catalog_status | 見積り日数 | parallel_group | depends_on |`);
    lines.push(`| --- | --- | --- | --- | --- | --- |`);
    for (const track of wave.tracks) {
      const dependsOn = track.depends_on.length > 0 ? track.depends_on.join(", ") : "-";
      lines.push(
        `| \`${track.track}\` | ${track.domains.join(", ")} | ${track.catalog_status} | ` +
          `${formatEstimate(track)} | ${track.parallel_group ?? "-"} | ${dependsOn} |`,
      );
    }
  }

  lines.push("");
  return lines.join("\n");
}

export function renderCatalogScaffoldMarkdown(result: TimelineBuildResult): string {
  const lines: string[] = [];
  lines.push(`# 成果物カタログ作成の準備`);
  lines.push("");
  lines.push(`- project_id: \`${result.projectId}\``);
  lines.push(`- targets: \`${result.scaffolds.length}\``);
  lines.push("");
  lines.push(
    `\`tml-index.yaml\` の各トラックが対象とするドメインのうち、\`dct-<domain>.yaml\` が未作成のものを列挙します。`,
  );
  lines.push("");

  if (result.scaffolds.length === 0) {
    lines.push(`未作成の成果物カタログはありません。`);
    lines.push("");
    return lines.join("\n");
  }

  lines.push(`| track | domain | 生成先 | 実行コマンド |`);
  lines.push(`| --- | --- | --- | --- |`);
  for (const scaffold of result.scaffolds) {
    lines.push(
      `| \`${scaffold.track}\` | \`${scaffold.domain}\` | \`${scaffold.catalogFile}\` | ` +
        `\`specdojo catalog scaffold --domain ${scaffold.domain}\` |`,
    );
  }
  lines.push("");
  return lines.join("\n");
}
