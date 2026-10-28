import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { getProjectTimelinePath, loadConfig, specdojoRootDir } from "../shared/specdojo-config.js";
import { loadTimelineIndex } from "../shared/timeline-index.js";
import type { RegisterPaths } from "./command-types.js";
import { loadRegisterItemDocs } from "./item.js";

// track は epic の担当単位。timeline がない project でも同じ形式の識別子を保持する。
export function validateRegisterTrack(
  projectId: string,
  itemType: string,
  track: string | undefined,
): void {
  if (itemType !== "epic") {
    if (track !== undefined) throw new Error("--track is only valid for epic items");
    return;
  }
  if (!track || !/^[a-z0-9][a-z0-9-]*$/.test(track)) {
    throw new Error("An epic requires --track with a lowercase track identifier");
  }
  const { config } = loadConfig();
  const project = config?.projects[projectId];
  if (!project) throw new Error(`Cannot validate epic track: unknown project ${projectId}`);
  const indexPath = resolve(specdojoRootDir(), getProjectTimelinePath(project), "tml-index.yaml");
  if (!existsSync(indexPath)) return;
  const { index, errors } = loadTimelineIndex(indexPath);
  if (errors.length > 0) throw new Error(`${indexPath}: ${errors.join("; ")}`);
  if (!index.tracks.some((entry) => entry.track === track)) {
    throw new Error(`Undefined epic track "${track}" in ${indexPath}`);
  }
}

export function validateRegisterEpicDocs(paths: RegisterPaths): string[] {
  return loadRegisterItemDocs(paths.projectRegisterPath).flatMap((doc) => {
    try {
      validateRegisterTrack(paths.projectId, doc.item.type, doc.item.track);
      return [];
    } catch (error) {
      return [
        `${join(paths.projectRegisterPath, doc.filename)}: ${error instanceof Error ? error.message : String(error)}`,
      ];
    }
  });
}
