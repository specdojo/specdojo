import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { dump, load } from "js-yaml";
import { gitEnvironment } from "../../../src/exec/worktree.js";
import { GRADE_RUN_MARKERS } from "../../helpers/grade-run-fixture.js";

// 型を整備する schedule（intent が improve-kata）の review の段を、CLI 経路で 1 回通す。
// 型の grade と review の段の事前の grade の組み合わせは、第 3 波の 090 で初めて食い違いが
// 分かった（PJR-Z17T）。agent と grade の agent は fixture のコマンドで代える。

const REAL_REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const TSX = join(REAL_REPO_ROOT, "node_modules", ".bin", "tsx");
const CLI = join(REAL_REPO_ROOT, "src", "specdojo.ts");
const TASK_ID = "T-KATA-overview-090";
const RULEBOOK_PATH = "docs/ja/specdojo/rulebooks/test-rulebook.md";
const SAMPLE_PATH = "docs/ja/specdojo/samples/test-sample.md";
const GRADE_NEEDS_WORK_MARKERS =
  "[VIEWPOINT vp-content]\nLEVEL: 2\nFINDING major line=7: 内容が不足している。\n[END VIEWPOINT]\n";
const TEST_TIMEOUT_MS = 240_000;

const tempDirs: string[] = [];

type Fixture = { repo: string; logPath: string };
type GradeLevel = "pass" | "needs-work";

