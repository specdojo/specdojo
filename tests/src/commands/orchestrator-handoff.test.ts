import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildHandoffRegisterAddArgs,
  buildInProgressSection,
  buildPendingDecisionsSection,
  findOpenHandoffs,
  formatOpenHandoffNotice,
  runOrchestratorHandoff,
  selectHandoffQueues,
  stoppedQueueCutoff,
  type HandoffQueue,
  type HandoffItem,
  type HandoffSnapshot,
} from "../../../src/commands/orchestrator-handoff.js";

function item(id: string, overrides: Partial<HandoffItem> = {}): HandoffItem {
  return {
    id,
    title: `${id} の題`,
    type: "todo",
    status: "open",
    docId: `prj-0001:${id.toLowerCase()}-topic`,
    ...overrides,
  };
}

const EMPTY: HandoffSnapshot = { queues: [], runs: [], items: [] };

describe("buildInProgressSection", () => {
  it("列・run・in-progress / review / waiting の項目を種類ごとにまとめる", () => {
    const section = buildInProgressSection({
      queues: [
        {
          queueId: "night-1",
          state: "running",
          done: 1,
          total: 3,
          current: "specdojo exec run --register PJR-AB12",
        },
      ],
      runs: [
        { slot: "primary", actor: "orchestrator", pid: 42, acquiredAt: "2026-11-23T00:00:00Z" },
      ],
      items: [
        item("PJR-AB12", { status: "in-progress" }),
        item("PJR-AB13", { status: "review" }),
        item("PJR-AB14", { status: "waiting" }),
        item("PJR-AB15"),
        item("PJR-AB16", { status: "done" }),
      ],
    });

    expect(section).toBe(
      [
        "- 流している列（`exec queue`）:",
        "  - `night-1`（running、1/3、現在: `specdojo exec run --register PJR-AB12`）",
        "- 実行中の run（exec run のロック）:",
        "  - `orchestrator`（pid 42、2026-11-23T00:00:00Z から）",
        "- in-progress の項目:",
        "  - [[prj-0001:pjr-ab12-topic|PJR-AB12]] PJR-AB12 の題",
        "- review の項目:",
        "  - [[prj-0001:pjr-ab13-topic|PJR-AB13]] PJR-AB13 の題",
        "- waiting の項目:",
        "  - [[prj-0001:pjr-ab14-topic|PJR-AB14]] PJR-AB14 の題",
        "",
      ].join("\n"),
    );
  });

  it("止まった列の段と理由、`--join` の枠を書き分ける", () => {
    const section = buildInProgressSection({
      queues: [{ queueId: "q", state: "stopped", done: 2, total: 2, stoppedStep: 2, reason: "x" }],
      runs: [{ slot: "slot-1", actor: "claude", pid: 7, acquiredAt: "" }],
      items: [],
    });

    expect(section).toContain("  - `q`（stopped、2/2、止まった段: 2、理由: x）");
    expect(section).toContain("  - `claude`（`--join` の slot-1）（pid 7）");
  });

  it("進行中のものがなければ - だけを返す", () => {
    expect(buildInProgressSection({ ...EMPTY, items: [item("PJR-AB15")] })).toBe("-\n");
  });

  it("境目より前に止まった列は件数だけを 1 行で出す", () => {
    const section = buildInProgressSection({
      ...EMPTY,
      queues: [{ queueId: "night-2", state: "running", done: 0, total: 1 }],
      olderStoppedQueues: 11,
    });

    expect(section).toBe(
      [
        "- 流している列（`exec queue`）:",
        "  - `night-2`（running、0/1）",
        "  - それより前に止まった列: 11 件（`exec queue status` で見る）",
        "",
      ].join("\n"),
    );
  });
});

function queue(queueId: string, state: string, updatedAt: string): HandoffQueue {
  return { queueId, state, done: 0, total: 1, updatedAt };
}

describe("stoppedQueueCutoff", () => {
  const now = new Date("2026-11-23T04:00:00Z");

  it("前回の handoff があれば、いちばん新しい起票時刻を境目にする", () => {
    const cutoff = stoppedQueueCutoff(
      [
        item("PJR-AB40", { type: "handoff", status: "done", registeredAt: "2026-11-22T10:00:00Z" }),
        item("PJR-AB41", { type: "handoff", registeredAt: "2026-11-23T01:00:00Z" }),
        item("PJR-AB42", { registeredAt: "2026-11-23T03:00:00Z" }),
      ],
      now,
    );

    expect(new Date(cutoff).toISOString()).toBe("2026-11-23T01:00:00.000Z");
  });

  it("前回の handoff がなければ直近 24 時間を境目にする", () => {
    const cutoff = stoppedQueueCutoff(
      [item("PJR-AB42", { registeredAt: "2026-11-23T03:00Z" })],
      now,
    );

    expect(new Date(cutoff).toISOString()).toBe("2026-11-22T04:00:00.000Z");
  });
});

