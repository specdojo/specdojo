import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { gitEnvironment } from "../../src/git-environment.js";

const scriptPath = path.resolve("tools/src-move-codemod.mjs");
const fixtures: string[] = [];

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, {
    cwd,
    env: gitEnvironment(),
    encoding: "utf8",
  }).trim();
}

function writeFixtureFile(repo: string, filePath: string, contents: string): void {
  const absolutePath = path.join(repo, filePath);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, contents, "utf8");
}

function createFixture(): { root: string; repo: string; mappingPath: string } {
  const root = mkdtempSync(path.join(tmpdir(), "specdojo-src-move-"));
  fixtures.push(root);
  const repo = path.join(root, "repo");
  const mappingPath = path.join(root, "moves.json");
  mkdirSync(repo);
  git(repo, "init", "--initial-branch=main");

  writeFixtureFile(
    repo,
    "src/alpha.ts",
    [
      'import { shared } from "./shared.js";',
      "export const location = import.meta.url;",
      "export const alpha = shared;",
      "",
    ].join("\n"),
  );
  writeFixtureFile(repo, "src/beta.ts", "export const beta = 2;\n");
  writeFixtureFile(repo, "src/legacy.ts", "export const legacy = 3;\n");
  writeFixtureFile(repo, "src/shared.ts", "export const shared = 1;\n");
  writeFixtureFile(
    repo,
    "src/consumer.ts",
    [
      'import { alpha } from "./alpha.js";',
      'export { beta } from "./beta.js";',
      'export const load = () => import("./alpha.js");',
      'vi.mock("./beta.js");',
      "export { alpha };",
      "",
    ].join("\n"),
  );
  writeFixtureFile(
    repo,
    "tests/src/alpha.test.ts",
    'import { alpha } from "../../src/alpha.js";\nvoid alpha;\n',
  );
  writeFixtureFile(
    repo,
    "tests/src/beta.integration.test.ts",
    'import { beta } from "../../src/beta.js";\nvoid beta;\n',
  );
  writeFixtureFile(
    repo,
    "tests/legacy.test.ts",
    'import { legacy } from "../src/legacy.js";\nvoid legacy;\n',
  );
  writeFixtureFile(
    repo,
    "tools/check.ts",
    'import { alpha } from "../src/alpha.js";\nvoid alpha;\n',
  );
  writeFixtureFile(repo, "docs/guide.md", "See `src/alpha.ts` and `dist/alpha.js`.\n");
  writeFixtureFile(
    repo,
    "docs/ja/projects/example/controls/project-register/history.md",
    "Historical `src/alpha.ts` and `dist/alpha.js`.\n",
  );
  writeFixtureFile(
    repo,
    "docs/ja/projects/example/execution/results/result.md",
    "Execution record `src/alpha.ts` and `dist/alpha.js`.\n",
  );
  writeFixtureFile(repo, "logs/previous.log", "Logged `src/alpha.ts` and `dist/alpha.js`.\n");
  git(repo, "add", ".");
  git(repo, "commit", "-m", "fixture");

  writeFileSync(
    mappingPath,
    `${JSON.stringify({
      "src/alpha.ts": "src/feature/alpha.ts",
      "src/beta.ts": "src/feature/renamed.ts",
      "src/legacy.ts": "src/feature/legacy.ts",
    })}\n`,
    "utf8",
  );
  return { root, repo, mappingPath };
}

function runCodemod(repo: string, mappingPath: string, ...args: string[]): string {
  return execFileSync(process.execPath, [scriptPath, ...args, mappingPath], {
    cwd: repo,
    env: gitEnvironment(),
    encoding: "utf8",
  });
}

afterEach(() => {
  for (const root of fixtures.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("tools/src-move-codemod.mjs", () => {
  it("dry-runs and then moves sources and matching tests while rewriting imports", () => {
    const { repo, mappingPath } = createFixture();

    const dryRunOutput = runCodemod(repo, mappingPath, "--dry-run");

    expect(dryRunOutput).toContain("DRY RUN: no files will be changed");
    expect(dryRunOutput).toContain("MOVE src/alpha.ts -> src/feature/alpha.ts");
    expect(dryRunOutput).toContain(
      "MOVE tests/src/beta.integration.test.ts -> tests/src/feature/renamed.integration.test.ts",
    );
    expect(dryRunOutput).toContain("MOVE tests/legacy.test.ts -> tests/src/feature/legacy.test.ts");
    expect(dryRunOutput).toContain("DETECT path-construction src/feature/alpha.ts:2");
    expect(dryRunOutput).toContain("DETECT literal-path docs/guide.md:1");
    expect(dryRunOutput).not.toContain("controls/project-register/history.md");
    expect(dryRunOutput).not.toContain("execution/results/result.md");
    expect(dryRunOutput).not.toContain("logs/previous.log");
    expect(git(repo, "status", "--short")).toBe("");

    const output = runCodemod(repo, mappingPath);

    expect(output).toContain("NEXT run npm run build");
    expect(readFileSync(path.join(repo, "src/feature/alpha.ts"), "utf8")).toContain(
      'from "../shared.js"',
    );
    expect(readFileSync(path.join(repo, "src/consumer.ts"), "utf8")).toContain(
      'from "./feature/alpha.js"',
    );
    expect(readFileSync(path.join(repo, "src/consumer.ts"), "utf8")).toContain(
      'from "./feature/renamed.js"',
    );
    expect(readFileSync(path.join(repo, "src/consumer.ts"), "utf8")).toContain(
      'import("./feature/alpha.js")',
    );
    expect(readFileSync(path.join(repo, "src/consumer.ts"), "utf8")).toContain(
      'vi.mock("./feature/renamed.js")',
    );
    expect(readFileSync(path.join(repo, "tests/src/feature/alpha.test.ts"), "utf8")).toContain(
      'from "../../../src/feature/alpha.js"',
    );
    expect(
      readFileSync(path.join(repo, "tests/src/feature/renamed.integration.test.ts"), "utf8"),
    ).toContain('from "../../../src/feature/renamed.js"');
    expect(readFileSync(path.join(repo, "tests/src/feature/legacy.test.ts"), "utf8")).toContain(
      'from "../../../src/feature/legacy.js"',
    );
    expect(readFileSync(path.join(repo, "tools/check.ts"), "utf8")).toContain(
      'from "../src/feature/alpha.js"',
    );
    expect(git(repo, "status", "--short")).toContain("src/alpha.ts -> src/feature/alpha.ts");
  });

  it("refuses to run when the worktree has uncommitted changes", () => {
    const { repo, mappingPath } = createFixture();
    writeFixtureFile(repo, "src/dirty.ts", "export const dirty = true;\n");

    const result = spawnSync(process.execPath, [scriptPath, mappingPath], {
      cwd: repo,
      env: gitEnvironment(),
      encoding: "utf8",
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("worktree is not clean");
    expect(git(repo, "status", "--short")).toContain("?? src/dirty.ts");
  });
});
