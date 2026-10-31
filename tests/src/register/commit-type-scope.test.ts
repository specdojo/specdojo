import { afterEach, describe, expect, it, vi } from "vitest";
import { Command } from "commander";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  readRegisterItemContent,
  registerItemFieldsFromItem,
  resolveItemCommitTypeAndScope,
} from "../../../src/register/item.js";
import { registerRegisterCommands } from "../../../src/register/register.js";
import {
  readRegisterEventsFromContent,
  registerEventFilePath,
} from "../../../src/register/events.js";
import { rebuildRegisterTicketFromEvents } from "../../../src/register/event-merge.js";
import { loadConfig } from "../../../src/shared/specdojo-config.js";

const REGISTER_REL = "docs/ja/projects/prj-0001/controls/project-register";

const CONFIG = {
  version: 1,
  current_project: "prj-0001",
  kata_authority: "customer",
  projects: {
    "prj-0001": {
      base_path: "docs/ja/projects/prj-0001",
      catalog_path: "010-deliverables-catalog",
      schedule_path: "schedule",
      execution_path: "execution",
      members_path: "030-project-management/pm-members.yaml",
      project_register_path: "controls/project-register",
      run: { register_date_timezone: "UTC" },
    },
  },
};

type Fixture = { root: string; registerDir: string };

function readEvents(registerDir: string, id: string) {
  const path = registerEventFilePath(registerDir, id);
  return readRegisterEventsFromContent(readFileSync(path, "utf8"), path);
}