describe("selectHandoffQueues", () => {
  it("流している列と境目より後に止まった列を残し、古い止まった列は数える", () => {
    const cutoff = Date.parse("2026-11-23T00:00:00Z");

    const selected = selectHandoffQueues(
      [
        queue("old-running", "running", "2026-11-21T00:00:00Z"),
        queue("old-pending", "pending", "2026-11-21T00:00:00Z"),
        queue("old-stopped-1", "stopped", "2026-11-21T00:00:00Z"),
        queue("old-stopped-2", "stopped", "2026-11-22T12:00:00Z"),
        queue("new-stopped", "stopped", "2026-11-23T02:00:00Z"),
      ],
      cutoff,
    );

    expect(selected.queues.map((entry) => entry.queueId)).toEqual([
      "old-running",
      "old-pending",
      "new-stopped",
    ]);
    expect(selected.olderStoppedQueues).toBe(2);
  });
});

describe("buildPendingDecisionsSection", () => {
  it("開いている question と waiting の項目への参照だけを置く", () => {
    const section = buildPendingDecisionsSection({
      ...EMPTY,
      items: [
        item("PJR-AB20", { type: "question" }),
        item("PJR-AB21", { type: "question", status: "decided" }),
        item("PJR-AB22", { status: "waiting" }),
        item("PJR-AB23", { status: "review" }),
        item("PJR-AB24", { type: "question", status: "waiting", docId: undefined }),
      ],
    });

    expect(section).toBe(
      [
        "- 開いている question:",
        "  - [[prj-0001:pjr-ab20-topic|PJR-AB20]] PJR-AB20 の題",
        "  - PJR-AB24 PJR-AB24 の題",
        "- waiting の項目:",
        "  - [[prj-0001:pjr-ab22-topic|PJR-AB22]] PJR-AB22 の題",
        "",
      ].join("\n"),
    );
  });

  it("判断待ちがなければ - だけを返す", () => {
    expect(buildPendingDecisionsSection(EMPTY)).toBe("-\n");
  });
});

describe("findOpenHandoffs", () => {
  it("open の handoff だけを返し、受け取り済みは含めない", () => {
    const open = findOpenHandoffs([
      item("PJR-AB30", { type: "handoff" }),
      item("PJR-AB31", { type: "handoff", status: "done" }),
      item("PJR-AB32"),
    ]);

    expect(open.map((entry) => entry.id)).toEqual(["PJR-AB30"]);
    expect(formatOpenHandoffNotice(open)).toBe(
      "Open handoff already exists (read it and close it with register close --by <actor>):\n" +
        "  PJR-AB30 PJR-AB30 の題\n",
    );
    expect(formatOpenHandoffNotice([])).toBe("");
  });
});

describe("buildHandoffRegisterAddArgs", () => {
  it("既定の題と topic を UTC の時刻から作り、2 つの章をファイルで渡す", () => {
    const args = buildHandoffRegisterAddArgs(
      { dryRun: true, project: "prj-0001", by: "orchestrator" },
      { inProgress: "/t/a.md", pending: "/t/b.md" },
      new Date("2026-11-23T03:47:20Z"),
    );

    expect(args).toEqual([
      "register",
      "add",
      "--type",
      "handoff",
      "--title",
      "オーケストレーターの引き継ぎ（2026-11-23 03:47 UTC）",
      "--topic",
      "orchestrator-handoff-20261123-0347",
      "--priority",
      "medium",
      "--due",
      "-",
      "--section",
      "進行中",
      "--section-file",
      "/t/a.md",
      "--section",
      "判断待ち",
      "--section-file",
      "/t/b.md",
      "--by",
      "orchestrator",
      "--project",
      "prj-0001",
      "--dry-run",
    ]);
  });

  it("--commit と commit message の段落を register add へ渡す", () => {
    const args = buildHandoffRegisterAddArgs(
      { title: "夜の引き継ぎ", topic: "night-handoff", commit: true, message: ["a", "b"] },
      { inProgress: "a.md", pending: "b.md" },
    );

    expect(args).toEqual(expect.arrayContaining(["--title", "夜の引き継ぎ", "--commit"]));
    expect(args).toContain("night-handoff");
    expect(args.slice(-4)).toEqual(["-m", "a", "-m", "b"]);
  });

  it("決めた ID を --id で register add へ渡す", () => {
    const args = buildHandoffRegisterAddArgs(
      { id: "PJR-F9JS", dryRun: true },
      { inProgress: "a.md", pending: "b.md" },
    );

    expect(args.slice(0, 4)).toEqual(["register", "add", "--id", "PJR-F9JS"]);
  });
});

