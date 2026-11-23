import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  detectHostOs,
  environmentNextSteps,
  LOCAL_TMUX_SCRIPT,
  presetIncludesTmux,
  writeLocalTmuxScript,
} from "../../../src/init/environment.js";

describe("detectHostOs", () => {
  it("tells WSL from Linux by /proc/version", () => {
    expect(detectHostOs("linux", "Linux version 6.6.87.2-microsoft-standard-WSL2")).toBe("wsl");
    expect(detectHostOs("linux", "Linux version 6.8.0-generic")).toBe("linux");
    expect(detectHostOs("darwin", undefined)).toBe("macos");
    expect(detectHostOs("win32", undefined)).toBe("windows");
  });
});

describe("presetIncludesTmux", () => {
  it("includes tmux in the recommended and full presets only", () => {
    expect(presetIncludesTmux("recommended")).toBe(true);
    expect(presetIncludesTmux("full")).toBe(true);
    expect(presetIncludesTmux("minimal")).toBe(false);
    expect(presetIncludesTmux(undefined)).toBe(false);
  });
});

describe("environmentNextSteps", () => {
  it("guides the Dev Container with tmux pattern to the host script", () => {
    const steps = environmentNextSteps({ devcontainer: true, tmux: true }, "macos");

    expect(steps[0]).toBe("Check prerequisites: npx specdojo doctor --devcontainer --tmux");
    expect(steps.join("\n")).toContain("Reopen in Container");
    expect(steps.join("\n")).toContain(".specdojo/host/devcontainer-tmux.sh");
  });

  it("guides the local tmux pattern on WSL to the local script and the Linux home", () => {
    const steps = environmentNextSteps({ devcontainer: false, tmux: true }, "wsl");

    expect(steps[0]).toBe("Check prerequisites: npx specdojo doctor --tmux");
    expect(steps.join("\n")).toContain("not /mnt/c");
    expect(steps.join("\n")).toContain(`bash ${LOCAL_TMUX_SCRIPT}`);
  });

  it("only asks to check prerequisites for the plain local pattern on macOS", () => {
    expect(environmentNextSteps({ devcontainer: false, tmux: false }, "macos")).toEqual([
      "Check prerequisites: npx specdojo doctor",
    ]);
  });
});

describe("writeLocalTmuxScript", () => {
  it("writes an executable local tmux script from the bundled template", async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), "specdojo-local-tmux-"));
    try {
      await writeLocalTmuxScript({ packageRoot: process.cwd(), repoRoot });

      const written = path.join(repoRoot, LOCAL_TMUX_SCRIPT);
      expect(await readFile(written, "utf8")).toContain("tmux new-session -d -s");
      expect((await stat(written)).mode & 0o111).not.toBe(0);
    } finally {
      await rm(repoRoot, { recursive: true, force: true });
    }
  });

  it("only reports the file in a dry run", async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), "specdojo-local-tmux-"));
    try {
      await writeLocalTmuxScript({ packageRoot: process.cwd(), repoRoot, dryRun: true });

      await expect(stat(path.join(repoRoot, LOCAL_TMUX_SCRIPT))).rejects.toThrow();
    } finally {
      await rm(repoRoot, { recursive: true, force: true });
    }
  });
});
