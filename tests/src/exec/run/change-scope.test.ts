import { mkdirSync, mkdtempSync, readFileSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  planConventionsFiles,
  readPlanFile,
  storePlanConventions,
} from "../../../../src/shared/plan-conventions.js";
import {
  appendScopeWaitNotes,
  ChangeScopeGate,
  inferChangeScope,
  normalizeScopePath,
  parseUnknownScopePolicy,
  scopeOverlap,
  type ChangeScopeLease,
} from "../../../../src/exec/run/change-scope.js";

let root: string;
let leases: ChangeScopeLease[];
const known = (path: string) => ({ paths: [`project:${path}`], unknown: false });
const registerTemplate = readFileSync(
  join(__dirname, "../../../../docs/ja/specdojo/exec-templates/xep-register-template.md"),
  "utf8",
);
const remember = (lease: ChangeScopeLease) => {
  leases.push(lease);
  return lease;
};

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "specdojo-change-scope-"));
  leases = [];
  vi.spyOn(process.stdout, "write").mockReturnValue(true);
});
afterEach(async () => {
  for (const lease of leases) await lease.finish(true);
  vi.restoreAllMocks();
  rmSync(root, { recursive: true, force: true });
});

describe("change scope inference", () => {
  const unchangedConditions =
    "保護された設定（lefthook.yml・.agents/・.claude/・.codex/・package.json・.specdojo/ など）は変えない。" +
    "`CHANGELOG.md` は変えず、個票の対応結果に文案を書く（PJR-EPQ3）。";

  it("reads item inputs but not generated register plan procedures and conventions", () => {
    const scope = inferChangeScope({
      projectId: "test",
      repoRoot: root,
      text: registerTemplate
        .replace("_PJR_DESCRIPTION_", "`src/exec/run.ts#resume` を変更する。")
        .replace("_REGISTER_INPUT_", "## 個票の入力（前提）\n\n`src/input.ts`")
        .replace("_GRADE_FINDINGS_", "- `src/finding.ts` を修正する。")
        .replace("_COMMON_CONVENTIONS_", "## 共通: 規約\n\n`package.json` を読む。"),
    });
    expect(scope).toEqual({
      paths: ["project:src/exec/run.ts", "project:src/finding.ts", "project:src/input.ts"],
      unknown: false,
    });
    expect(inferChangeScope({ projectId: "test", repoRoot: root, text: registerTemplate })).toEqual(
      { paths: [], unknown: true },
    );
  });

  it("keeps later additional conditions and ignores headings inside fenced examples", () => {
    expect(
      inferChangeScope({
        projectId: "test",
        repoRoot: root,
        text: [
          "# Edit Plan: task",
          "## 1. 対象成果物",
          "```md",
          "## 共通: this is an example, not a section boundary",
          "```",
          "`docs/output.md`",
          "## 2. 進め方",
          "`src/common-procedure.ts` を読む。",
          "### grade result から展開された finding",
          "`src/finding.ts` を修正する。",
          "### 2.1. 判断根拠の記録",
          "`src/common-record.ts` を読む。",
          "## 3. 完了手順",
          "`pjr-index.md` の状態は変更しない。",
          "## 個票の追加完了条件",
          "`src/additional.ts` を変更する。",
        ].join("\n"),
      }),
    ).toEqual({
      paths: ["project:docs/output.md", "project:src/additional.ts", "project:src/finding.ts"],
      unknown: false,
    });
  });

  it("excludes normalized generated paths from explicit targets and item prose", () => {
    expect(
      inferChangeScope({
        projectId: "test",
        repoRoot: root,
        targets: ["docs/./generated/index.md", "app:generated/view.md"],
        targetPath: "docs/generated/new.md",
        text: "`docs/other/../generated/list.md` と `src/real.ts` を変更する。",
      }),
    ).toEqual(known("src/real.ts"));
  });

  it("runs independent register items sharing only template instructions concurrently", async () => {
    const infer = (path: string) =>
      inferChangeScope({
        projectId: "test",
        repoRoot: root,
        text: registerTemplate.replace("_PJR_DESCRIPTION_", `\`${path}\` を変更する。`),
      });
    const firstScope = infer("src/catalog.ts");
    const secondScope = infer("src/exec.ts");
    expect(scopeOverlap(firstScope, secondScope)).toBeUndefined();
    const gate = new ChangeScopeGate(root);
    remember(await gate.acquire("PJR-V0FQ", firstScope));
    const second = await gate.tryAcquire("PJR-981V", secondScope);
    expect(second).not.toBeNull();
    expect(remember(second!).waits).toEqual([]);
  });

  it.each(["ticket", "plan"])(
    "allows independent items sharing unchanged settings in a %s, even after a failure",
    async (format) => {
      const infer = (path: string) => {
        const conditions = `\`${path}\` を修正する。${unchangedConditions}`;
        const text =
          format === "ticket"
            ? `## 4. 対応方針\n\n| 項目 | 内容 |\n| --- | --- |\n| 完了条件 | ${conditions} |`
            : registerTemplate.replace("_REGISTER_INPUT_", `## 完了条件\n\n- ${conditions}`);
        return inferChangeScope({ projectId: "test", repoRoot: root, text });
      };
      const firstScope = infer("src/exec/smoke.ts");
      const secondScope = infer("src/exec/parent-validation.ts");
      expect(firstScope).toEqual(known("src/exec/smoke.ts"));
      expect(secondScope).toEqual(known("src/exec/parent-validation.ts"));
      expect(scopeOverlap(firstScope, secondScope)).toBeUndefined();
      const gate = new ChangeScopeGate(root);
      const first = remember(await gate.acquire("PJR-8NB8", firstScope));
      const second = await gate.tryAcquire("PJR-C07H", secondScope);
      expect(second).not.toBeNull();
      expect(remember(second!).waits).toEqual([]);
      await second!.finish(true);
      await first.finish(false);
      const afterFailure = await gate.tryAcquire("PJR-9JN6", secondScope);
      expect(afterFailure).not.toBeNull();
      expect(remember(afterFailure!).waits).toEqual([]);
    },
  );

  it.each([
    "変えない",
    "変えず",
    "変更しない",
    "変更しません",
    "変更せず",
    "編集しない",
    "更新しないこと",
    "触らない",
  ])("excludes backticked settings explicitly marked %s", (predicate) => {
    expect(
      inferChangeScope({
        projectId: "test",
        repoRoot: root,
        text: `## 完了条件\n\n保護された設定（\`lefthook.yml\`、\`.agents/\`、\`.claude/\`、\`.codex/\`、\`package.json\`、\`.specdojo/\`）は${predicate}。`,
      }),
    ).toEqual({ paths: [], unknown: true });
  });

  it.each([
    "`src/real.ts` を修正する。`CHANGELOG.md` は変更しない。",
    "`CHANGELOG.md` は変えず、`src/real.ts` を修正する。",
    "`CHANGELOG.md` は変更しないが、`src/real.ts` を修正する。",
    "`src/real.ts` を修正し、`CHANGELOG.md` は変更しない。",
    "`src/real.ts` を修正するが、`CHANGELOG.md` は変更しない。",
    "src/real.ts を修正する。`CHANGELOG.md` は変えない（PJR-EPQ3）。",
    "`package.json`、`.agents/` は変更しない。`src/real.ts` を修正する。",
    "`CHANGELOG.md` は変えない。\n`src/real.ts` を修正する。",
    "| 制約 | `CHANGELOG.md` は変更しない | 対象 | `src/real.ts` を修正する |",
    "`src/real.ts` は変えない。別の条件では `src/real.ts` を修正する。",
  ])("preserves positive paths beside negative clauses: %s", (text) => {
    expect(inferChangeScope({ projectId: "test", repoRoot: root, text })).toEqual(
      known("src/real.ts"),
    );
  });

  it("keeps explicit targets and positive protected paths despite negative prose", () => {
    expect(
      inferChangeScope({
        projectId: "test",
        repoRoot: root,
        targets: [".agents/worker.md"],
        targetPath: "CHANGELOG.md",
        text: `${unchangedConditions}\n\`package.json\` を変更する。`,
      }),
    ).toEqual({
      paths: ["project:.agents/worker.md", "project:CHANGELOG.md", "project:package.json"],
      unknown: false,
    });
  });

  it("still waits for integration when inferred function references overlap", async () => {
    const infer = (reference: string) =>
      inferChangeScope({
        projectId: "test",
        repoRoot: root,
        text: `## 完了条件\n\n\`${reference}\` を修正する。${unchangedConditions}`,
      });
    const firstScope = infer("src/exec/run/lifecycle-commands.ts#resume");
    const secondScope = infer("src/exec/run/lifecycle-commands.ts:42:3");
    expect(scopeOverlap(firstScope, secondScope)).toBe(
      "project:src/exec/run/lifecycle-commands.ts <> project:src/exec/run/lifecycle-commands.ts",
    );
    const gate = new ChangeScopeGate(root);
    const first = remember(await gate.acquire("PJR-ED0K", firstScope));
    expect(await gate.tryAcquire("PJR-1GCD", secondScope)).toBeNull();
    await first.finish(true);
    const second = remember(await gate.acquire("PJR-1GCD", secondScope));
    expect(second.waits).toMatchObject([{ blocker: "PJR-ED0K" }]);
  });

  it("does not treat prose alternatives or per-item bookkeeping as implementation paths", () => {
    expect(
      inferChangeScope({
        projectId: "test",
        repoRoot: root,
        text: "executor/reporter pipeline を使う。\n`docs/ja/projects/test/controls/project-register/pjr-ab12-topic.md`\n`docs/ja/projects/test/execution/runs/register/PJR-AB12/run/result.md`\n`docs/ja/projects/test/execution/conventions/snapshot.txt`",
      }),
    ).toEqual({ paths: [], unknown: true });
    expect(
      inferChangeScope({
        projectId: "test",
        repoRoot: root,
        text: "`src/run.ts#resume` と `app:src/new.ts:42:3` と src/new.ts を変更する。",
      }),
    ).toEqual({
      paths: ["app:src/new.ts", "project:src/new.ts", "project:src/run.ts"],
      unknown: false,
    });
  });
  it("covers files, directories, glob prefixes and function/line references", () => {
    expect(normalizeScopePath("./src/exec/../exec/run/*.ts")).toBe("project:src/exec/run");
    expect(normalizeScopePath("src/exec/run.ts:48:3")).toBe("project:src/exec/run.ts");
    expect(normalizeScopePath("app:src/main.ts#resume")).toBe("app:src/main.ts");
    expect(normalizeScopePath("../../outside")).toBeUndefined();
    expect(normalizeScopePath("https://example.com/path")).toBeUndefined();
    expect(scopeOverlap(known("src/run"), known("src/run/a.ts"))).toContain("src/run");
    expect(scopeOverlap(known("src/run"), known("src/runner/a.ts"))).toBeUndefined();
    expect(
      scopeOverlap(known("src/a.ts"), { paths: ["app:src/a.ts"], unknown: false }),
    ).toBeUndefined();
  });

  it("resolves declared documents, uncreated target paths, and current prose without history", () => {
    expect(
      inferChangeScope({
        projectId: "test",
        repoRoot: root,
        targets: ["test:design"],
        documentPaths: { "test:design": "docs/design.md:12" },
        text: "## 2. 入力\n\n`src/exec/run.ts` と src/exec/in-place.ts を変更する。\n\n## 5. 対応結果\n\n`src/old.ts`\n",
      }),
    ).toEqual({
      paths: ["project:docs/design.md", "project:src/exec/in-place.ts", "project:src/exec/run.ts"],
      unknown: false,
    });
    expect(
      inferChangeScope({
        projectId: "test",
        repoRoot: root,
        targets: ["test:new"],
        targetPath: "docs/new.md",
      }),
    ).toEqual(known("docs/new.md"));
  });

  it("reserves authoring output without its sources or the whole kata directory", () => {
    const authoring = inferChangeScope({
      projectId: "test",
      repoRoot: root,
      targets: ["specdojo:new-template", "test:source"],
      approach: "template-authoring",
      documentPaths: {},
    });
    expect(authoring).toEqual(known("docs/ja/specdojo/templates/new-template.md"));
    const other = inferChangeScope({
      projectId: "test",
      repoRoot: root,
      targets: ["specdojo:other-template", "test:source"],
      approach: "template-authoring",
      documentPaths: {},
    });
    expect(scopeOverlap(authoring, other)).toBeUndefined();
  });

  it.each(["bootstrap", "bootstrap-finalize"] as const)(
    "reserves resolved kata files for %s without adding directory-wide scope",
    (approach) => {
      expect(
        inferChangeScope({
          projectId: "test",
          repoRoot: root,
          targets: ["test:design", "specdojo:design-rulebook"],
          approach,
          documentPaths: {
            "test:design": "docs/design.md",
            "specdojo:design-rulebook": "docs/ja/specdojo/rulebooks/design-rulebook.md",
          },
        }),
      ).toEqual({
        paths: ["project:docs/design.md", "project:docs/ja/specdojo/rulebooks/design-rulebook.md"],
        unknown: false,
      });
    },
  );

  it.each([
    ["rulebook-maintenance", "rulebooks", "rulebook"],
    ["recipe-maintenance", "recipes", "recipe"],
    ["sample-maintenance", "samples", "sample"],
    ["template-maintenance", "templates", "template"],
  ] as const)(
    "allows independent %s targets even after failure, but waits for the same kata file",
    async (approach, directory, kind) => {
      const path = (name: string) => `docs/ja/specdojo/${directory}/${name}-${kind}.md`;
      const infer = (name: string) =>
        inferChangeScope({
          projectId: "test",
          repoRoot: root,
          targets: [`specdojo:${name}-${kind}`],
          approach,
          documentPaths: { [`specdojo:${name}-${kind}`]: path(name) },
        });
      const firstScope = infer("first");
      const secondScope = infer("second");
      expect(firstScope).toEqual(known(path("first")));
      expect(secondScope).toEqual(known(path("second")));
      expect(scopeOverlap(firstScope, secondScope)).toBeUndefined();
      const gate = new ChangeScopeGate(root);
      const first = remember(await gate.acquire("T-FIRST", firstScope));
      const second = await gate.tryAcquire("T-SECOND", secondScope);
      expect(second).not.toBeNull();
      expect(remember(second!).waits).toEqual([]);
      const sameFile = inferChangeScope({
        projectId: "test",
        repoRoot: root,
        targetPath: path("first"),
        approach,
      });
      expect(scopeOverlap(firstScope, sameFile)).toBe(
        `project:${path("first")} <> project:${path("first")}`,
      );
      expect(await gate.tryAcquire("T-SAME", sameFile)).toBeNull();
      await first.finish(true);
      const same = remember(await gate.acquire("T-SAME", sameFile));
      expect(same.waits).toMatchObject([{ blocker: "T-FIRST" }]);
      await same.finish(false);
      await second!.finish(true);
      const afterFailure = await gate.tryAcquire("T-INDEPENDENT", secondScope);
      expect(afterFailure).not.toBeNull();
      expect(remember(afterFailure!).waits).toEqual([]);
    },
  );

  it("keeps explicitly declared kata directories and unresolved target uncertainty", () => {
    expect(
      inferChangeScope({
        projectId: "test",
        repoRoot: root,
        targets: ["docs/ja/specdojo/rulebooks/"],
        approach: "rulebook-maintenance",
      }),
    ).toEqual(known("docs/ja/specdojo/rulebooks"));
    expect(
      inferChangeScope({
        projectId: "test",
        repoRoot: root,
        targets: ["test:missing"],
        approach: "rulebook-maintenance",
        documentPaths: {},
      }),
    ).toEqual({ paths: [], unknown: true });
  });

  it("reserves the shared catalog index and distinguishes independent strategy tracks", () => {
    const base = {
      projectId: "test",
      repoRoot: root,
      catalogPath: join(root, "catalog"),
      schedulePath: join(root, "schedule"),
    };
    const catalog = (id: string) =>
      inferChangeScope({ ...base, approach: "catalog-planning", targets: [`domain:${id}`] });
    expect(scopeOverlap(catalog("architecture"), catalog("business"))).toContain("project:catalog");
    const strategy = (id: string) =>
      inferChangeScope({ ...base, approach: "strategy-planning", targets: [`track:${id}`] });
    expect(strategy("one").unknown).toBe(false);
    expect(scopeOverlap(strategy("one"), strategy("two"))).toBeUndefined();
  });
});

