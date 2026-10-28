import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import type { Approach } from "../shared/agent-types.js";
import {
  getProjectCatalogPath,
  getProjectTimelinePath,
  type SpecDojoProjectConfig,
} from "../shared/specdojo-config.js";
import { loadTimelineIndex } from "../shared/timeline-index.js";

export function isPlanningApproach(
  approach: string | undefined,
): approach is Extract<Approach, "catalog-planning" | "strategy-planning"> {
  return approach === "catalog-planning" || approach === "strategy-planning";
}

// These targets identify work units, including units whose documents do not exist yet.
export function planningTarget(approach: string, target: string): string {
  const prefix = approach === "catalog-planning" ? "domain" : "track";
  const match = target.match(new RegExp(`^${prefix}:([a-z0-9][a-z0-9-]{0,62})$`));
  if (!match) throw new Error(`Approach "${approach}" requires --target ${prefix}:<id>`);
  return match[1];
}

export function validatePlanningTarget(opts: {
  repoRoot: string;
  approach: string;
  target: string;
  project: SpecDojoProjectConfig;
}): void {
  const unit = planningTarget(opts.approach, opts.target);
  if (!getProjectCatalogPath(opts.project)) {
    throw new Error(`Approach "${opts.approach}" requires catalog_path`);
  }
  if (opts.approach !== "strategy-planning") return;
  if (!opts.project.schedule_path?.trim()) {
    throw new Error('Approach "strategy-planning" requires schedule_path');
  }
  const file = resolve(opts.repoRoot, getProjectTimelinePath(opts.project), "tml-index.yaml");
  if (!existsSync(file)) {
    // A declared strategy scope also supports projects without a timeline.
    return;
  }
  const { index, errors } = loadTimelineIndex(file);
  if (errors.length > 0) throw new Error(`${file}: ${errors.join("; ")}`);
  if (!index.tracks.some((track) => track.track === unit)) {
    throw new Error(
      `Undefined strategy track "${unit}" in ${join(getProjectTimelinePath(opts.project), "tml-index.yaml")}`,
    );
  }
}
