import type { PjrItem } from "./item.js";
import { loadRegisterItemDocs } from "./item.js";
import { planningTarget } from "./planning.js";
import type { CatalogStatus, TimelineTrackPlan } from "../shared/timeline-index.js";

// No state is persisted: reopened tickets are reflected on the next build as well.
export function deriveTimelineCatalogStatus(
  tracks: TimelineTrackPlan[],
  items: readonly Pick<PjrItem, "type" | "status" | "approach" | "targets">[],
): { tracks: TimelineTrackPlan[]; warnings: string[] } {
  const byDomain = new Map<string, CatalogStatus[]>();
  for (const item of items) {
    if (item.type !== "todo" || item.approach !== "catalog-planning") continue;
    if (item.status === "rejected" || item.status === "deferred") continue;
    if (item.targets?.length !== 1) continue;
    const domain = planningTarget(item.approach, item.targets[0]);
    const status: CatalogStatus =
      item.status === "done" ? "primary" : item.status === "open" ? "not_started" : "draft";
    const values = byDomain.get(domain) ?? [];
    values.push(status);
    byDomain.set(domain, values);
  }
  const warnings: string[] = [];
  return {
    tracks: tracks.map((track) => {
      if (!track.domains.some((domain) => byDomain.has(domain))) return { ...track };
      const statuses = track.domains.map((domain) => {
        const values = byDomain.get(domain);
        if (!values) return track.catalog_status;
        return values.includes("primary")
          ? "primary"
          : values.includes("draft")
            ? "draft"
            : "not_started";
      });
      const status: CatalogStatus = statuses.every((value) => value === "primary")
        ? "primary"
        : statuses.some((value) => value !== "not_started")
          ? "draft"
          : "not_started";
      if (status !== track.catalog_status) {
        warnings.push(
          `${track.track}: register-derived catalog_status is ${status}, but tml-index.yaml declares ${track.catalog_status}; using register-derived status (tml-index.yaml is unchanged)`,
        );
      }
      return { ...track, catalog_status: status };
    }),
    warnings,
  };
}

export function resolveTimelineCatalogStatus(tracks: TimelineTrackPlan[], registerPath?: string) {
  return deriveTimelineCatalogStatus(
    tracks,
    registerPath ? loadRegisterItemDocs(registerPath).map((doc) => doc.item) : [],
  );
}
