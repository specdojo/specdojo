import { Command } from "commander";
import { mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import yaml from "js-yaml";
import { describe, expect, it } from "vitest";
import {
  collectProjectMilestones,
  registerScheduleCommands,
  updateMilestonesFile,
} from "../../src/schedule.js";

function writeMilestoneStrategy(
  dir: string,
  track: string,
  milestoneId: string,
  projectId = "prj-test",
  status = "ready",
): string {
  const localId = `doc-${track}`;
  const catalogFile = `catalog-${track}.yaml`;
  writeFileSync(
    join(dir, catalogFile),
    yaml.dump({
      groups: [
        {
          name: track,
          deliverables: [{ local_id: localId, name: track, kind: "work", path: `${localId}.md` }],
        },
      ],
    }),
    "utf8",
  );

  const strategyFile = `sch-strategy-${track}.yaml`;
  writeFileSync(
    join(dir, strategyFile),
    yaml.dump({
      kind: "strategy",
      id: `${projectId}:sch-strategy-${track}`,
      type: "project",
      status,
      track,
      scope: {
        catalogs: [{ id: `${projectId}:catalog-${track}`, path: `/${catalogFile}` }],
        include_kinds: ["work"],
      },
      phase_sets: {
        first: [{ id: "draft", name: "Draft", task_suffix: "010", duration_days: 1 }],
      },
      default_phase_sets: ["first"],
      owner_rules: [{ local_ids: [localId], owner: "BA" }],
      phase_gates: [
        {
          id: milestoneId,
          name: `${track} complete`,
          after_phase_sets: ["first"],
          owner: "PM",
          scope: { local_ids: [localId] },
        },
      ],
    }),
    "utf8",
  );
  return strategyFile;
}

describe("schedule command registration", () => {
  it("build コマンドを登録する", () => {
    const program = new Command();
    registerScheduleCommands(program);

    const schedule = program.commands.find((command) => command.name() === "schedule");
    const commandNames = schedule?.commands.map((command) => command.name());
    const help = schedule?.helpInformation();

    expect(commandNames).toEqual(["where", "build", "assessment", "strategy"]);
    expect(help).toContain("build");
  });

  it("assessment サブコマンドを登録する", () => {
    const program = new Command();
    registerScheduleCommands(program);

    const schedule = program.commands.find((command) => command.name() === "schedule");
    const assessment = schedule?.commands.find((command) => command.name() === "assessment");

    expect(assessment?.commands.map((command) => command.name())).toEqual([
      "scaffold",
      "prompt",
      "validate",
    ]);
  });
});

describe("project milestone rebuild", () => {
  it("全 strategy の milestone をファイル名順に集約する", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-schedule-milestones-"));
    try {
      writeMilestoneStrategy(dir, "beta", "G-BETA-first");
      writeMilestoneStrategy(dir, "alpha", "G-ALPHA-first");

      const result = collectProjectMilestones(dir, dir, "prj-test");

      expect(result.errors).toEqual([]);
      expect(result.milestones.map((milestone) => milestone.id)).toEqual([
        "G-ALPHA-first",
        "G-BETA-first",
      ]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("既存 milestone の順序を維持して新規 track の項目を末尾へ追加する", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-schedule-milestone-order-"));
    try {
      writeMilestoneStrategy(dir, "launch", "G-LAUNCH-first");
      const initial = collectProjectMilestones(dir, dir, "prj-test");
      updateMilestonesFile(dir, "prj-test", initial.milestones, false);

      writeMilestoneStrategy(dir, "data-flow", "G-DATA-FLOW-first");
      const rebuilt = collectProjectMilestones(dir, dir, "prj-test");
      updateMilestonesFile(dir, "prj-test", rebuilt.milestones, false);
      const doc = yaml.load(readFileSync(join(dir, "sch-milestones.yaml"), "utf8")) as {
        milestones: Array<{ id: string }>;
      };

      expect(rebuilt.milestones.map((milestone) => milestone.id)).toEqual([
        "G-DATA-FLOW-first",
        "G-LAUNCH-first",
      ]);
      expect(doc.milestones.map((milestone) => milestone.id)).toEqual([
        "G-LAUNCH-first",
        "G-DATA-FLOW-first",
      ]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("削除された strategy 由来の stale milestone を再構築時に除去する", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-schedule-milestone-removal-"));
    try {
      writeMilestoneStrategy(dir, "alpha", "G-ALPHA-first");
      const betaFile = writeMilestoneStrategy(dir, "beta", "G-BETA-first");
      const initial = collectProjectMilestones(dir, dir, "prj-test");
      updateMilestonesFile(dir, "prj-test", initial.milestones, false);

      unlinkSync(join(dir, betaFile));
      const rebuilt = collectProjectMilestones(dir, dir, "prj-test");
      rebuilt.milestones[0] = {
        ...rebuilt.milestones[0],
        owner: "PO",
        tags: ["rebuilt"],
      };
      const update = updateMilestonesFile(dir, "prj-test", rebuilt.milestones, false);
      const doc = yaml.load(readFileSync(join(dir, "sch-milestones.yaml"), "utf8")) as {
        milestones: Array<{ id: string; owner: string; tags?: string[] }>;
      };

      expect(update.removed).toEqual(["G-BETA-first"]);
      expect(doc.milestones.map((milestone) => milestone.id)).toEqual(["G-ALPHA-first"]);
      expect(doc.milestones[0]).toMatchObject({ owner: "PO", tags: ["rebuilt"] });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("strategy 間の milestone ID 重複をエラーにする", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-schedule-milestone-duplicate-"));
    try {
      writeMilestoneStrategy(dir, "alpha", "G-SHARED-first");
      writeMilestoneStrategy(dir, "beta", "G-SHARED-first");

      const result = collectProjectMilestones(dir, dir, "prj-test");

      expect(result.errors).toContain(
        "Duplicate milestone ID 'G-SHARED-first' generated by sch-strategy-alpha.yaml and sch-strategy-beta.yaml",
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("新規 milestone 集約ファイルを draft で作成する", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-schedule-milestone-status-new-"));
    try {
      writeMilestoneStrategy(dir, "alpha", "G-ALPHA-first");
      const result = collectProjectMilestones(dir, dir, "prj-test");

      updateMilestonesFile(dir, "prj-test", result.milestones, false);
      const doc = yaml.load(readFileSync(join(dir, "sch-milestones.yaml"), "utf8")) as {
        status: string;
      };

      expect(doc.status).toBe("draft");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it.each([
    ["ready", "draft"],
    ["draft", "ready"],
    ["deprecated", "ready"],
  ])(
    "既存 milestone 集約ファイルの status=%s を strategy status=%s の再構築でも保持する",
    (status, strategyStatus) => {
      const dir = mkdtempSync(join(tmpdir(), "specdojo-schedule-milestone-status-existing-"));
      try {
        writeMilestoneStrategy(dir, "alpha", "G-ALPHA-first", "prj-test", strategyStatus);
        writeFileSync(
          join(dir, "sch-milestones.yaml"),
          yaml.dump({
            kind: "milestones",
            id: "prj-test:sch-milestones",
            type: "project",
            status,
            version: 1,
            project_id: "prj-test",
            settings: {},
            milestones: [],
          }),
          "utf8",
        );
        const result = collectProjectMilestones(dir, dir, "prj-test");

        updateMilestonesFile(dir, "prj-test", result.milestones, false);
        const doc = yaml.load(readFileSync(join(dir, "sch-milestones.yaml"), "utf8")) as {
          status: string;
        };

        expect(doc.status).toBe(status);
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    },
  );

  it("別 strategy が不正なら不完全な集約結果を成功扱いしない", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-schedule-milestone-invalid-"));
    try {
      writeMilestoneStrategy(dir, "alpha", "G-ALPHA-first");
      writeFileSync(join(dir, "sch-strategy-broken.yaml"), "track: broken\n", "utf8");

      const result = collectProjectMilestones(dir, dir, "prj-test");

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("sch-strategy-broken.yaml");
      expect(result.errors[0]).toContain("missing required fields");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