describe("runOrchestratorHandoff", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("登録簿と列から章を組み立てて register add に渡し、開いている handoff を知らせる", () => {
    const cwd = process.cwd();
    const root = mkdtempSync(join(tmpdir(), "specdojo-handoff-command-"));
    try {
      mkdirSync(join(root, ".specdojo"));
      mkdirSync(join(root, "register"));
      mkdirSync(join(root, "execution/queues"), { recursive: true });
      writeFileSync(
        join(root, ".specdojo/specdojo.config.json"),
        JSON.stringify({
          version: 1,
          current_project: "test",
          projects: {
            test: {
              schedule_path: "schedule",
              execution_path: "execution",
              project_register_path: "register",
            },
          },
        }),
      );
      const ticket = (id: string, topic: string, type: string, status: string): void => {
        writeFileSync(
          join(root, `register/${id.toLowerCase()}-${topic}.md`),
          `---\nspecdojo:\n  id: test:${id.toLowerCase()}-${topic}\n  item_type: ${type}\n  item_status: ${status}\n---\n\n# ${id} ${topic}\n`,
        );
      };
      ticket("PJR-AB12", "review-item", "todo", "review");
      ticket("PJR-AB13", "ask", "question", "open");
      ticket("PJR-AB14", "previous", "handoff", "open");
      writeFileSync(
        join(root, "execution/queues/night.json"),
        JSON.stringify({
          version: 1,
          queue_id: "night",
          project_id: "test",
          created_at: "2026-11-23T00:00:00Z",
          updated_at: "2026-11-23T00:00:00Z",
          state: "pending",
          steps: [
            {
              index: 1,
              kind: "exec-run",
              argv: ["exec", "run", "--register", "PJR-AB12"],
              on_failure: "stop",
              status: "pending",
            },
          ],
        }),
      );
      writeFileSync(
        join(root, "execution/queues/old.json"),
        JSON.stringify({
          version: 1,
          queue_id: "old",
          project_id: "test",
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
          state: "stopped",
          stopped_step: 1,
          steps: [
            {
              index: 1,
              kind: "exec-run",
              argv: ["exec", "run", "--register", "PJR-AB12"],
              on_failure: "stop",
              status: "failed",
            },
          ],
        }),
      );
      const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);
      process.chdir(root);
      const calls: { args: string[]; sections: string[] }[] = [];

      const exitCode = runOrchestratorHandoff({ project: "test", dryRun: true }, (args) => {
        const files = args.flatMap((arg, index) =>
          args[index - 1] === "--section-file" ? [arg] : [],
        );
        calls.push({ args, sections: files.map((file) => readFileSync(file, "utf8")) });
        return true;
      });

      expect(exitCode).toBe(0);
      expect(calls).toHaveLength(1);
      expect(calls[0]!.args).toEqual(expect.arrayContaining(["--type", "handoff", "--dry-run"]));
      const idIndex = calls[0]!.args.indexOf("--id");
      expect(idIndex).toBe(2);
      expect(calls[0]!.args[idIndex + 1]).toMatch(/^PJR-[0-9A-Z]{4}$/);
      expect(["PJR-AB12", "PJR-AB13", "PJR-AB14"]).not.toContain(calls[0]!.args[idIndex + 1]);
      expect(calls[0]!.sections[0]).toContain("  - `night`（pending、0/1）");
      expect(calls[0]!.sections[0]).not.toContain("`old`");
      expect(calls[0]!.sections[0]).toContain("  - それより前に止まった列: 1 件");
      expect(calls[0]!.sections[0]).toContain(
        "- review の項目:\n  - [[test:pjr-ab12-review-item|PJR-AB12]] review-item",
      );
      expect(calls[0]!.sections[1]).toBe(
        "- 開いている question:\n  - [[test:pjr-ab13-ask|PJR-AB13]] ask\n",
      );
      expect(stderr.mock.calls.map((call) => String(call[0])).join("")).toContain(
        "  PJR-AB14 previous",
      );
    } finally {
      process.chdir(cwd);
      rmSync(root, { recursive: true, force: true });
    }
  });
});
