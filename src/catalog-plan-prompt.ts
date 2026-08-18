// Renders the agent instruction for DCT plan judgment. The instruction is plain Markdown
// so it can be piped into any SpecDojo agent execution path; no agent product API is
// wired into the CLI. The agent's only output is a dct-plan-<domain>.yaml that conforms
// to dct-plan.schema.yaml — never free-form prose and never a catalog file.

import type { DctPlanInput } from "./catalog-plan.js";

export type PlanPromptOptions = {
  projectId: string;
  domain: string;
  templateId: string;
  templateRelPath: string;
  planRelPath: string;
  schemaRelPath: string;
  inputs: DctPlanInput[];
  planExists: boolean;
};

const INPUT_KIND_LABEL: Record<DctPlanInput["kind"], string> = {
  "data-flow": "データフロー（主要判定根拠）",
  "upstream-deliverable": "上流成果物",
  "existing-catalog": "既存カタログ（基準線）",
  template: "テンプレート",
  other: "その他",
};

export function renderPlanPrompt(options: PlanPromptOptions): string {
  const { projectId, domain, templateId, templateRelPath, planRelPath, schemaRelPath } = options;
  const existingCatalogs = options.inputs.filter((input) => input.kind === "existing-catalog");

  const lines: string[] = [];

  lines.push(`# DCT成果物インスタンス判定指示（${domain}）`);
  lines.push("");
  lines.push(
    `project ${projectId} の domain \`${domain}\` について、下記の入力文書だけを読み、` +
      `必要な成果物インスタンス・placeholder 値・採用しない候補・未確定事項を判定する。`,
  );
  lines.push("");

  lines.push("## 1. 出力");
  lines.push("");
  lines.push(`- 出力先: \`${planRelPath}\``);
  lines.push(`- 準拠スキーマ: \`${schemaRelPath}\`（構造から外れた項目を追加しない）`);
  lines.push(
    "- 出力は YAML のみとする。判断の説明は `rationale` / `open_questions` に構造化して書く。",
  );
  lines.push(
    "- 成果物カタログ（`dct-<domain>.yaml`）そのものを書かない。`groups` / `base_path` / `done_criteria` はテンプレートとジェネレーターの責務である。",
  );
  lines.push("");

  lines.push("## 2. 入力");
  lines.push("");
  lines.push(`- テンプレート: \`${templateRelPath}\`（id: \`${templateId}\`）`);
  if (options.inputs.length === 0) {
    lines.push("- 判定対象の入力文書が解決できていない。判定を行わず、入力不足として報告する。");
  }
  for (const input of options.inputs) {
    const label = INPUT_KIND_LABEL[input.kind];
    lines.push(`- ${label}: \`${input.path}\``);
  }
  lines.push("");
  lines.push(
    "上記以外の文書を根拠にしない。追加の入力が必要な場合は `open_questions` に必要文書を書く。",
  );
  lines.push("");

  lines.push("## 3. 判定手順");
  lines.push("");
  lines.push("1. データフロー文書を読み、業務領域・処理単位・登場する情報の区分を洗い出す。");
  lines.push("2. テンプレートの各項目について、この domain で必要なインスタンスを決める。");
  lines.push(
    "3. `iteration_pattern` を決める。複数業務領域へ項目を複製する場合は `pattern-a`、単一業務領域を処理単位ごとの固定 `local_id` へ分割する場合は `pattern-b` とする。",
  );
  lines.push(
    "4. `pattern-a` では placeholder（`_TERM_` 等）ごとに `variables` へ値・根拠・理由を書き、`local_id` は展開後の値と一致させる。",
  );
  lines.push(
    "5. `pattern-b` では `variables` を使わず、処理単位ごとに固定 `local_id` を与え、由来するテンプレート項目を `template_local_id` に書く。",
  );
  lines.push("6. 採用しないテンプレート項目・業務領域は `exclusions` に候補と理由を書く。");
  lines.push(
    "7. 入力から根拠を得られない placeholder・要否・名称・依存関係は確定させず、`open_questions` に理由と次のアクションを書く。",
  );
  lines.push("");

  lines.push("## 4. 判定の制約");
  lines.push("");
  lines.push(
    "- すべての `deliverables[]` と `variables[]` に、入力文書の ID またはパスを `evidence` として1件以上書く。",
  );
  lines.push(
    "- 根拠のない項目を推測で確定しない。確度が低い判断は `confidence: low` とし、`open_questions` を併記する。",
  );
  lines.push(
    "- `local_id` は kebab-case とし、placeholder を残さない。プロジェクト内で一意にする。",
  );
  lines.push(
    "- `depends_on` には、この plan 内の `local_id` または既存カタログの `local_id` だけを書く。",
  );
  if (existingCatalogs.length > 0) {
    lines.push(
      `- この domain には既存カタログがある（${existingCatalogs.map((input) => `\`${input.path}\``).join(", ")}）。既存 \`local_id\` を落とす場合は \`exclusions\` に理由を書く。`,
    );
  }
  if (options.planExists) {
    lines.push(
      `- 既存の判定結果 \`${planRelPath}\` がある。無条件に置き換えず、差分をレビューできる形で更新理由を \`notes\` に書く。`,
    );
  }
  lines.push("");

  lines.push("## 5. 完了確認");
  lines.push("");
  lines.push("```sh");
  lines.push(`specdojo catalog plan validate --project ${projectId} --domain ${domain}`);
  lines.push("```");
  lines.push("");
  lines.push(
    "検証がエラーを返す場合は、推測で埋めずに指摘された項目を修正するか `open_questions` へ移す。",
  );
  lines.push("");

  return lines.join("\n");
}
