import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { runLefthookScaffold } from "../../../src/shared/lefthook-scaffold.js";
import { gitEnvironment } from "../../../src/shared/git-environment.js";
import type { SpecDojoConfig } from "../../../src/shared/specdojo-config.js";

const packageRoot = process.cwd();

function git(repoRoot: string, args: string[]): string {
  return execFileSync("git", args, {
    cwd: repoRoot,
    env: gitEnvironment(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

describe("scaffolded lefthook", () => {
  it("runs before commit in a temporary repository and rejects markdown violations", async () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "specdojo-lefthook-integration-"));
    const config: SpecDojoConfig = {
      version: 1,
      current_project: "prj-0001",
      projects: {
        "prj-0001": {
          base_path: "docs/ja/projects/prj-0001",
          project_register_path: "controls/project-register",
        },
      },
    };
    try {
      git(repoRoot, ["init"]);
      writeFileSync(join(repoRoot, "package.json"), '{"name":"fixture","private":true}\n', "utf8");
      mkdirSync(join(repoRoot, ".specdojo"), { recursive: true });
      writeFileSync(
        join(repoRoot, ".specdojo/specdojo.config.json"),
        `${JSON.stringify(config, null, 2)}\n`,
        "utf8",
      );
      symlinkSync(join(packageRoot, "node_modules"), join(repoRoot, "node_modules"), "dir");
      await runLefthookScaffold({ packageRoot, repoRoot, config, force: false, dryRun: false });
      execFileSync(process.execPath, ["tools/install-lefthook.mjs"], {
        cwd: repoRoot,
        env: gitEnvironment(),
        stdio: "pipe",
      });

      writeFileSync(join(repoRoot, "README.md"), "# Valid\n", "utf8");
      git(repoRoot, ["add", "."]);
      git(repoRoot, ["commit", "--no-verify", "-m", "initial"]);
      writeFileSync(join(repoRoot, "README.md"), "#Invalid heading\n", "utf8");
      git(repoRoot, ["add", "README.md"]);

      const commit = spawnSync("git", ["commit", "-m", "invalid markdown"], {
        cwd: repoRoot,
        env: gitEnvironment(),
        encoding: "utf8",
      });

      expect(commit.status).not.toBe(0);
      expect(`${commit.stdout}\n${commit.stderr}`).toMatch(/MD018|markdownlint/u);
      expect(readFileSync(join(repoRoot, "README.md"), "utf8")).toContain("#Invalid heading");
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});
