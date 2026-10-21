import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import type { Command } from "commander";
import { resolveProjectPaths } from "../exec/project.js";
import { loadRegisterItems, resolveRegisterPaths, type PjrItem } from "../register/register.js";
import { specdojoRootDir } from "../shared/specdojo-config.js";

export type NightRunOutcome = {
  id: string;
  outcome: "success" | "failure" | "skipped";
  transition: "done" | "waiting" | "review" | "none";
  reason?: string;
};

export function selectApprovedNightItems(items: readonly PjrItem[], limit: number): PjrItem[] {
  return items
    .filter(
      (item) =>
        item.autopilot === "approved" &&
        (item.type === "todo" || item.type === "issue") &&
        item.status === "open",
    )
    .sort((a, b) => (a.id === b.id ? 0 : a.id < b.id ? -1 : 1))
    .slice(0, limit);
}

export function parseRegisterRunSummary(output: string): NightRunOutcome[] {
  const results: NightRunOutcome[] = [];
  for (const line of output.split(/\r?\n/u)) {
    const match = line.match(
      /^\s+(PJR-[0-9A-Z]{4})\s+(success|failure|skipped)\s+transition=(done|waiting|review|none)\s+commit=.*?(?:\s{2}reason=(.*))?$/u,
    );
    if (!match) continue;
    results.push({
      id: match[1],
      outcome: match[2] as NightRunOutcome["outcome"],
      transition: match[3] as NightRunOutcome["transition"],
      ...(match[4]?.trim() ? { reason: match[4].trim() } : {}),
    });
  }
  return results;
}

export function consecutiveFailureCount(
  previous: number,
  outcomes: readonly NightRunOutcome[],
): number {
  let count = previous;
  for (const outcome of outcomes) {
    if (outcome.outcome === "failure") count += 1;
    else if (outcome.outcome === "success") count = 0;
  }
  return count;
}

export function requiresDerivedApproval(outcome: NightRunOutcome): boolean {
  if (outcome.outcome !== "failure") return false;
  return /protected|agent-config-write|git-state|\b(?:tag|push|publish)\b|CHANGELOG|scope|範囲|承認/iu.test(
    outcome.reason ?? "",
  );
}

function positiveInteger(value: string, option: string): number {
  if (!/^[1-9]\d*$/u.test(value)) throw new Error(`${option} must be a positive integer: ${value}`);
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) throw new Error(`${option} is too large: ${value}`);
  return parsed;
}

function safeCell(value: string | undefined): string {
  return (value?.trim() || "-").replaceAll("|", "\\|").replace(/\r?\n/gu, " ");
}

export function renderNightReport(options: {
  projectId: string;
  startedAt: string;
  completedAt: string;
  selected: readonly PjrItem[];
  outcomes: readonly NightRunOutcome[];
  approvalIssues: ReadonlyMap<string, string>;
  stopReason?: string;
}): string {
  const stamp = options.startedAt
    .replace(/[-:.]/gu, "")
    .replace(/\.\d+Z$/u, "Z")
    .toLowerCase();
  const byId = new Map(options.outcomes.map((outcome) => [outcome.id, outcome]));
  const rows = options.selected.map((item) => {
    const outcome = byId.get(item.id);
    return `| ${item.id} | ${outcome?.outcome ?? "skipped"} | ${outcome?.transition ?? "none"} | ${safeCell(outcome?.reason)} |`;
  });
  const closed = options.outcomes
    .filter((item) => item.transition === "done")
    .map((item) => item.id);
  const waiting = options.outcomes
    .filter((item) => item.transition === "waiting")
    .map((item) => item.id);
  const approvals = [...options.approvalIssues].map(
    ([source, created]) => `${created}（${source} 由来）`,
  );
  const list = (values: readonly string[]) => (values.length > 0 ? values.join("、") : "なし");
  return `---
specdojo:
  id: ${options.projectId}:night-orchestrator-report-${stamp}
  type: report
  status: draft
---

# 夜間 orchestrator 朝報告 ${options.startedAt.slice(0, 10)}

- 開始: \`${options.startedAt}\`
- 完了: \`${options.completedAt}\`
- 停止理由: ${safeCell(options.stopReason)}

## 集計

- close: ${list(closed)}
- \`waiting\`: ${list(waiting)}
- 新しい承認待ち: ${list(approvals)}

## 実行結果

| 項目 | 結果 | 遷移 | 理由 |
| ---- | ---- | ---- | ---- |
${rows.join("\n") || "| - | skipped | none | 承認済みの open todo/issue なし |"}
`;
}

