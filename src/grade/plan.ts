import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { specdojoRootDir } from "../shared/specdojo-config.js";
import { basename, extname, join } from "node:path";
import { dump } from "../shared/yaml.js";
import {
  GRADE_PLAN_EMBEDDED_DOCUMENT_CHARACTER_LIMIT,
  agentViewpoints,
  gradedViewpoints,
  levelCapForFindings,
  parseMarkdown,
  type GradeDoneCriterion,
  type GradeFindingInput,
  type GradeTarget,
  type GradeViewpointInput,
  type MarkdownDocument,
} from "./core.js";
import { gradeResultPathForDocument, readGradeResult } from "./result.js";
import {
  assertRubric,
  loadKataReferences,
  parseGradeReferenceExample,
  repoRelativePath,
  resolveGradeReferencePathsFromCatalog,
  resolveSafeMarkdownPath,
  resolveSafeRepositoryPath,
  selectGradeReferenceExampleFromCatalog,
} from "./targets.js";
import { viewpointAppliesToDocument } from "../review/plan.js";
import type { ReviewViewpointsDoc } from "../review/types.js";

export function deterministicResults(
  document: MarkdownDocument,
  definitions: ReviewViewpointsDoc,
  target: GradeTarget,
): GradeViewpointInput[] {
  const results: GradeViewpointInput[] = [];
  const metadata = document.data.specdojo as Record<string, unknown>;
  for (const viewpoint of gradedViewpoints(definitions, target, metadata).filter(
    (item) => item.evaluation === "deterministic",
  )) {
    const findings: GradeFindingInput[] = [];
    const specdojo = document.data.specdojo as Record<string, unknown>;
    if (viewpoint.id === "vp-arc-document-structure") {
      for (const key of ["id", "type", "status"] as const) {
        if (typeof specdojo[key] !== "string" || !String(specdojo[key]).trim()) {
          findings.push({
            severity: "major",
            message: `Frontmatter の specdojo.${key} が未設定です。`,
            line: 1,
          });
        }
      }
      if (!/^#\s+\S/m.test(document.body)) {
        findings.push({ severity: "major", message: "本文に H1 見出しがありません。", line: 1 });
      }
    }
    if (viewpoint.id === "vp-qe-config-validity") {
      const placeholderLine = document.body
        .split("\n")
        .findIndex((line) => /(?:_TODO_|_ASSUMPTION_)/.test(line));
      if (placeholderLine >= 0) {
        findings.push({
          severity: "major",
          message: "未解決の _TODO_ / _ASSUMPTION_ が残っています。",
          line: placeholderLine + 1,
        });
      }
    }
    const cap = levelCapForFindings(findings);
    results.push({ id: viewpoint.id, level: cap, findings });
  }
  return results;
}

function doneCriteriaPlanLines(
  doneCriteria: readonly GradeDoneCriterion[],
  definitions: ReviewViewpointsDoc,
): string[] {
  const titles = new Map(
    (definitions.viewpoints ?? []).map((viewpoint) => [viewpoint.id, viewpoint.title]),
  );
  return [
    "### 3.4. 完了条件（done_criteria）",
    "",
    "成果物カタログが対象へ宣言する完了条件である。viewpoint と rubric による level 判定とは別の軸として、各条件を現在の本文の根拠だけで `satisfied` / `unsatisfied` のどちらかに判定する。score や level の高低から充足を推論せず、条件文が要求する内容を本文で確認できるかだけで判定する。`roles` は条件の確認責任を持つ Role code、`viewpoint` は条件を見る観点であり、`evaluation: discretionary` の観点に紐づく条件も本文の根拠で一次判定する。",
    "",
    ...doneCriteria.map((criterion) => {
      const title = titles.get(criterion.viewpoint);
      const viewpoint = title ? `${criterion.viewpoint}（${title}）` : criterion.viewpoint;
      return `- ${criterion.id} [roles=${criterion.roles.join(",")}; viewpoint=${viewpoint}]: ${criterion.text}`;
    }),
    "",
  ];
}