function write(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function git(cwd: string, ...args: string[]): string {
  const result = spawnSync("git", ["-C", cwd, ...args], {
    encoding: "utf8",
    env: gitEnvironment(),
  });
  if (result.status !== 0) throw new Error(String(result.stderr));
  return String(result.stdout).trim();
}

// 1 つの script が grade の agent・review の executor・reporter を、prompt の内容で振り分ける。
// 呼び出しは対象リポジトリの外のログへ 1 行ずつ残す。
function fakeAgentScript(logPath: string, sampleGrade: GradeLevel, failFreshnessCheck: boolean) {
  const evidence = {
    final_message: "型の grade を確認し、review の判断材料を集めた。",
    validations: failFreshnessCheck
      ? [
          {
            command: "specdojo grade list --changed-only",
            status: "failed",
            summary: "最新でない評価結果がある。",
          },
        ]
      : [],
  };
  const reporter = {
    schema_version: 1,
    mode: "review",
    grade_check: "型の評価結果を確認した。",
    rationale: ["fixture の reporter は常に complete を返す。"],
    improvements: [],
    approach: "plan と evidence だけを根拠にした。",
    verdict: "complete",
  };
  return [
    'const fs = require("node:fs");',
    'const prompt = fs.readFileSync(0, "utf8");',
    "let role = 'grader';",
    "if (prompt.includes('You are the reporter stage')) role = 'reporter';",
    "else if (prompt.includes('grade の対象種別')) role = 'executor';",
    `fs.appendFileSync(${JSON.stringify(logPath)}, JSON.stringify({ role, prompt }) + "\\n");`,
    `if (role === 'executor') process.stdout.write("<specdojo_executor_evidence>" + ${JSON.stringify(JSON.stringify(evidence))} + "</specdojo_executor_evidence>\\n");`,
    `else if (role === 'reporter') process.stdout.write(${JSON.stringify(JSON.stringify(reporter))});`,
    `else process.stdout.write(prompt.includes(${JSON.stringify(SAMPLE_PATH)}) ? ${JSON.stringify(sampleGrade === "pass" ? GRADE_RUN_MARKERS : GRADE_NEEDS_WORK_MARKERS)} : ${JSON.stringify(GRADE_RUN_MARKERS)});`,
    "",
  ].join("\n");
}

function setupFixture(sampleGrade: GradeLevel, failFreshnessCheck: boolean): Fixture {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-kata-review-stage-"));
  const logDir = mkdtempSync(join(tmpdir(), "specdojo-kata-review-stage-log-"));
  tempDirs.push(repo, logDir);
  const logPath = join(logDir, "agent-calls.jsonl");
  writeFileSync(logPath, "", "utf8");
  symlinkSync(join(REAL_REPO_ROOT, "node_modules"), join(repo, "node_modules"), "dir");
  write(join(repo, ".gitignore"), ".specdojo/doc-index.json\n**/generated/\nnode_modules\n");
  write(join(repo, "package.json"), '{"name":"kata-review-stage-fixture"}\n');
  write(
    join(repo, ".specdojo/specdojo.config.json"),
    `${JSON.stringify({
      version: 1,
      current_project: "test",
      projects: {
        test: {
          schedule_path: "schedule",
          execution_path: "execution",
          catalog_path: "kata-catalog",
          members_path: "pm-members.yaml",
          viewpoints_path: "viewpoints.yaml",
        },
      },
    })}\n`,
  );
  write(join(repo, ".specdojo/exec-defaults.yaml"), "pipeline:\n  parent_validations: []\n");
  const member = (nickname: string, stageRole: string): Record<string, unknown> => ({
    nickname,
    display_name: nickname,
    email: null,
    roles: ["QE"],
    type: "agent",
    provider: "custom",
    mode: "review",
    stage_role: stageRole,
    command: "node fake-agent.cjs",
    capabilities: [],
    proficiency: "normal",
    priority: 1,
  });
  write(
    join(repo, ".specdojo/agent-members.yaml"),
    dump({
      version: 1,
      members: [
        member("fixture-review-executor", "executor"),
        member("fixture-reporter", "reporter"),
      ],
    }),
  );
  write(
    join(repo, "pm-members.yaml"),
    [
      "id: test:pm-members",
      "type: project",
      "status: draft",
      "title: Members",
      "rulebook: specdojo:pm-members-rulebook",
      "version: 1",
      "project_id: test",
      "members: []",
      "",
    ].join("\n"),
  );
  write(join(repo, "fake-agent.cjs"), fakeAgentScript(logPath, sampleGrade, failFreshnessCheck));

  // grade の rubric と観点。
  write(
    join(repo, "viewpoints.yaml"),
    dump({
      id: "test:pm-review-viewpoints",
      type: "project",
      status: "draft",
      grade_rubric: {
        id: "grade-rubric-v1",
        pass_score: 70,
        levels: [0, 1, 2, 3, 4].map((level) => ({
          level,
          name: `L${level}`,
          description: `Level ${level}`,
          review_verdict:
            level === 4 ? "complete" : level === 3 ? "complete-with-findings" : "incomplete",
        })),
        weights: { kata: { quality: 100 }, deliverable: { quality: 100 } },
      },
      viewpoints: [
        {
          id: "vp-content",
          role: "QE",
          category: "quality",
          title: "Content",
          check: "Check the content.",
          evidence: "Document text.",
          default_severity: "major",
          evaluation: "referential",
        },
      ],
    }),
  );

  // 型の文書: 代表は sample で、rulebook が sample を宣言する。
  write(
    join(repo, RULEBOOK_PATH),
    "---\nspecdojo:\n  id: specdojo:test-rulebook\n  type: rulebook\n  status: draft\n  sample: specdojo:test-sample\n  recipe: not-needed\n  template: not-needed\n---\n\n# Rulebook\n\nRulebook text.\n",
  );
  write(
    join(repo, SAMPLE_PATH),
    "---\nspecdojo:\n  id: specdojo:test-sample\n  type: sample\n  status: draft\n  rulebook: specdojo:test-rulebook\n---\n\n# Sample\n\nSample text.\n",
  );
  write(
    join(repo, "kata-catalog/dct-kata.yaml"),
    dump({
      id: "test:dct-kata",
      type: "project",
      status: "draft",
      project_id: "test",
      domain: "kata",
      base_path: "/docs/ja/specdojo",
      groups: [
        {
          base_path: "samples",
          deliverables: [
            {
              local_id: "overview",
              name: "Sample",
              kind: "work",
              overview: "Sample of the kata",
              path: "test-sample.md",
              rulebook: "specdojo:test-rulebook",
              done_criteria: [{ text: "Sample is complete", roles: ["QE"] }],
            },
          ],
        },
      ],
    }),
  );

  // intent が improve-kata で、review の段（090）だけを持つ型の schedule。
  write(
    join(repo, "schedule/sch-strategy-kata.yaml"),
    dump({
      kind: "strategy",
      track: "kata",
      phase_sets: {
        "kata-review": [
          {
            id: "review",
            name: "Review",
            task_suffix: "090",
            mode: "review",
            agent_pipeline: {
              stages: [
                { stage_role: "executor", proficiency: "normal" },
                { stage_role: "reporter", proficiency: "normal" },
              ],
            },
          },
        ],
      },
      owner_rules: [{ local_ids: ["overview"], owner: "QE", phase_set: "kata-review" }],
      approach_rules: [{ local_ids: ["overview"], intent: "improve-kata", kata_target: "sample" }],
    }),
  );
  write(
    join(repo, "schedule/sch-track-kata.yaml"),
    dump({
      kind: "track",
      id: "test:sch-track-kata",
      type: "project",
      status: "draft",
      version: 1,
      project_id: "test",
      track: "kata",
      tasks: [
        {
          local_id: "overview",
          phase_suffix: "090",
          name: "Overview",
          duration_days: 1,
          depends_on: [],
          owner: "QE",
        },
      ],
    }),
  );
  mkdirSync(join(repo, "execution/exec/events"), { recursive: true });
  cpSync(
    join(REAL_REPO_ROOT, "docs/ja/specdojo/exec-templates"),
    join(repo, "docs/ja/specdojo/exec-templates"),
    { recursive: true },
  );
  git(repo, "init", "-b", "project/test/develop");
  git(repo, "add", ".");
  git(repo, "commit", "-m", "test: fixture");
  return { repo, logPath };
}

function runReviewStage(repo: string): ReturnType<typeof spawnSync> {
  return spawnSync(
    process.execPath,
    [TSX, CLI, "exec", "run", "--project", "test", "--task", TASK_ID],
    {
      cwd: repo,
      encoding: "utf8",
      env: {
        ...gitEnvironment(),
        CI: "true",
        LEFTHOOK: "0",
        XDG_STATE_HOME: join(repo, "..", `${repo.split("/").at(-1)}-state`),
      },
      timeout: TEST_TIMEOUT_MS - 30_000,
    },
  );
}

type AgentCall = { role: "grader" | "executor" | "reporter"; prompt: string };

function readAgentCalls(logPath: string): AgentCall[] {
  return readFileSync(logPath, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as AgentCall);
}

function listFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));
}

