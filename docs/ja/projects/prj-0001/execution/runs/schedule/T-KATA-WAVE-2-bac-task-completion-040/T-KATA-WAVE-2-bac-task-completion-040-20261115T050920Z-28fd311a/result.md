---
specdojo:
  id: prj-0001:xer-t-kata-wave-2-bac-task-completion-040-20261115t050920z-28fd311a
  type: exec-result
  task_id: T-KATA-WAVE-2-bac-task-completion-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-2-bac-task-completion-040/T-KATA-WAVE-2-bac-task-completion-040-20261115T050920Z-28fd311a/plan.md
  started_at: "2026-11-15T05:09:25.212Z"
  completed_at: "2026-11-15T05:57:40.248Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - bac-task-completion
    - specdojo:bac-rulebook
---

# Edit Result

## 1. 実施内容

- BAC rulebook (`docs/ja/specdojo/rulebooks/bac-rulebook.md`) の規則および判断基準を、grade result から展開された finding および関連規範に基づき改訂した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/bac-rulebook.md`: 成果物リファレンス・トラック設計ガイドとの関係（位置づけ）、ファイル命名と `id` の対応規則、メタ情報の正本参照、確認完了条件と担当 `Role` code の追記、上流変更・改訂・廃止への追従手順、および未確定事項と `PJR` の使い分けに関する記述を補強した。

## 3. 申し送り

- 変更ファイルは `docs/ja/specdojo/rulebooks/bac-rulebook.md` のみ。成果物リファレンス・トラック設計ガイドとの関係、命名と `id` の対応、メタ情報の正本、確認完了条件と担当 `Role` code、上流変更・改訂・廃止への追従、未確定事項と `PJR` の使い分けを補強した。reporter は実施内容・変更ファイル・進め方と実践の型の適用へ記録すること。
- 判断根拠は `rulebook-authoring-standard.md`、`document-metadata-standard.md`、`deliverable-frontmatter.schema.yaml`、`docs-structure-guide.md`、`track-design-guide.md`、`deliverables-reference.md`、`kata-guide.md`、`ryu-guide.md`、`pjr-rulebook.md`、共通レビュー観点の該当 viewpoint。プロジェクトのレビュー観点には共通正本との差分がないことを確認した。
- 実績として `bac-task-completion.md`、根拠の `bps-deliverable-evaluation.md`・`bps-task-completion.md`・`prj-success-criteria-and-acceptance-criteria.md`、既存 BAC recipe・sample・template、`grade/results/specdojo.bac-rulebook.yaml`・`specdojo.bac-sample.yaml`、先行 bootstrap タスク `T-KATA-WAVE-2-bac-task-completion-005` の result を参照した。成果物から届いた Kata 原因の grade・condense 記録は plan 上なし。
- F001・F015 は目的と位置づけ、F002・F004・F005 は未確定事項と `PJR`、F003・F013 は確認完了条件と検証、F006～F008・F014 は価値・範囲・関係者・観測先、F009・F011・F012・F023 はメタ情報・`id`・変更影響の規約で対応した。F010・F016・F017・F021 は先行整備で解消済みの表構造・本文要件・見出し連番・用語統一を維持した。
- F020 の旧指摘にある `type: test` は採用しない。現行メタ情報標準と schema は業務受入基準を requirement と分類しており、rulebook・代表 BAC・sample・template の生成物宣言も一致している。旧指摘の `tests` キーは再導入せず、型付き参照の正本へ委譲した。完成例は既に sample に外出し済みで、rulebook へ再掲していない。
- F018・F019 は既存の `specdojo:bac-recipe`・`specdojo:bac-template` 宣言を維持した。シナリオ選択と停止・再開の掘り下げには書き手による品質差があるため recipe が必要であり、共通の3章構成とシナリオ記入欄があるため template も必要と判断した。sample も必要で、not-needed とする型はない。既存 sample は117行で `clis-sample` の132行に近い厚さを持つ。対象形式は Markdown であり、独立 YAML の充実化は非適用。
- 後続の recipe・sample・template 同期では、価値とシナリオ `id` の対応、期待結果ごとの観測先、未確定事項の担当・判断時点・追跡先、確認完了条件を反映すること。構造・必須項目・禁止事項は今回の rulebook を正とする。F022 に対し、rulebook の ready 化前には後続同期と親 runner の Markdown・Frontmatter・schema 検証結果を確認する必要があることを記録する。`status` は draft を維持し、昇格は人が判断する。
- 親 runner に設定された lint・schema・型検査・テストは sandbox では重複実行していない。保護設定・Git 設定・grade サイドカー・runner 管理ファイルは変更していない。
- 変更ファイルは docs/ja/specdojo/rulebooks/bac-rulebook.md のみ。成果物リファレンス・トラック設計ガイドとの関係、命名と ID の対応、メタ情報の正本、確認完了条件と担当 Role code、上流変更・改訂・廃止への追従、未確定事項と PJR の使い分けを補強した。reporter は実施内容・変更ファイル・進め方と実践の型の適用へ記録すること。
- 判断根拠は rulebook-authoring-standard.md、document-metadata-standard.md、deliverable-frontmatter.schema.yaml、docs-structure-guide.md、track-design-guide.md、deliverables-reference.md、kata-guide.md、ryu-guide.md、pjr-rulebook.md、共通レビュー観点の該当 viewpoint。プロジェクトのレビュー観点には共通正本との差分がないことを確認した。
- 実績として bac-task-completion.md、根拠の bps-deliverable-evaluation.md・bps-task-completion.md・prj-success-criteria-and-acceptance-criteria.md、既存 BAC recipe・sample・template、grade/results/specdojo.bac-rulebook.yaml・specdojo.bac-sample.yaml、先行 bootstrap タスク T-KATA-WAVE-2-bac-task-completion-005 の result を参照した。成果物から届いた Kata 原因の grade・condense 記録は plan 上なし。
- F001・F015 は目的と位置づけ、F002・F004・F005 は未確定事項と PJR、F003・F013 は確認完了条件と検証、F006～F008・F014 は価値・範囲・関係者・観測先、F009・F011・F012・F023 はメタ情報・ID・変更影響の規約で対応した。F010・F016・F017・F021 は先行整備で解消済みの表構造・本文要件・見出し連番・用語統一を維持した。
- F020 の旧指摘にある type: test は採用しない。現行メタ情報標準と schema は業務受入基準を requirement と分類しており、rulebook・代表 BAC・sample・template の生成物宣言も一致している。旧指摘の tests キーは再導入せず、型付き参照の正本へ委譲した。完成例は既に sample に外出し済みで、rulebook へ再掲していない。
- F018・F019 は既存の specdojo:bac-recipe・specdojo:bac-template 宣言を維持した。シナリオ選択と停止・再開の掘り下げには書き手による品質差があるため recipe が必要であり、共通の3章構成とシナリオ記入欄があるため template も必要と判断した。sample も必要で、not-needed とする型はない。既存 sample は117行で clis-sample の132行に近い厚さを持つ。対象形式は Markdown であり、独立 YAML の充実化は非適用。
- 後続の recipe・sample・template 同期では、価値とシナリオ ID の対応、期待結果ごとの観測先、未確定事項の担当・判断時点・追跡先、確認完了条件を反映すること。構造・必須項目・禁止事項は今回の rulebook を正とする。F022 に対し、rulebook の ready 化前には後続同期と親 runner の Markdown・Frontmatter・schema 検証結果を確認する必要があることを記録する。status は draft を維持し、昇格は人が判断する。
- 適用外の検証: `npm run validate:schema:file`（変更ファイルは Markdown rulebook のみで、YAML・YML ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票、既存 plan・result などの履歴蓄積ファイルを変更していない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance
