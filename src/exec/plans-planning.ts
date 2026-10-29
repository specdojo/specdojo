import { existsSync } from "node:fs";
import { join, relative } from "node:path";
import { loadCatalogDocs } from "../catalog/build.js";
import { loadTemplatesForDomain, resolvePlanPath } from "../catalog/plan.js";
import { resolveSpecdojoPath } from "../docs/template-resolution.js";
import { resolveKataRefs } from "../kata/kata.js";
import { planningTarget } from "../register/planning.js";
import {
  getProjectSchedulePath,
  getProjectTimelinePath,
  type SpecDojoProjectConfig,
} from "../shared/specdojo-config.js";

export function planningPlanFields(opts: {
  repoRoot: string;
  projectId: string;
  project: SpecDojoProjectConfig;
  catalogPath: string;
  approach: "catalog-planning" | "strategy-planning";
  target: string;
}) {
  const unit = planningTarget(opts.approach, opts.target);
  const path = (file: string) => relative(opts.repoRoot, file).replaceAll("\\", "/");
  const catalogs = existsSync(opts.catalogPath) ? loadCatalogDocs(opts.catalogPath) : [];
  const catalogRefs =
    catalogs
      .map(
        ({ doc, filePath }) =>
          `- \`${doc.id}\`: \`${path(filePath)}\`（domain: \`${doc.domain}\`）`,
      )
      .join("\n") || "- なし。必要な上流入力を個票から確認する。";
  const catalog = opts.approach === "catalog-planning";
  const refs = resolveKataRefs(catalog ? "specdojo:dct-rulebook" : "specdojo:sch-rulebook");
  const common = [
    `### 作業単位と既存カタログ`,
    "",
    `対象: \`${opts.target}\`（project: \`${opts.projectId}\`）。既存カタログは読み取り、scope と依存関係の判断に取り込む。`,
    "",
    catalogRefs,
    "",
    "### 参照する実践の型",
    "",
    ...Object.entries(refs).map(([kind, ref]) => `- ${kind}: \`${ref}\``),
    "",
  ];
  const projectArg = `--project ${opts.projectId}`;
  if (catalog) {
    const templates = loadTemplatesForDomain(
      resolveSpecdojoPath("docs/ja/specdojo/templates"),
      unit,
      opts.repoRoot,
    );
    if (templates.length === 0) throw new Error(`No catalog template found for domain '${unit}'`);
    const plan = path(resolvePlanPath(opts.catalogPath, unit));
    common.push(
      "### 判定・生成手順と完了条件",
      "",
      ...templates.map(
        (template) => `- domain の雛形: \`${template.template.id}\`（\`${template.relPath}\`）`,
      ),
      "",
      `1. \`specdojo catalog plan prompt ${projectArg} --domain ${unit}\` を実行し、その入力文書・判定規約に従う。データフローがない場合は、個票が指定する上流資料を \`--input <path>\` で明示する。入力不足なら停止して必要資料を申し送る。`,
      "2. agent の判定を YAML に出力する。インスタンス・根拠・除外・未確定事項を記録する。既存カタログと kata を優先して参照し、テンプレート由来の構造を独自に再作成しない。",
      `3. \`specdojo catalog plan scaffold ${projectArg} --domain ${unit} --from <agent-output>.yaml\` で \`${plan}\` に検証保存する。prompt に入力を追加した場合は同じ \`--input\` を渡す。`,
      `4. \`specdojo catalog plan validate ${projectArg} --domain ${unit}\` を通す。blocking な \`open_questions\` を解消する。`,
      `5. \`specdojo catalog scaffold ${projectArg} --domain ${unit} --plan\` で \`dct-${unit}.yaml\`（物理分割時は全 part）を生成する。\`dct-index.yaml\` の \`size\` がない場合は個票の範囲に合わせて \`--size <small|medium|large>\` を明示する。既存ファイルは差分を確認し、必要な場合だけ \`--force\` を使う。`,
      `6. \`specdojo catalog validate ${projectArg}\` を通す。先に \`dct-index.yaml\` の全 domain の索引を整備し、生成した domain を登録する（物理分割も同じ domain の一項目とする）。判定計画とカタログの保存、参照・依存・完了条件の整合を完了基準とする。`,
      "7. 個票の作業内容・対応結果と実行記録に判断・検証結果を記録する。todo の close は runner と人が行う。close 後の `timeline build` が domain を `primary` と導く。`tml-index.yaml` は変更しない。",
    );
  } else {
    const strategy = join(
      getProjectSchedulePath(opts.project),
      `sch-strategy-${unit}.yaml`,
    ).replaceAll("\\", "/");
    common.push(
      "### scope・intent の宣言と完了条件",
      "",
      `1. \`${join(getProjectTimelinePath(opts.project), "tml-index.yaml").replaceAll("\\", "/")}\` があれば対象 track の domains と依存・着手順を確認する。\`timeline build\` の register 由来の状態と既存カタログも確認する。`,
      `2. \`${strategy}\` に \`scope.catalogs\`（ID・リポジトリルートからのパス）、\`scope.include_kinds\` と \`approach_rules\` を宣言する。既存 scope の意図を保ち、各成果物の \`local_ids\` と \`intent\`（例: author-deliverable / bootstrap-kata-set / confirm-deliverable）、必要時の \`kata_target\` / \`bootstrap_scope\` を根拠付きで決める。`,
      "3. 主担当を `owner_rules` または生成時の `--owner` / `--default-owner` で明示する。`done_criteria.roles` を主担当と解釈しない。必要な kata の grade が不足なら先に評価し、不明な判断を推測で補わない。",
      `4. \`specdojo schedule strategy generate ${projectArg} --track ${unit}\` を実行し、scope・intent・担当・依存関係に関するエラーを解消する。既存 strategy の変更は差分を確認し、必要な場合だけ \`--force\` を指定する。`,
      `5. \`specdojo schedule build ${projectArg} --track ${unit}\` を通し、\`sch-track-${unit}.yaml\` が生成され、scope の成果物とタスクの対応・依存が一致することを確認する。`,
      "6. strategy と track の保存、scope 全件の intent と担当の解決、生成・検証の成功を完了基準とし、個票の作業内容・対応結果と実行記録へ判断と検証を記録する。カタログ本体と `tml-index.yaml` は変更しない。",
    );
  }
  return { refs, conditions: common.join("\n") };
}
