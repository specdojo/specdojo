---
specdojo:
  id: prj-0001:xer-pjr-ese7-20261122t032130z-1a8df2e8
  type: exec-result
  task_id: PJR-ESE7
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-ESE7/pjr-ese7-20261122T032130Z-1a8df2e8/plan.md
  started_at: "2026-11-22T03:21:31.445Z"
  completed_at: "2026-11-22T03:26:39.408Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- exec の --by が予約名（SpecDojo・specdojo-orchestrator・night-orchestrator）を受け付けるようにした。assertValidExecActor を追加して exec の core・commands に適用し、単体テスト、文書、個票の対応結果と CHANGELOG 文案を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-operation-guide.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+2 / -0 行
- `src/exec/commands.ts`: 変更、+2 / -2 行
- `src/exec/core.ts`: 変更、+3 / -3 行
- `src/shared/specdojo-config.ts`: 変更、+7 / -0 行
- `tests/src/exec/events.test.ts`: 変更、+19 / -0 行
- `tests/src/shared/specdojo-config.test.ts`: 変更、+18 / -0 行

## 3. 申し送り

- 統合後に、オーケストレーターが第 3 波の 090 の 1 件を `exec release --by specdojo-orchestrator` で戻して流し、記帳と run が通ることを確かめる（executor では実行していない）。
- `events/pjr-ese7.yaml` は私が編集していないが作業ツリーで変更済み（引用符の形式のみ）。runner 管理のファイルのため、そのまま扱ってよいか確認する。
- `src/shared/specdojo-config.ts` は 1,000 行を超えており `max-lines` の警告が出ている（既存の傾向で、今回の追加は 7 行）。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
