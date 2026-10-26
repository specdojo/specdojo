import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { Command } from "commander";
import { load } from "js-yaml";
import { describe, expect, it, vi } from "vitest";
import { registerExecCommands } from "../../../src/exec/commands.js";
import { resolveProjectPaths } from "../../../src/exec/project.js";
import { writeGradeRunFixture } from "../../helpers/grade-run-fixture.js";

describe("exec scaffold viewpoints", () => {
  it("writes the configured overlay from defaults and falls back to packaged viewpoints", async () => {
    const previous = process.cwd();
    const root = mkdtempSync(join(tmpdir(), "specdojo-scaffold-viewpoints-"));
    const stdout = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      writeGradeRunFixture(root);
      process.chdir(root);
      const config = JSON.parse(readFileSync(".specdojo/specdojo.config.json", "utf8"));
      config.projects.test.viewpoints_path = "project/review.yaml";
      writeFileSync(".specdojo/specdojo.config.json", JSON.stringify(config));
      const program = new Command();
      registerExecCommands(program);
      await program.parseAsync(["node", "specdojo", "exec", "scaffold", "--project", "test"]);
      expect(load(readFileSync("project/review.yaml", "utf8"))).toMatchObject({
        extends: "specdojo:pm-review-viewpoints",
        status: "draft",
        viewpoints: [],
      });
      delete config.projects.test.viewpoints_path;
      writeFileSync(".specdojo/specdojo.config.json", JSON.stringify(config));
      const fallback = new Command();
      registerExecCommands(fallback);
      await fallback.parseAsync(["node", "specdojo", "exec", "scaffold", "--project", "test"]);
      expect(stdout).toHaveBeenCalledWith(
        expect.stringContaining("using specdojo:pm-review-viewpoints"),
      );
      expect(resolveProjectPaths({ project: "test" }).viewpointsPath).toMatch(
        /defaults[/\\]pm-review-viewpoints.yaml$/,
      );
    } finally {
      stdout.mockRestore();
      process.chdir(previous);
      rmSync(root, { recursive: true, force: true });
    }
  });
});
