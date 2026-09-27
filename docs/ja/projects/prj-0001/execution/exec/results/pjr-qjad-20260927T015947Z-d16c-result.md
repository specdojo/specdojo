---
specdojo:
  id: prj-0001:xer-pjr-qjad-20260927t015947z-d16c
  type: exec-result
  task_id: PJR-QJAD
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-qjad-20260927T015947Z-d16c-plan.md
  started_at: "2026-09-27T02:02:14.828Z"
  completed_at: "2026-09-27T02:53:37.417Z"
  agent: claude-expert-executor
---

# Edit Result

## 1. 実施内容

- `tools/grade/run-per-document.sh` を修正し、未完了の文書が残った場合に終了コード 1 を返すように変更しました。
- 併せて、正常終了時と未完了文書が存在する場合の両ケースを検証するテストを `tests/tools/grade-per-document.test.ts` に追加し、既存のテストを更新しました。
- 親検証（`test-unit`, `test-integration`, `typecheck`, `validate-schema`）はすべて `passed` となっており、正当性が確認されています。

## 2. 変更ファイル

- `tools/grade/run-per-document.sh`: 未完了文書がある場合に終了コード 1 を出力し、詳細情報を標準エラー出力に記録する処理を追加。
- `tests/tools/grade-per-document.test.ts`: 終了コードの検証テストを追加および更新。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

`tools/grade/run-per-document.sh` の終了処理を修正し、`incomplete` の件数に基づいた終了コードの制御を実装しました。また、Vitest を用いて期待される終了コードが返却されることを検証するテストケースを実装・更新することで、動作を保証しました。
