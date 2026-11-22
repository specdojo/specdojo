import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  applyDriftCandidate,
  changelogTermsForPath,
  collectDriftCandidates,
  detectProvidersInUse,
  snapshotScaffoldSources,
  unifiedDiff,
} from "../../../src/update/scaffold-drift.js";
import { writeFiles, writePackage } from "./update-fixture.js";

let dir: string;
let oldRoot: string;
let newRoot: string;
let repoRoot: string;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "specdojo-update-drift-"));
  oldRoot = await writePackage(path.join(dir, "old"), "0.9.1", {
    "claude/agents/specdojo-orchestrator.md": "old agent\n",
    "claude/rules/markdown.md": "rules v1\n",
    "codex/orchestrator.md": "codex\n",
    "agent-skills/specdojo-register/SKILL.md": "register skill v1\n",
  });
  newRoot = await writePackage(path.join(dir, "new"), "0.9.2", {
    "claude/agents/specdojo-orchestrator.md": "new agent\n",
    "claude/rules/markdown.md": "rules v2\n",
    "codex/orchestrator.md": "codex\n",
    "agent-skills/specdojo-register/SKILL.md": "register skill v1\n",
    "agent-skills/specdojo-exec-in-session/SKILL.md": "in-session skill\n",
  });
  repoRoot = path.join(dir, "repo");
  await writeFiles(repoRoot, {
    ".claude/agents/specdojo-orchestrator.md": "old agent\n",
    ".claude/rules/markdown.md": "rules v1 with my edit\n",
    ".agents/skills/specdojo-register/SKILL.md": "register skill v1\n",
  });
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("detectProvidersInUse", () => {
  it("returns providers whose own files exist, ignoring shared skills", async () => {
    expect(await detectProvidersInUse({ packageRoot: newRoot, repoRoot })).toEqual(["claude"]);
  });
});

describe("collectDriftCandidates", () => {
  it("labels stale copies, local edits, and files new in the target version", async () => {
    const previousSources = await snapshotScaffoldSources({
      packageRoot: oldRoot,
      repoRoot,
      providers: ["claude"],
    });

    const candidates = await collectDriftCandidates({
      packageRoot: newRoot,
      repoRoot,
      providers: ["claude"],
      previousSources,
    });

    expect(
      candidates.map((candidate) => [
        candidate.entry.destinationRelPath,
        candidate.kind,
        candidate.origin,
      ]),
    ).toEqual([
      [".agents/skills/specdojo-exec-in-session/SKILL.md", "missing", "new-file"],
      [".claude/agents/specdojo-orchestrator.md", "changed", "stale"],
      [".claude/rules/markdown.md", "changed", "modified"],
    ]);
  });

  it("does not propose files the user deleted that the previous version also shipped", async () => {
    await rm(path.join(repoRoot, ".agents/skills/specdojo-register/SKILL.md"));
    const previousSources = await snapshotScaffoldSources({
      packageRoot: oldRoot,
      repoRoot,
      providers: ["claude"],
    });

    const candidates = await collectDriftCandidates({
      packageRoot: newRoot,
      repoRoot,
      providers: ["claude"],
      previousSources,
    });

    expect(candidates.map((candidate) => candidate.entry.destinationRelPath)).not.toContain(
      ".agents/skills/specdojo-register/SKILL.md",
    );
  });

  it("proposes missing files when the previous version is unknown", async () => {
    await rm(path.join(repoRoot, ".agents/skills/specdojo-register/SKILL.md"));

    const candidates = await collectDriftCandidates({
      packageRoot: newRoot,
      repoRoot,
      providers: ["claude"],
    });

    expect(
      candidates
        .filter((candidate) => candidate.kind === "missing")
        .map((candidate) => [candidate.entry.destinationRelPath, candidate.origin]),
    ).toEqual([
      [".agents/skills/specdojo-exec-in-session/SKILL.md", "unknown"],
      [".agents/skills/specdojo-register/SKILL.md", "unknown"],
    ]);
  });

  it("writes the new version's file when a candidate is applied", async () => {
    const [candidate] = await collectDriftCandidates({
      packageRoot: newRoot,
      repoRoot,
      providers: ["claude"],
    });

    await applyDriftCandidate(candidate);

    expect(await readFile(candidate.entry.destinationPath, "utf8")).toBe("in-session skill\n");
  });
});

describe("unifiedDiff", () => {
  it("shows removed and added lines with context", () => {
    const diff = unifiedDiff("a\nb\nc\n", "a\nB\nc\n", { before: "x", after: "y" });

    expect(diff).toBe("--- x\n+++ y\n@@ -1,3 +1,3 @@\n a\n-b\n+B\n c\n");
  });

  it("returns an empty string for identical text", () => {
    expect(unifiedDiff("a\n", "a\n", { before: "x", after: "y" })).toBe("");
  });
});

describe("changelogTermsForPath", () => {
  it("uses the path and its specific parts, not generic directory names", () => {
    expect(changelogTermsForPath(".claude/skills/specdojo-exec-in-session/SKILL.md")).toEqual([
      ".claude/skills/specdojo-exec-in-session/SKILL.md",
      "specdojo-exec-in-session",
    ]);
  });
});
