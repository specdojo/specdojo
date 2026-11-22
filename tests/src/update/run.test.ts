import { existsSync } from "node:fs";
import { cp, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { InstallCommand } from "../../../src/update/package-manager.js";
import { runUpdate, type UpdateDeps } from "../../../src/update/run.js";
import { writeFiles, writePackage } from "./update-fixture.js";

const NEW_CHANGELOG = [
  "# Changelog",
  "",
  "## [0.9.2] - 2026-11-21",
  "",
  "- skill `specdojo-exec-in-session` を配るようにしました。",
  "- `exec-defaults.yaml` の routing を見直してください。",
  "",
  "## [0.9.1] - 2026-11-20",
  "",
  "- 0.9.1 の変更。",
  "",
].join("\n");

let dir: string;
let repoRoot: string;
let newRoot: string;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "specdojo-update-run-"));
  repoRoot = path.join(dir, "repo");
  await writeFiles(repoRoot, {
    "package.json": `${JSON.stringify({ devDependencies: { specdojo: "^0.9.1", "@specdojo/docs-lint": "0.5.0" } })}\n`,
    "package-lock.json": "{}\n",
    ".claude/agents/specdojo-orchestrator.md": "agent v1\n",
    ".claude/rules/markdown.md": "rules v1\n",
  });
  await writePackage(path.join(repoRoot, "node_modules/specdojo"), "0.9.1", {
    "claude/agents/specdojo-orchestrator.md": "agent v1\n",
    "claude/rules/markdown.md": "rules v1\n",
  });
  await writeFiles(repoRoot, {
    "node_modules/@specdojo/docs-lint/package.json": '{"version":"0.5.0"}\n',
  });
  newRoot = await writePackage(
    path.join(dir, "new"),
    "0.9.2",
    {
      "claude/agents/specdojo-orchestrator.md": "agent v2\n",
      "claude/rules/markdown.md": "rules v2\n",
      "agent-skills/specdojo-exec-in-session/SKILL.md": "in-session\n",
    },
    NEW_CHANGELOG,
  );
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

interface FakeDeps extends UpdateDeps {
  output: string[];
  commands: InstallCommand[];
  questions: string[];
}

function fakeDeps(answers: string[] = [], overrides: Partial<UpdateDeps> = {}): FakeDeps {
  const deps: FakeDeps = {
    output: [],
    commands: [],
    questions: [],
    write(text) {
      deps.output.push(text);
    },
    resolveRegistryVersion: (name) => Promise.resolve(name === "specdojo" ? "0.9.2" : "0.5.1"),
    readTarballVersion: () => Promise.resolve("0.9.3"),
    materializePackage: async (_source, destinationDir) => {
      const root = path.join(destinationDir, "package");
      await cp(newRoot, root, { recursive: true });
      return root;
    },
    runCommand: (command) => {
      deps.commands.push(command);
      return Promise.resolve(0);
    },
    ask: (question) => {
      deps.questions.push(question);
      return Promise.resolve(answers.shift() ?? "");
    },
    isInteractiveTerminal: true,
    ...overrides,
  };
  return deps;
}

async function repoFile(relPath: string): Promise<string> {
  return readFile(path.join(repoRoot, relPath), "utf8");
}

