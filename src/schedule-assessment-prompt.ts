// Renders the agent instruction for the readiness assessment. The instruction is plain Markdown
// so it can be piped into any SpecDojo agent execution path. The agent's only output is a
// sch-assessment-<track>.yaml that conforms to sch-assessment.schema.yaml — it never edits
// sch-strategy-<track>.yaml, never searches for files, and never rewrites `facts`.

import type { AssessedDeliverable, KataKindKey } from "./schedule-assessment.js";
import { KATA_KINDS } from "./schedule-assessment.js";

export type AssessmentPromptOptions = {
  projectId: string;
  track: string;
  strategyRelPath: string;
  assessmentRelPath: string;
  schemaRelPath: string;
  deliverables: AssessedDeliverable[];
  assessmentExists: boolean;
};

const KATA_LABEL: Record<KataKindKey, string> = {
  rulebook: "rulebook（構造・必須事項・禁止事項）",
  recipe: "recipe（問い・組み立て方）",
  sample: "sample（粒度・文体・表現）",
  template: "template（開始時の雛形）",
};

function kataStateLabel(deliverable: AssessedDeliverable, kind: KataKindKey): string {
  const fact = deliverable.facts.kata[kind];
  if (fact.broken_reference) return `宣言先が存在しない（${fact.path}）`;
  if (!fact.exists) {
    if (fact.declaration === "not-needed") return "not-needed（不要と判断済み）";
    if (fact.declaration === "undecided") return "undecided（要否未判断）";
    return fact.declaration === "none" ? "none 宣言で無効化" : "未解決（判定不要）";
  }
  const status = fact.status ? `status: ${fact.status}` : "status 不明";
  const grade = fact.grade
    ? `, grade: ${fact.grade.verdict} (${fact.grade.score})`
    : ", grade: 未評価";
  return `${fact.path}（${status}${grade}）`;
}