function gradeSidecar(repo: string, documentPath: string): { target: string; verdict: string } {
  const sidecars = listFiles(join(repo, "execution/grade/results")).filter((path) =>
    path.endsWith(".yaml"),
  );
  const matching = sidecars
    .map(
      (path) =>
        load(readFileSync(path, "utf8")) as { path: string; target: string; verdict: string },
    )
    .filter((result) => result.path === documentPath);
  expect(matching).toHaveLength(1);
  return matching[0]!;
}

function reviewFiles(repo: string, name: "plan.md" | "result.md"): string {
  const paths = listFiles(join(repo, "execution")).filter(
    (path) => path.includes(TASK_ID) && path.endsWith(`/${name}`),
  );
  expect(paths).toHaveLength(1);
  return readFileSync(paths[0]!, "utf8");
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("kata schedule review stage", { timeout: TEST_TIMEOUT_MS }, () => {
  it("grades the kata once with --target kata and completes when the kata grade passes", () => {
    const fixture = setupFixture("pass", true);

    const result = runReviewStage(fixture.repo);

    const output = `${result.stdout}\n${result.stderr}`;
    expect(result.status, output).toBe(0);
    const calls = readAgentCalls(fixture.logPath);
    const gradeCalls = calls.filter((call) => call.role === "grader");
    // 代表の sample と宣言された rulebook を、それぞれ 1 回だけ評価する。
    expect(gradeCalls).toHaveLength(2);
    for (const path of [SAMPLE_PATH, RULEBOOK_PATH]) {
      expect(output.split(`graded: ${path} `)).toHaveLength(2);
    }
    expect(gradeSidecar(fixture.repo, SAMPLE_PATH).target).toBe("kata");
    expect(gradeSidecar(fixture.repo, RULEBOOK_PATH).target).toBe("kata");
    expect(reviewFiles(fixture.repo, "plan.md")).toContain(
      "grade の対象種別（`--target`）: `kata`",
    );
    expect(output).not.toContain("--target deliverable");
    expect(reviewFiles(fixture.repo, "result.md")).toContain("- verdict: complete");
    expect(output).toContain(`run done: ${TASK_ID}`);
  });

  it("records the verdict instead of blocking when the executor records the freshness check as failed", () => {
    const fixture = setupFixture("pass", true);

    const result = runReviewStage(fixture.repo);

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    const executorCalls = readAgentCalls(fixture.logPath).filter(
      (call) => call.role === "executor",
    );
    expect(executorCalls).toHaveLength(1);
    expect(`${result.stdout}`).not.toContain("run blocked");
    expect(reviewFiles(fixture.repo, "result.md")).toMatch(/^- verdict: complete$/m);
  });

  it("does not complete the review while the kata grade is needs-work", () => {
    const fixture = setupFixture("needs-work", false);

    const result = runReviewStage(fixture.repo);

    const output = `${result.stdout}\n${result.stderr}`;
    expect(gradeSidecar(fixture.repo, SAMPLE_PATH).verdict).toBe("needs-work");
    expect(reviewFiles(fixture.repo, "result.md")).toMatch(/^- verdict: incomplete$/m);
    // reporter が complete を返しても、runner が型の grade を理由に verdict を制限する。
    expect(reviewFiles(fixture.repo, "result.md")).not.toMatch(/^- verdict: complete/m);
    expect(reviewFiles(fixture.repo, "result.md")).toContain("verdict を `incomplete` に制限した");
    expect(output).toContain("Reporter complete");
  });
});
