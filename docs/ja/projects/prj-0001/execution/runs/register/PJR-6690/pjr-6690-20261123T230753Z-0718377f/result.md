---
specdojo:
  id: prj-0001:xer-pjr-6690-20261123t230753z-0718377f
  type: exec-result
  task_id: PJR-6690
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-6690/pjr-6690-20261123T230753Z-0718377f/plan.md
  started_at: "2026-11-23T23:07:54.204Z"
  completed_at: "2026-11-23T23:23:00.414Z"
  agent: opus-executor
  block_reason: "parent validation failed: test-unit"
---

# Edit Result

## 1. 実施内容

- 原因は、`exec run --parallel` 中に他タスクの `spawnSync`（`npm ci`、`specdojo build`、merge など）がランナーのイベントループを止め、親の検証の出力パイプを読めなくなることでした。`validate:schema` は約 450 KB を出力するため、64 KiB のパイプバッファが埋まって書き込みで止まり、時間切れになっていました。
- 修正として、親の検証の stdout と stderr を一時ファイルへ書き出し、検査の終了時または時間切れ時に読む方式へ変更しました。時間切れ時は、経過時間と npm script の段階を summary、block reason、失敗ログに出すようにしました。
- executor の測定では、5 並列の `validate:schema` で、ランナーを 20 秒ずつ止めた条件下の所要時間が修正前 60.2 秒から修正後 20.1 秒になりました。止めない場合は 3.1 秒です。
- runner の `test:unit` は失敗しています。`tests/src/exec/validation-metrics.test.ts` で、`validation-timeout` 記録の `active_test_files` が期待値 `["tests/hanging.test.ts"]` に対して空配列でした。evidence の範囲では、今回の変更との関係は確認できません。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-operation-guide.md`: 運用ガイドを更新しました。親の検証の出力を一時ファイル経由で扱うことと、時間切れ時の記録内容を反映しています。
- `src/exec/evidence.ts`: 時間切れ時の summary、block reason、失敗ログに、経過時間と npm script の段階を含めるようにしました。
- `src/exec/parent-validation.ts`: 子プロセスの stdout と stderr を、パイプではなく一時ファイルへ向けるようにしました。出力は検査の終了時または時間切れ時に読みます。
- `tests/src/exec/parent-validation-timeout.integration.test.ts`: 既存の時間切れテストの期待値を更新しました。出力がファイルになったため、プロセスグループを抜けた子孫がいても `pipes_closed: true` を期待します。
- `tests/src/exec/parent-validation.test.ts`: 単体テストを追加・更新しました。時間切れの summary、block reason、ログ行を検証します。
- `src/exec/parent-validation-output.ts`: 新規ファイルです。親の検証の出力を一時ファイルで扱う処理をまとめています。
- `tests/src/exec/parent-validation-output.integration.test.ts`: 新規ファイルです。ランナーが止まった状況で大量出力する検証が固まる問題を再現し、修正を確認する統合テストです。
- `tools/e2e/parent-validation-load.ts`: 新規ファイルです。複数の `validate:schema` を同時に流し、ランナーを一定時間止めて所要時間を測る測定スクリプトです。

## 3. 申し送り

- runner の `npm run test:unit` が `tests/src/exec/validation-metrics.test.ts` で失敗しています。`validation-timeout` 記録の `active_test_files` が空でした。executor の対象テスト実行にこのファイルは含まれていません。原因が今回の変更か既存の問題かは evidence だけでは判断できないため、確認が必要です。
- 個票 `docs/ja/projects/prj-0001/controls/project-register/pjr-6690-schema-hang.md` は executor が更新済みです。runner 管理の変更として `changed_files` の対象外です。
- If the timeout integration test's `pipes_closed` expectation is reviewed: output now goes to files, so a descendant that escapes the process group no longer keeps the runner from seeing the child close. `tests/src/exec/parent-validation-timeout.integration.test.ts` now expects `pipes_closed: true` in that case. `pipes_closed: false` remains only for a direct child that does not close after SIGKILL.
- CHANGELOG.md is unchanged. The entry's category and draft line are in the ticket's section 「CHANGELOG に書く事項」 (Fixed).
- Follow-up idea (outside this item's scope): the spawnSync calls that stop the runner's event loop (`npm ci`, `specdojo build`, the build after a merge) remain. Making them asynchronous could be a separate register item.

## 4. 進め方

原因をランナーのイベントループ停止による出力パイプの読み残しと特定し、親の検証の出力を一時ファイル経由に変更しました。あわせて、時間切れ時の診断情報を増やしました。再現テスト、測定スクリプト、単体テスト、運用ガイドを追加・更新しました。
