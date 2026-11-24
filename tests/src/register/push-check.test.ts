import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  findOutOfScopePaths,
  formatRegisterPushReport,
  validateRegisterShape,
} from "../../../src/register/push-check.js";

const TARGET = {
  registerPath: "docs/sample/controls/project-register",
  eventsPath: "docs/sample/execution/exec/events",
  branch: "project/sample/register",
};

const TICKET = `---
specdojo:
  id: sample:pjr-ab12-first
  type: project
  status: draft
---

# PJR-AB12 first
`;

describe("findOutOfScopePaths", () => {
  it("accepts tickets, register events and schedule events", () => {
    const actual = findOutOfScopePaths(TARGET, [
      `${TARGET.registerPath}/pjr-ab12-first.md`,
      `${TARGET.registerPath}/events/pjr-ab12.yaml`,
      `${TARGET.eventsPath}/2026-11.yaml`,
    ]);

    expect(actual).toEqual([]);
  });

  it("returns files outside the register scope, including a sibling directory with a shared prefix", () => {
    const actual = findOutOfScopePaths(TARGET, [
      `${TARGET.registerPath}/pjr-ab12-first.md`,
      "src/register/item.ts",
      `${TARGET.registerPath}-old/pjr-ab12-first.md`,
    ]);

    expect(actual).toEqual([
      "src/register/item.ts",
      `${TARGET.registerPath}-old/pjr-ab12-first.md`,
    ]);
  });
});

describe("validateRegisterShape", () => {
  let dir: string | undefined;

  function fixture(): string {
    dir = mkdtempSync(join(tmpdir(), "specdojo-register-push-check-"));
    return dir;
  }

  afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
    dir = undefined;
  });

  it("accepts an empty register directory", () => {
    expect(validateRegisterShape(fixture(), "UTC")).toEqual([]);
  });

  it("reports a ticket that has no event directory", () => {
    const root = fixture();
    writeFileSync(join(root, "pjr-ab12-first.md"), TICKET, "utf8");

    const actual = validateRegisterShape(root, "UTC");

    expect(actual).toContain("events/: register event directory not found");
  });

  it("reports an event file that has no matching ticket", () => {
    const root = fixture();
    mkdirSync(join(root, "events"));
    writeFileSync(join(root, "events", "pjr-ab12.yaml"), "[]\n", "utf8");

    const actual = validateRegisterShape(root, "UTC");

    expect(actual).toContain("pjr-ab12.yaml: no matching register item for PJR-AB12");
  });

  it("reports a ticket whose id does not match its filename", () => {
    const root = fixture();
    writeFileSync(
      join(root, "pjr-ab12-first.md"),
      TICKET.replace("sample:pjr-ab12-first", "sample:pjr-cd34-other"),
      "utf8",
    );

    const actual = validateRegisterShape(root, "UTC");

    expect(actual.some((error) => error.startsWith("pjr-ab12-first.md:"))).toBe(true);
  });
});

describe("formatRegisterPushReport", () => {
  it("names the file and gives a fix for each kind of violation", () => {
    const report = formatRegisterPushReport(TARGET, {
      scopeViolations: ["0123456789ab: src/register/item.ts"],
      shapeViolations: ["pjr-ab12-first.md: missing register event file events/pjr-ab12.yaml"],
    });

    expect(report).toContain("0123456789ab: src/register/item.ts");
    expect(report).toContain("pjr-ab12-first.md: missing register event file");
    expect(report).toContain("直し方");
  });

  it("is empty when nothing is violated", () => {
    expect(formatRegisterPushReport(TARGET, { scopeViolations: [], shapeViolations: [] })).toBe("");
  });
});
