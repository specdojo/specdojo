import { readYaml } from "./fs.js";
import { normalizeDateOnly } from "./time.js";

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