export function applicableDoneCriteria(
  doneCriteria: readonly GradeDoneCriterion[],
  definitions: ReviewViewpointsDoc,
  metadata: Record<string, unknown>,
): GradeDoneCriterion[] {
  const viewpoints = new Map(
    (definitions.viewpoints ?? []).map((viewpoint) => [viewpoint.id, viewpoint]),
  );
  return doneCriteria.filter((criterion) => {
    const viewpoint = viewpoints.get(criterion.viewpoint);
    return viewpoint === undefined || viewpointAppliesToDocument(viewpoint, metadata);
  });
}

type RenderGradePlanOptions = {
  target: GradeTarget;
  path: string;
  references?: string[];
  referenceExample?: string;
  viewpoints: ReviewViewpointsDoc;
  projectId: string;
  doneCriteria?: GradeDoneCriterion[];
  embedDocuments?: boolean;
  /** テスト用に上限を差し替える。CLI は既定の 100,000 文字を使う。 */
  maxEmbeddedDocumentCharacters?: number;
  /** 前回結果の読み取り元。省略時は project の execution/grade/results を使う。 */
  resultsDirectory?: string;
};

type GradePlanEmbedding = {
  requested: boolean;
  embedded: boolean;
  characterCount: number;
  limit: number;
  lines: string[];
};