function writeActorRosters(root: string): void {
  const humanPath = join(root, "docs/ja/projects/prj-0001/030-project-management/pm-members.yaml");
  mkdirSync(join(root, "docs/ja/projects/prj-0001/030-project-management"), {
    recursive: true,
  });
  writeFileSync(
    humanPath,
    [
      "id: prj-0001:pm-members",
      "type: project",
      "status: ready",
      "title: Test members",
      "rulebook: specdojo:pm-members-rulebook",
      "version: 1",
      "project_id: prj-0001",
      "members:",
      "  - nickname: po",
      "    display_name: Project Owner",
      "    roles: [PO]",
      "    type: human",
      "",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(
    join(root, ".specdojo/agent-members.yaml"),
    [
      "version: 1",
      "members:",
      "  - nickname: codex",
      "    display_name: Codex",
      "    roles: []",
      "    type: agent",
      "    provider: codex",
      "    capabilities: []",
      "    proficiency: normal",
      "    priority: 1",
      "",
    ].join("\n"),
    "utf8",
  );
}

function withRepo(
  fn: (fixture: Fixture) => Promise<void> | void,
  opts: { config?: unknown; copyTemplates?: boolean } = {},
): Promise<void> {
  const originalCwd = process.cwd();
  const root = mkdtempSync(join(tmpdir(), "specdojo-register-commit-type-"));
  return (async () => {
    try {
      mkdirSync(join(root, ".specdojo"), { recursive: true });
      writeFileSync(
        join(root, ".specdojo/specdojo.config.json"),
        `${JSON.stringify(opts.config ?? CONFIG, null, 2)}\n`,
        "utf8",
      );
      writeActorRosters(root);
      const registerDir = join(root, REGISTER_REL);
      mkdirSync(registerDir, { recursive: true });
      if (opts.copyTemplates !== false) {
        cpSync(
          join(originalCwd, "docs/ja/specdojo/templates"),
          join(root, "docs/ja/specdojo/templates"),
          { recursive: true },
        );
      }
      process.chdir(root);
      await fn({ root, registerDir });
    } finally {
      process.chdir(originalCwd);
      rmSync(root, { recursive: true, force: true });
    }
  })();
}

async function runRegister(args: string[]): Promise<void> {
  const program = new Command();
  program.exitOverride();
  registerRegisterCommands(program);
  await program.parseAsync(["register", ...args], { from: "user" });
}

describe("resolveItemCommitTypeAndScope", () => {
  it("指定がないときは項目の type から既定の commit type を決定する", () => {
    expect(resolveItemCommitTypeAndScope({ type: "issue" })).toEqual({ type: "fix" });
    expect(resolveItemCommitTypeAndScope({ type: "todo" })).toEqual({ type: "feat" });
    expect(resolveItemCommitTypeAndScope({ type: "change-request" })).toEqual({ type: "feat" });
    expect(resolveItemCommitTypeAndScope({ type: "decision" })).toEqual({ type: "docs" });
    expect(resolveItemCommitTypeAndScope({ type: "note" })).toEqual({ type: "docs" });
    expect(resolveItemCommitTypeAndScope({ type: "question" })).toEqual({ type: "docs" });
    expect(resolveItemCommitTypeAndScope({ type: "risk" })).toEqual({ type: "docs" });
    expect(resolveItemCommitTypeAndScope({ type: "epic" })).toEqual({ type: "feat" });
  });

  it.each(["unknown-type", "toString", "constructor", "__proto__"])(
    "未知の type %s には chore を既定フォールバックとする",
    (type) => {
      expect(resolveItemCommitTypeAndScope({ type })).toEqual({ type: "chore" });
    },
  );

  it("個票に commitType / commitScope が指定されていればそれを最優先とする", () => {
    const result = resolveItemCommitTypeAndScope({
      type: "todo",
      commitType: "refactor",
      commitScope: "core",
    });
    expect(result).toEqual({ type: "refactor", scope: "core" });
  });

  it("プロジェクト設定 (projectConfig.commit_types) で既定の対応を上書きできる", () => {
    const projectConfig = {
      commit_types: {
        todo: "chore",
        issue: "fix",
      },
    };
    const result = resolveItemCommitTypeAndScope({ type: "todo" }, { projectConfig });
    expect(result).toEqual({ type: "chore" });
  });

  it("リポジトリ設定 (repoConfig.commit_types) はプロジェクト設定より優先される", () => {
    const projectConfig = {
      commit_types: {
        todo: "chore",
      },
    };
    const repoConfig = {
      commit_types: {
        todo: "perf",
      },
    };
    const result = resolveItemCommitTypeAndScope({ type: "todo" }, { projectConfig, repoConfig });
    expect(result).toEqual({ type: "perf" });
  });

  it("設定のないキーはプロジェクト設定、既定値の順に補完し、scope のみの指定も保持する", () => {
    const options = {
      projectConfig: { commit_types: { issue: "perf" } },
      repoConfig: { commit_types: { todo: "chore" } },
    };
    expect(
      resolveItemCommitTypeAndScope({ type: "issue", commitScope: "parser" }, options),
    ).toEqual({ type: "perf", scope: "parser" });
    expect(resolveItemCommitTypeAndScope({ type: "note" }, options)).toEqual({ type: "docs" });
  });

  it("個票の commitType 指定はリポジトリ設定・プロジェクト設定よりも優先される", () => {
    const projectConfig = { commit_types: { todo: "chore" } };
    const repoConfig = { commit_types: { todo: "perf" } };
    const result = resolveItemCommitTypeAndScope(
      { type: "todo", commitType: "docs", commitScope: "guide" },
      { projectConfig, repoConfig },
    );
    expect(result).toEqual({ type: "docs", scope: "guide" });
  });

  it("commitScope が未指定または空白の場合は scope を含めない", () => {
    expect(resolveItemCommitTypeAndScope({ type: "issue", commitScope: "" })).toEqual({
      type: "fix",
    });
    expect(resolveItemCommitTypeAndScope({ type: "issue", commitScope: "   " })).toEqual({
      type: "fix",
    });
  });
});

describe("commit_types 設定の読み込み", () => {
  it("project と repo の対応を loadConfig で読み込み、共通関数から利用できる", async () => {
    await withRepo(
      ({ root }) => {
        const config = structuredClone(CONFIG);
        const project = {
          ...config.projects["prj-0001"],
          commit_types: { issue: "perf", todo: "chore" },
          repos: [{ name: "app", path: "app", commit_types: { todo: "docs" } }],
        };
        mkdirSync(join(root, "app"));
        writeFileSync(
          join(root, ".specdojo/specdojo.config.json"),
          JSON.stringify({
            ...config,
            projects: { "prj-0001": project },
          }),
        );
        const loaded = loadConfig(root).config!.projects["prj-0001"];
        expect(
          resolveItemCommitTypeAndScope(
            { type: "todo" },
            {
              projectConfig: loaded,
              repoConfig: loaded.repos![0],
            },
          ),
        ).toEqual({ type: "docs" });
        expect(
          resolveItemCommitTypeAndScope(
            { type: "issue" },
            {
              projectConfig: loaded,
              repoConfig: loaded.repos![0],
            },
          ),
        ).toEqual({ type: "perf" });
      },
      { copyTemplates: false },
    );
  });

  for (const level of ["project", "repo"] as const) {
    it.each([null, [], "feat", { todo: "bugfix" }, { todo: "" }, { todo: 1 }])(
      `${level} の不正な commit_types %j を拒否する`,
      async (commitTypes) => {
        await withRepo(
          ({ root }) => {
            mkdirSync(join(root, "app"));
            const project = {
              ...CONFIG.projects["prj-0001"],
              ...(level === "project"
                ? { commit_types: commitTypes }
                : {
                    repos: [{ name: "app", path: "app", commit_types: commitTypes }],
                  }),
            };
            writeFileSync(
              join(root, ".specdojo/specdojo.config.json"),
              JSON.stringify({
                ...CONFIG,
                projects: { "prj-0001": project },
              }),
            );
            expect(() => loadConfig(root)).toThrow(/commit_types/);
          },
          { copyTemplates: false },
        );
      },
    );
  }
});

describe("個票 frontmatter の commit_type / commit_scope の読み書き", () => {
  it("readRegisterItemContent で commit_type と commit_scope を読み取る", () => {
    const content = [
      "---",
      "specdojo:",
      "  id: prj-0001:pjr-ab12-topic",
      "  type: project",
      "  status: draft",
      "  rulebook: specdojo:pjr-rulebook",
      "  part_of: [prj-0001:pjr-index]",
      "  item_type: todo",
      "  commit_type: feat",
      "  commit_scope: cli",
      "---",
      "",
      "# PJR-AB12 テスト題名",
      "",
      "## 1. 概要",
      "",
      "概要説明",
    ].join("\n");

    const parsed = readRegisterItemContent(content, "pjr-ab12-topic.md");
    expect(parsed?.item.commitType).toBe("feat");
    expect(parsed?.item.commitScope).toBe("cli");
  });

  it("registerItemFieldsFromItem で commit_type と commit_scope を出力する", () => {
    const item = {
      id: "PJR-AB12",
      type: "todo",
      status: "open",
      title: "題名",
      description: "説明",
      priority: "medium",
      owner: "DEV",
      registeredAt: "2026-08-01T00:00:00Z",
      due: "-",
      completedAt: "-",
      conclusion: "-",
      ticket: "-",
      commitType: "fix",
      commitScope: "parser",
    };

    const fields = registerItemFieldsFromItem(item);
    expect(fields.commit_type).toBe("fix");
    expect(fields.commit_scope).toBe("parser");
  });
});

describe("register CLI — commit_type と commit_scope の操作", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  it("register add で --commit-type と --commit-scope を指定できる", async () => {
    await withRepo(async ({ registerDir }) => {
      vi.spyOn(process.stdout, "write").mockReturnValue(true);
      await runRegister([
        "add",
        "--type",
        "todo",
        "--id",
        "PJR-AB12",
        "--topic",
        "topic",
        "--title",
        "テスト項目",
        "--commit-type",
        "feat",
        "--commit-scope",
        "core",
      ]);

      const ticketPath = join(registerDir, "pjr-ab12-topic.md");
      const content = readFileSync(ticketPath, "utf8");
      const parsed = readRegisterItemContent(content, "pjr-ab12-topic.md");
      expect(parsed?.item.commitType).toBe("feat");
      expect(parsed?.item.commitScope).toBe("core");

      const events = readEvents(registerDir, "PJR-AB12");
      expect(events[0].changes).toContainEqual({
        field: "commit_type",
        from: "",
        to: "feat",
      });
      expect(events[0].changes).toContainEqual({
        field: "commit_scope",
        from: "",
        to: "core",
      });
    });
  });

  it.each(["invalid-type", "", "-"])(
    "register add で不正な --commit-type %j はエラーになる",
    async (value) => {
      await withRepo(async () => {
        vi.spyOn(process.stdout, "write").mockReturnValue(true);
        const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);
        await runRegister([
          "add",
          "--type",
          "todo",
          "--id",
          "PJR-AB12",
          "--topic",
          "topic",
          "--title",
          "不正typeテスト",
          "--commit-type",
          value,
        ]);
        expect(process.exitCode).toBe(1);
        expect(String(stderr.mock.calls.at(-1)?.[0])).toContain("Invalid commit type");
      });
    },
  );

  it.each(["INVALID SCOPE!", "", "   ", "-", "core\nparser"])(
    "register add で不正な --commit-scope %j はエラーになる",
    async (value) => {
      await withRepo(async () => {
        vi.spyOn(process.stdout, "write").mockReturnValue(true);
        const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);
        await runRegister([
          "add",
          "--type",
          "todo",
          "--id",
          "PJR-AB12",
          "--topic",
          "topic",
          "--title",
          "不正scopeテスト",
          "--commit-scope",
          value,
        ]);
        expect(process.exitCode).toBe(1);
        expect(String(stderr.mock.calls.at(-1)?.[0])).toContain("Invalid commit scope");
      });
    },
  );

  it("register update で --commit-type と --commit-scope を更新および - で消去できる", async () => {
    await withRepo(async ({ registerDir }) => {
      vi.spyOn(process.stdout, "write").mockReturnValue(true);
      await runRegister([
        "add",
        "--type",
        "todo",
        "--id",
        "PJR-AB12",
        "--topic",
        "topic",
        "--title",
        "テスト項目",
      ]);

      const ticketPath = join(registerDir, "pjr-ab12-topic.md");

      const ticketFilename = "pjr-ab12-topic.md";
      const initial = readRegisterItemContent(
        readFileSync(ticketPath, "utf8"),
        ticketFilename,
      )!.item;
      expect(initial.commitType).toBeUndefined();
      expect(initial.commitScope).toBeUndefined();
      expect(resolveItemCommitTypeAndScope(initial)).toEqual({ type: "feat" });

      // update で追加
      await runRegister([
        "update",
        "--id",
        "PJR-AB12",
        "--commit-type",
        "fix",
        "--commit-scope",
        "cli-parser",
      ]);

      let content = readFileSync(ticketPath, "utf8");
      let parsed = readRegisterItemContent(content, "pjr-ab12-topic.md");
      expect(parsed?.item.commitType).toBe("fix");
      expect(parsed?.item.commitScope).toBe("cli-parser");

      let events = readEvents(registerDir, "PJR-AB12");
      expect(events.at(-1)?.changes).toContainEqual({
        field: "commit_type",
        from: "-",
        to: "fix",
      });
      expect(events.at(-1)?.changes).toContainEqual({
        field: "commit_scope",
        from: "-",
        to: "cli-parser",
      });

      const commitFields = events.at(-1)!;
      const rebuilt = rebuildRegisterTicketFromEvents(
        content.replace(/  commit_(type|scope):.*\n/g, ""),
        events,
        new Set([commitFields.id]),
      );
      expect(readRegisterItemContent(rebuilt.content, ticketFilename)?.item.commitType).toBe("fix");
      expect(readRegisterItemContent(rebuilt.content, ticketFilename)?.item.commitScope).toBe(
        "cli-parser",
      );

      // 無関係な update では既存値を保持し、イベントにも変更を含めない。
      await runRegister(["update", "--id", "PJR-AB12", "--title", "更新した題名"]);
      expect(
        readRegisterItemContent(readFileSync(ticketPath, "utf8"), ticketFilename)?.item,
      ).toMatchObject({ commitType: "fix", commitScope: "cli-parser" });
      expect(
        readEvents(registerDir, "PJR-AB12")
          .at(-1)
          ?.changes.some(
            (change) => change.field === "commit_type" || change.field === "commit_scope",
          ),
      ).toBe(false);

      // 既存値の置換。
      await runRegister([
        "update",
        "--id",
        "PJR-AB12",
        "--commit-type",
        "refactor",
        "--commit-scope",
        "core",
      ]);
      content = readFileSync(ticketPath, "utf8");
      expect(readRegisterItemContent(content, ticketFilename)?.item).toMatchObject({
        commitType: "refactor",
        commitScope: "core",
      });
      const contentBeforeRemoval = content;

      // update で消去 (-)
      await runRegister([
        "update",
        "--id",
        "PJR-AB12",
        "--commit-type",
        "-",
        "--commit-scope",
        "-",
      ]);

      content = readFileSync(ticketPath, "utf8");
      parsed = readRegisterItemContent(content, "pjr-ab12-topic.md");
      expect(parsed).toBeDefined();
      expect(parsed?.item.commitType).toBeUndefined();
      expect(parsed?.item.commitScope).toBeUndefined();
      expect(resolveItemCommitTypeAndScope(parsed!.item)).toEqual({ type: "feat" });
      expect(content).not.toMatch(/^  commit_(type|scope):/m);

      events = readEvents(registerDir, "PJR-AB12");
      expect(events.at(-1)?.changes).toContainEqual({
        field: "commit_type",
        from: "refactor",
        to: "-",
      });
      expect(events.at(-1)?.changes).toContainEqual({
        field: "commit_scope",
        from: "core",
        to: "-",
      });
      const removal = events.at(-1)!;
      const removed = rebuildRegisterTicketFromEvents(
        contentBeforeRemoval,
        [removal],
        new Set([removal.id]),
      );
      expect(removed.appliedFields).toEqual(["commit_scope", "commit_type"]);
      const removedItem = readRegisterItemContent(removed.content, ticketFilename)!.item;
      expect(removedItem.commitType).toBeUndefined();
      expect(removedItem.commitScope).toBeUndefined();
      expect(removed.content).not.toMatch(/^  commit_(type|scope):/m);
    });
  });

  it.each(["bad_type", "", "fix\nfeat"])(
    "register update で不正な --commit-type %j はエラーになる",
    async (value) => {
      await withRepo(async ({ registerDir }) => {
        vi.spyOn(process.stdout, "write").mockReturnValue(true);
        const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);
        await runRegister([
          "add",
          "--type",
          "todo",
          "--id",
          "PJR-AB12",
          "--topic",
          "topic",
          "--title",
          "テスト項目",
        ]);

        const before = readFileSync(join(registerDir, "pjr-ab12-topic.md"), "utf8");
        const eventsBefore = readEvents(registerDir, "PJR-AB12");
        await runRegister(["update", "--id", "PJR-AB12", "--commit-type", value]);
        expect(process.exitCode).toBe(1);
        expect(String(stderr.mock.calls.at(-1)?.[0])).toContain("Invalid commit type");
        expect(readFileSync(join(registerDir, "pjr-ab12-topic.md"), "utf8")).toBe(before);
        expect(readEvents(registerDir, "PJR-AB12")).toEqual(eventsBefore);
      });
    },
  );

  it.each(["_invalid_scope", "", "   ", "core\nparser"])(
    "register update で不正な --commit-scope %j はエラーになる",
    async (value) => {
      await withRepo(async () => {
        vi.spyOn(process.stdout, "write").mockReturnValue(true);
        const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);
        await runRegister([
          "add",
          "--type",
          "todo",
          "--id",
          "PJR-AB12",
          "--topic",
          "topic",
          "--title",
          "テスト項目",
        ]);

        await runRegister(["update", "--id", "PJR-AB12", "--commit-scope", value]);
        expect(process.exitCode).toBe(1);
        expect(String(stderr.mock.calls.at(-1)?.[0])).toContain("Invalid commit scope");
      });
    },
  );
});
