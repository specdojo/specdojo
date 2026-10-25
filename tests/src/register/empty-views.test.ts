import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { lint } from "markdownlint/sync";
import { generateDerivedViewFiles } from "../../../src/register/views.js";
import type { RegisterPaths } from "../../../src/register/command-types.js";

describe("generateDerivedViewFiles with an empty register", () => {
  it("generates views without consecutive blank lines", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-empty-views-"));
    try {
      const registerPath = join(root, "project-register");
      mkdirSync(registerPath, { recursive: true });
      const paths: RegisterPaths = {
        projectId: "prj-test",
        projectRegisterPath: registerPath,
        pjrIndexPath: join(registerPath, "pjr-index.md"),
        generatedPath: join(registerPath, "generated"),
        controlsGeneratedPath: join(root, "generated"),
        registerDateTimeZone: "Asia/Tokyo",
      };

      const views = generateDerivedViewFiles(paths, "all");
      const strings = Object.fromEntries(views.map((view) => [view.path, view.content]));
      const result = lint({ strings, config: { default: false, MD012: true } });

      expect(views.length).toBeGreaterThanOrEqual(9);
      const violations = Object.entries(result).flatMap(([name, errors]) =>
        errors.map((error) => `${name}:${error.lineNumber}`),
      );
      expect(violations).toEqual([]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
