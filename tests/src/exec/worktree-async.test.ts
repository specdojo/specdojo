import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import type * as GitModule from "../../../src/shared/git.js";
import { gitOutput } from "../../../src/shared/git.js";
import {
  generateWorktreeArtifacts,
  installWorktreeDependencies,
} from "../../../src/exec/worktree.js";

vi.mock("../../../src/shared/git.js", async (original) => ({
  ...(await original<typeof GitModule>()),
  gitOutput: vi.fn(),
}));

const directories: string[] = [];
function fixture(): string {
  const root = mkdtempSync(join(tmpdir(), "worktree-async-"));
  directories.push(root);
  for (const dir of [root, join(root, "packages", "a")]) {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "package.json"), "{}");
  }
  vi.mocked(gitOutput).mockReturnValue("package-lock.json\0packages/a/package-lock.json\0");
  return root;
}

afterEach(() => {
  for (const root of directories.splice(0)) rmSync(root, { recursive: true, force: true });
  vi.clearAllMocks();
});

describe("asynchronous worktree preparation", () => {
  it("awaits each install in order before generating artifacts", async () => {
    const root = fixture();
    mkdirSync(join(root, ".specdojo"));
    writeFileSync(join(root, ".specdojo", "specdojo.config.json"), "{}");
    const events: string[] = [];
    let release: () => void = () => undefined;
    const firstInstall = new Promise<void>((resolve) => {
      release = resolve;
    });
    let installs = 0;
    const preparation = (async () => {
      await installWorktreeDependencies(root, async (dir) => {
        events.push(`start:${dir}`);
        if (installs++ === 0) await firstInstall;
        events.push(`end:${dir}`);
      });
      await generateWorktreeArtifacts(root, async () => {
        events.push("build");
      });
    })();
    await new Promise((resolve) => setImmediate(resolve));
    expect(events).toEqual([`start:${root}`]);
    release();
    await preparation;
    const packageDir = join(root, "packages", "a");
    expect(events).toEqual([
      `start:${root}`,
      `end:${root}`,
      `start:${packageDir}`,
      `end:${packageDir}`,
      "build",
    ]);
  });

  it("stops before subsequent installs and artifact generation on an install rejection", async () => {
    const root = fixture();
    const install = vi.fn(async () => {
      throw new Error("npm ci failed");
    });
    const build = vi.fn();
    const preparation = (async () => {
      await installWorktreeDependencies(root, install);
      await generateWorktreeArtifacts(root, build);
    })();
    await expect(preparation).rejects.toThrow("npm ci failed");
    expect(install).toHaveBeenCalledTimes(1);
    expect(build).not.toHaveBeenCalled();
  });
});