type CapturedResult = { code: number; stdout: string; stderr: string };
const MAX_CAPTURED_OUTPUT = 2 * 1024 * 1024;

function appendOutputTail(current: string, chunk: string): string {
  const combined = current + chunk;
  return combined.length <= MAX_CAPTURED_OUTPUT
    ? combined
    : combined.slice(combined.length - MAX_CAPTURED_OUTPUT);
}

async function runCaptured(command: string, args: string[]): Promise<CapturedResult> {
  return await new Promise((resolveRun, reject) => {
    const child = spawn(command, args, {
      cwd: specdojoRootDir(),
      env: process.env,
      stdio: "pipe",
    }) as ChildProcessWithoutNullStreams;
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => {
      const text = chunk.toString();
      stdout = appendOutputTail(stdout, text);
      process.stdout.write(text);
    });
    child.stderr.on("data", (chunk: Buffer) => {
      const text = chunk.toString();
      stderr = appendOutputTail(stderr, text);
      process.stderr.write(text);
    });
    child.once("error", reject);
    child.once("close", (code) => resolveRun({ code: code ?? 1, stdout, stderr }));
  });
}

function cliInvocation(args: string[]): [string, string[]] {
  const entry = process.argv[1];
  if (!entry) throw new Error("Cannot resolve the current specdojo CLI entry point.");
  return [process.execPath, [entry, ...args]];
}

async function addDerivedApprovalIssue(
  projectId: string,
  item: PjrItem,
  reason: string,
): Promise<string> {
  const [command, args] = cliInvocation([
    "register",
    "add",
    "--project",
    projectId,
    "--type",
    "issue",
    "--title",
    `${item.id} 夜間実行で見つかった承認待ち`,
    "--description",
    `夜間 orchestrator は承認範囲外の対応が必要と判断した。元項目は ${item.id}。理由: ${reason}`,
    "--priority",
    item.priority,
    "--owner",
    item.owner,
    "--from",
    item.id,
    "--topic",
    `night-approval-${item.id.toLowerCase()}`,
    "--by",
    "night-orchestrator",
    "--reason",
    "approved night run requires human authorization",
  ]);
  const result = await runCaptured(command, args);
  if (result.code !== 0) throw new Error(`Failed to create derived approval for ${item.id}.`);
  const created = result.stdout.match(/\(added (PJR-[0-9A-Z]{4})\)/u)?.[1];
  if (!created) throw new Error(`Could not read the derived approval ID for ${item.id}.`);
  return created;
}

