---
specdojo:
  id: prj-0001:xer-pjr-32pn-20261125t122204z-04ae3d0a
  type: exec-result
  task_id: PJR-32PN
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-32PN/pjr-32pn-20261125T122204Z-04ae3d0a/plan.md
  started_at: "2026-11-25T12:22:05.078Z"
  completed_at: "2026-11-25T12:40:14.541Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- `specdojo exec stop` を追加した。走っている `exec run --auto --loop`・`exec cycle`・予約の列が、新しいタスクを claim せず、走っているタスクを統合まで終えてから終了コード 76 で抜ける。`--track`・`--queue` で対象を絞り、`--cancel` で取り消せる。止めた記録は `exec/stops/` に残る。予約の列は止めた段を `pending` に戻し、同じ `exec queue run` で再開する。`exec status`・`exec queue status` に待ちの状態が出る。統合テスト・単体テスト・文書・個票を更新した。実際の run を止めて再開する確認は close の前に人が行う。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-operation-guide.md`: 変更、+16 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+52 / -21 行
- `src/exec/commands.ts`: 変更、+4 / -0 行
- `src/exec/queue-command.ts`: 変更、+57 / -7 行
- `src/exec/queue.ts`: 変更、+41 / -1 行
- `src/exec/run/lifecycle-commands.ts`: 変更、+8 / -0 行
- `src/exec/run/schedule-mode.ts`: 変更、+161 / -32 行
- `src/exec/trailing-records.ts`: 変更、+6 / -1 行
- `src/exec/validate-records.ts`: 変更、+2 / -1 行
- `tests/src/exec/queue.test.ts`: 変更、+73 / -0 行
- `tests/src/exec/trailing-records.integration.test.ts`: 変更、+15 / -0 行
- `src/exec/stop-command.ts`: 追加、+93 / -0 行
- `src/exec/stop-request.ts`: 追加、+408 / -0 行
- `tests/src/exec/run/auto-run-stop.integration.test.ts`: 追加、+356 / -0 行
- `tests/src/exec/stop-request.test.ts`: 追加、+273 / -0 行

## 3. 申し送り

- 完了条件の「close の前に、実際の `exec run --auto --loop` を止めて再開し、動作を確かめる」は、実 agent の起動と利用枠を要するため executor では行っていない（個票の作業内容の 4 行目を `open` のまま残した）。手順: `exec stop --msg ...` → `exec status` で `stop requests:` の `draining` を確かめる → run が終了コード 76 で抜ける → 起動し直す（予約の列なら同じ `exec queue run &lt;queue-id&gt;`）。
- CHANGELOG に書く事項（区分 Added）: `exec stop` を追加しました。走っている `exec run --auto`（`--loop`）・`exec cycle`・予約の列に、新しいタスクを claim せず、走っているタスクを統合まで終えてから止まるよう指示できます（`--track`・`--queue` で対象を絞り、`--cancel` で取り消し）。止まった run は終了コード 76 で終わり、予約の列は同じ `exec queue run` で止めた段から再開します。
- 指示は区切りで読むため、`--parallel` の枠がすべて走っている間は、どれかのタスクが終わるまで run は指示を見ない。`exec cycle` の auto の段より前（再開・index・refresh）では、auto run の印がまだないため `Nothing to stop` で拒否される。
- 予約の列の runner が書く止めた記録（`exec/stops/`）と予約ファイルは列の runner 自身は commit しない。次の run の記帳の commit か、利用者・orchestrator の commit で入る。
- 保護された設定の変更は不要だった。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
