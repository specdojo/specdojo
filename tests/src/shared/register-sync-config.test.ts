import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadConfig } from "../../../src/shared/specdojo-config.js";

describe("project register_sync configuration", () => {
  let root: string;

  function config(sync: unknown): ReturnType<typeof loadConfig> {
    root = mkdtempSync(join(tmpdir(), "specdojo-register-sync-config-"));
    mkdirSync(join(root, ".specdojo"));
    writeFileSync(
      join(root, ".specdojo/specdojo.config.json"),
      JSON.stringify({
        version: 1,
        projects: { example: { register_sync: sync } },
      }),
    );
    return loadConfig(root);
  }

  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it.each([
    undefined,
    {},
    { enabled: false },
    { enabled: true },
    { enabled: true, branch: "bookkeeping/example", remote: "team" },
  ])("accepts optional synchronization settings %j", (sync) => {
    expect(config(sync).config?.projects.example.register_sync).toEqual(sync);
  });

  it.each([
    null,
    [],
    true,
    "origin",
    { enabled: "true" },
    { enabled: null },
    { branch: " " },
    { remote: "" },
    { remote: "--all" },
    { remote: "https://example.invalid" },
    { unknown: true },
  ])("rejects malformed synchronization settings %j", (sync) => {
    expect(() => config(sync)).toThrow("register_sync");
  });
});
