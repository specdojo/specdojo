import { createHash } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import {
  type ScheduleDiff,
  type ScheduleHash,
  type ScheduleIndex,
  type ScheduleNode,
} from "./exec-types.js";
import {
  ensureDir,
  readJson,
  toArtifactPath,
  toScheduleFilePath,
  writeJson,
} from "./exec-shared.js";
import { generatedDirForProject } from "./exec-project.js";

function normalizeNodeForHash(n: ScheduleNode): Record<string, unknown> {
  return {
    id: n.id,
    name: n.name ?? "",
    owner: n.owner ?? "",
    kind: n.kind,
    duration_days: n.duration_days,
    depends_on: [...n.depends_on].sort(),
    schedule_file: basename(n.schedule_file),
  };
}

function sha256Json(obj: unknown): string {
  return createHash("sha256").update(JSON.stringify(obj)).digest("hex");
}

function buildScheduleHash(schedule: ScheduleIndex, projectPath: string): ScheduleHash {
  const node_hashes: Record<string, string> = {};
  for (const n of schedule.nodes.values()) node_hashes[n.id] = sha256Json(normalizeNodeForHash(n));

  return {
    schema_version: 1,
    schedule_path: toArtifactPath(projectPath),
    schedule_files: schedule.files.map((p) => toScheduleFilePath(projectPath, p)).sort(),
    node_hashes,
  };
}

function computeScheduleDiff(prev: ScheduleHash | null, cur: ScheduleHash): ScheduleDiff {
  const prevMap = prev?.node_hashes ?? {};
  const curMap = cur.node_hashes;

  const prevIds = new Set(Object.keys(prevMap));
  const curIds = new Set(Object.keys(curMap));

  const added = Array.from(curIds)
    .filter((id) => !prevIds.has(id))
    .sort();
  const removed = Array.from(prevIds)
    .filter((id) => !curIds.has(id))
    .sort();
  const changed = Array.from(curIds)
    .filter((id) => prevIds.has(id) && prevMap[id] !== curMap[id])
    .sort();

  return {
    schedule_path: cur.schedule_path,
    added,
    removed,
    changed,
  };
}

export function writeScheduleHashAndDiff(projectPath: string, schedule: ScheduleIndex): void {
  const genDir = generatedDirForProject(projectPath);
  ensureDir(genDir);

  const cur = buildScheduleHash(schedule, projectPath);
  const hashPath = join(genDir, "schedule-hash.json");

  let prev: ScheduleHash | null = null;
  if (existsSync(hashPath)) {
    try {
      prev = readJson(hashPath) as ScheduleHash;
    } catch {
      prev = null;
    }
  }

  const diff = computeScheduleDiff(prev, cur);
  writeJson(hashPath, cur);

  const lines: string[] = [];
  lines.push(`# Schedule Diff`);
  lines.push("");
  lines.push(`## Added`);
  lines.push("");
  lines.push(diff.added.length ? diff.added.map((x) => `- \`${x}\``).join("\n") : "_none_");
  lines.push("");
  lines.push(`## Removed`);
  lines.push("");
  lines.push(diff.removed.length ? diff.removed.map((x) => `- \`${x}\``).join("\n") : "_none_");
  lines.push("");
  lines.push(`## Changed`);
  lines.push("");
  lines.push(diff.changed.length ? diff.changed.map((x) => `- \`${x}\``).join("\n") : "_none_");
  lines.push("");
  writeFileSync(join(genDir, "schedule-diff.md"), lines.join("\n"), "utf8");
}
