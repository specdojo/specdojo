import { mkdirSync, mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir, homedir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { localStateDirectory } from "../../../src/shared/local-state.js";

const common = vi.hoisted(() => ({ path: "", status: 0 }));
vi.mock("node:child_process", () => ({
  spawnSync: () => ({ status: common.status, stdout: common.path }),
}));
const directories: string[] = [];
afterEach(() => {
  vi.unstubAllEnvs();
  common.status = 0;
  for (const directory of directories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});

describe("local state repository identity", () => {
  it("shares linked worktrees through the canonical Git common directory", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-local-state-"));
    directories.push(root);
    const metadata = join(root, "repo.git");
    mkdirSync(metadata);
    symlinkSync(metadata, join(root, "alias.git"));
    vi.stubEnv("XDG_STATE_HOME", join(root, "state"));
    common.path = metadata;
    const first = localStateDirectory(join(root, "worktree-one"));
    common.path = join(root, "alias.git");
    expect(localStateDirectory(join(root, "worktree-two"))).toBe(first);
    const separate = join(root, "separate.git");
    mkdirSync(separate);
    common.path = separate;
    expect(localStateDirectory(root)).not.toBe(first);
  });

  it("uses the standard home fallback for absent/relative XDG paths, and supports non-Git projects", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-local-state-"));
    directories.push(root);
    common.status = 128;
    vi.stubEnv("XDG_STATE_HOME", undefined);
    const fallback = localStateDirectory(root);
    expect(fallback.startsWith(join(homedir(), ".local", "state", "specdojo"))).toBe(true);
    vi.stubEnv("XDG_STATE_HOME", "relative-state");
    expect(localStateDirectory(root)).toBe(fallback);
  });
});
