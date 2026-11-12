---
specdojo:
  id: prj-0001:xer-t-project-kata-pm-plan-050-20261112t221512z-d8668285
  type: exec-result
  task_id: T-PROJECT-KATA-pm-plan-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-PROJECT-KATA-pm-plan-050/T-PROJECT-KATA-pm-plan-050-20261112T221512Z-d8668285/plan.md
  started_at: "2026-11-12T22:15:16.553Z"
  completed_at: "2026-11-12T22:30:42.366Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:pm-plan
    - specdojo:pm-plan-sample
---

# Edit Result

## 1. 実施内容

- 駄菓子屋の共通サンプル文脈に基づき、`docs/ja/specdojo/samples/pm-plan-sample.md` を完成例として見直しました。
- grade result で指摘された F001〜F009 の finding を解消し、判断基準の具体化、RACI 表の正本明確化、未決事項表への `_UNDECIDED_:` ラベルおよび現状列の追加、コスト・負荷項目の区分管理を実装しました。
- 改訂済み rulebook を正として、各管理項目における根拠・基準・契機・責任・証跡の対応付けを強化し、構成管理や技術依存の変更追従プロセスを具体化しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-plan-sample.md`: 判断ゲートの成功条件を ID（`SC-01` 等）で具体化し、RACI 表の分離、未決事項表の形式修正（現状列と `_UNDECIDED_:` の追加）、および運用負荷・コストの区分管理を適用して完成例として整備。

## 3. 申し送り

- 根拠規範: `pm-plan-rulebook`、`pm-plan-recipe`、`pm-plan-template`、`sample-authoring-standard`、`rulebook-authoring-standard`、`document-metadata-standard`、`people-and-organization-definition-standard`、共通規約、`ryu-guide`。判定には共通レビュー観点の `vp-qe-verifiability`、`vp-qe-omissions-consistency`、`vp-qe-kata-conformance`、`vp-ux-readability`、`vp-arc-conciseness` を適用。
- 実績・評価根拠: `prj-0001` の `pm-plan`・`pm-organization`・`pm-roles`、および `execution/grade/results/` 下の sample 評価結果、`T-PROJECT-KATA-pm-plan-040` の result を確認。比較対象として `clis-sample` 等を参照。
- 修正内容: F001, F005, F006, F009 に対し成功条件正本の明示と PO による判定フローを追加。F002, F007 に対し RACI 正本を Schedule から分離。F003, F008 に対し未決表の列追加とラベル付与を実施。F004 に対し支出・時間・負荷の定義を区分化。
- recipe および template は、管理基準の導出手順および構成（5章・必須表）の統一に不可欠であるため、既存の宣言を維持し `not-needed` とせず継続利用と判断しました。
- reporter は result の「実施内容」「変更ファイル」「進め方と実践の型の適用」へ以下を記録してください。変更ファイルは docs/ja/specdojo/samples/pm-plan-sample.md のみ。成果物本体、rulebook、recipe、template、grade サイドカー、result は編集していません。
- 根拠規範: pm-plan-rulebook、pm-plan-recipe、pm-plan-template、sample-authoring-standard、rulebook-authoring-standard、document-metadata-standard、people-and-organization-definition-standard、共通規約、ryu-guide の実践の型メンテナンス手順。判定には共通レビュー観点の `vp-qe-verifiability`、`vp-qe-omissions-consistency`、`vp-qe-kata-conformance`、`vp-ux-readability`、`vp-arc-conciseness` を適用しました。
- 実績・評価根拠: prj-0001 の pm-plan・pm-organization・pm-roles、execution/grade/results/ の specdojo.pm-plan-sample.yaml と prj-0001.pm-plan.yaml、T-PROJECT-KATA-pm-plan-040 の result を確認しました。比較対象は概要・スコープ・成功条件・組織・RACI・品質・コミュニケーション・各管理簿の sample と clis-sample。今回の F001〜F009 は対象 sample 自身の grade に由来し、成果物から届いた Kata 原因の grade／condense 記録はありません。
- F001・F005・F006・F009: 成功条件の正本を明示し、初期受入を SC-01・AC-01〜AC-04、試用継続を SC-02・SC-03 に接続。未達・証跡不足時の保留、是正・再確認、人間の PO による判定を追加。F002・F007: RACI の正本を Schedule と分離。F003・F008: 未決表に現状列と `_UNDECIDED_:`、期限、判断者、着手保留を記載。F004: 現金支出、準備・開発時間、日常操作負荷、保守・引き継ぎ負荷を区別しました。照合上、未解消の finding はありません。
- 改訂済み rulebook を正として、各管理行に根拠・基準・契機・逸脱対応・責任・証跡を対応付け、構成管理と技術依存の変更対応、追従タスクの担当・順序・期限・完了確認を追加しました。template の主章5章と表の役割、店舗の業務範囲・2週間の試用・人間の最終判断は維持。未同梱記録は架空参照名と明示して整備担当・時期を設定し、条件の数値・測定方法や実装・schema の詳細は正本へ委譲しました。
- recipe は価値・制約から管理基準と証跡を導く手順のため、template は5章・必須表・未決事項の記入欄を統一するため必要と判断。rulebook frontmatter の既存宣言 `recipe: specdojo:pm-plan-recipe` と `template: specdojo:pm-plan-template` を維持し、変更は不要です。
- 適用外の検証: `npm run validate:schema:file`（変更ファイルは Markdown のみで、YAML の変更がないため。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していないため。）
- 適用外の検証: `npm run validate:history-links`（履歴ファイルおよび既存の plan・result を変更していないため。）

## 4. 進め方と実践の型の適用

sample-maintenance
