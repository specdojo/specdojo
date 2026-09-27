---
specdojo:
  id: prj-0001:xer-pjr-qjad-20260927t015947z-d16c
  type: exec-result
  task_id: PJR-QJAD
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-qjad-20260927T015947Z-d16c-plan.md
  started_at: "2026-09-27T02:02:14.828Z"
  completed_at: "2026-09-27T02:28:26.822Z"
  agent: claude-expert-executor
  block_reason: "agent exited with non-zero code: 親検証の `test-unit` (npm run test:unit) が失敗しています。`tests/src/grade.test.ts` および `tests/src/doc-index.test.ts` でエラーが発生しているため、完了条件を満たしていません。"
---

# Edit Result

## 1. 実施内容

- `tools/grade/run-per-document.sh` を修正し、未完了の文書が残っている場合に終了コード 1 を返すように実装しました。
- 対応するテストケースを `tests/tools/grade-per-document.test.ts` に追加しました。

## 2. 変更ファイル

- `tools/grade/run-per-document.sh`: 未完了の文書がある場合に終了コード 1 を返すロジックを追加し、不完全なドキュメントとステージを標準エラー出力に記録するように変更。
- `tests/tools/grade-per-document.test.ts`: 終了コードの検証テストを追加し、既存のテストで期待される終了コードを 1 に更新。

## 3. 申し送り

- 親検証の `test-unit` が失敗しているため、原因の調査と修正が必要です。

## 4. 進め方と実践の型の適用

シェルスクリプトの実行終了後の判定ロジックを修正し、未完了件数に基づいた終了コードを出力するように実装しました。また、Vitest による統合テストおよび単体テストによる検証を行いました。
