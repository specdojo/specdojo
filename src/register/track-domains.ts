import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { loadRegisterItemDocs, type PjrItem } from "./item.js";
import { readYaml } from "../shared/fs.js";
import { loadTimelineIndex } from "../shared/timeline-index.js";

export type TrackDomainSource = "strategy" | "epic" | "timeline";

export function resolveTrackDomains(opts: {
  track: string;
  timelinePath: string;
  registerPath?: string;
  registerItems?: PjrItem[];
  repoRoot?: string;
  existingStrategy?: Record<string, unknown> | null;
}): { domains: string[]; source: TrackDomainSource; errors: string[] } {
  const legacyPath = join(opts.timelinePath, "tml-index.yaml");
  const legacy = existsSync(legacyPath) ? loadTimelineIndex(legacyPath) : undefined;
  const scope = opts.existingStrategy?.scope as
    { catalogs?: { id?: string; path?: string }[] } | undefined;
  if (Array.isArray(scope?.catalogs)) {
    const domains = scope.catalogs.flatMap((entry) => {
      if (!entry || typeof entry !== "object" || typeof entry.path !== "string") return [];
      const path = resolve(opts.repoRoot ?? ".", entry.path.replace(/^\//, ""));
      const doc = existsSync(path) ? (readYaml(path) as { domain?: string } | null) : null;
      const domain =
        doc?.domain ?? entry.id?.split(":dct-")[1] ?? entry.path.match(/dct-(.+)\.ya?ml$/)?.[1];
      return domain ? [domain] : [];
    });
    return { domains: [...new Set(domains)], source: "strategy", errors: [] };
  }
  const items =
    opts.registerItems ??
    (opts.registerPath ? loadRegisterItemDocs(opts.registerPath).map((doc) => doc.item) : []);
  const epics = items.filter((item) => item.type === "epic" && item.track === opts.track);
  if (epics.length > 1)
    return { domains: [], source: "epic", errors: [`Duplicate epic track "${opts.track}"`] };
  if (epics[0]?.domains !== undefined) {
    return { domains: epics[0].domains, source: "epic", errors: [] };
  }
  return {
    domains: legacy?.index.tracks.find((entry) => entry.track === opts.track)?.domains ?? [],
    source: "timeline",
    errors: legacy?.errors ?? [],
  };
}
