---
specdojo:
  id: prj-0001:xer-pjr-nszt-20261018t155558z-f02a
  type: exec-result
  task_id: PJR-NSZT
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-nszt-20261018T155558Z-f02a-plan.md
  started_at: "2026-10-18T15:55:58.542Z"
  completed_at: "2026-10-18T16:05:33.843Z"
  agent: flash-high-executor
---

# Edit Result

## 1. 実施内容

- `tests/src/exec/register-post-review.test.ts` に、`verdict` が `complete` または `complete-with-findings` の場合に `todo` と `issue` が自動的に `close` される判定（`explanation` に指摘が残ることの確認を含む）のテストを追加しました。
- `tests/src/exec/register-post-review.test.ts` に、`verdict` の状態にかかわらず `decision` と `question` は `close` されない判定の単体テストを追加しました。
- 個票 `docs/ja/projects/prj-0001/controls/project-register/pjr-nszt-post-review-verdict-tests.md` を更新しました。

## 2. 変更ファイル

- `tests/src/exec/register-post-review.test.ts`: `verdict` が `complete` または `complete-with-findings` の際の `todo` / `issue` の自動 `close` 判定、および `decision` / `question` が `close` されないことを確認する単体テストを追加しました。

## 3. 申し送り

- 全工程が完了しました。

## 4. 進め方

まず、既存のテストスイート `tests/src/exec/register-post-review.test.ts` を確認し、不足していた `verdict` が `complete` または `complete-with-findings` である場合の振る舞いを検証するテストケースを設計しました。具体的には、`todo` および `issue` が `close` されること、およびその際に `explanation` に内容が引き継がれることの検証、そして `decision` と `question` は `close` されないことの検証を実装しました。最後に、個票ファイルを更新しました。
