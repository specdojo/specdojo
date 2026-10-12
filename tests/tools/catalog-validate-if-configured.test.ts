import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { beforeAll, describe, expect, it, vi } from "vitest";

type RunCatalogValidateIfConfigured = (options?: {
  resolvePath?: () => Promise<string> | string;
  runValidation?: () => Promise<number> | number;
  writeStdout?: (message: string) => void;
}) => Promise<number>;

let runCatalogValidateIfConfigured: RunCatalogValidateIfConfigured;

beforeAll(async () => {
  const moduleUrl = pathToFileURL(path.resolve("tools/catalog-validate-if-configured.mjs")).href;
  const entryModule = (await import(moduleUrl)) as {
    runCatalogValidateIfConfigured: RunCatalogValidateIfConfigured;
  };
  runCatalogValidateIfConfigured = entryModule.runCatalogValidateIfConfigured;
});

describe("catalog validate pre-commit wrapper", () => {
  it("skips when the selected configured project has no catalog_path", async () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "specdojo-catalog-hook-"));
    const previousCwd = process.cwd();
    const previousProject = process.env.SPECDOJO_PROJECT;
    const stdout: string[] = [];

    mkdirSync(path.join(root, ".specdojo"));
    writeFileSync(
      path.join(root, ".specdojo", "specdojo.config.json"),
      JSON.stringify({
        version: 1,
        current_project: "prj-0001",
        projects: {
          "prj-0001": { catalog_path: "catalog" },
          "prj-0002": { project_register_path: "project-register" },
        },
      }),
    );

    try {
      process.chdir(root);
      process.env.SPECDOJO_PROJECT = "prj-0002";

      const exitCode = await runCatalogValidateIfConfigured({
        writeStdout: (message) => stdout.push(message),
      });

      expect(exitCode).toBe(0);
      expect(stdout.join("")).toContain(
        "skipped: catalog_path is not configured for project 'prj-0002'",
      );
    } finally {
      process.chdir(previousCwd);
      if (previousProject === undefined) {
        delete process.env.SPECDOJO_PROJECT;
      } else {
        process.env.SPECDOJO_PROJECT = previousProject;
      }
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("turns only the missing catalog_path error into a successful skip", async () => {
    const stdout: string[] = [];
    const runValidation = vi.fn(() => 1);

    const exitCode = await runCatalogValidateIfConfigured({
      resolvePath: () => {
        throw new Error(
          "catalog_path not set for project 'prj-0002' in /repo/.specdojo/specdojo.config.json.\n" +
            'Add "catalog_path": "<path>" to the project config.\n' +
            "Configuration keys: https://example.test/config",
        );
      },
      runValidation,
      writeStdout: (message) => stdout.push(message),
    });

    expect(exitCode).toBe(0);
    expect(runValidation).not.toHaveBeenCalled();
    expect(stdout.join("")).toContain(
      "skipped: catalog_path is not configured for project 'prj-0002'",
    );
  });

  it("keeps a configured catalog validation failure", async () => {
    const runValidation = vi.fn(() => 1);

    const exitCode = await runCatalogValidateIfConfigured({
      resolvePath: () => "/repo/catalog",
      runValidation,
    });

    expect(exitCode).toBe(1);
    expect(runValidation).toHaveBeenCalledOnce();
  });

  it("keeps configuration errors instead of treating them as a skip", async () => {
    const stdout: string[] = [];
    const runValidation = vi.fn(() => 0);

    const exitCode = await runCatalogValidateIfConfigured({
      resolvePath: () => {
        throw new Error("Unknown project: prj-9999");
      },
      runValidation,
      writeStdout: (message) => stdout.push(message),
    });

    expect(exitCode).toBe(1);
    expect(runValidation).not.toHaveBeenCalled();
    expect(stdout.join("")).toBe("Unknown project: prj-9999\n");
  });

  it("returns success for a valid configured catalog", async () => {
    const runValidation = vi.fn(() => 0);

    const exitCode = await runCatalogValidateIfConfigured({
      resolvePath: () => "/repo/catalog",
      runValidation,
    });

    expect(exitCode).toBe(0);
    expect(runValidation).toHaveBeenCalledOnce();
  });
});
