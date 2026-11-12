---
specdojo:
  id: prj-0001:xer-t-project-kata-pm-raci-040-20261112t231322z-3c92d3e4
  type: exec-result
  task_id: T-PROJECT-KATA-pm-raci-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-PROJECT-KATA-pm-raci-040/T-PROJECT-KATA-pm-raci-040-20261112T231322Z-3c92d3e4/plan.md
  started_at: "2026-11-12T23:13:30.951Z"
  completed_at: "2026-11-12T23:30:01.394Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:pm-raci
    - specdojo:pm-raci-rulebook
---

# Edit Result

## 1. 実施内容

- `pm-raci-rulebook` を改訂し、grade result から展開された 5 件の finding および記述標準への適合性を向上させました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/pm-raci-rulebook.md`: finding F001〜F005 に対応し、主担当の識別方法、責任分担の網羅条件、記述ガイド（判断基準・良否例）を整備しました。また、本文から不必要な骨格定義を削除し、`_ROLE_CODE_` 等のプレースホルダー表記への移行と、`rulebook-authoring-standard` に基づく構成への変更を行いました。

## 3. 申し送り

- reporter は result の実施内容・変更ファイル・進め方と実践の型の適用へ以下の判断根拠を記録してください。変更ファイルは `docs/ja/specdojo/rulebooks/pm-raci-rulebook.md` のみです。成果物本体、sample、recipe、template、grade サイドカー、result は編集していません。
- 規範として rulebook-authoring-standard、people-and-organization-definition-standard、document-metadata-standard、共通規約、ryu-guide、共通レビュー観点の該当5観点を確認しました。実績として prj-0001 の pm-raci・pm-organization、宣言先の recipe・sample・template、RACI 関連 grade result、T-LAUNCH-pm-raci-070-I02・140 の result を参照しました。PJR-2GD6 の正本再掲を避ける方針も確認しました。
- F001 は本文構成表と空の表骨格を削除し、本文要件を目的・必須性・判定規則へ変更しました。F004・F005 は固定 Role 列の例を削除し、`_ROLE_CODE_` は採用 Role に置換して増減する例であると明記しました。骨格は template、内容要件は rulebook、完成例は sample に責務を分けました。
- F002 は、複数の `R` がある行について、行に付随する注記で作業ごとの主担当 Role code と担当範囲を明記する規則を追加しました。F003 は業務・技術・品質の責任分担と省略理由を網羅条件とし、WBS の明示 `owner` の確認、承認・レビュー・外部待ちの `A` / `C` を上位標準に従って扱うよう修正しました。文書上で5件の問題への対応を照合済みですが、正式な再 grade は実行していません。
- 一行一つの `A`・一つ以上の `R`、Agent に `A` を割り当てない方針、責任境界が重要な対象への限定、実行主体を別正本で管理する方針は、上位標準・成果物・sample と整合するため維持しました。成果物行とプロセス行の判断範囲、波及更新と管理記録への引き継ぎも明確にしました。
- recipe は対象選定と担当照合の手順支援、template は二表と記入欄の再利用に必要と判断し、frontmatter の既存 ID 宣言を維持しました。このフェーズの指定に従う次の作業案: recipe の担当一律一致規則を上位標準の優先順・例外と主担当注記へ追従させ、Schedule にない行を一律削除する手順も見直す。template の固定 Role 列をプレースホルダー化し、主担当注記と担当選定例外の記入案内を追加する。矛盾する内容要件の判断は改訂後 rulebook を正とします。
- 後続 sample-maintenance では、既存 sample の複数 `R` 行の主担当を明示し、担当選定例外、三観点の確認、判断範囲、更新先と見直し条件を含む完成例へ拡充してください。現在の代表成果物にも主担当の識別不足と戦略文書の担当不一致が残っていますが、本フェーズは成果物本体の変更を対象外としています。
- lint-ts・lint-fm・lint-md・lint-mermaid・lint-d2・test-integration・validate-schema・typecheck・test-unit は指定に従い親 runner に委ね、executor では実行していません。既存の frontmatter `status` は変更していません。
- 適用外の検証: `npm run validate:schema:file`（executor の変更は Markdown のみで、変更した YAML ファイルがありません。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していません。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存 plan・result を変更していません。）

## 4. 進め方と実践の型の適用

rulebook-maintenance
