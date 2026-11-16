---
specdojo:
  id: prj-0001:xer-pjr-kvwh-20261116t115820z-5481194c
  type: exec-result
  task_id: PJR-KVWH
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-KVWH/pjr-kvwh-20261116T115820Z-5481194c/plan.md
  started_at: "2026-11-16T12:00:04.223Z"
  completed_at: "2026-11-16T13:03:50.701Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- routine が別の run の lock で skip した回（busy skip）を済んだ回として記録しないようにした。cron の `missed_run` が latest・all のときは `last_scheduled_for` を開始前の値へ戻し、次の routine run --due でその回を流し直す。interval は `busy_skip_count` が正の間 due になる。上限は 24 回。履歴に `skip_reason` と `retry_pending` を残し、routine status を追加した。回帰テストと単体テストを追加し、ガイド・リファレンス・個票を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/routine-operation-guide.md`: 変更、+5 / -2 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+7 / -6 行
- `src/dashboard/routines.ts`: 変更、+6 / -8 行
- `src/routine/definition.ts`: 変更、+22 / -0 行
- `src/routine/routine.ts`: 変更、+151 / -26 行
- `tests/src/routine/execution.test.ts`: 変更、+96 / -0 行
- `src/routine/status.ts`: 追加、+74 / -0 行
- `tests/src/routine/busy-skip.test.ts`: 追加、+192 / -0 行

## 3. 申し送り

- 流し直しの上限を、続いた busy skip 24 回（`ROUTINE_BUSY_RETRY_LIMIT`）に決めた。毎時の `routine run --due` でおよそ 1 日ぶん試す。超えたらその回を済んだ回とし、`last_reason` と履歴の `reason` に上限到達を残す。
- 朝の報告（dashboard の routine 実行状況）の表示は変えていない。busy の回は `skipped` の行のままで、内訳は `routine status` と履歴の `skip_reason` で確かめる。dashboard に内訳の列を出すかは別の項目で判断する。
- busy の判別は exec の出力 `[&lt;command&gt;] skipped: exec busy`（`src/exec/run/shared.ts`）に依存する。この文言を変えるときは `isExecBusySkipOutput` も合わせて変える。
- 配列 action は全体の結果が `skipped` で、いずれかの段が busy なら同じ `scheduled_for` で回ごと流し直す。Job Run の重複実行の防止を前提にしている。`routine run --id` の手動実行が busy で skip した場合も流し直し待ちにする。
- CHANGELOG の文案（不具合修正・追加機能の 2 件）は、個票の対応結果「CHANGELOG に書く事項」にある。CHANGELOG.md と保護された設定は変えていない。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
