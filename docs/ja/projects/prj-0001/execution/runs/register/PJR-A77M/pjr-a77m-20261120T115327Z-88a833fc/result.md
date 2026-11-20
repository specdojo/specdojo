---
specdojo:
  id: prj-0001:xer-pjr-a77m-20261120t115327z-88a833fc
  type: exec-result
  task_id: PJR-A77M
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-A77M/pjr-a77m-20261120T115327Z-88a833fc/plan.md
  started_at: "2026-11-20T11:53:29.015Z"
  completed_at: "2026-11-20T12:16:59.925Z"
  agent: sonnet-executor
  block_reason: "parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- CodeQL が検出した 5 件のセキュリティ Alert を修正した。
- `src/shared/text.ts` にエスケープ処理を行う `escape` 関数を抽出し、共通化した。
- `src/deliverable/trash.ts` の正規表現への `local_id` 埋め込みを修正した。
- `src/exec/run/change-scope.ts` の ReDoS の可能性を解消した。
- `src/exec/repo-trace.ts` および `src/dashboard/shared.ts` における表のセルエスケープ処理を適用した。
- `src/exec/shared.ts` における不要な `replace` 処理を削除した。
- 修正内容を確認するための単体テストおよび統合テストを追加した。

## 2. 変更ファイル

- `src/dashboard/shared.ts`: 表のセルエスケープ処理を適用した。
- `src/deliverable/trash.ts`: 正規表現への `local_id` 埋め込みを修正した。
- `src/exec/register-foreign-wait.ts`: 変更、+1 / -4 行
- `src/exec/repo-trace.ts`: 表のセルエスケープ処理を適用した。
- `src/exec/run/change-scope.ts`: ReDoS の可能性を解消した。
- `src/exec/shared.ts`: 不要な `replace` 処理を削除した。
- `src/register/renumber.ts`: 変更、+1 / -4 行
- `src/shared/text.ts`: 共通の `escape` 関数を実装した。
- `tests/src/deliverable/trash.integration.test.ts`: `src/deliverable/trash.ts` の修正を確認する統合テストを追加した。
- `tests/src/exec/repo-trace.test.ts`: `src/exec/repo-trace.ts` の修正を確認する単体テストを追加した。
- `tests/src/exec/run/change-scope.test.ts`: `src/exec/run/change-scope.ts` の修正を確認する単体テストを追加した。
- `tests/src/shared/text.test.ts`: `src/shared/text.ts` の `escape` 関数を確認する単体テストを追加した。

## 3. 申し送り

- merge 後に CodeQL の alert（1・2・5・6・7）が閉じるかを orchestrator が確認する。
- CHANGELOG.md は変えず、個票 5.4 に区分 Fixed と文案を記載した。
- tmp/fix.py（作業用スクリプト）が残っているが tmp/ は commit 対象外。

## 4. 進め方

CodeQL の指摘に基づき、脆弱性となり得る箇所を特定し、修正を行った。まず、共通の安全なエスケープ処理を行うために `src/shared/text.ts` へ `escape` 関数を実装した。その後、各ファイル（`src/deliverable/trash.ts`, `src/exec/run/change-scope.ts`, `src/exec/repo-trace.ts`, `src/dashboard/shared.ts`, `src/exec/shared.ts`）の修正を行い、修正によって機能が損なわれていないことを確認するために、それぞれの単体テストおよび統合テストを整備した。
