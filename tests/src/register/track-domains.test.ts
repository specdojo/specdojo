import { Command } from "commander";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolveTrackDomains } from "../../../src/register/track-domains.js";
import { resolveTrackScopeCatalogs } from "../../../src/schedule/strategy-generate-scope.js";
import { writeDashboard } from "../../../src/dashboard/dashboard.js";
import { buildRegisterEvent } from "../../../src/register/events.js";
import { buildTimeline } from "../../../src/dashboard/timeline-build.js";
import { dump } from "../../../src/shared/yaml.js";

let root: string;
const legacy = {
  project_id: "prj-test",
  tracks: [
    { track: "demo", domains: ["legacy"], catalog_status: "draft", order: 1, depends_on: [] },
  ],
};
function writeEpic(domains?: string[]) {
  writeFileSync(
    join(root, "register/pjr-ab12-demo.md"),
    `---\n${dump({
      specdojo: {
        id: "prj-test:pjr-ab12-demo",
        item_type: "epic",
        item_status: "open",
        track: "demo",
        ...(domains === undefined ? {} : { domains }),
      },
    })}---\n\n# PJR-AB12 Demo\n`,
  );
}
function options() {
  return {
    track: "demo",
    repoRoot: root,
    projectId: "prj-test",
    registerPath: join(root, "register"),
    timelinePath: join(root, "timeline"),
    catalogPath: join(root, "catalog"),
    schedulePath: join(root, "schedule"),
  };
}
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "epic-domains-"));
  for (const dir of ["register", "timeline", "catalog", "schedule"]) mkdirSync(join(root, dir));
  writeFileSync(join(root, "timeline/tml-index.yaml"), dump(legacy));
});
afterEach(() => {
  vi.restoreAllMocks();
  rmSync(root, { recursive: true, force: true });
});

