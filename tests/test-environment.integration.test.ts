import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import unitConfig from "../vitest.unit.config.js";
import integrationConfig from "../vitest.integration.config.js";
import { gitEnvironment } from "../src/shared/git-environment.js";

const tsxLoader = createRequire(import.meta.url).resolve("tsx");
const catalogModule = new URL("../src/catalog/catalog.ts", import.meta.url).href;

describe("Vitest の project 環境隔離", () => {
  it.each([
    ["unit", unitConfig],
    ["integration", integrationConfig],
  ] as const)("%s の setup 後に起動する CLI 処理は fixture の project を解決する", (_, config) => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-test-environment-"));
    try {
      mkdirSync(join(root, ".specdojo"));
      writeFileSync(
        join(root, ".specdojo", "specdojo.config.json"),
        JSON.stringify({
          version: 1,
          current_project: "prj-0001",
          projects: {
            "prj-0001": { catalog_path: "fixture-catalog" },
          },
        }),
        "utf8",
      );
      const setupFiles = config.test?.setupFiles;
      expect(Array.isArray(setupFiles)).toBe(true);
      if (!Array.isArray(setupFiles)) throw new Error("Expected setupFiles to be an array");
      const setupArguments = setupFiles.flatMap((file) => [
        "--import",
        new URL(`../${file}`, import.meta.url).href,
      ]);
      // 別プロセスへ意図的に未知の project を渡し、実際の setup を test module より先に読む。
      // setup が除去し忘れると resolveCatalogPath が Unknown project で失敗する。
      const result = spawnSync(
        process.execPath,
        [
          "--import",
          tsxLoader,
          ...setupArguments,
          "--input-type=module",
          "--eval",
          `import { spawnSync } from "node:child_process";
const result = spawnSync(process.execPath, [
  "--import", ${JSON.stringify(tsxLoader)}, "--input-type=module", "--eval",
  ${JSON.stringify(`import { resolveCatalogPath } from ${JSON.stringify(catalogModule)};
console.log(resolveCatalogPath({}));`)},
], { encoding: "utf8" });
process.stdout.write(result.stdout ?? "");
process.stderr.write(result.stderr ?? "");
process.exitCode = result.status ?? 1;`,
        ],
        {
          cwd: root,
          encoding: "utf8",
          timeout: 20_000,
          env: { ...gitEnvironment(), SPECDOJO_PROJECT: "prj-0002" },
        },
      );

      expect(result.error).toBeUndefined();
      expect(result.status, result.stderr).toBe(0);
      expect(result.stdout.trim()).toBe(join(root, "fixture-catalog"));
      expect(result.stderr).not.toContain("Unknown project");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
