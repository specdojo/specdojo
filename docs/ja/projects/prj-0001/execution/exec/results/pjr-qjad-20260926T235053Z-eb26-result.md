---
specdojo:
  id: prj-0001:xer-pjr-qjad-20260926t235053z-eb26
  type: exec-result
  task_id: PJR-QJAD
  mode: edit
  status: superseded
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-qjad-20260926T235053Z-eb26-plan.md
  started_at: "2026-09-26T23:51:49.191Z"
  completed_at: "2026-09-27T02:02:14.828Z"
  agent: claude-expert-executor
---

# Edit Result

## 1. 実施内容

- executor は `tools/grade/run-per-document.sh` の修正を行い、未完了の文書が残った場合に終了コード 1 を返すように変更しました。
- 個票 `docs/ja/projects/prj-0001/controls/project-register/pjr-qjad-grade-incomplete-exit-code.md` の更新および `tests/tools/grade-per-document.test.ts` へのテスト追加を実施しました。
- しかし、親 runner による `test-integration` 検証が失敗（exit 1）しています。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/controls/project-register/pjr-qjad-grade-incomplete-exit-code.md`: 個票の作業内容および対応結果を更新。
- `tests/tools/grade-per-document.test.ts`: 終了コード 1 の期待値を追加し、既存のテストケースを修正。
- `tools/grade/run-per-document.sh`: 未完了ドキュメントが存在する場合に終了コード 1 を返すロジックを追加。

## 3. 申し送り

- 親検証 `test-integration` が失敗しているため、この原因を調査し修正する必要があります。

## 4. 進め方と実践の型の適用

executor はシェルスクリプトの編集とテストコードの更新を行い、静的検査およびユニットテスト（`test-unit`）までをパスさせましたが、統合テスト（`test-integration`）で失敗が発生しました。
