import { randomUUID } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import {
  QUICK_START_TODO_SCENARIO,
  captureState,
  checkAfterApproval,
  committedFiles,
  compareBeforeApproval,
  prepareFixtureRepository,
  readEventActions,
  readTicketFields,
  runOrchestratorTurn,
} from "./helpers/orchestrator-scenario.js";

// PJR-FNB7: 実オーケストレーター（claude CLI）を呼ぶため、npm test には入れない。
// `npm run test:agent` で流す。回数とモデルは環境変数で変える。
const PROJECT_ROOT = fileURLToPath(new URL("../..", import.meta.url));
const RUNS = Number(process.env.SPECDOJO_AGENT_TEST_RUNS ?? "5");
const MODEL = process.env.SPECDOJO_AGENT_TEST_MODEL ?? "sonnet";
const TURN_TIMEOUT_MS = 10 * 60 * 1000;
if (!Number.isInteger(RUNS) || RUNS < 1) {
  throw new Error(`SPECDOJO_AGENT_TEST_RUNS must be a positive integer: ${String(RUNS)}`);
}

interface RunRecord {
  run: number;
  passed: boolean;
  durationMs: number;
  costUsd: number;
  failures: string[];
  replies: string[];
}

const records: RunRecord[] = [];

afterAll(() => {
  const passed = records.filter((record) => record.passed).length;
  const summary = {
    scenario: "quick-start-guide: 機能追加を起票する（todo）",
    model: MODEL,
    runs: records.length,
    passed,
    passRate: records.length === 0 ? 0 : passed / records.length,
    totalDurationMs: records.reduce((sum, record) => sum + record.durationMs, 0),
    totalCostUsd: records.reduce((sum, record) => sum + record.costUsd, 0),
    records,
  };
  const outDir = path.join(PROJECT_ROOT, "tmp", "agent-test");
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(
    outDir,
    `orchestrator-quick-start-${new Date().toISOString().replace(/[:.]/g, "")}.json`,
  );
  writeFileSync(outPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  console.log(
    `orchestrator quick-start: ${passed}/${records.length} passed, ` +
      `${(summary.totalDurationMs / 1000).toFixed(1)}s, $${summary.totalCostUsd.toFixed(4)} -> ${outPath}`,
  );
});

describe("Quick Start の todo 起票の対話を実オーケストレーターで流す", () => {
  it.each(Array.from({ length: RUNS }, (_, index) => index + 1))(
    "run %i: 承認の前は状態を変えず、承認の後に個票・イベント・commit を残す",
    async (run) => {
      const repo = mkdtempSync(path.join(tmpdir(), "specdojo-agent-fnb7-"));
      const record: RunRecord = {
        run,
        passed: false,
        durationMs: 0,
        costUsd: 0,
        failures: [],
        replies: [],
      };
      records.push(record);
      try {
        prepareFixtureRepository(repo, PROJECT_ROOT);
        const baseline = captureState(repo);
        const sessionId = randomUUID();
        for (const [index, turn] of QUICK_START_TODO_SCENARIO.entries()) {
          const result = await runOrchestratorTurn({
            repo,
            model: MODEL,
            sessionId,
            isFirstTurn: index === 0,
            message: turn.message,
            timeoutMs: TURN_TIMEOUT_MS,
          });
          record.durationMs += result.durationMs;
          record.costUsd += result.costUsd;
          record.replies.push(result.resultText);
          if (result.isError) record.failures.push(`turn ${index + 1}: claude reported is_error`);
          const current = captureState(repo);
          if (!turn.isApproval) {
            record.failures.push(
              ...compareBeforeApproval(baseline, current).map(
                (failure) => `turn ${index + 1}: ${failure}`,
              ),
            );
            continue;
          }
          record.failures.push(
            ...checkAfterApproval({
              before: baseline,
              after: current,
              committedFiles: committedFiles(repo, baseline.head, current.head),
              readTicketFields: (ticketPath) => readTicketFields(repo, ticketPath),
              readEventActions: (eventPath) => readEventActions(repo, eventPath),
            }),
          );
        }
      } catch (error) {
        record.failures.push(error instanceof Error ? error.message : String(error));
      } finally {
        record.passed = record.failures.length === 0;
        rmSync(repo, { recursive: true, force: true });
      }

      expect(record.failures).toEqual([]);
    },
    // 3 発言分の上限と、fixture の準備の余裕
    3 * TURN_TIMEOUT_MS + 60_000,
  );
});
