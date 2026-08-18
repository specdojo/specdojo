import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { normalizeDateOnly, readYaml } from "./exec-shared.js";

export type CatalogStatus = "not_started" | "draft" | "primary";

export type TimelineTrackPlan = {
  track: string;
  domains: string[];
  catalog_status: CatalogStatus;
  catalog_duration_estimate_days?: number;
  order: number;
  parallel_group?: string;
  depends_on: string[];
  note?: string;
};

export type TimelineIndex = {
  id: string;
  project_id: string;
  status: string;
  tracks: TimelineTrackPlan[];
  // トラックの予定開始日・終了日を算出する計画開始日（機械可読正本）。ダッシュボードの
  // タイムライン用 Gantt chart の横軸（日付）の起点になる。
  planned_start_date?: string;
};

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

const CATALOG_STATUSES: readonly CatalogStatus[] = ["not_started", "draft", "primary"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readStringArray(value: unknown, field: string, errors: string[]): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    errors.push(`${field}: must be an array of strings`);
    return [];
  }
  const result: string[] = [];
  for (const item of value) {
    if (typeof item !== "string" || item.trim().length === 0) {
      errors.push(`${field}: must contain non-empty strings only`);
      continue;
    }
    result.push(item);
  }
  return result;
}

function parseTrack(raw: unknown, index: number, errors: string[]): TimelineTrackPlan | null {
  const where = `tracks[${index}]`;
  if (!isRecord(raw)) {
    errors.push(`${where}: must be an object`);
    return null;
  }

  const track = raw.track;
  if (typeof track !== "string" || track.trim().length === 0) {
    errors.push(`${where}.track: required non-empty string`);
    return null;
  }

  const domains = readStringArray(raw.domains, `${where}.domains`, errors);
  if (domains.length === 0) errors.push(`${where}.domains: required non-empty array`);

  const catalogStatus = raw.catalog_status;
  if (
    typeof catalogStatus !== "string" ||
    !CATALOG_STATUSES.includes(catalogStatus as CatalogStatus)
  ) {
    errors.push(`${where}.catalog_status: must be one of ${CATALOG_STATUSES.join(" | ")}`);
    return null;
  }

  const order = raw.order;
  if (typeof order !== "number" || !Number.isInteger(order) || order < 1) {
    errors.push(`${where}.order: must be an integer >= 1`);
    return null;
  }

  if (raw.depends_on === undefined) {
    errors.push(`${where}.depends_on: required (use [] when there is no prerequisite)`);
  }
  const dependsOn = readStringArray(raw.depends_on, `${where}.depends_on`, errors);

  const estimate = raw.catalog_duration_estimate_days;
  if (estimate !== undefined && (typeof estimate !== "number" || estimate <= 0)) {
    errors.push(`${where}.catalog_duration_estimate_days: must be a number > 0`);
  }

  const parallelGroup = raw.parallel_group;
  if (parallelGroup !== undefined && typeof parallelGroup !== "string") {
    errors.push(`${where}.parallel_group: must be a string`);
  }

  const note = raw.note;
  if (note !== undefined && typeof note !== "string") {
    errors.push(`${where}.note: must be a string`);
  }

  return {
    track,
    domains,
    catalog_status: catalogStatus as CatalogStatus,
    ...(typeof estimate === "number" ? { catalog_duration_estimate_days: estimate } : {}),
    order,
    ...(typeof parallelGroup === "string" ? { parallel_group: parallelGroup } : {}),
    depends_on: dependsOn,
    ...(typeof note === "string" ? { note } : {}),
  };
}

export function loadTimelineIndex(filePath: string): { index: TimelineIndex; errors: string[] } {
  const errors: string[] = [];
  const parsed = readYaml(filePath);
  if (!isRecord(parsed)) {
    throw new Error(`${filePath}: invalid or empty YAML`);
  }

  const projectId = parsed.project_id;
  if (typeof projectId !== "string" || projectId.trim().length === 0) {
    errors.push(`project_id: required non-empty string`);
  }

  if (!Array.isArray(parsed.tracks) || parsed.tracks.length === 0) {
    errors.push(`tracks: required non-empty array`);
    return {
      index: {
        id: typeof parsed.id === "string" ? parsed.id : "",
        project_id: typeof projectId === "string" ? projectId : "",
        status: typeof parsed.status === "string" ? parsed.status : "",
        tracks: [],
      },
      errors,
    };
  }

  const tracks: TimelineTrackPlan[] = [];
  parsed.tracks.forEach((raw, index) => {
    const track = parseTrack(raw, index, errors);
    if (track) tracks.push(track);
  });

  // 計画開始日は YYYY-MM-DD に正規化する。不正な値はエラーとして報告し、未設定とみなす。
  let plannedStartDate: string | undefined;
  if (parsed.planned_start_date !== undefined && parsed.planned_start_date !== null) {
    const normalized = normalizeDateOnly(parsed.planned_start_date);
    if (!normalized) {
      errors.push("planned_start_date: must be a YYYY-MM-DD date");
    } else {
      plannedStartDate = normalized;
    }
  }

  return {
    index: {
      id: typeof parsed.id === "string" ? parsed.id : "",
      project_id: typeof projectId === "string" ? projectId : "",
      status: typeof parsed.status === "string" ? parsed.status : "",
      tracks,
      ...(plannedStartDate !== undefined ? { planned_start_date: plannedStartDate } : {}),
    },
    errors,
  };
}

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

// 1 ドメインが dct-<domain>-<sub>.yaml のように複数ファイルへ分割されることがあるため、
// ファイル名ではなく各カタログの domain 値で突き合わせる。
export function collectCatalogFilesByDomain(catalogPath: string): Map<string, string[]> {
  const byDomain = new Map<string, string[]>();
  if (!existsSync(catalogPath)) return byDomain;

  const files = readdirSync(catalogPath)
    .filter((file) => /^dct-.+\.ya?ml$/.test(file))
    .sort();

  for (const file of files) {
    const fullPath = join(catalogPath, file);
    const parsed = readYaml(fullPath);
    if (!isRecord(parsed)) continue;
    const domain = parsed.domain;
    if (typeof domain !== "string" || domain.trim().length === 0) continue;

    const group = byDomain.get(domain);
    if (group) group.push(fullPath);
    else byDomain.set(domain, [fullPath]);
  }

  return byDomain;
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
}): TimelineBuildResult {
  const indexFile = join(opts.timelinePath, "tml-index.yaml");
  if (!existsSync(indexFile)) {
    throw new Error(`Timeline index not found: ${indexFile}`);
  }

  const { index, errors: loadErrors } = loadTimelineIndex(indexFile);
  const errors = [...loadErrors];
  const warnings: string[] = [];

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
      `直接編集せず、\`tml-index.yaml\` を更新してください。`,
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
