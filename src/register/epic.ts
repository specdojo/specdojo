import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getProjectRegisterPath, loadConfig, specdojoRootDir } from "../shared/specdojo-config.js";
import type { RegisterPaths } from "./command-types.js";
import { loadRegisterItemDocs, readSpecdojoFields, type PjrItem } from "./item.js";

export function validateRegisterDomains(itemType: string, domains: unknown): void {
  if (domains === undefined) return;
  if (itemType !== "epic") throw new Error("--domain / domains is only valid for epic items");
  if (
    !Array.isArray(domains) ||
    domains.some((v) => typeof v !== "string" || !v.trim() || v === "-")
  ) {
    throw new Error("domains must be an array of non-empty strings");
  }
  if (new Set(domains).size !== domains.length) throw new Error("Duplicate epic domains");
}

function validateTrack(itemType: string, track: string | undefined): void {
  if (itemType !== "epic") {
    if (track !== undefined) throw new Error("--track is only valid for epic items");
  } else if (!track || !/^[a-z0-9][a-z0-9-]*$/.test(track)) {
    throw new Error("An epic requires --track with a lowercase track identifier");
  }
}

export function validateRegisterTrack(
  projectId: string,
  itemType: string,
  track: string | undefined,
  excludingId?: string,
): void {
  validateTrack(itemType, track);
  if (itemType !== "epic") return;
  const { config } = loadConfig();
  const project = config?.projects[projectId];
  if (!project) throw new Error(`Cannot validate epic track: unknown project ${projectId}`);
  const path = getProjectRegisterPath(project);
  if (!path) return;
  const duplicate = loadRegisterItemDocs(resolve(specdojoRootDir(), path)).find(
    (doc) => doc.id !== excludingId && doc.item.type === "epic" && doc.item.track === track,
  );
  if (duplicate) throw new Error(`Duplicate epic track "${track}": ${duplicate.id}`);
}

// Only local epic edges determine the overall plan. Qualified references to this project
// are equivalent to local IDs; dependencies on other items remain execution constraints.
export function epicPredecessors(
  item: PjrItem,
  projectId: string,
  epics: Map<string, PjrItem>,
): PjrItem[] {
  return (item.dependsOn ?? []).flatMap((ref) => {
    const id = ref.startsWith(`${projectId}:`) ? ref.slice(projectId.length + 1) : ref;
    const predecessor = epics.get(id);
    return predecessor ? [predecessor] : [];
  });
}

export function orderEpics(items: PjrItem[], projectId: string): PjrItem[] {
  const epics = new Map(
    items.filter((item) => item.type === "epic").map((item) => [item.id, item]),
  );
  const ordered: PjrItem[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const tracks = new Set<string>();
  for (const item of epics.values()) {
    validateTrack(item.type, item.track);
    validateRegisterDomains(item.type, item.domains);
    if (tracks.has(item.track!)) throw new Error(`Duplicate epic track "${item.track}"`);
    tracks.add(item.track!);
  }
  const visit = (item: PjrItem): void => {
    if (visiting.has(item.id))
      throw new Error(`Epic depends_on cycle: ${[...visiting, item.id].join(" -> ")}`);
    if (visited.has(item.id)) return;
    visiting.add(item.id);
    for (const predecessor of epicPredecessors(item, projectId, epics)) visit(predecessor);
    visiting.delete(item.id);
    visited.add(item.id);
    ordered.push(item);
  };
  for (const item of [...epics.values()].sort((a, b) => a.id.localeCompare(b.id))) visit(item);
  return ordered;
}

export function validateRegisterEpicDocs(paths: RegisterPaths): string[] {
  const docs = loadRegisterItemDocs(paths.projectRegisterPath);
  try {
    for (const doc of docs) {
      validateTrack(doc.item.type, doc.item.track);
      validateRegisterDomains(
        doc.item.type,
        readSpecdojoFields(readFileSync(doc.path, "utf8")).domains,
      );
    }
    orderEpics(
      docs.map((doc) => doc.item),
      paths.projectId,
    );
    return [];
  } catch (error) {
    return [
      `${paths.projectRegisterPath}: ${error instanceof Error ? error.message : String(error)}`,
    ];
  }
}
