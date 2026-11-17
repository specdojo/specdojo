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

  it("uses approach reference directories and authoring output without its sources", () => {
    const authoring = inferChangeScope({
      projectId: "test",
      repoRoot: root,
      targets: ["specdojo:new-template", "test:source"],
      approach: "template-authoring",
      documentPaths: {},
    });
    expect(authoring.paths).toContain("project:docs/ja/specdojo/templates/new-template.md");
    expect(authoring.unknown).toBe(false);
    const bootstrap = inferChangeScope({
      projectId: "test",
      repoRoot: root,
      targets: ["test:design"],
      approach: "bootstrap",
      documentPaths: { "test:design": "docs/design.md" },
    });
    expect(bootstrap.paths).toContain("project:docs/ja/specdojo/rulebooks");
    expect(bootstrap.paths).toContain("project:docs/ja/specdojo/templates");
    expect(
      inferChangeScope({
        projectId: "test",
        repoRoot: root,
        targets: ["test:missing"],
        documentPaths: {},
      }).unknown,
    ).toBe(true);
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
