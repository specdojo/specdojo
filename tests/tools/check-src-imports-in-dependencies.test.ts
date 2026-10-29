import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  checkSrcImportsInDependencies,
  findRuntimeImportViolations,
  formatRuntimeImportViolation,
} from "../../tools/check-src-imports-in-dependencies.mjs";

const temporaryRoots: string[] = [];

afterEach(() => {
  while (temporaryRoots.length > 0) rmSync(temporaryRoots.pop()!, { recursive: true, force: true });
});

describe("findRuntimeImportViolations", () => {
  it("accepts dependencies, peerDependencies, node: modules, and relative paths", () => {
    const source = [
      'import runtimeDefault from "runtime-dependency";',
      'export { runtimeValue } from "peer-dependency/feature";',
      'import { readFile } from "node:fs";',
      'import { localValue } from "./local.js";',
      'const dynamicallyLoaded = import("runtime-dependency/dynamic");',
      "void runtimeDefault; void readFile; void localValue; void dynamicallyLoaded;",
    ].join("\n");

    expect(
      findRuntimeImportViolations(
        source,
        "src/example.ts",
        new Set(["runtime-dependency", "peer-dependency"]),
      ),
    ).toEqual([]);
  });

  it("ignores type-only imports and exports", () => {
    const source = [
      'import type { First } from "dev-only";',
      'import { type Second } from "dev-only/subpath";',
      'export type { Third } from "dev-only";',
      'export { type Fourth } from "dev-only/subpath";',
      'type Fifth = import("dev-only").Fifth;',
    ].join("\n");

    expect(findRuntimeImportViolations(source, "src/types.ts", new Set())).toEqual([]);
  });

  it("reports packages that are available only as development dependencies", () => {
    const repositoryRoot = mkdtempSync(path.join(tmpdir(), "src-import-dependencies-"));
    temporaryRoots.push(repositoryRoot);
    const sourceRoot = path.join(repositoryRoot, "src");
    mkdirSync(sourceRoot);
    writeFileSync(
      path.join(repositoryRoot, "package.json"),
      JSON.stringify({
        dependencies: { "runtime-dependency": "1.0.0" },
        peerDependencies: { "peer-dependency": "1.0.0" },
        devDependencies: {
          "dev-only": "1.0.0",
          "@scope/dev-only": "1.0.0",
          "another-dev-only": "1.0.0",
        },
      }),
    );
    writeFileSync(
      path.join(sourceRoot, "broken.ts"),
      [
        'import runtimeDefault from "runtime-dependency";',
        'export { peerValue } from "peer-dependency/feature";',
        'import { first } from "dev-only/subpath";',
        'export { second } from "@scope/dev-only/feature";',
        'const third = import("another-dev-only");',
        "void runtimeDefault; void first; void third;",
      ].join("\n"),
    );

    expect(checkSrcImportsInDependencies({ repositoryRoot })).toEqual([
      {
        filePath: "src/broken.ts",
        line: 3,
        packageName: "dev-only",
        specifier: "dev-only/subpath",
      },
      {
        filePath: "src/broken.ts",
        line: 4,
        packageName: "@scope/dev-only",
        specifier: "@scope/dev-only/feature",
      },
      {
        filePath: "src/broken.ts",
        line: 5,
        packageName: "another-dev-only",
        specifier: "another-dev-only",
      },
    ]);
  });

  it("formats a failure with both the source file and package name", () => {
    expect(
      formatRuntimeImportViolation({
        filePath: "src/broken.ts",
        line: 4,
        packageName: "dev-only",
        specifier: "dev-only/subpath",
      }),
    ).toContain('src/broken.ts:4: package "dev-only"');
  });
});
