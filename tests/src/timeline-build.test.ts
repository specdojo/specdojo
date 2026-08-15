import { describe, expect, it } from "vitest";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  buildCatalogScaffoldPlans,
  buildTimeline,
  buildTimelineWaves,
  collectCatalogFilesByDomain,
  loadTimelineIndex,
  renderCatalogScaffoldMarkdown,
  renderTimelineOrderMarkdown,
  validateTimelineTracks,
  type TimelineTrackPlan,
} from "../../src/timeline-build.js";

function track(partial: Partial<TimelineTrackPlan> & Pick<TimelineTrackPlan, "track">) {
  return {
    domains: partial.domains ?? [partial.track],
    catalog_status: partial.catalog_status ?? "draft",
    order: partial.order ?? 1,
    depends_on: partial.depends_on ?? [],
    ...partial,
  } satisfies TimelineTrackPlan;
}

async function withTempDir<T>(run: (dir: string) => Promise<T>): Promise<T> {
  const dir = await mkdtemp(path.join(tmpdir(), "specdojo-timeline-"));
  try {
    return await run(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

const MINIMAL_INDEX = [
  "id: prj-0001:tml-index",
  "type: project",
  "status: draft",
  "title: トラック順序計画",
  "rulebook: specdojo:tml-rulebook",
  "version: 1",
  "project_id: prj-0001",
  "tracks:",
  "  - track: launch",
  "    domains: [project-definition]",
  "    catalog_status: primary",
  "    order: 1",
  "    depends_on: []",
  "  - track: data-flow",
  "    domains: [data-flow]",
  "    catalog_status: not_started",
  "    catalog_duration_estimate_days: 2",
  "    order: 2",
  "    parallel_group: business-specs",
  "    depends_on: [launch]",
  "",
].join("\n");

describe("loadTimelineIndex", () => {
  it("tracks を型付きで読み込み、任意フィールドを保持する", async () => {
    await withTempDir(async (dir) => {
      const file = path.join(dir, "tml-index.yaml");
      await writeFile(file, MINIMAL_INDEX, "utf8");

      const { index, errors } = loadTimelineIndex(file);

      expect(errors).toEqual([]);
      expect(index.project_id).toBe("prj-0001");
      expect(index.tracks).toHaveLength(2);
      expect(index.tracks[1]).toEqual({
        track: "data-flow",
        domains: ["data-flow"],
        catalog_status: "not_started",
        catalog_duration_estimate_days: 2,
        order: 2,
        parallel_group: "business-specs",
        depends_on: ["launch"],
      });
    });
  });

  it("depends_on の省略を、対象位置が分かるエラーとして報告する", async () => {
    await withTempDir(async (dir) => {
      const file = path.join(dir, "tml-index.yaml");
      await writeFile(
        file,
        [
          "id: prj-0001:tml-index",
          "project_id: prj-0001",
          "tracks:",
          "  - track: launch",
          "    domains: [project-definition]",
          "    catalog_status: primary",
          "    order: 1",
          "",
        ].join("\n"),
        "utf8",
      );

      const { errors } = loadTimelineIndex(file);

      expect(errors).toContain(
        "tracks[0].depends_on: required (use [] when there is no prerequisite)",
      );
    });
  });

  it("catalog_status が3値以外ならエラーにする", async () => {
    await withTempDir(async (dir) => {
      const file = path.join(dir, "tml-index.yaml");
      await writeFile(
        file,
        [
          "id: prj-0001:tml-index",
          "project_id: prj-0001",
          "tracks:",
          "  - track: launch",
          "    domains: [project-definition]",
          "    catalog_status: done",
          "    order: 1",
          "    depends_on: []",
          "",
        ].join("\n"),
        "utf8",
      );

      const { errors } = loadTimelineIndex(file);

      expect(errors).toContain(
        "tracks[0].catalog_status: must be one of not_started | draft | primary",
      );
    });
  });
});

describe("validateTimelineTracks", () => {
  it("未定義トラックへの depends_on を検出する", () => {
    const result = validateTimelineTracks([track({ track: "a", order: 2, depends_on: ["ghost"] })]);

    expect(result.errors).toContain("a: depends_on refers to undefined track 'ghost'");
  });

  it("depends_on の向きと order の大小が矛盾する場合にエラーにする", () => {
    const result = validateTimelineTracks([
      track({ track: "a", order: 1, depends_on: ["b"] }),
      track({ track: "b", order: 2 }),
    ]);

    expect(result.errors).toContain("a: depends_on 'b' must have a smaller order (b=2, a=1)");
  });

  it("循環した depends_on を経路つきで検出する", () => {
    const result = validateTimelineTracks([
      track({ track: "a", order: 1, depends_on: ["b"] }),
      track({ track: "b", order: 1, depends_on: ["a"] }),
    ]);

    expect(result.errors.some((error) => error.startsWith("Cyclic depends_on detected:"))).toBe(
      true,
    );
  });

  it("track id の重複を検出する", () => {
    const result = validateTimelineTracks([track({ track: "a" }), track({ track: "a" })]);

    expect(result.errors).toContain("Duplicate track id: a");
  });

  it("前提が primary 未満のまま primary になっているトラックを警告する", () => {
    const result = validateTimelineTracks([
      track({ track: "a", order: 1, catalog_status: "draft" }),
      track({ track: "b", order: 2, catalog_status: "primary", depends_on: ["a"] }),
    ]);

    expect(result.warnings).toContain(
      "b: catalog is primary while prerequisite 'a' is still draft",
    );
  });

  it("整合したトラック定義ではエラーも警告も出さない", () => {
    const result = validateTimelineTracks([
      track({ track: "a", order: 1, catalog_status: "primary" }),
      track({ track: "b", order: 2, catalog_status: "primary", depends_on: ["a"] }),
    ]);

    expect(result).toEqual({ errors: [], warnings: [] });
  });
});

describe("buildTimelineWaves", () => {
  it("order 昇順に wave を採番し、同 order は track 名昇順で並べる", () => {
    const waves = buildTimelineWaves([
      track({ track: "zeta", order: 5 }),
      track({ track: "beta", order: 2 }),
      track({ track: "alpha", order: 2 }),
    ]);

    expect(waves).toHaveLength(2);
    expect(waves[0].wave).toBe(1);
    expect(waves[0].tracks.map((t) => t.track)).toEqual(["alpha", "beta"]);
    expect(waves[1]).toMatchObject({ wave: 2 });
    expect(waves[1].tracks.map((t) => t.track)).toEqual(["zeta"]);
  });

  it("order が飛び番でも wave 番号は 1 から連番になる", () => {
    const waves = buildTimelineWaves([
      track({ track: "a", order: 1 }),
      track({ track: "b", order: 9 }),
    ]);

    expect(waves.map((wave) => wave.wave)).toEqual([1, 2]);
  });
});

describe("collectCatalogFilesByDomain", () => {
  it("ファイル名ではなく domain 値で分割カタログをまとめる", async () => {
    await withTempDir(async (dir) => {
      await writeFile(path.join(dir, "dct-data-model-bdd.yaml"), "domain: data-model\n", "utf8");
      await writeFile(path.join(dir, "dct-data-model-ccd.yaml"), "domain: data-model\n", "utf8");
      await writeFile(path.join(dir, "dct-glossary.yaml"), "domain: glossary\n", "utf8");

      const byDomain = collectCatalogFilesByDomain(dir);

      expect(byDomain.get("data-model")).toHaveLength(2);
      expect(byDomain.get("glossary")).toHaveLength(1);
    });
  });

  it("カタログディレクトリが存在しない場合は空を返す", () => {
    expect(collectCatalogFilesByDomain(path.join(tmpdir(), "specdojo-missing-catalog"))).toEqual(
      new Map(),
    );
  });
});

describe("buildCatalogScaffoldPlans", () => {
  it("カタログが無いドメインだけを scaffold 対象にする", async () => {
    await withTempDir(async (dir) => {
      await writeFile(path.join(dir, "dct-glossary.yaml"), "domain: glossary\n", "utf8");

      const { scaffolds } = buildCatalogScaffoldPlans(
        [
          track({ track: "glossary", domains: ["glossary"] }),
          track({
            track: "architecture",
            domains: ["architecture"],
            catalog_status: "not_started",
          }),
        ],
        dir,
      );

      expect(scaffolds).toEqual([
        {
          track: "architecture",
          domain: "architecture",
          catalogFile: path.join(dir, "dct-architecture.yaml"),
        },
      ]);
    });
  });

  it("catalog_status と実カタログの有無が食い違う場合に警告する", async () => {
    await withTempDir(async (dir) => {
      await writeFile(path.join(dir, "dct-glossary.yaml"), "domain: glossary\n", "utf8");

      const { warnings } = buildCatalogScaffoldPlans(
        [
          track({ track: "glossary", domains: ["glossary"], catalog_status: "not_started" }),
          track({ track: "architecture", domains: ["architecture"], catalog_status: "primary" }),
        ],
        dir,
      );

      expect(warnings).toContain(
        "glossary: catalog_status is not_started but a catalog for domain 'glossary' already exists (1 file(s))",
      );
      expect(warnings).toContain(
        "architecture: catalog_status is primary but no catalog for domain 'architecture' was found",
      );
    });
  });
});

describe("buildTimeline", () => {
  it("tml-index.yaml から wave・scaffold 対象・primary トラックを導出する", async () => {
    await withTempDir(async (dir) => {
      await writeFile(path.join(dir, "tml-index.yaml"), MINIMAL_INDEX, "utf8");

      const result = buildTimeline({ timelinePath: dir, catalogPath: null });

      expect(result.errors).toEqual([]);
      expect(result.projectId).toBe("prj-0001");
      expect(result.waves.map((wave) => wave.tracks.map((t) => t.track))).toEqual([
        ["launch"],
        ["data-flow"],
      ]);
      expect(result.scheduleReadyTracks).toEqual(["launch"]);
      expect(result.warnings).toContain(
        "catalog_path is not configured; skipped catalog scaffold planning",
      );
    });
  });

  it("tml-index.yaml が無い場合は対象パスを含めて失敗する", async () => {
    await withTempDir(async (dir) => {
      expect(() => buildTimeline({ timelinePath: dir, catalogPath: null })).toThrow(
        /Timeline index not found:.*tml-index\.yaml/,
      );
    });
  });
});

describe("renderTimelineOrderMarkdown", () => {
  it("wave ごとに見出しと表を出力する", async () => {
    await withTempDir(async (dir) => {
      await writeFile(path.join(dir, "tml-index.yaml"), MINIMAL_INDEX, "utf8");
      const result = buildTimeline({ timelinePath: dir, catalogPath: null });

      const markdown = renderTimelineOrderMarkdown(result);

      expect(markdown).toContain("# トラック着手順序");
      expect(markdown).toContain("## 1. Wave 1");
      expect(markdown).toContain("## 2. Wave 2");
      expect(markdown).toContain("| `data-flow` | data-flow | not_started | 2 | business-specs |");
    });
  });
});

describe("renderCatalogScaffoldMarkdown", () => {
  it("scaffold 対象が無い場合はその旨を明示する", async () => {
    await withTempDir(async (dir) => {
      await writeFile(path.join(dir, "tml-index.yaml"), MINIMAL_INDEX, "utf8");
      const result = buildTimeline({ timelinePath: dir, catalogPath: null });

      expect(renderCatalogScaffoldMarkdown(result)).toContain(
        "未作成の成果物カタログはありません。",
      );
    });
  });

  it("scaffold 対象を実行コマンドつきで列挙する", async () => {
    await withTempDir(async (dir) => {
      await writeFile(path.join(dir, "tml-index.yaml"), MINIMAL_INDEX, "utf8");
      // カタログが 1 件も無いディレクトリを指すと、全ドメインが scaffold 対象になる。
      const catalogDir = path.join(dir, "catalog-empty");

      const result = buildTimeline({ timelinePath: dir, catalogPath: catalogDir });
      const markdown = renderCatalogScaffoldMarkdown(result);

      expect(markdown).toContain("`specdojo catalog scaffold --domain data-flow`");
    });
  });
});
