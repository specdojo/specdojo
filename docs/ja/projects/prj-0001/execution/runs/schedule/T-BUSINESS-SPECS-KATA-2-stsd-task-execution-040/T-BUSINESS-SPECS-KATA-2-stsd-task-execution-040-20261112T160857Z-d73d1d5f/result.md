---
specdojo:
  id: prj-0001:xer-t-business-specs-kata-2-stsd-task-execution-040-20261112t160857z-d73d1d5f
  type: exec-result
  task_id: T-BUSINESS-SPECS-KATA-2-stsd-task-execution-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-BUSINESS-SPECS-KATA-2-stsd-task-execution-040/T-BUSINESS-SPECS-KATA-2-stsd-task-execution-040-20261112T160857Z-d73d1d5f/plan.md
  started_at: "2026-11-12T16:09:03.692Z"
  completed_at: "2026-11-12T16:27:08.554Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:stsd-task-execution
    - specdojo:stsd-rulebook
---

# Edit Result

## 1. 実施内容

- `stsd-rulebook.md` を改訂し、章ごとの判断基準、良い例・悪い例、正本参照の方針、および改訂時の影響確認手順を整備しました。
- `source=grade` による finding (F001, F002) を確認し、F002 については本文要件に「状態の正本となる管理場所」および「状態変更を起こす業務範囲」を明記することで解消しました。F001 は現状の規定で対応済みと判断し維持しています。
- `source=condense` による 4 件の記録を確認し、`vp-arc-conciseness` に照らして図表の一対一対応や共有状態の記述は必要であると判断し維持し、不要な重複を削るための基準を記述ガイドに追記しました。
- `rulebook-authoring-standard.md` に従い、章立ての整理と階層ごとの連番付与を行い、共通メタ情報は標準参照へ置き換えることで簡素化しました。
- recipe および template の要否を検討し、現状の `specdojo:stsd-recipe` および `specdojo:stsd-template` を維持することを決定しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/stsd-rulebook.md`: 章構成を執筆標準に合わせ、各章の判断基準・例を追記し、本文要件に管理場所と業務範囲の明記を追加しました。また、改訂時の影響確認についても整備しました。

## 3. 申し送り

- 変更ファイルは docs/ja/specdojo/rulebooks/stsd-rulebook.md のみ。成果物本体・sample・result・grade サイドカーは変更していません。
- result の「進め方と実践の型の適用」への記録事項: rulebook-authoring-standard、document-metadata-standard、ryu-guide、PJR-2GD6、stsd-task-execution、stsd-job-run、および登録項目・定期処理の状態定義と condense 記録を確認。template の骨組みを重複する見出し一覧は内容要件へ整理し、共通メタ情報は標準参照へ置き換えました。
- source=grade: specdojo.stsd-rulebook.yaml の F001・F002 を vp-qe-omissions-consistency に照らして確認。F001 は既存の初回確定前の振り直し対応記録、確定後の ID 保持・欠番・再利用禁止で解消済みのため維持。F002 は改訂した本文要件に「状態の正本となる管理場所」「状態変更を起こす業務範囲」を明記し、記述ガイド・template と整合させました。未解消の finding はありません。
- source=condense: prj-0001:xer-t-stsd-pilot-stsd-job-run-080、prj-0001:xer-t-stsd-pilot-stsd-register-entry-080、prj-0001:xer-t-stsd-pilot-stsd-routine-run-080 の計4件を確認。cause.location が指す現行の全体方針・状態遷移、および stsd-mermaid-rulebook の共有状態宣言・図の分割規定と照合しました。vp-arc-conciseness に照らし、図表の一対一対応と共有状態は判断・接続に必要なため維持。不要な重複を削る対象との区別を記述ガイドへ追記しました。
- recipe は聞き取り・状態候補整理・図表照合の手順が必要、template は章・表・記入欄の骨組みが必要と判断し、frontmatter の specdojo:stsd-recipe と specdojo:stsd-template を維持しました。既存 recipe・template との矛盾はありません。次の recipe-maintenance では、追加した改訂時の影響確認を手順・仕上げチェックへ反映する案を検討してください。sample は宣言済みの specdojo:stsd-sample を維持し、完成例の整備は計画どおり後続の sample-maintenance に委ねます。
- lint・schema・型チェック・単体／統合テストは指定された親 runner の検証に委ね、executor では重複実行していません。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown のみで、YAML・YML の変更がないため。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存 plan・result を変更していないため。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下に及ばないため。）

## 4. 進め方と実践の型の適用

rulebook-maintenance
