import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

type RunResult = { outcome: string };
type RunScript = (
  command: string,
  args: string[],
  options: { cwd: string; stdio: string; shell: boolean },
) => { status: number | null; error?: Error };
type RunBuildIfStale = (
  repoRoot: string,
  options?: { runScript?: RunScript; reportMessage?: (message: string) => void },
) => RunResult;

const fixtures: string[] = [];
let runBuildIfStale: RunBuildIfStale;

beforeAll(async () => {
  const moduleUrl = pathToFileURL(path.resolve("tools/build-if-stale.mjs")).href;
  const entryModule = (await import(moduleUrl)) as { runBuildIfStale: RunBuildIfStale };
  runBuildIfStale = entryModule.runBuildIfStale;
});

function createFixture(gitEntry: "directory" | "file", hasTsx = false): string {
  const root = mkdtempSync(path.join(tmpdir(), "specdojo-build-if-stale-"));
  fixtures.push(root);
  if (gitEntry === "directory") {
    mkdirSync(path.join(root, ".git"));
  } else {
    writeFileSync(path.join(root, ".git"), "gitdir: /tmp/example\n", "utf8");
  }
  if (hasTsx) {
    const tsxCli = path.join(root, "node_modules", "tsx", "dist", "cli.mjs");
    mkdirSync(path.dirname(tsxCli), { recursive: true });
    writeFileSync(tsxCli, "// fixture\n", "utf8");
  }
  return root;
}

afterEach(() => {
  for (const root of fixtures.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("tools/build-if-stale.mjs", () => {
  it("skips a linked worktree before checking node_modules", () => {
    const root = createFixture("file");
    const runScript = vi.fn<RunScript>();
    const reportMessage = vi.fn();

    const result = runBuildIfStale(root, { runScript, reportMessage });

    expect(result.outcome).toBe("not-primary-worktree");
    expect(runScript).not.toHaveBeenCalled();
    expect(reportMessage).not.toHaveBeenCalled();
  });

  it("skips successfully in the primary worktree when tsx is not installed", () => {
    const root = createFixture("directory");
    const runScript = vi.fn<RunScript>();
    const messages: string[] = [];

    const result = runBuildIfStale(root, {
      runScript,
      reportMessage: (message) => messages.push(message),
    });

    expect(result.outcome).toBe("dependency-missing");
    expect(runScript).not.toHaveBeenCalled();
    expect(messages.join("\n")).toContain("tsx が未インストール");
  });

  it("delegates to the existing TypeScript implementation in the primary worktree", () => {
    const root = createFixture("directory", true);
    const runScript = vi.fn<RunScript>(() => ({ status: 0 }));

    const result = runBuildIfStale(root, { runScript });

    expect(result.outcome).toBe("delegated");
    expect(runScript).toHaveBeenCalledWith(
      process.execPath,
      [
        path.join(root, "node_modules", "tsx", "dist", "cli.mjs"),
        path.join(root, "src", "build-if-stale.ts"),
      ],
      { cwd: root, stdio: "inherit", shell: false },
    );
  });

  it("reports delegation failure without throwing", () => {
    const root = createFixture("directory", true);
    const messages: string[] = [];

    const result = runBuildIfStale(root, {
      runScript: () => ({ status: 7 }),
      reportMessage: (message) => messages.push(message),
    });

    expect(result.outcome).toBe("delegation-failed");
    expect(messages.join("\n")).toContain("終了コード 7");
  });
});
