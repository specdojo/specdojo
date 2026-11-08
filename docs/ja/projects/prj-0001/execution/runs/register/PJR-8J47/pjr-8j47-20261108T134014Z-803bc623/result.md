---
specdojo:
  id: prj-0001:xer-pjr-8j47-20261108t134014z-803bc623
  type: exec-result
  task_id: PJR-8J47
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-8J47/pjr-8j47-20261108T134014Z-803bc623/plan.md
  started_at: "2026-11-08T13:40:15.243Z"
  completed_at: "2026-11-08T13:54:12.657Z"
  agent: flash-high-executor
---

# Edit Result

## 1. 実施内容

- カタログの `uis-index` および `uis-exec-commands` を `clis-index` と `clis-exec-commands` に付け替えました。
- clis の型に合わせて、`rulebook`、`overview`、および `done_criteria` の定義を更新しました。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-system-functions.yaml`: カタログ内の `uis-index` および `uis-exec-commands` を `clis-index` および `clis-exec-commands` に書き換え、`clis` の型に合わせた定義更新と関連カタログ参照の修正を行いました。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-user-interface-model.yaml`: `uis` 関連の項目を `clis` 関連の項目へ付け替え、`clis` 型の定義に合わせた更新を行いました。

## 3. 申し送り

- clis-index の専用 rulebook（`clis-index-rulebook`）は未整備のため未宣言としています。将来の必要性に応じて kata 新設を検討してください。
- clis-index の専用 rulebook（clis-index-rulebook）は未整備のため未宣言としています。将来の必要性に応じて kata 新設を検討してください。

## 4. 進め方

まず、対象となるカタログファイルを確認し、`uis` 関連のキー（`uis-index`, `uis-exec-commands`）を `clis` 系の名称に置換する作業を行いました。併せて、`clis` の構造（`rulebook`, `overview`, `done_criteria`）が既存の `uis` の定義と異なるため、新しい型に適合するように各項目の定義を調整しました。