describe("runUpdate", () => {
  it("shows the versions and the CHANGELOG sections after the installed version", async () => {
    const deps = fakeDeps(["n", "n", "n"]);

    await runUpdate({ repoRoot, dryRun: false, interactive: true }, deps);

    const output = deps.output.join("");
    expect(output).toContain("specdojo: 0.9.1 (installed) -> 0.9.2 (npm specdojo@latest)");
    expect(output).toContain("## [0.9.2] - 2026-11-21");
    expect(output).not.toContain("0.9.1 の変更");
    expect(output).toMatch(
      /Settings to review by hand[^\n]*\n {2}\[0\.9\.2\] - `exec-defaults\.yaml`/u,
    );
  });

  it("updates specdojo and installed companions keeping each spec form", async () => {
    const deps = fakeDeps(["n", "n", "n"]);

    const outcome = await runUpdate({ repoRoot, dryRun: false, interactive: true }, deps);

    expect(deps.commands).toEqual([
      {
        command: "npm",
        args: ["install", "--save-dev", "--save-exact", "@specdojo/docs-lint@0.5.1"],
      },
      { command: "npm", args: ["install", "--save-dev", "specdojo@^0.9.2"] },
    ]);
    expect(outcome.changedFiles).toEqual(["package.json", "package-lock.json"]);
    expect(deps.output.join("")).toContain("commit them yourself");
  });

  it("applies, skips, and applies all remaining files as answered", async () => {
    const deps = fakeDeps(["n", "a"]);

    const outcome = await runUpdate({ repoRoot, dryRun: false, interactive: true }, deps);

    expect(deps.questions).toHaveLength(2);
    expect(outcome.applied).toEqual([
      ".claude/agents/specdojo-orchestrator.md",
      ".claude/rules/markdown.md",
    ]);
    expect(
      existsSync(path.join(repoRoot, ".agents/skills/specdojo-exec-in-session/SKILL.md")),
    ).toBe(false);
    expect(await repoFile(".claude/agents/specdojo-orchestrator.md")).toBe("agent v2\n");
    expect(await repoFile(".claude/rules/markdown.md")).toBe("rules v2\n");
  });

  it("shows the diff and related CHANGELOG lines before asking", async () => {
    const deps = fakeDeps(["y", "n", "n"]);

    await runUpdate({ repoRoot, dryRun: false, interactive: true }, deps);

    const beforeFirstQuestion = deps.output.join("").split("Applied:")[0];
    expect(beforeFirstQuestion).toContain("+in-session");
    expect(beforeFirstQuestion).toContain(
      "[0.9.2] - skill `specdojo-exec-in-session` を配るようにしました。",
    );
    expect(await repoFile(".agents/skills/specdojo-exec-in-session/SKILL.md")).toBe("in-session\n");
  });

  it("asks before overwriting a locally edited file", async () => {
    await writeFiles(repoRoot, { ".claude/rules/markdown.md": "rules v1 with my edit\n" });
    const deps = fakeDeps(["n", "n", "n"]);

    await runUpdate({ repoRoot, dryRun: false, interactive: true }, deps);

    expect(deps.output.join("")).toContain(
      ".claude/rules/markdown.md (claude; edited locally; applying overwrites your edits)",
    );
    expect(await repoFile(".claude/rules/markdown.md")).toBe("rules v1 with my edit\n");
  });

  it("only lists candidates without rewriting when stdin is not a terminal", async () => {
    const deps = fakeDeps([], { isInteractiveTerminal: false });

    const outcome = await runUpdate({ repoRoot, dryRun: false, interactive: true }, deps);

    expect(deps.questions).toEqual([]);
    expect(outcome.applied).toEqual([]);
    expect(await repoFile(".claude/agents/specdojo-orchestrator.md")).toBe("agent v1\n");
    expect(deps.output.join("")).toContain(
      "npx specdojo config scaffold --provider claude --force",
    );
  });

  it("only lists candidates with --no-interactive", async () => {
    const deps = fakeDeps();

    await runUpdate({ repoRoot, dryRun: false, interactive: false }, deps);

    expect(deps.questions).toEqual([]);
    expect(await repoFile(".claude/rules/markdown.md")).toBe("rules v1\n");
  });

  it("changes nothing with --dry-run and shows the commands it would run", async () => {
    const before = await repoFile("package.json");
    const deps = fakeDeps(["a"]);

    const outcome = await runUpdate({ repoRoot, dryRun: true, interactive: true }, deps);

    expect(deps.commands).toEqual([]);
    expect(deps.questions).toEqual([]);
    expect(outcome.changedFiles).toEqual([]);
    expect(await repoFile("package.json")).toBe(before);
    expect(await repoFile(".claude/agents/specdojo-orchestrator.md")).toBe("agent v1\n");
    expect(deps.output.join("")).toContain(
      "[dry-run] would run: npm install --save-dev specdojo@^0.9.2",
    );
  });

  it("skips the version update at the same version and still checks distributed files", async () => {
    const deps = fakeDeps([], {
      resolveRegistryVersion: () => Promise.resolve("0.9.1"),
      isInteractiveTerminal: false,
    });
    await writeFiles(repoRoot, { ".claude/rules/markdown.md": "rules edited\n" });

    const outcome = await runUpdate({ repoRoot, dryRun: false, interactive: true }, deps);

    expect(outcome.updated).toBe(false);
    expect(deps.commands).toEqual([]);
    expect(outcome.candidates.map((candidate) => candidate.entry.destinationRelPath)).toEqual([
      ".claude/rules/markdown.md",
    ]);
  });

  it("installs from a tarball path given to --to", async () => {
    await writeFiles(dir, { "specdojo-0.9.3.tgz": "" });
    const deps = fakeDeps(["n", "n", "n"]);

    const outcome = await runUpdate(
      { repoRoot, to: "../specdojo-0.9.3.tgz", dryRun: false, interactive: true },
      deps,
    );

    expect(outcome.targetVersion).toBe("0.9.3");
    expect(deps.commands).toContainEqual({
      command: "npm",
      args: ["install", "--save-dev", path.join(dir, "specdojo-0.9.3.tgz")],
    });
  });

  it("stops with the command when the package manager fails", async () => {
    const deps = fakeDeps([], { runCommand: () => Promise.resolve(1) });

    await expect(runUpdate({ repoRoot, dryRun: false, interactive: true }, deps)).rejects.toThrow(
      /exit code 1: npm install/u,
    );
  });
});
