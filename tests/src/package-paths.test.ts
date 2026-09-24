import { readFileSync } from "node:fs";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { specdojoPackageRootDir, specdojoPackageVersion } from "../../src/package-paths.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function repositoryPackageVersion(): string {
  const parsed: unknown = JSON.parse(
    readFileSync(path.join(repositoryRoot, "package.json"), "utf8"),
  );
  if (typeof parsed === "object" && parsed !== null && "version" in parsed) {
    const version = (parsed as { version: unknown }).version;
    if (typeof version === "string") return version;
  }
  throw new Error("test fixture: package.json に version がない");
}

const originalOverride = process.env.SPECDOJO_PACKAGE_ROOT;
const temporaryRoots: string[] = [];

afterEach(() => {
  if (originalOverride === undefined) delete process.env.SPECDOJO_PACKAGE_ROOT;
  else process.env.SPECDOJO_PACKAGE_ROOT = originalOverride;
  while (temporaryRoots.length > 0) rmSync(temporaryRoots.pop()!, { recursive: true, force: true });
});

describe("specdojoPackageVersion", () => {
  it("reports the version written in the package.json of the running CLI", () => {
    expect(specdojoPackageVersion()).toBe(repositoryPackageVersion());
  });

  it("ignores SPECDOJO_PACKAGE_ROOT because that variable redirects kata, not the CLI itself", () => {
    const other = mkdtempSync(path.join(tmpdir(), "specdojo-package-root-"));
    temporaryRoots.push(other);
    process.env.SPECDOJO_PACKAGE_ROOT = other;

    // kata の解決先は差し替わるが、報告する版は実行中の CLI のものを保つ。
    expect(specdojoPackageRootDir()).toBe(other);
    expect(specdojoPackageVersion()).toBe(repositoryPackageVersion());
  });
});
