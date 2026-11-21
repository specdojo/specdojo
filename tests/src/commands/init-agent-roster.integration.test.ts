import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadExecDefaultsConfig, resolveMemberCommand } from "../../../src/exec/agent-config.js";
import { gitEnvironment } from "../../../src/shared/git-environment.js";
import {
  loadMemberRoster,
  resolveAgentMember,
  type SpecDojoConfig,
} from "../../../src/shared/specdojo-config.js";

// 空のリポジトリで実 CLI の `init --yes` と `config scaffold` を行い、配布する agent の名簿が
// 実体と別名の 2 段構成で schema と別名の検証を通ることを確かめる（PJR-8TGQ）。

// Vitest はリポジトリ直下を cwd にして実行される。
const REPO_ROOT = resolve(process.cwd());
// antigravity is not selectable since 0.9.2 (PJR-NJE4); its rejection is tested separately.
const PROVIDERS = ["claude", "codex", "opencode", "copilot"] as const;

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

function makeTempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

function createEmptyRepo(): string {
  const repo = makeTempDir("specdojo-init-roster-");
  const result = spawnSync("git", ["init", "--quiet"], {
    cwd: repo,
    encoding: "utf8",
    env: gitEnvironment(),
  });
  expect(result.status, result.stderr).toBe(0);
  writeFileSync(
    join(repo, "package.json"),
    `${JSON.stringify({ name: "fixture", private: true, scripts: {} }, null, 2)}\n`,
    "utf8",
  );
  return repo;
}

function runCli(cwd: string, args: string[]): SpawnSyncReturns<string> {
  return spawnSync(
    process.execPath,
    [
      join(REPO_ROOT, "node_modules", ".bin", "tsx"),
      join(REPO_ROOT, "src", "specdojo.ts"),
      ...args,
    ],
    {
      cwd,
      encoding: "utf8",
      env: { ...gitEnvironment(), CI: "true", LEFTHOOK: "0" },
    },
  );
}

function expectSuccess(result: SpawnSyncReturns<string>): void {
  expect(result.status, `stdout:\n${result.stdout}\nstderr:\n${result.stderr}`).toBe(0);
}

// スニペットは保護された名簿へ写して使うため、名簿として読み込んで schema と別名を検証する。
function loadAsAgentRoster(content: string): ReturnType<typeof loadMemberRoster> {
  const root = makeTempDir("specdojo-roster-snippet-");
  mkdirSync(join(root, ".specdojo"), { recursive: true });
  writeFileSync(join(root, ".specdojo", "agent-members.yaml"), content, "utf8");
  return loadMemberRoster(root, {});
}

describe("specdojo init and config scaffold agent rosters", () => {
  it(
    "generates a two-level roster whose aliases resolve to concrete members with a model",
    { timeout: 180_000 },
    () => {
      const repo = createEmptyRepo();

      expectSuccess(runCli(repo, ["init", "--yes", "--exec", "--provider", PROVIDERS.join(",")]));
      for (const provider of PROVIDERS) {
        expectSuccess(runCli(repo, ["config", "scaffold", "--provider", provider]));
      }

      const config = JSON.parse(
        readFileSync(join(repo, ".specdojo", "specdojo.config.json"), "utf8"),
      ) as SpecDojoConfig;
      const project = Object.values(config.projects)[0];
      // loadMemberRoster は agent-members.schema.yaml と別名の整合性を読み込み時に検証する。
      const roster = loadMemberRoster(repo, project);
      const defaults = loadExecDefaultsConfig(join(repo, ".specdojo", "exec-defaults.yaml"));

      expect(roster?.aliases?.map((alias) => alias.nickname)).toEqual([
        "claude-executor",
        "claude-review-executor",
        "claude-reporter",
        "claude-expert-executor",
        "claude-expert-review-executor",
        "codex-executor",
        "codex-review-executor",
        "codex-reporter",
        "codex-expert-executor",
        "codex-expert-review-executor",
        "opencode-executor",
        "opencode-review-executor",
        "opencode-reporter",
      ]);
      for (const alias of roster?.aliases ?? []) {
        const member = resolveAgentMember(roster, alias.nickname);
        expect(member?.nickname, alias.nickname).toBe(alias.alias_of);
        expect(member?.model, alias.nickname).toBeTruthy();
        expect(member?.provider, alias.nickname).not.toBe("antigravity");
        expect(resolveMemberCommand(defaults, member!)).toContain(`--model ${member!.model}`);
      }

      // claude・opencode は役割ごとの定義を mode で選ぶ。選ばれる定義が配置されていて、model を持たない。
      for (const [provider, directory] of [
        ["claude", ".claude"],
        ["opencode", ".opencode"],
      ] as const) {
        const byMode = defaults.providers?.[provider]?.command_params?.by_mode ?? {};
        expect(Object.keys(byMode).sort(), provider).toEqual(["edit", "report", "review"]);
        for (const variables of Object.values(byMode)) {
          const definitionPath = join(repo, directory, "agents", `${variables?.agent}.md`);
          expect(existsSync(definitionPath), definitionPath).toBe(true);
          expect(readFileSync(definitionPath, "utf8")).not.toMatch(/^model:/m);
        }
      }
    },
  );

  it(
    "scaffolds the copilot agent member snippet that passes schema validation",
    { timeout: 120_000 },
    () => {
      const repo = createEmptyRepo();
      expectSuccess(runCli(repo, ["config", "scaffold", "--provider", "copilot"]));

      const copilot = readFileSync(
        join(repo, ".specdojo", "copilot", "agent-members-snippet.yaml"),
        "utf8",
      );
      expect(loadAsAgentRoster(copilot)?.members.length).toBeGreaterThan(0);
    },
  );

  it(
    "rejects antigravity in init and config scaffold with the reason, without writing agy settings",
    { timeout: 120_000 },
    () => {
      const repo = createEmptyRepo();

      const init = runCli(repo, ["init", "--yes", "--exec", "--provider", "claude,antigravity"]);
      const scaffold = runCli(repo, ["config", "scaffold", "--provider", "antigravity"]);

      for (const result of [init, scaffold]) {
        expect(result.status, result.stdout).not.toBe(0);
        expect(result.stderr).toContain("do not launch Antigravity (agy)");
        expect(result.stderr).toContain("Additional Terms (Section 6)");
      }
      expect(existsSync(join(repo, ".specdojo", "antigravity"))).toBe(false);
    },
  );
});
