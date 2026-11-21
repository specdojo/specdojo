import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { epicPredecessors, orderEpics } from "./epic.js";
import { loadRegisterItemDocs } from "./item.js";
import { readYaml } from "../shared/fs.js";
import { loadTimelineIndex, type TimelineIndex } from "../shared/timeline-index.js";
import { resolveTrackDomains } from "./track-domains.js";

/** Epic order and domains supersede legacy plans; legacy-only tracks remain readable. */
export function loadTrackPlan(opts: {
  timelinePath: string;
  registerPath?: string;
  schedulePath?: string;
  projectId?: string;
  repoRoot?: string;
}): { index: TimelineIndex; errors: string[] } {
  const file = join(opts.timelinePath, "tml-index.yaml");
  const loaded = existsSync(file)
    ? loadTimelineIndex(file)
    : {
        index: {
          id: "",
          project_id: opts.projectId ?? "",
          status: "draft",
          tracks: [],
        } as TimelineIndex,
        errors: [],
      };
  const items = opts.registerPath
    ? loadRegisterItemDocs(opts.registerPath).map((doc) => doc.item)
    : [];
  const epics = orderEpics(items, loaded.index.project_id);
  if (epics.length === 0 && !existsSync(file) && !opts.registerPath && !opts.schedulePath) {
    throw new Error(`Timeline index not found: ${file}`);
  }
  const byId = new Map(epics.map((item) => [item.id, item]));
  const depth = new Map<string, number>();
  for (const item of epics) {
    const predecessors = epicPredecessors(item, loaded.index.project_id, byId);
    const order = 1 + Math.max(0, ...predecessors.map((p) => depth.get(p.id) ?? 0));
    depth.set(item.id, order);
    const previous = loaded.index.tracks.find((track) => track.track === item.track);
    const plan = {
      ...previous,
      track: item.track!,
      domains: item.domains ?? previous?.domains ?? [],
      catalog_status: previous?.catalog_status ?? ("not_started" as const),
      order,
      depends_on: predecessors.map((p) => p.track!),
    };
    loaded.index.tracks = loaded.index.tracks.filter((track) => track.track !== item.track);
    loaded.index.tracks.push(plan);
  }
  if (opts.schedulePath && existsSync(opts.schedulePath)) {
    for (const name of readdirSync(opts.schedulePath).filter((name) =>
      /^sch-strategy-.+\.yaml$/.test(name),
    )) {
      const doc = readYaml(join(opts.schedulePath, name)) as { track?: string } | null;
      if (doc?.track && !loaded.index.tracks.some((entry) => entry.track === doc.track)) {
        loaded.index.tracks.push({
          track: doc.track,
          domains: [],
          catalog_status: "not_started",
          order: 1,
          depends_on: [],
        });
      }
    }
  }
  for (const track of loaded.index.tracks) {
    const strategyPath = opts.schedulePath
      ? join(opts.schedulePath, `sch-strategy-${track.track}.yaml`)
      : undefined;
    const existingStrategy =
      strategyPath && existsSync(strategyPath)
        ? (readYaml(strategyPath) as Record<string, unknown>)
        : undefined;
    const resolved = resolveTrackDomains({
      ...opts,
      registerItems: items,
      track: track.track,
      existingStrategy,
    });
    track.domains = resolved.domains;
    loaded.errors.push(...resolved.errors);
  }
  return loaded;
}