describe("change scope reservations", () => {
  it.each([false, true])(
    "preserves convention expansion and checkpoint snapshots after wait notes (legacy: %s)",
    (legacy) => {
      mkdirSync(join(root, ".git"));
      const plan = join(root, "plan.md");
      const conventions = "## 共通規約\n\nresult の必須セクションを記入する。\n";
      const stored = storePlanConventions(conventions, root, plan);
      const ref = legacy
        ? stored.replace(/^`共通規約 sha256:([^`]+)` `([^`]+)`$/, "[共通規約 sha256:$1]($2)")
        : stored;
      writeFileSync(plan, `# Edit Plan\n\n${ref}\n`);
      const snapshots = planConventionsFiles(readFileSync(plan, "utf8"), root);
      appendScopeWaitNotes(plan, [
        {
          item: "PJR-1GCD",
          blocker: "PJR-ED0K",
          overlap: "project:src/run.ts",
          at: "2026-11-17T00:00:00Z",
        },
      ]);
      expect(planConventionsFiles(readFileSync(plan, "utf8"), root)).toEqual(snapshots);
      expect(snapshots).toHaveLength(1);
      const prompt = readPlanFile(plan);
      expect(prompt).toContain(conventions.trimEnd());
      expect(prompt).toContain("変更範囲による実行待ち");
      expect(prompt).not.toContain("共通規約 sha256:");
    },
  );
  it("keeps overlap blocked through integration while allowing unrelated work, and records why", async () => {
    const a = new ChangeScopeGate(root);
    const b = new ChangeScopeGate(root);
    const first = remember(await a.acquire("PJR-ED0K", known("src/exec/run")));
    const independent = remember(await b.acquire("PJR-OTHER", known("src/catalog")));
    expect(independent.waits).toEqual([]);
    expect(await b.tryAcquire("PJR-1GCD", known("src/exec/run/lifecycle-commands.ts"))).toBeNull();
    // Executor completion alone cannot release the reservation.
    expect(await b.tryAcquire("PJR-1GCD", known("src/exec/run/lifecycle-commands.ts"))).toBeNull();
    await first.finish(true);
    leases = leases.filter((lease) => lease !== first);
    const second = remember(
      await b.acquire("PJR-1GCD", known("src/exec/run/lifecycle-commands.ts")),
    );
    expect(second.waits).toMatchObject([
      { item: "PJR-1GCD", blocker: "PJR-ED0K", overlap: expect.stringContaining("src/exec/run") },
    ]);
    const plan = join(root, "plan.md");
    writeFileSync(plan, "# Plan\n");
    appendScopeWaitNotes(plan, second.waits);
    expect(readFileSync(plan, "utf8")).toContain("PJR-ED0K");
    expect(readFileSync(join(root, "exec/.locks/change-scopes/waits.jsonl"), "utf8")).toContain(
      "PJR-1GCD",
    );
  });

  it("retains a failed integration barrier and permits the same item to resume", async () => {
    const gate = new ChangeScopeGate(root);
    const first = await gate.acquire("PJR-ED0K", known("src/exec/run.ts"));
    await first.finish(false);
    await expect(gate.acquire("PJR-1GCD", known("src/exec/run.ts"))).rejects.toThrow(
      /unintegrated PJR-ED0K/,
    );
    const resumed = await gate.acquire("PJR-ED0K", known("src/exec/run.ts"));
    await resumed.finish(true);
    remember(await gate.acquire("PJR-1GCD", known("src/exec/run.ts")));
  });

  it("clears a failure barrier after a standalone schedule resume integrates", async () => {
    const gate = new ChangeScopeGate(root);
    const failed = await gate.acquire("T-ONE", known("docs/design.md"));
    await failed.finish(false);
    await gate.clearIntegrated("T-ONE");
    remember(await gate.acquire("T-TWO", known("docs/design.md")));
  });

  it("treats a crashed holder as unintegrated until the same item resumes", async () => {
    const gate = new ChangeScopeGate(root);
    const key = createHash("sha256").update("PJR-ED0K").digest("hex");
    const directory = join(root, "exec/.locks/change-scopes");
    const lock = join(directory, `${key}.lock`);
    mkdirSync(lock, { recursive: true });
    writeFileSync(
      join(directory, `${key}.json`),
      JSON.stringify({ item: "PJR-ED0K", scope: known("src/run.ts"), state: "running" }),
    );
    writeFileSync(
      join(lock, "owner.json"),
      JSON.stringify({ actor: "change-scope", token: "crashed", pid: 999999 }),
    );
    const old = new Date(Date.now() - 60_000);
    utimesSync(lock, old, old);
    await expect(gate.tryAcquire("PJR-1GCD", known("src/run.ts"))).rejects.toThrow(
      /unintegrated PJR-ED0K/,
    );
    const resumed = remember(await gate.acquire("PJR-ED0K", known("src/run.ts")));
    expect(await gate.tryAcquire("PJR-1GCD", known("src/run.ts"))).toBeNull();
    await resumed.finish(true);
    remember(await gate.acquire("PJR-1GCD", known("src/run.ts")));
  });

  it("allows choosing whether unknown scope blocks other items", async () => {
    expect(parseUnknownScopePolicy()).toBe("parallel");
    expect(() => parseUnknownScopePolicy("invalid")).toThrow(/unknown-scope/);
    const unknown = { paths: [], unknown: true };
    const parallel = new ChangeScopeGate(root);
    const optedOut = remember(await parallel.acquire("unknown-parallel", unknown));
    const first = remember(await parallel.acquire("known", known("src/a.ts")));
    await optedOut.finish(true);
    leases = leases.filter((lease) => lease !== optedOut);
    const serial = new ChangeScopeGate(root, "serialize");
    expect(await serial.tryAcquire("unknown-serial", unknown)).toBeNull();
    await first.finish(true);
    leases = leases.filter((lease) => lease !== first);
    // The unknown parallel item opts out; the serial item itself blocks subsequent known work.
    const second = remember(await serial.acquire("unknown-serial", unknown));
    expect(second.waits[0]?.blocker).toBe("known");
    expect(await parallel.tryAcquire("other-known", known("src/b.ts"))).toBeNull();
  });
});
