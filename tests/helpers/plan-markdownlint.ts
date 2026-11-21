import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { dump } from "js-yaml";
import { buildScheduleTrack } from "../../src/schedule/build.js";
import { createScheduleTrackDocument } from "../../src/schedule/schedule.js";
import { DEFAULT_MARKDOWNLINT_CONFIG } from "../../src/shared/markdownlint-config.js";

export function createPlanMarkdownlintFixture(description: string, mode = "edit"): string {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-plan-markdownlint-"));
  for (const dir of [".specdojo", "catalog", "schedule", "execution/exec/plans"]) {
    mkdirSync(join(repo, dir), { recursive: true });
  }
  writeFileSync(
    join(repo, ".specdojo", "specdojo.config.json"),
    JSON.stringify({
      version: 1,
      current_project: "test",
      projects: {
        test: {
          catalog_path: "catalog",
          schedule_path: "schedule",
          execution_path: "execution",
          project_context: [],
        },
      },
    }),
  );
  writeFileSync(join(repo, ".markdownlint.yaml"), dump(DEFAULT_MARKDOWNLINT_CONFIG));
  writeFileSync(
    join(repo, ".specdojo", "agent-members.yaml"),
    dump({
      version: 1,
      members: [
        {
          nickname: "test-agent",
          display_name: "Test agent",
          email: null,
          roles: ["DEV"],
          type: "agent",
          provider: "custom",
          mode: "edit",
          capabilities: [],
          proficiency: "normal",
          priority: 1,
          command: "node -e 'throw new Error(\"agent must not run\")'",
        },
      ],
    }),
  );
  // Reproduce generated history excluded from formatting and whole-repo lint.
  writeFileSync(join(repo, ".prettierignore"), "execution/\n");
  writeFileSync(join(repo, ".markdownlintignore"), "execution/\n");
  writeFileSync(
    join(repo, "catalog", "dct-test.yaml"),
    dump({
      id: "test:dct-test",
      type: "project",
      status: "draft",
      project_id: "test",
      domain: "test",
      base_path: "/docs/test",
      groups: [
        {
          name: "test",
          deliverables: [{ local_id: "doc", name: "Document", kind: "work", path: "doc.md" }],
        },
      ],
    }),
  );
  writeFileSync(
    join(repo, "schedule", "sch-strategy-test.yaml"),
    dump({
      kind: "strategy",
      id: "test:sch-strategy-test",
      type: "project",
      status: "draft",
      track: "test",
      scope: {
        catalogs: [{ id: "test:dct-test", path: "/catalog/dct-test.yaml" }],
        include_kinds: ["work"],
      },
      phase_sets: {
        first: [
          { id: "draft", name: "Draft", task_suffix: "010", duration_days: 1, mode, description },
        ],
      },
      default_phase_sets: ["first"],
      owner_rules: [{ local_ids: ["doc"], owner: "DEV" }],
    }),
  );
  const result = buildScheduleTrack(join(repo, "schedule", "sch-strategy-test.yaml"), repo);
  if (result.errors.length) throw new Error(result.errors.join("\n"));
  writeFileSync(
    join(repo, "schedule", "sch-track-test.yaml"),
    dump(createScheduleTrackDocument(result)),
  );
  return repo;
}