describe("track domain resolution", () => {
  it("uses strategy scope, then epic domains, then legacy domains", () => {
    writeEpic(["epic"]);
    expect(resolveTrackDomains(options())).toMatchObject({ source: "epic", domains: ["epic"] });
    const strategy = {
      scope: { catalogs: [{ id: "prj-test:dct-explicit", path: "/catalog/dct-explicit.yaml" }] },
    };
    expect(resolveTrackDomains({ ...options(), existingStrategy: strategy })).toMatchObject({
      source: "strategy",
      domains: ["explicit"],
    });
    expect(
      resolveTrackDomains({ ...options(), existingStrategy: { scope: { catalogs: [] } } }).domains,
    ).toEqual([]);
    writeEpic([]);
    expect(resolveTrackDomains(options())).toMatchObject({ source: "epic", domains: [] });
    writeEpic();
    expect(resolveTrackDomains(options())).toMatchObject({
      source: "timeline",
      domains: ["legacy"],
    });
  });

  it("expands all physical catalogs in epic domains without a timeline", () => {
    writeEpic(["demo"]);
    rmSync(join(root, "timeline/tml-index.yaml"));
    for (const part of ["a", "b"])
      writeFileSync(
        join(root, `catalog/dct-demo-${part}.yaml`),
        dump({ id: `prj-test:dct-demo-${part}`, domain: "demo", groups: [] }),
      );
    const result = resolveTrackScopeCatalogs(options());
    expect(result.source).toBe("epic");
    expect(result.catalogs).toHaveLength(2);
    expect(result.errors).toEqual([]);
    const explicit = resolveTrackScopeCatalogs({
      ...options(),
      existingStrategy: {
        scope: { catalogs: [{ path: "/catalog/dct-demo-a.yaml", local_ids: ["selected"] }] },
      },
    });
    expect(explicit.catalogs).toHaveLength(1);
    expect(explicit.catalogs[0].local_ids).toEqual(["selected"]);
  });

  it("catalog-scaffold uses the same priority and detects missing catalogs", () => {
    writeEpic(["epic"]);
    expect(buildTimeline(options()).scaffolds.map((row) => row.domain)).toEqual(["epic"]);
    writeFileSync(
      join(root, "schedule/sch-strategy-demo.yaml"),
      dump({
        track: "demo",
        scope: { catalogs: [{ id: "prj-test:dct-selected", path: "/catalog/dct-selected.yaml" }] },
      }),
    );
    expect(buildTimeline(options()).scaffolds.map((row) => row.domain)).toEqual(["selected"]);
    rmSync(join(root, "timeline/tml-index.yaml"));
    expect(buildTimeline(options()).scaffolds.map((row) => row.domain)).toEqual(["selected"]);
  });

  it("dashboard writes the epic Gantt and catalog-scaffold under execution/generated without a timeline", () => {
    writeEpic(["epic"]);
    rmSync(join(root, "timeline/tml-index.yaml"));
    const ticketPath = join(root, "register/pjr-ab12-demo.md");
    const before = readFileSync(ticketPath, "utf8");
    const after = before.replace("item_status: open", "item_status: in-progress");
    writeFileSync(ticketPath, after);
    mkdirSync(join(root, "register/events"));
    const event = buildRegisterEvent({
      beforeContent: before,
      afterContent: after,
      filename: "pjr-ab12-demo.md",
      timeZone: "UTC",
      action: "start",
      actor: "tester",
      reason: "started",
      ts: "2026-01-05T00:00:00Z",
    })!;
    writeFileSync(join(root, "register/events/pjr-ab12.yaml"), dump([event]));
    const output = join(root, "execution/generated");
    const result = writeDashboard({
      ...options(),
      projectPath: root,
      executionGeneratedPath: output,
    });
    expect(result.generatedFiles).toHaveLength(4);
    expect(result.markdown).toContain("全体計画（epic）");
    expect(result.markdown).toContain("2026-01-05");
    expect(result.markdown).toContain("終了日は未定");
    expect(readFileSync(join(output, "dashboard-timeline-gantt.svg"), "utf8")).toContain(
      "<polygon",
    );
    expect(readFileSync(join(output, "catalog-scaffold.md"), "utf8")).toContain("`epic`");
    expect(readFileSync(ticketPath, "utf8")).toBe(after);
  });

  it("legacy loading emits one deprecation warning across repeated reads", async () => {
    vi.resetModules();
    const { loadTimelineIndex } = await import("../../../src/shared/timeline-index.js");
    const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);
    const path = join(root, "timeline/tml-index.yaml");
    expect(loadTimelineIndex(path).index.tracks[0].domains).toEqual(["legacy"]);
    loadTimelineIndex(path);
    expect(
      stderr.mock.calls.filter(([message]) =>
        String(message).includes("tml-index.yaml is deprecated"),
      ),
    ).toHaveLength(1);
  });
  it("timeline build and timeline_path warn once while the compatibility CLI still works", async () => {
    vi.resetModules();
    const { registerTimelineCommands } = await import("../../../src/dashboard/timeline.js");
    const previousCwd = process.cwd();
    const previousExitCode = process.exitCode;
    mkdirSync(join(root, ".specdojo"));
    writeFileSync(
      join(root, ".specdojo/specdojo.config.json"),
      JSON.stringify({
        version: 1,
        projects: {
          "prj-test": {
            timeline_path: "timeline",
            catalog_path: "catalog",
            project_register_path: "register",
            schedule_path: "schedule",
          },
        },
      }),
    );
    const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);
    vi.spyOn(process.stdout, "write").mockReturnValue(true);
    try {
      process.chdir(root);
      process.exitCode = undefined;
      for (let i = 0; i < 2; i++) {
        const command = new Command();
        registerTimelineCommands(command);
        await command.parseAsync(["timeline", "build", "--project", "prj-test", "--dry-run"], {
          from: "user",
        });
      }
      expect(process.exitCode).toBeUndefined();
      for (const feature of ["timeline build", "timeline_path", "tml-index.yaml"]) {
        expect(
          stderr.mock.calls.filter(([message]) =>
            String(message).includes(`${feature} is deprecated`),
          ),
        ).toHaveLength(1);
      }
    } finally {
      process.chdir(previousCwd);
      process.exitCode = previousExitCode;
    }
  });
});
