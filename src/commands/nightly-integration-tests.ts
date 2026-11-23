import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import type { Command } from "commander";
import { resolveProjectPaths } from "../exec/project.js";
import { gitEnvironment } from "../shared/git-environment.js";
import { specdojoRootDir } from "../shared/specdojo-config.js";

export type FailedIntegrationTest = {
  file: string;
  name: string;
  message: string;
};

export type IntegrationTestSummary = {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  failures: FailedIntegrationTest[];
};

const MAX_MESSAGE_LENGTH = 600;
const MAX_OUTPUT_TAIL = 4000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** The fixed argv for the full integration suite. Vitest writes the JSON report to `jsonPath`. */
export function integrationTestArgs(jsonPath: string): string[] {
  return [
    "run",
    "test:integration",
    "--",
    "--reporter=default",
    "--reporter=json",
    `--outputFile.json=${jsonPath}`,
  ];
}

function summarizeMessage(messages: unknown): string {
  const text = Array.isArray(messages)
    ? messages.filter((item): item is string => typeof item === "string").join("\n")
    : "";
  const firstLines = text
    .replace(/\u001b\[[0-9;]*m/gu, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(" / ");
  return firstLines.length > MAX_MESSAGE_LENGTH
    ? `${firstLines.slice(0, MAX_MESSAGE_LENGTH)}…`
    : firstLines;
}

/** Reads a Vitest JSON report. Throws when the report is not a Vitest result. */
export function parseVitestJsonReport(text: string, root = ""): IntegrationTestSummary {
  const parsed: unknown = JSON.parse(text);
  if (!isRecord(parsed) || !Array.isArray(parsed.testResults))
    throw new Error("Vitest JSON report has no testResults");
  const summary: IntegrationTestSummary = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    failures: [],
  };
  for (const file of parsed.testResults) {
    if (!isRecord(file)) continue;
    const fileName =
      typeof file.name === "string" ? relative(root, file.name).split("\\").join("/") : "-";
    const assertions = Array.isArray(file.assertionResults) ? file.assertionResults : [];
    for (const raw of assertions) {
      if (!isRecord(raw)) continue;
      summary.total += 1;
      if (raw.status === "passed") summary.passed += 1;
      else if (raw.status === "failed") {
        summary.failed += 1;
        summary.failures.push({
          file: fileName,
          name: typeof raw.fullName === "string" ? raw.fullName : String(raw.title ?? "-"),
          message: summarizeMessage(raw.failureMessages),
        });
      } else summary.skipped += 1;
    }
    // A file that failed to load has no assertions but a failed status.
    if (file.status === "failed" && assertions.length === 0) {
      summary.total += 1;
      summary.failed += 1;
      summary.failures.push({
        file: fileName,
        name: "(test file failed to run)",
        message: typeof file.message === "string" ? summarizeMessage([file.message]) : "",
      });
    }
  }
  return summary;
}

function cell(value: string): string {
  return value.replace(/\|/gu, "\\|").replace(/\r?\n/gu, " ");
}

export type NightlyIntegrationReportOptions = {
  projectId: string;
  startedAt: string;
  completedAt: string;
  exitCode: number;
  summary?: IntegrationTestSummary;
  outputTail?: string;
};

export function renderNightlyIntegrationReport(options: NightlyIntegrationReportOptions): string {
  const stamp = options.startedAt.replace(/[-:.]/gu, "").replace(/\d{3}Z$/u, "Z");
  const { summary } = options;
  const result = options.exitCode === 0 ? "success" : "failure";
  const counts = summary
    ? `- 件数: 合計 ${summary.total}、成功 ${summary.passed}、失敗 ${summary.failed}、skip ${summary.skipped}`
    : "- 件数: 取得できなかった（Vitest の JSON 報告がない）";
  const failureSection = summary?.failures.length
    ? `## 2. 失敗したテスト

| ファイル | テスト | 要約 |
| -------- | ------ | ---- |
${summary.failures.map((item) => `| \`${cell(item.file)}\` | ${cell(item.name)} | ${cell(item.message)} |`).join("\n")}
`
    : "";
  const tailSection =
    options.exitCode !== 0 && (!summary || summary.failures.length === 0)
      ? `## 2. 出力の末尾