export function registerNightOrchestratorCommand(orchestrator: Command): void {
  orchestrator
    .command("night")
    .description("Run only human-approved register todo/issue items and write a morning report")
    .option("--project <projectId>", "Project id in specdojo.config.json")
    .option("--max-items <n>", "Maximum items in one night", "10")
    .option("--parallel <n>", "Maximum parallel item runs", "2")
    .option("--max-consecutive-failures <n>", "Stop after this many consecutive failures", "2")
    .option(
      "--on-rate-limit <action>",
      "Override the difficulty route's pinned-agent action: stop|wait|fallback",
    )
    .option(
      "--fallback-executor-by <nickname>",
      "Fallback executor for rate limits or configured connection errors",
    )
    .option("--scheduled-at <dateTime>", "Scheduled occurrence time used in the report")
    .option("--dry-run", "Print the approved queue without executing", false)
    .action(async (opts) => {
      try {
        const maxItems = positiveInteger(opts.maxItems, "--max-items");
        const parallel = positiveInteger(opts.parallel, "--parallel");
        const maxFailures = positiveInteger(
          opts.maxConsecutiveFailures,
          "--max-consecutive-failures",
        );
        if (
          opts.onRateLimit !== undefined &&
          !["stop", "wait", "fallback"].includes(opts.onRateLimit)
        ) {
          throw new Error('--on-rate-limit must be "stop", "wait", or "fallback".');
        }
        const resolved = resolveProjectPaths({ project: opts.project });
        const projectId = resolved.projectId ?? opts.project;
        if (!projectId) throw new Error("orchestrator night requires --project <id>.");
        const items = loadRegisterItems(resolveRegisterPaths({ project: projectId })).map(
          (view) => view.item,
        );
        const selected = selectApprovedNightItems(items, maxItems);
        process.stdout.write(
          `[night] approved queue (${selected.length}/${maxItems}): ${selected.map((item) => item.id).join(", ") || "none"}\n`,
        );
        if (opts.dryRun) return;

        const startedAt = opts.scheduledAt
          ? new Date(opts.scheduledAt).toISOString()
          : new Date().toISOString();
        const outcomes: NightRunOutcome[] = [];
        const approvalIssues = new Map<string, string>();
        let consecutiveFailures = 0;
        let stopReason: string | undefined;
        for (let offset = 0; offset < selected.length; offset += parallel) {
          const wave = selected.slice(offset, offset + parallel);
          const [command, args] = cliInvocation([
            "exec",
            "run",
            "--project",
            projectId,
            "--register",
            ...wave.map((item) => item.id),
            "--worktree",
            "--post-review",
            "--parallel",
            String(parallel),
            "--on-failure",
            "continue",
            ...(opts.onRateLimit ? ["--on-rate-limit", opts.onRateLimit] : []),
            ...(opts.fallbackExecutorBy ? ["--fallback-executor-by", opts.fallbackExecutorBy] : []),
          ]);
          const result = await runCaptured(command, args);
          const parsed = parseRegisterRunSummary(result.stdout);
          const parsedById = new Map(parsed.map((outcome) => [outcome.id, outcome]));
          const waveOutcomes = wave.map(
            (item): NightRunOutcome =>
              parsedById.get(item.id) ?? {
                id: item.id,
                outcome: "failure",
                transition: "waiting",
                reason: `exec run ended with code ${result.code} without an item summary`,
              },
          );
          outcomes.push(...waveOutcomes);
          for (const outcome of waveOutcomes) {
            if (!requiresDerivedApproval(outcome)) continue;
            const source = wave.find((item) => item.id === outcome.id);
            if (source) {
              const existing = items.find(
                (item) =>
                  item.type === "issue" &&
                  !["done", "decided", "rejected", "deferred"].includes(item.status) &&
                  item.derivedFrom?.includes(source.id) &&
                  item.title.startsWith(`${source.id} 夜間実行で見つかった承認待ち`),
              );
              approvalIssues.set(
                source.id,
                existing?.id ??
                  (await addDerivedApprovalIssue(
                    projectId,
                    source,
                    outcome.reason ?? "approval required",
                  )),
              );
            }
          }
          consecutiveFailures = consecutiveFailureCount(consecutiveFailures, waveOutcomes);
          if (consecutiveFailures >= maxFailures) {
            stopReason = `連続失敗が上限 ${maxFailures} 件に達した`;
            break;
          }
        }
        const processed = new Set(outcomes.map((outcome) => outcome.id));
        for (const item of selected) {
          if (!processed.has(item.id)) {
            outcomes.push({
              id: item.id,
              outcome: "skipped",
              transition: "none",
              reason: stopReason ?? "not started",
            });
          }
        }
        const completedAt = new Date().toISOString();
        const reportsPath = join(resolved.executionPath, "reports", "night-orchestrator");
        mkdirSync(reportsPath, { recursive: true });
        const reportName = `night-orchestrator-${startedAt.replace(/[-:.]/gu, "").replace(/\.\d+Z$/u, "Z")}.md`;
        const reportPath = join(reportsPath, reportName);
        writeFileSync(
          reportPath,
          renderNightReport({
            projectId,
            startedAt,
            completedAt,
            selected,
            outcomes,
            approvalIssues,
            ...(stopReason ? { stopReason } : {}),
          }),
          "utf8",
        );
        process.stdout.write(
          `[night] morning report: ${relative(specdojoRootDir(), reportPath)}\n`,
        );
        if (outcomes.some((outcome) => outcome.outcome === "failure")) process.exitCode = 2;
      } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = 1;
      }
    });
}
