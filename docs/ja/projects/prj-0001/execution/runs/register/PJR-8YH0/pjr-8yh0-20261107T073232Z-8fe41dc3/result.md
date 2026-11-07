---
specdojo:
  id: prj-0001:xer-pjr-8yh0-20261107t073232z-8fe41dc3
  type: exec-result
  task_id: PJR-8YH0
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-8YH0/pjr-8yh0-20261107T073232Z-8fe41dc3/plan.md
  started_at: "2026-11-07T07:32:32.669Z"
  completed_at: "2026-11-07T07:44:54.446Z"
  agent: sol-executor
  block_reason: "parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- ログ退避の仕組みを `copyFileSync` による写し作成から、ファイルをそのまま移動する方式に変更しました。
- これにより、成功した再開 run において、前回の失敗した親の検証ログ（`parent-validation-attempt-1-*.log`）が、退避用の名前ではなく元の名前のまま残る問題を解消しました。
- 本変更に伴い、`src/shared/run-records.ts` の実装、および関連する統合テスト、単体テスト、ガイド、個票、CHANGELOG を更新しました。

## 2. 変更ファイル

- `CHANGELOG.md`: 未公開版の変更内容を記録しました。
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: ログ退避に関する仕様変更を反映しました。
- `src/shared/run-records.ts`: 試行の退避処理を `copyFileSync` による写し作成から、ファイルをそのまま移動する方式へ変更しました。
- `tests/src/exec/register-resume.integration.test.ts`: ログが移動方式になったことによる再開経路の回帰テストを更新しました。
- `tests/src/exec/run-records.test.ts`: ログ退避のロジック変更に伴う単体テストを更新しました。

## 3. 申し送り

- 統合テスト (`test-integration`) が失敗していることを確認しました。これは、退避方式の変更に伴い、テストコード内の期待値（`executorRefs` の長さ）が、写しではなく移動後のログを参照する挙動に変わったことに関連している可能性があります。runner での検証を依頼します。
- 適用外の検証: `npm run validate:schema:file`（executor が変更した YAML ファイルはない。）

## 4. 進め方

ログ退避の際、`copyFileSync` を使用すると元のファイルが残り続けてしまうため、ファイルを直接移動する方式 (`rename` に相当する処理) に変更しました。これにより、試行の snapshot 時には前回のコンテキストのログが適切に整理されるようになります。変更範囲は、コアロジック、テスト、および関連するドキュメントです。