function markdownFence(content: string): string {
  let longestRun = 0;
  for (const match of content.matchAll(/`+/g)) longestRun = Math.max(longestRun, match[0].length);
  return "`".repeat(Math.max(3, longestRun + 1));
}

function splitDocumentForEmbedding(content: string): { frontmatter?: string; body: string } {
  const normalized = content.replace(/\r\n?/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { body: normalized.replace(/\n$/, "") };
  return {
    frontmatter: match[1],
    body: (match[2] ?? "").replace(/^\n+/, "").replace(/\n$/, ""),
  };
}

function renderEmbeddedGradeDocument(path: string, roles: readonly string[]): string[] {
  const content = readFileSync(resolveSafeRepositoryPath(path, "embedded document"), "utf8");
  const { frontmatter, body } = splitDocumentForEmbedding(content);
  const bodyLines = body === "" ? [] : body.split("\n");
  const numberedBody = bodyLines.map((line, index) => `${index + 1} | ${line}`).join("\n");
  const lines = [
    `#### ${roles.join("・")}: \`${path}\``,
    "",
    "Frontmatter（`finding.line` の行番号対象外）:",
    "",
  ];
  if (frontmatter === undefined) {
    lines.push("- なし", "");
  } else {
    const fence = markdownFence(frontmatter);
    lines.push(`${fence}yaml`, frontmatter, fence, "");
  }
  const bodyFence = markdownFence(numberedBody);
  lines.push(
    "本文（左端は `finding.line` と同じ、Frontmatter を除く1始まりの行番号）:",
    "",
    `${bodyFence}text`,
    numberedBody,
    bodyFence,
    "",
  );
  return lines;
}

function gradePlanEmbedding(opts: {
  requested: boolean;
  targetPath: string;
  references: readonly string[];
  referenceExample?: string;
  limit: number;
}): GradePlanEmbedding {
  if (!Number.isSafeInteger(opts.limit) || opts.limit < 1) {
    throw new Error("maxEmbeddedDocumentCharacters must be a positive integer");
  }
  if (!opts.requested) {
    return { requested: false, embedded: false, characterCount: 0, limit: opts.limit, lines: [] };
  }

  const rolesByPath = new Map<string, string[]>();
  const add = (path: string, role: string) => {
    const roles = rolesByPath.get(path);
    if (roles) {
      if (!roles.includes(role)) roles.push(role);
    } else {
      rolesByPath.set(path, [role]);
    }
  };
  add(opts.targetPath, "評価対象");
  for (const reference of opts.references) add(reference, "参考資料");
  if (opts.referenceExample) add(opts.referenceExample, "良い実例");

  const lines = [...rolesByPath].flatMap(([path, roles]) =>
    renderEmbeddedGradeDocument(path, roles),
  );
  const characterCount = lines.join("\n").length;
  return {
    requested: true,
    embedded: characterCount <= opts.limit,
    characterCount,
    limit: opts.limit,
    lines: characterCount <= opts.limit ? lines : [],
  };
}

function renderGradePlanWithEmbedding(opts: RenderGradePlanOptions): {
  content: string;
  embedding: GradePlanEmbedding;
} {
  const rubric = assertRubric(opts.viewpoints);
  const absolute = resolveSafeMarkdownPath(opts.path, specdojoRootDir(), opts.projectId);
  const rel = repoRelativePath(absolute);
  const document = parseMarkdown(readFileSync(absolute, "utf8"), rel);
  const metadata = document.data.specdojo as Record<string, unknown>;
  const viewpoints = agentViewpoints(opts.viewpoints, opts.target, metadata);
  const documentId = typeof metadata.id === "string" ? metadata.id : rel;
  const priorFindings =
    readGradeResult(
      gradeResultPathForDocument({
        documentPath: absolute,
        project: opts.projectId,
        resultsDirectory: opts.resultsDirectory,
      }),
    )?.findings ?? [];
  const taskHash = createHash("sha256").update(rel).digest("hex").slice(0, 12).toUpperCase();
  const taskId = `GRADE-${opts.target.toUpperCase()}-${taskHash}`;
  const references = (opts.references ?? []).map((reference) =>
    repoRelativePath(resolveSafeRepositoryPath(reference, "reference")),
  );
  const referenceExample = opts.referenceExample
    ? repoRelativePath(
        resolveSafeMarkdownPath(opts.referenceExample, specdojoRootDir(), opts.projectId),
      )
    : undefined;
  const embedding = gradePlanEmbedding({
    requested: opts.embedDocuments ?? false,
    targetPath: rel,
    references,
    referenceExample,
    limit: opts.maxEmbeddedDocumentCharacters ?? GRADE_PLAN_EMBEDDED_DOCUMENT_CHARACTER_LIMIT,
  });
  const doneCriteria =
    opts.target === "deliverable"
      ? applicableDoneCriteria(opts.doneCriteria ?? [], opts.viewpoints, metadata)
      : [];
  const lines = [
    "---",
    dump(
      {
        specdojo: {
          id: `${opts.projectId}:grade-${opts.target}-${taskHash.toLowerCase()}-plan`,
          type: "exec-plan",
          rulebook: "none",
          task_id: taskId,
          name: `grade: ${rel}`,
          mode: "review",
          status: "ready",
          project_id: opts.projectId,
          targets: [documentId],
        },
      },
      { lineWidth: 120, noRefs: true },
    ).trimEnd(),
    "---",
    "",
    `# Review Plan: ${taskId} grade: ${rel}`,
    "",
    "この plan は grade pipeline の executor stage 用である。評価と根拠の記述だけを行い、GradeSubmission JSON は作成しない。`grade apply` が最終応答の marker を機械的に解析して GradeSubmission を生成し、契約を満たさない応答は拒否して executor を再実行する。",
    "",
    "## 1. このタスクで行うこと",
    "",
    `評価対象 \`${rel}\` を共通 viewpoint と category rubric で 0-4 判定する。deterministic viewpoint は CLI が判定するため、agent の出力には含めない。`,
    "",
    "## 2. 対象項目",
    "",
    `- \`target\`: ${opts.target}`,
    `- \`rubric\`: ${rubric.id}`,
    `- \`document_id\`: ${documentId}`,
    `- \`評価対象\`: \`${rel}\``,
    "",
    "### 参考資料",
    "",
    "参考資料は評価対象ではなく、成果物間整合を判定するための材料である。参考資料自体を評価しない。",
    "",
    ...(references.length > 0 ? references.map((reference) => `- \`${reference}\``) : ["- なし"]),
    "",
    // 比較リファレンスは任意である。指定がない場合は節ごと省略する。空の節を残すと
    // 候補が存在しないのか指定していないのかを読み手が区別できない。
    ...(referenceExample
      ? [
          "### 良い実例（比較リファレンス）",
          "",
          "`status: ready` の文書から選んだ比較材料である。記載水準を具体化するために使い、評価対象へ含めず、内容を正解として機械的に模倣しない。`ready` は品質保証ではないため、実例自体の問題を評価対象へ転用しない。",
          "",
          `- \`${referenceExample}\``,
          "",
        ]
      : []),
    ...(embedding.embedded
      ? [
          "### 埋め込み資料",
          "",
          `評価対象・参考資料・良い実例を plan 生成時点の内容で埋め込む。埋め込み部分は ${embedding.characterCount.toLocaleString("en-US")} 文字（上限 ${embedding.limit.toLocaleString("en-US")} 文字）である。`,
          "",
          ...embedding.lines,
        ]
      : embedding.requested
        ? [
            "### 埋め込み資料",
            "",
            `警告: 埋め込み部分が ${embedding.characterCount.toLocaleString("en-US")} 文字となり、上限 ${embedding.limit.toLocaleString("en-US")} 文字を超えたため、本文を埋め込まずパス参照へフォールバックした。`,
            "",
          ]
        : []),
    "## 3. 進め方",
    "",
    ...(embedding.embedded
      ? [
          "1. plan の「埋め込み資料」にある評価対象の本文を全文読む。Frontmatter は行番号の対象外であり、本文左端の番号を finding の `line` に使う。",
          "2. 埋め込まれた参考資料と良い実例がある場合はすべて読む。ファイル読み取りツールと検索ツールを使わず、plan に埋め込まれた資料だけで判定し、参考資料や良い実例を評価対象と混同しない。",
        ]
      : [
          "1. 評価対象をファイル読み取りツールで全文読み、実行ログに読み取り操作を残す。plan に対象本文は埋め込まれていないため、この手順を省略しない。",
          "2. 参考資料と良い実例がある場合は列挙された全ファイルを全文読み、実行ログに各パスの読み取り操作を残す。参考資料や良い実例を評価対象と混同しない。",
        ]),
    "3. 良い実例がある場合は、章ごとの具体性、根拠の密度、過不足を評価対象と比較して記載水準を判定する。表現の類似や実例自体の欠点を評価理由にせず、rubric と viewpoint を最終的な判定基準にする。",
    "4. 評価対象を次の rubric と viewpoint に照らし、各 viewpoint を 0-4 で判定する。ある viewpoint の finding の有無から、ほかの viewpoint の判定を推論しない。",
    "5. 判定根拠と新しい finding の message は英語で記述する。固有名詞・識別子・引用は原文を保ってよい。日本語だけの既存 finding は互換用の正本として扱い、未解消ならその message を翻訳せず原文のまま再掲する。",
    "6. level 3 以下には finding を付ける。finding には severity（blocker / major / minor / note）、対象直前の本文行番号、具体的な修正理由を含める。line は Frontmatter を除く本文の1始まり（通常は H1 が1行目）とする。level 4 は finding なしとする。",
    "7. 前回の指摘を対象の現在内容と照合し、解消済みか確認する。未解消なら前回の canonical message を変更せず今回の finding に含め、severity は前回と同等以上を指定する。前回の rule は前回評価時の分類として扱い、各 viewpoint は現在の根拠から独立に評価する。前回の問題が解消され、別の軽微な問題だけが残るため severity を引き下げる場合は、その根拠を新しい finding の message に含める。",
    "8. 前回の指摘の確認だけで終了せず、前回の指摘にない問題もすべての viewpoint で独立して検出する。",
    ...(doneCriteria.length > 0
      ? [
          "9. 完了条件（done_criteria）を1件ずつ本文の根拠と照合し、`satisfied` / `unsatisfied` を判定する。viewpoint の level や総合 score とは独立した判定であり、level が高いことを理由に条件を満たしたとみなさない。`unsatisfied` には不足している内容を英語で1行に記す。",
        ]
      : []),
    "",
    "### 3.1. 前回の指摘",
    "",
    "grade result サイドカーに記録された前回の finding を示す。対象本文には評価コメントを書き込まない。",
    "",
    // 前回の id は今回の採番と混同させないため渡さない。事実（severity / rule / 位置 / message）だけを示す。
    ...(priorFindings.length > 0
      ? [
          "```json",
          JSON.stringify(
            priorFindings.map(({ severity, rule, line, anchor, message }) => ({
              severity,
              rule,
              line,
              anchor,
              message,
            })),
            null,
            2,
          ),
          "```",
        ]
      : ["- なし"]),
    "",
    "### 3.2. Rubric",
    "",
    ...rubric.levels.map(
      (level) =>
        `- ${level.level} (${level.name}, review=${level.review_verdict}): ${level.description}`,
    ),
    "",
    "### 3.3. Viewpoints",
    "",
    ...viewpoints.map(
      (viewpoint) =>
        `- ${viewpoint.id} [${viewpoint.category}/${viewpoint.evaluation}]: ${viewpoint.check} Evidence: ${viewpoint.evidence}`,
    ),
    "",
    ...(doneCriteria.length > 0 ? doneCriteriaPlanLines(doneCriteria, opts.viewpoints) : []),
    "## 4. 完了手順",
    "",
    "1. すべての agent viewpoint の判定と、必要な finding が揃っていることを確認する。",
    "2. 最終応答では各 viewpoint を次のマーカーで1回ずつ宣言する。マーカー間には根拠や検討過程を自由形式で詳しく記述してよい。JSON、Markdown コードフェンス、GradeSubmission は出力しない。",
    "3. `LEVEL` と各 `FINDING` は `grade apply` が機械的に読み取る申告値である。marker・`LEVEL`・`FINDING` はそれぞれ行頭に1行で記し、message は英語で1行に具体的に記す。message は正本としてそのまま記録される。finding がない場合は `FINDING` 行を記さない。",
    "4. すべての viewpoint marker、0-4 の level、level 3 以下の finding、severity と非空 message が揃っていることを確認する。",
    ...(doneCriteria.length > 0
      ? [
          "5. 完了条件は `[DONE_CRITERIA]` と `[END DONE_CRITERIA]` で囲んだブロックを1回だけ置き、列挙されたすべての条件 ID を1行ずつ `<ID>: satisfied` または `<ID>: unsatisfied: <不足内容>` の形で申告する。列挙にない ID を追加せず、ID を省略しない。",
        ]
      : []),
    "",
    "```text",
    ...viewpoints.flatMap((viewpoint) => [
      `[VIEWPOINT ${viewpoint.id}]`,
      "LEVEL: <0-4>",
      "根拠を自由形式で記述する。",
      "FINDING <severity> line=<line>: level 3 以下の場合だけ、具体的な修正理由を1行で記述する。",
      "[END VIEWPOINT]",
      "",
    ]),
    ...(doneCriteria.length > 0
      ? [
          "[DONE_CRITERIA]",
          ...doneCriteria.map(
            (criterion) => `${criterion.id}: <satisfied|unsatisfied>: 不足内容を1行で記述する。`,
          ),
          "[END DONE_CRITERIA]",
          "",
        ]
      : []),
    "```",
    "",
    "## 5. 異常終了の条件",
    "",
    ...(embedding.embedded
      ? [
          "- plan に評価対象、参考資料、または良い実例の埋め込み内容が欠けている場合は、内容を推測せず異常終了する。",
        ]
      : ["- 評価対象、参考資料、または良い実例を読み取れない場合は、内容を推測せず異常終了する。"]),
    "- rubric または viewpoint に不足があり、全項目を判定できない場合は異常終了する。",
    "- すべての viewpoint の level と finding を申告できない場合は異常終了する。",
    ...(doneCriteria.length > 0
      ? ["- 列挙された完了条件のいずれかを判定できない場合は異常終了する。"]
      : []),
  ];
  return { content: `${lines.join("\n")}\n`, embedding };
}

export function renderGradePlan(opts: RenderGradePlanOptions): string {
  return renderGradePlanWithEmbedding(opts).content;
}

export function renderGradeReporterPlan(opts: {
  target: GradeTarget;
  path: string;
  viewpoints: ReviewViewpointsDoc;
  projectId: string;
  doneCriteria?: GradeDoneCriterion[];
}): string {
  const rubric = assertRubric(opts.viewpoints);
  const absolute = resolveSafeMarkdownPath(opts.path, specdojoRootDir(), opts.projectId);
  const rel = repoRelativePath(absolute);
  const document = parseMarkdown(readFileSync(absolute, "utf8"), rel);
  const metadata = document.data.specdojo as Record<string, unknown>;
  const viewpoints = agentViewpoints(opts.viewpoints, opts.target, metadata);
  const documentId = typeof metadata.id === "string" ? metadata.id : rel;
  const taskHash = createHash("sha256").update(rel).digest("hex").slice(0, 12).toUpperCase();
  const taskId = `GRADE-${opts.target.toUpperCase()}-${taskHash}-REPORTER`;
  const doneCriteria =
    opts.target === "deliverable"
      ? applicableDoneCriteria(opts.doneCriteria ?? [], opts.viewpoints, metadata)
      : [];
  const lines = [
    "---",
    dump(
      {
        specdojo: {
          id: `${opts.projectId}:grade-${opts.target}-${taskHash.toLowerCase()}-reporter-plan`,
          type: "exec-plan",
          rulebook: "none",
          task_id: taskId,
          name: `grade reporter: ${rel}`,
          mode: "review",
          status: "ready",
          project_id: opts.projectId,
          targets: [documentId],
        },
      },
      { lineWidth: 120, noRefs: true },
    ).trimEnd(),
    "---",
    "",
    `# Reporter Plan: ${taskId} grade: ${rel}`,
    "",
    "この plan は grade pipeline の reporter stage 用である。既定の pipeline は reporter を起動せず、`grade apply` が executor の marker から GradeSubmission を機械的に生成する。この plan は LLM reporter を明示指定して書き写しの精度を比較・検証する場合にだけ使う。executor の最終応答が `<grade_executor_output>` としてこの plan と一緒に渡される。評価やファイル読み取りは行わず、申告済みの判定を GradeSubmission JSON へ忠実に構造化する。",
    "",
    "## 1. このタスクで行うこと",
    "",
    "executor が申告した全 viewpoint の level と finding を、追加・省略・変更せず GradeSubmission JSON へ写す。",
    "",
    "## 2. 対象項目",
    "",
    `- \`target\`: ${opts.target}`,
    `- \`rubric\`: ${rubric.id}`,
    `- \`document_id\`: ${documentId}`,
    `- \`評価対象\`: \`${rel}\``,
    "",
    "## 3. 進め方",
    "",
    "1. `<grade_executor_output>` の `[VIEWPOINT <id>]` ごとに `LEVEL` とすべての `FINDING` を読み取る。対象文書や参考資料は読まない。",
    "2. level、severity、line、message を executor の申告どおりにコピーする。message の要約、言い換え、校正を行わない。",
    "3. executor が述べていない finding を追加せず、述べた finding を省略しない。finding の `id` は出力しない。",
    "4. finding の severity により viewpoint の level に上限がある（`blocker` は上限 0、`major` は上限 2、`minor` は上限 3）。executor の申告が上限を超えていても level は申告どおりにコピーし、補正は `grade apply` に委ねる。marker 欠落など、それ以外の GradeSubmission 契約違反は推測で補わず異常終了する。",
    ...(doneCriteria.length > 0
      ? [
          "5. `[DONE_CRITERIA]` ブロックの各行を `done_criteria` へ写す。`id` と `status`（`satisfied` / `unsatisfied`）は申告どおりにコピーし、`unsatisfied` に続く不足内容は `reason` へ一字一句コピーする。条件の追加・省略・判定変更を行わない。",
        ]
      : []),
    "",
    "## 4. 完了手順",
    "",
    "1. facts である `rubric` と `path` を次のテンプレートから変更しない。",
    "2. すべての agent viewpoint が1回ずつあり、level と finding が executor の申告と一致することを確認する。",
    ...(doneCriteria.length > 0
      ? [
          "3. `done_criteria` の各要素が executor の申告した ID と status に一致することを確認する。",
          "4. 正常終了時の最終応答は GradeSubmission JSON オブジェクト1個だけとする。前置き、要約、Markdown コードフェンスを含めない。",
        ]
      : [
          "3. 正常終了時の最終応答は GradeSubmission JSON オブジェクト1個だけとする。前置き、要約、Markdown コードフェンスを含めない。",
        ]),
    "",
    "```json",
    JSON.stringify(
      {
        rubric: rubric.id,
        documents: [
          {
            path: rel,
            viewpoints: viewpoints.map((viewpoint) => ({
              id: viewpoint.id,
              level: 4,
              findings: [],
            })),
            ...(doneCriteria.length > 0
              ? {
                  done_criteria: doneCriteria.map((criterion) => ({
                    id: criterion.id,
                    status: "satisfied",
                  })),
                }
              : {}),
          },
        ],
      },
      null,
      2,
    ),
    "```",
    "",
    "## 5. 異常終了の条件",
    "",
    "- `<grade_executor_output>` が渡されていない、または marker 契約を解析できない場合は異常終了する。",
    "- level の下方向補正を除き、executor の申告を変更しなければ GradeSubmission の契約を満たせない場合は異常終了する。",
  ];
  return `${lines.join("\n")}\n`;
}

export function gradePlanFilename(path: string): string {
  const rel = repoRelativePath(path);
  const stem = basename(path, extname(path))
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const hash = createHash("sha256").update(rel).digest("hex").slice(0, 10);
  return `${stem || "document"}-${hash}-grade-plan.md`;
}

function gradeReporterPlanFilename(path: string): string {
  return gradePlanFilename(path).replace(/-grade-plan\.md$/, "-grade-reporter-plan.md");
}

export function writeGradePlans(opts: {
  target: GradeTarget;
  paths: string[];
  referenceExampleCandidates: string[];
  // 明示指定があれば選定を行わず固定する。比較実験では選定の揺れを排除する必要があり、
  // 運用でも特定の実例へ水準を揃えたい場合がある。
  referenceExampleOverride?: string;
  viewpoints: ReviewViewpointsDoc;
  projectId: string;
  outputDirectory: string;
  embedDocuments?: boolean;
  random?: () => number;
  // リポジトリ相対パスをキーにした done_criteria 定義。deliverable の plan だけが使う。
  doneCriteriaByPath?: ReadonlyMap<string, GradeDoneCriterion[]>;
}): {
  path: string;
  changed: boolean;
  reporterPath: string;
  reporterChanged: boolean;
  target: string;
  referenceExample?: string;
  documentsEmbedded: boolean;
  embeddingCharacterCount: number;
  embeddingCharacterLimit: number;
}[] {
  const outputDirectory = resolveSafeRepositoryPath(opts.outputDirectory, "--out");
  if (opts.paths.length === 0) return [];
  mkdirSync(outputDirectory, { recursive: true });
  const kataReferences = loadKataReferences();
  const referenceExamples = opts.referenceExampleCandidates.flatMap((candidate) => {
    const parsed = parseGradeReferenceExample(candidate, opts.target, opts.projectId);
    return parsed ? [parsed] : [];
  });
  return opts.paths.map((path) => {
    const absolute = resolveSafeMarkdownPath(path, specdojoRootDir(), opts.projectId);
    const output = join(outputDirectory, gradePlanFilename(absolute));
    const reporterOutput = join(outputDirectory, gradeReporterPlanFilename(absolute));
    const referenceExample =
      opts.referenceExampleOverride ??
      selectGradeReferenceExampleFromCatalog({
        target: opts.target,
        path: absolute,
        project: opts.projectId,
        candidates: referenceExamples,
        random: opts.random,
      });
    const doneCriteria = opts.doneCriteriaByPath?.get(repoRelativePath(absolute));
    const rendered = renderGradePlanWithEmbedding({
      target: opts.target,
      path: absolute,
      references: resolveGradeReferencePathsFromCatalog(absolute, kataReferences, opts.projectId),
      referenceExample,
      viewpoints: opts.viewpoints,
      projectId: opts.projectId,
      doneCriteria,
      embedDocuments: opts.embedDocuments,
    });
    const content = rendered.content;
    const reporterContent = renderGradeReporterPlan({
      target: opts.target,
      path: absolute,
      viewpoints: opts.viewpoints,
      projectId: opts.projectId,
      doneCriteria,
    });
    const changed = !existsSync(output) || readFileSync(output, "utf8") !== content;
    const reporterChanged =
      !existsSync(reporterOutput) || readFileSync(reporterOutput, "utf8") !== reporterContent;
    if (changed) writeFileSync(output, content, "utf8");
    if (reporterChanged) writeFileSync(reporterOutput, reporterContent, "utf8");
    return {
      path: repoRelativePath(output),
      changed,
      reporterPath: repoRelativePath(reporterOutput),
      reporterChanged,
      target: repoRelativePath(absolute),
      referenceExample,
      documentsEmbedded: rendered.embedding.embedded,
      embeddingCharacterCount: rendered.embedding.characterCount,
      embeddingCharacterLimit: rendered.embedding.limit,
    };
  });
}

// executor の最終応答に現れる marker 行の軽微な書式の揺れを正規化する。受理するのは、行頭の
// 空白、ブロッククオート `>`、リスト記号（`-` / `*` / `+` と空白）、および marker・LEVEL・
// FINDING・DC-NNN の見出し部分を囲む `**` だけである。message と reason の本文は変更しない。
// 文中に埋もれた FINDING などは marker とみなさず、従来どおり無視または拒否する。
