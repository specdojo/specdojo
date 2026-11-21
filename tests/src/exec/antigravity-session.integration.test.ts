import { execFileSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { withoutInheritedRepoEnvironment } from "../../../src/exec/task-repos.js";

// 0.9.1 init wrote command templates that call `specdojo agent launch --provider antigravity`.
// Since 0.9.2 the real CLI must exit non-zero for every role without running agy.
describe("Antigravity CLI launch block", () => {
  it("exits non-zero for each pipeline role and never runs a fake agy", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-agy-launch-"));
    const packageRoot = resolve(".");
    const cwd = join(root, "project");
    const bin = join(root, "bin");
    const marker = join(root, "agy-was-launched");
    try {
      for (const dir of [cwd, bin]) mkdirSync(dir, { recursive: true });
      const fakeAgy = join(bin, "agy");
      writeFileSync(fakeAgy, `#!/bin/sh\necho launched > ${JSON.stringify(marker)}\n`);
      chmodSync(fakeAgy, 0o755);
      for (const role of ["edit", "review", "report"]) {
        let failure: { status?: number; stderr?: string } | undefined;
        try {
          execFileSync(
            process.execPath,
            [
              "--import",
              import.meta.resolve("tsx"),
              join(packageRoot, "src", "specdojo.ts"),
              "agent",
              "launch",
              "--provider",
              "antigravity",
              "--role",
              role,
              "--",
              "--model",
              "fixture",
            ],
            {
              cwd,
              encoding: "utf8",
              stdio: ["ignore", "pipe", "pipe"],
              env: {
                ...withoutInheritedRepoEnvironment(process.env),
                SPECDOJO_PACKAGE_ROOT: packageRoot,
                PATH: `${bin}${delimiter}${process.env.PATH ?? ""}`,
              },
            },
          );
        } catch (error) {
          failure = error as { status?: number; stderr?: string };
        }
        expect(failure?.status).toBe(1);
        expect(failure?.stderr).toMatch(/agent launch: SpecDojo 0\.9\.2 and later do not launch/);
        expect(existsSync(marker)).toBe(false);
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
