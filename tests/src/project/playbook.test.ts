import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { renderPlaybookTemplate, scaffoldPlaybook } from "../../../src/project/playbook.js";
import { getProjectPlaybookPath } from "../../../src/shared/specdojo-config.js";

const template = [
  "---",
  "specdojo:",
  "  id: specdojo:pm-orchestrator-playbook-template",
  "  type: template",
  "  frontmatter_template:",
  "    specdojo:",
  "      id: _PROJECT_ID_:pm-orchestrator-playbook",
  "      type: project",
  "---",
  "",
  "# _PROJECT_NAME_ のオーケストレーター運用メモ",
  "",
].join("\n");

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "specdojo-playbook-"));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("getProjectPlaybookPath", () => {
  it("defaults to the project-management folder under base_path", () => {
    expect(getProjectPlaybookPath({ base_path: "docs/p" })).toBe(
      join("docs/p", "030-project-management/pm-orchestrator-playbook.md"),
    );
  });

  it("uses playbook_path relative to base_path when configured", () => {
    expect(getProjectPlaybookPath({ base_path: "docs/p", playbook_path: "ops/notes.md" })).toBe(
      join("docs/p", "ops/notes.md"),
    );
  });
});

describe("renderPlaybookTemplate", () => {
  it("expands the output frontmatter and fills the project placeholders", () => {
    const actual = renderPlaybookTemplate(template, "prj-x");

    expect(actual).toContain("id: prj-x:pm-orchestrator-playbook");
    expect(actual).toContain("# prj-x のオーケストレーター運用メモ");
    expect(actual).not.toContain("-template");
  });
});

describe("scaffoldPlaybook", () => {
  function writeTemplate(): string {
    const templatePath = join(dir, "template.md");
    writeFileSync(templatePath, template, "utf8");
    return templatePath;
  }

  it("creates the playbook, including missing parent directories", () => {
    const playbookPath = join(dir, "a/b/playbook.md");

    const result = scaffoldPlaybook(
      { projectId: "prj-x", playbookPath },
      { templatePath: writeTemplate() },
    );

    expect(result.created).toBe(true);
    expect(readFileSync(playbookPath, "utf8")).toContain("prj-x:pm-orchestrator-playbook");
  });

  it("writes nothing on dry-run", () => {
    const playbookPath = join(dir, "playbook.md");

    const result = scaffoldPlaybook(
      { projectId: "prj-x", playbookPath },
      { dryRun: true, templatePath: writeTemplate() },
    );

    expect(result.created).toBe(false);
    expect(existsSync(playbookPath)).toBe(false);
  });

  it("refuses to overwrite an existing playbook", () => {
    const playbookPath = join(dir, "playbook.md");
    writeFileSync(playbookPath, "keep", "utf8");

    expect(() =>
      scaffoldPlaybook({ projectId: "prj-x", playbookPath }, { templatePath: writeTemplate() }),
    ).toThrow(/already exists/);
    expect(readFileSync(playbookPath, "utf8")).toBe("keep");
  });
});