\`\`\`text
${(options.outputTail ?? "").slice(-MAX_OUTPUT_TAIL).replace(/```/gu, "'''")}
\`\`\`
`
      : "";
  return `---
specdojo:
  id: ${options.projectId}:nightly-integration-tests-report-${stamp}
  type: project
  status: draft
  rulebook: none
---

# 夜間 統合テスト全件 朝報告 ${options.startedAt.slice(0, 10)}

- 開始: \`${options.startedAt}\`
- 完了: \`${options.completedAt}\`
- 結果: ${result}（終了コード ${options.exitCode}）
- コマンド: \`npm run test:integration\`
${counts}

## 1. 集計

${
  result === "success"
    ? "全件成功した。"
    : "失敗した。朝にオーケストレーターが登録簿へ項目を起票して直す。"
}

${failureSection}${tailSection}`.replace(/\n{3,}/gu, "\n\n");
}

async function runIntegrationSuite(
  jsonPath: string,
): Promise<{ code: number; outputTail: string }> {
  return await new Promise((resolveRun, reject) => {
    const child = spawn("npm", integrationTestArgs(jsonPath), {
      cwd: specdojoRootDir(),
      env: gitEnvironment(),
      stdio: "pipe",
    });
    let tail = "";
    const collect = (stream: NodeJS.WriteStream) => (chunk: Buffer) => {
      const text = chunk.toString();
      tail = (tail + text).slice(-MAX_OUTPUT_TAIL * 2);
      stream.write(text);
    };
    child.stdout.on("data", collect(process.stdout));
    child.stderr.on("data", collect(process.stderr));
    child.once("error", reject);
    child.once("close", (code) => resolveRun({ code: code ?? 1, outputTail: tail }));
  });
}

export function registerNightlyIntegrationTestsCommand(orchestrator: Command): void {
  orchestrator
    .command("integration-tests")
    .description("Run the full integration test suite and write a morning report")
    .option("--project <projectId>", "Project id in specdojo.config.json")
    .option("--scheduled-at <iso>", "Scheduled time recorded in the report")
    .action(async (options: { project?: string; scheduledAt?: string }) => {
      const workDirectory = mkdtempSync(join(tmpdir(), "specdojo-integration-"));
      try {
        const resolved = resolveProjectPaths({ project: options.project });
        const projectId = resolved.projectId ?? options.project ?? "project";
        const startedAt = new Date().toISOString();
        const jsonPath = join(workDirectory, "vitest.json");
        const { code, outputTail } = await runIntegrationSuite(jsonPath);
        let summary: IntegrationTestSummary | undefined;
        if (existsSync(jsonPath)) {
          try {
            summary = parseVitestJsonReport(readFileSync(jsonPath, "utf8"), specdojoRootDir());
          } catch (error) {
            process.stderr.write(
              `[integration-tests] cannot read the Vitest report: ${error instanceof Error ? error.message : String(error)}\n`,
            );
          }
        }
        const exitCode = code === 0 && summary && summary.failed > 0 ? 1 : code;
        const reportsPath = join(resolved.executionPath, "reports", "nightly-integration-tests");
        mkdirSync(reportsPath, { recursive: true });
        const stamp = startedAt.replace(/[-:.]/gu, "").replace(/\d{3}Z$/u, "Z");
        const reportPath = join(reportsPath, `nightly-integration-tests-${stamp}.md`);
        writeFileSync(
          reportPath,
          renderNightlyIntegrationReport({
            projectId,
            startedAt,
            completedAt: new Date().toISOString(),
            exitCode,
            ...(summary ? { summary } : {}),
            outputTail,
          }),
          "utf8",
        );
        process.stdout.write(
          `[integration-tests] morning report: ${relative(specdojoRootDir(), reportPath)}\n`,
        );
        process.exitCode = exitCode === 0 ? 0 : 1;
      } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = 1;
      } finally {
        rmSync(workDirectory, { recursive: true, force: true });
      }
    });
}