export function renderAssessmentPrompt(options: AssessmentPromptOptions): string {
  const { projectId, track, strategyRelPath, assessmentRelPath, schemaRelPath } = options;
  const lines: string[] = [];

  lines.push(`# 成果物・実践の型の利用可能性判定指示（${track}）`);
  lines.push("");
  lines.push(
    `project ${projectId} の track \`${track}\` について、下記に列挙したファイルだけを読み、` +
      `成果物と実践の型（rulebook / recipe / sample / template）が作成・更新の基準として` +
      `信頼できるかを判定する。`,
  );
  lines.push("");

  lines.push("## 1. 出力");
  lines.push("");
  lines.push(`- 出力先: \`${assessmentRelPath}\``);
  lines.push(`- 準拠スキーマ: \`${schemaRelPath}\`（構造から外れた項目を追加しない）`);
  lines.push(
    "- 出力は YAML のみとする。判断の説明は `rationale` / `checks[].note` / `open_questions` に構造化して書く。",
  );
  lines.push(
    `- \`${strategyRelPath}\` を含む sch-strategy / sch-track ファイルを編集しない。生成はコードの責務である。`,
  );
  lines.push(
    "- `facts` はコードが収集した事実であり、編集しない。値の誤りを見つけた場合は `open_questions` に書く。",
  );
  lines.push(
    "- 追記するのは各成果物の `judgment` と、判定できなかった項目の `open_questions` だけである。",
  );
  lines.push("");

  lines.push("## 2. 判定対象");
  lines.push("");
  if (options.deliverables.length === 0) {
    lines.push("- 判定対象の成果物が解決できていない。判定を行わず、入力不足として報告する。");
  }
  for (const deliverable of options.deliverables) {
    const doc = deliverable.facts.deliverable;
    const docState = doc.path
      ? `${doc.path}（${doc.exists ? `既存, status: ${doc.status ?? "不明"}` : "未作成"}）`
      : "文書パス未宣言";
    lines.push(`- \`${deliverable.local_id}\` ${deliverable.name}`);
    lines.push(`  - 成果物: ${docState}`);
    if (doc.grade) {
      lines.push(
        `  - 成果物 grade: ${doc.grade.verdict} (${doc.grade.score}, ${doc.grade.rubric})`,
      );
    }
    for (const kind of KATA_KINDS) {
      lines.push(`  - ${KATA_LABEL[kind]}: ${kataStateLabel(deliverable, kind)}`);
    }
    const evidence = deliverable.facts.evidence_refs.filter((ref) => ref.exists);
    if (evidence.length > 0) {
      lines.push(`  - 実装エビデンス: ${evidence.map((ref) => `\`${ref.path}\``).join(", ")}`);
    }
    if (deliverable.facts.schema) {
      lines.push(`  - schema: \`${deliverable.facts.schema.path}\``);
    }
  }
  lines.push("");
  lines.push(
    "上記以外のファイルを根拠にしない。ファイル探索・ID 導出・存在判定はコードが済ませてあるため、やり直さない。",
  );
  lines.push("");

  lines.push("## 3. 利用可能性の判定");
  lines.push("");
  lines.push(
    "存在する実践の型（上記で具体パスが示されているもの）ごとに、次の4観点をすべて評価し、`checks[].note` に具体的な根拠（章・記述・不足箇所）を書く。",
  );
  lines.push("");
  lines.push(
    "| `check`                | 問い                                                       |",
  );
  lines.push(
    "| ---------------------- | ---------------------------------------------------------- |",
  );
  lines.push(
    "| `target-fit`           | 対象成果物向けの内容か（別成果物向けの流用ではないか）     |",
  );
  lines.push(
    "| `substantive-content`  | 空・placeholder 中心ではなく、判断に足る内容があるか       |",
  );
  lines.push(
    "| `internal-consistency` | 同じ一式の他の型と致命的に矛盾していないか                 |",
  );
  lines.push(
    "| `standard-alignment`   | 現行の rulebook・schema と整合しているか                   |",
  );
  lines.push("");
  lines.push(
    "- `usability` は checks から導く。全て `pass` なら `usable`、1件でも `fail` なら `unusable`、`fail` がなく `unknown` があれば `unknown`。",
  );
  lines.push("- `status: draft` であること自体は利用不能の根拠にしない。内容で判断する。");
  lines.push("- ファイルが存在しない型は判定しない（`judgment.kata` に書かない）。");
  lines.push(
    "- `not-needed` の型は欠落ではなく要否判断済みとして扱い、`bootstrap_scope` / `kata_target` に含めない。",
  );
  lines.push(
    "- `undecided` の型は初回の `bootstrap` で要否を判断し、必要なら文書 ID、不要なら `not-needed` へ宣言を更新する。",
  );
  lines.push("");

  lines.push("## 4. タスク目的と推奨フロー");
  lines.push("");
  lines.push(
    "`intent` はタスクの目的であり、実践の型が何件揃っているかだけで決めない。`recommended_approach` は `intent` と利用可能性から次の規則で決まるため、規則の結果と一致させる。",
  );
  lines.push("");
  lines.push(
    "| `intent`                          | 意味                                     | `recommended_approach`                             |",
  );
  lines.push(
    "| --------------------------------- | ---------------------------------------- | -------------------------------------------------- |",
  );
  lines.push(
    "| `author-deliverable`              | 成果物を作成・更新する                   | 必要な型が全て利用可 → `fully-guided` / recipe 利用可 → `recipe-guided` / それ以外 → `freeform` |",
  );
  lines.push(
    "| `bootstrap-kata-set`              | 成果物と再利用可能な型を一式で初期整備   | `bootstrap`（`bootstrap_scope` 必須）              |",
  );
  lines.push(
    "| `reflect-implementation`          | 実装先行の現在動作を成果物へ反映         | `retrofit`（解決済み実装エビデンスが必要）        |",
  );
  lines.push(
    "| `deduplicate-across-deliverables` | 成果物群の重複を整理                     | `cross-deliverable-dedup`                          |",
  );
  lines.push(
    "| `improve-kata`                    | 成果物を根拠に型を見直す                 | `<kata_target>-maintenance`                        |",
  );
  lines.push(
    "| `confirm-deliverable`             | human が成果物を確定する                 | `finalize`                                         |",
  );
  lines.push(
    "| `confirm-with-kata-set`           | human が成果物と型一式を確定する         | `bootstrap-finalize`                               |",
  );
  lines.push("");
  lines.push(
    "- `bootstrap` は「型が1件でも欠ける」ことを理由に選ばない。作成条件から必要と判断した型だけを `bootstrap_scope` に列挙し、対象とする理由を `intent_rationale` に書く。",
  );
  lines.push(
    "- `bootstrap` / `retrofit` / `cross-deliverable-dedup` / `*-maintenance` / `finalize` / `bootstrap-finalize` は整備状況ではなく目的で選ぶフェーズである。整備状況だけを見て選ばない。",
  );
  lines.push(
    "- 目的を決められない、または利用可否が `unknown` の型が残る場合は `recommended_approach: undecided` とし、`topic` に対象 `local_id` を書いた blocking な `open_questions` を必ず添える。",
  );
  lines.push(
    "- `evidence` には、判断の根拠にしたファイルパス（`facts` に載っているもの）を1件以上書く。",
  );
  if (options.assessmentExists) {
    lines.push(
      `- 既存の判定結果 \`${assessmentRelPath}\` がある。無条件に置き換えず、更新理由を \`notes\` に書く。`,
    );
  }
  lines.push("");

  lines.push("## 5. 完了確認");
  lines.push("");
  lines.push("```sh");
  lines.push(`specdojo schedule assessment validate --project ${projectId} --track ${track}`);
  lines.push("```");
  lines.push("");
  lines.push(
    "検証がエラーを返す場合は、推測で埋めずに指摘された項目を修正するか `open_questions` へ移す。",
  );
  lines.push("");

  return lines.join("\n");
}
