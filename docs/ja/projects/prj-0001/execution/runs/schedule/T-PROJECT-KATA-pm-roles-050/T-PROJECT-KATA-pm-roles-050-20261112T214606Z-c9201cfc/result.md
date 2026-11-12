---
specdojo:
  id: prj-0001:xer-t-project-kata-pm-roles-050-20261112t214606z-c9201cfc
  type: exec-result
  task_id: T-PROJECT-KATA-pm-roles-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-PROJECT-KATA-pm-roles-050/T-PROJECT-KATA-pm-roles-050-20261112T214606Z-c9201cfc/plan.md
  started_at: "2026-11-12T21:46:10.637Z"
  completed_at: "2026-11-12T21:58:25.281Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:pm-roles
    - specdojo:pm-roles-sample
---

# Edit Result

## 1. 実施内容

- `pm-roles-sample.yaml` を駄菓子屋のプロジェクトを題材とした完成例として更新しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-roles-sample.yaml`: 題材を表題に明記し、組織定義・メンバー定義・RACI への参照、兼務による期限超過への対応、専門支援と主導ロールの境界、試験結果から人間の PO への判断接続を具体化しました。

## 3. 申し送り

- result の実施内容・変更ファイルへ記録: 変更は docs/ja/specdojo/samples/pm-roles-sample.yaml のみ。題材を表題に明記し、組織定義・メンバー定義・RACI への参照、兼務による期限超過への対応、専門支援と主導ロールの境界、試験結果から人間の PO への判断接続を具体化した。成果物本体・result・grade サイドカーは変更していない。
- result の進め方と実践の型の適用へ記録: sample-maintenance として、Sample 記述標準、Rulebook 記述標準、人と組織の定義標準、ドキュメントメタ情報標準、共通規約、対応 rulebook・recipe・template・schema、共通レビュー観点の `vp-arc-conciseness`、PJR-2GD6 を確認した。代表のロール定義・組織定義、レビュー結果 prj-0001:xrr-t-launch-pm-roles-090、直前の rulebook-maintenance 結果、関連 grade 結果、組織定義・メンバー定義・RACI・CLI の sample を根拠とした。
- 改訂・維持の判断: 組織定義 sample が採用する8ロール、標準順・正式名称、既存メタ情報と `based_on` を維持。ARC・UX・OPS は採用されていても初期 Schedule の主責任を持たず、それぞれ DEV・BA・PM を支援する例にした。判定不能な『継続増加』『必要時』による専任化表現を、期限超過と組織定義の見直しに接続した。値・構文・構造の詳細は schema 等へ委ね、代表成果物の内容を転記していない。plan に sample 向け finding・condense 記録はない。
- recipe・template は必要と判断。採用集合の照合と固有メモの具体化に問いが必要なため `recipe: specdojo:pm-roles-recipe`、独立 YAML のメタ項目と配列の骨組みに `template: specdojo:pm-roles-template` を維持する。既存 frontmatter に両 ID と sample の宣言があり、rulebook にサンプル章はないため変更不要。
- 後続作業: 現行 pm-roles-recipe.md には必須の `rulebook` を禁止する指示と悪い例が残る。直前 result の修正済み記録とは現物が一致していない。本 sample は rulebook・schema を正として必須キーを維持した。PM は recipe-maintenance で現物と記録を再照合し、禁止指示・手順・悪い例を正本へ整合させる。
- result の進め方と実践の型の適用へ記録: sample-maintenance として、Sample 記述標準、Rulebook 記述標準、人と組織の定義標準、ドキュメントメタ情報標準、共通規約、対応 rulebook・recipe・template・schema、共通レビュー観点の vp-arc-conciseness、PJR-2GD6 を確認した。代表のロール定義・組織定義、レビュー結果 prj-0001:xrr-t-launch-pm-roles-090、直前の rulebook-maintenance 結果、関連 grade 結果、組織定義・メンバー定義・RACI・CLI の sample を根拠とした。
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル、既存 plan、result を変更していない。）

## 4. 進め方と実践の型の適用

sample-maintenance
