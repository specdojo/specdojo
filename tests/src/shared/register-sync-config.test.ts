import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { isProjectSyncEnabled, loadConfig } from "../../../src/shared/specdojo-config.js";

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

describe("project sync configuration", () => {
  let root: string;

  function config(project: Record<string, unknown>): ReturnType<typeof loadConfig> {
    root = mkdtempSync(join(tmpdir(), "specdojo-sync-config-"));
    mkdirSync(join(root, ".specdojo"));
    writeFileSync(
      join(root, ".specdojo/specdojo.config.json"),
      JSON.stringify({ version: 1, projects: { example: project } }),
    );
    return loadConfig(root);
  }

  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it.each([
    { enabled: true },
    { enabled: true, remote: "team" },
    {
      enabled: true,
      branches: {
        register: { branch: "sync/example/register" },
        "exec-events": { branch: "sync/example/exec-events" },
      },
    },
    { enabled: false, branches: { register: {} } },
  ])("accepts sync settings %j", (sync) => {
    expect(config({ sync }).config?.projects.example.sync).toEqual(sync);
  });

  it.each([
    { enabled: "true" },
    { branch: "project/example/register" },
    { remote: "--all" },
    { branches: [] },
    { branches: { exec: { branch: "project/example/sync/exec" } } },
    { branches: { register: { branch: " " } } },
    { branches: { register: { branch: "a", remote: "origin" } } },
  ])("rejects malformed sync settings %j", (sync) => {
    expect(() => config({ sync })).toThrow("sync must contain only");
  });

  it("rejects sync and register_sync set together", () => {
    expect(() => config({ sync: { enabled: true }, register_sync: { enabled: true } })).toThrow(
      "sync and register_sync cannot be set together",
    );
  });

  it("treats either key as enabling synchronization", () => {
    expect(isProjectSyncEnabled({ sync: { enabled: true } })).toBe(true);
    expect(isProjectSyncEnabled({ register_sync: { enabled: true } })).toBe(true);
    expect(isProjectSyncEnabled({ sync: { enabled: false } })).toBe(false);
    expect(isProjectSyncEnabled(undefined)).toBe(false);
  });
});
