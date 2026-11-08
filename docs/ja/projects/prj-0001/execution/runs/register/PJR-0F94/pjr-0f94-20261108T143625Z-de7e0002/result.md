---
specdojo:
  id: prj-0001:xer-pjr-0f94-20261108t143625z-de7e0002
  type: exec-result
  task_id: PJR-0F94
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-0F94/pjr-0f94-20261108T143625Z-de7e0002/plan.md
  started_at: "2026-11-08T14:36:26.553Z"
  completed_at: "2026-11-08T16:06:46.238Z"
  agent: flash-high-executor
---

# Edit Result

## 1. 実施内容

- ダッシュボードの章構成を、人の対応・おすすめ・実行中の `epic` を優先的に表示するアクションファーストな構成へ刷新しました。
- 完了した `epic` や `routine` の定義、`Grade` の表、および全体の集計セクションを折りたたみ形式（`details` タグ）に変更しました。
- 変更内容の検証として、空リポジトリおよび `prj-0001` 環境での `dashboard build`、`lint:md`、`docs:build` が正常に動作することを確認しました。

## 2. 変更ファイル

- `docs/ja/specdojo/references/command-reference.md`: ドキュメントの更新。
- `src/dashboard/dashboard.ts`: ダッシュボードの生成ロジックを、アクションファーストな章構成および折りたたみ表示の仕様に合わせて変更しました。
- `tests/src/dashboard/dashboard.test.ts`: ダッシュボードの生成ロジックの変更に伴うテストコードの更新。
- `tests/src/register/track-domains.test.ts`: テストコードの更新。

## 3. 申し送り

- CHANGELOG に書く事項（区分: 変更、文案: dashboard build が生成するダッシュボードを、人の対応が要るもの・おすすめの登録項目・実行中の epic を優先し、終わった epic・routine 定義・Grade 全体表・全体の集計を折りたたむアクションファースト構成に刷新しました。）を個票に記載しました。
- 空リポジトリ（config init と register scaffold 直後）での dashboard build 検証および prj-0001 での dashboard build、lint:md、docs:build がすべて正常に完了したことを確認しました。

## 4. 進め方

まず、`src/dashboard/dashboard.ts` を修正して、ダッシュボードの章構成を「人の対応」「おすすめ」「実行中の epic」が先に来るように、またそれ以外の項目（完了済み、定義、統計など）を折りたたむように変更しました。その後、`tests/src/dashboard/dashboard.test.ts` および関連するテストファイルを更新し、新しい生成ロジックが期待通りに動作することを確認しました。最後に、既存のプロジェクト環境でのビルドおよび静的検査が正常に完了することを検証しました。
