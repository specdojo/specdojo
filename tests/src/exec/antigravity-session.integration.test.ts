import { execFileSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, join, resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { runProviderScaffold } from "../../../src/shared/provider-scaffold.js";
import {
  productRepoEnvironment,
  withoutInheritedRepoEnvironment,
} from "../../../src/exec/task-repos.js";

describe("Antigravity scaffold and CLI launch", () => {
  it("launches a fake agy with one session profile and task roots for each pipeline role", async () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-agy-launch-"));
    const packageRoot = resolve(".");
    const cwd = join(root, "project");
    const product = join(root, "task", "product");
    const homeDir = join(root, "home");
    const bin = join(root, "bin");
    const output = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      for (const dir of [cwd, product, bin, homeDir]) mkdirSync(dir, { recursive: true });
      writeFileSync(join(cwd, "package.json"), "{}\n");
      await runProviderScaffold("antigravity", {
        packageRoot,
        repoRoot: cwd,
        homeDir,
        force: false,
        dryRun: false,
      });
      for (const role of ["edit", "review", "report", "orchestrator"]) {
        expect(existsSync(join(cwd, ".specdojo", "antigravity", `settings.${role}.json`))).toBe(
          true,
        );
      }
      expect(existsSync(join(homeDir, ".gemini"))).toBe(false);
      const fakeAgy = join(bin, "agy");
      writeFileSync(
        fakeAgy,
        "#!/usr/bin/env node\nprocess.stdout.write(JSON.stringify(process.argv.slice(2)));\n",
      );
      chmodSync(fakeAgy, 0o755);
      for (const role of ["edit", "review", "report"]) {
        const raw = execFileSync(
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
            "-p",
            "--settings",
            "--add-dir",
            product,
          ],
          {
            cwd,
            encoding: "utf8",
            env: {
              ...withoutInheritedRepoEnvironment(process.env),
              SPECDOJO_PACKAGE_ROOT: packageRoot,
              ...productRepoEnvironment(cwd, [{ name: "product", path: product }]),
              PATH: `${bin}${delimiter}${process.env.PATH ?? ""}`,
            },
          },
        );
        const args = JSON.parse(raw) as string[];
        // The prompt itself may contain flag-like text; only the final flag is settings.
        expect(args.slice(0, 4)).toEqual(["--model", "fixture", "-p", "--settings"]);
        expect(args).toContain(product);
        const settings = JSON.parse(args.at(-1)!) as {
          permissions: { allow: string[]; deny: string[] };
        };
        expect(settings.permissions.deny).toContain(`read_file(${product}/secrets/)`);
        expect(settings.permissions.deny).toContain(`write_file(${product}/package.json)`);
        if (role === "edit")
          expect(settings.permissions.allow).toContain(`write_file(${product}/)`);
        else expect(settings.permissions.deny).toContain("write_file(*)");
      }
    } finally {
      output.mockRestore();
      rmSync(root, { recursive: true, force: true });
    }
  });
});
