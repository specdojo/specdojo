import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { deriveTimelineCatalogStatus } from "../../../src/register/catalog-status.js";
import { buildTimeline } from "../../../src/dashboard/timeline-build.js";
import { resolveTrackScopeCatalogs } from "../../../src/schedule/strategy-generate-scope.js";
import type { TimelineTrackPlan } from "../../../src/shared/timeline-index.js";
import { dump } from "../../../src/shared/yaml.js";

const track: TimelineTrackPlan = {
  track: "demo",
  domains: ["demo"],
  catalog_status: "not_started",
  order: 1,
  depends_on: [],
};
function todo(status: string, domain = "demo") {
  return {
    type: "todo",
    approach: "catalog-planning" as const,
    targets: [`domain:${domain}`],
    status,
  };
}
describe("register-derived catalog status", () => {
  it.each([
    ["open", "not_started"],
    ["in-progress", "draft"],
    ["waiting", "draft"],
    ["review", "draft"],
    ["done", "primary"],
  ])("todo %s から %s を導く", (status, expected) => {
    const result = deriveTimelineCatalogStatus([track], [todo(status)]);
    expect(result.tracks[0].catalog_status).toBe(expected);
    expect(track.catalog_status).toBe("not_started");
  });
  it("done が一件あれば domain を primary とし、reopen で再計算する", () => {
    expect(
      deriveTimelineCatalogStatus([track], [todo("done"), todo("open")]).tracks[0].catalog_status,
    ).toBe("primary");
    const declaredPrimary = { ...track, catalog_status: "primary" as const };
    const result = deriveTimelineCatalogStatus([declaredPrimary], [todo("open")]);
    expect(result.tracks[0].catalog_status).toBe("not_started");
    expect(result.warnings.join("\n")).toContain("tml-index.yaml declares primary");
  });
  it("対象 todo がなければ手書き値を保持し、他 type・approach・終端例外は除外する", () => {
    const declaredPrimary = { ...track, catalog_status: "primary" as const };
    const result = deriveTimelineCatalogStatus(
      [declaredPrimary],
      [
        todo("done", "other"),
        todo("rejected"),
        todo("deferred"),
        { ...todo("open"), type: "issue" },
        { ...todo("open"), approach: "strategy-planning" },
      ],
    );
    expect(result.tracks).toEqual([declaredPrimary]);
    expect(result.warnings).toEqual([]);
  });
  it("複数 domain は全件 primary のときだけ着手可能で、共有 domain も同じ状態となる", () => {
    const tracks = [
      { ...track, domains: ["demo", "second"] },
      { ...track, track: "shared" },
    ];
    expect(
      deriveTimelineCatalogStatus(tracks, [todo("done")]).tracks.map((row) => row.catalog_status),
    ).toEqual(["draft", "primary"]);
    expect(
      deriveTimelineCatalogStatus(tracks, [todo("done"), todo("done", "second")]).tracks.map(
        (row) => row.catalog_status,
      ),
    ).toEqual(["primary", "primary"]);
  });
  it("build と strategy scope が個票を読み、手書き timeline を変更しない", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-timeline-register-"));
    try {
      for (const dir of ["timeline", "catalog", "register"]) mkdirSync(join(root, dir));
      const indexPath = join(root, "timeline/tml-index.yaml");
      const original = dump({ project_id: "prj-0001", tracks: [track] });
      writeFileSync(indexPath, original);
      writeFileSync(
        join(root, "catalog/dct-demo.yaml"),
        dump({ id: "prj-0001:dct-demo", domain: "demo", groups: [] }),
      );
      writeFileSync(
        join(root, "register/pjr-ab12-demo.md"),
        "---\nspecdojo:\n  id: prj-0001:pjr-ab12-demo\n  item_type: todo\n  item_status: done\n  approach: catalog-planning\n  targets: [domain:demo]\n---\n\n# PJR-AB12 Catalog\n",
      );
      const opts = {
        timelinePath: join(root, "timeline"),
        catalogPath: join(root, "catalog"),
        registerPath: join(root, "register"),
      };
      const result = buildTimeline(opts);
      expect(result.errors).toEqual([]);
      expect(result.scheduleReadyTracks).toEqual(["demo"]);
      expect(result.warnings.join("\n")).toContain("register-derived catalog_status is primary");
      const scope = resolveTrackScopeCatalogs({ ...opts, repoRoot: root, track: "demo" });
      expect(scope.errors).toEqual([]);
      expect(scope.warnings.join("\n")).not.toContain("カタログ作成 todo の完了を確認");
      expect(readFileSync(indexPath, "utf8")).toBe(original);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
