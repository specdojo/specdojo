---
specdojo:
  id: prj-0001:xer-pjr-wf8q-20261126t202046z-218b5494
  type: exec-result
  task_id: PJR-WF8Q
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-WF8Q/pjr-wf8q-20261126T202046Z-218b5494/plan.md
  started_at: "2026-11-26T20:20:47.015Z"
  completed_at: "2026-11-26T20:23:11.443Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- imp 系 rulebook 5 本の `based_on` の説明を小文字 pjr-xxxx の形にそろえ、sample 4 本の cr-2026-004 を pjr-c4a1 / PJR-C4A1 に直した。個票の作業内容と対応結果も更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/imp-business-rulebook.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/rulebooks/imp-data-rulebook.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/rulebooks/imp-interface-rulebook.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/rulebooks/imp-operations-rulebook.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/rulebooks/imp-test-rulebook.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/samples/imp-business-sample.md`: 変更、+2 / -2 行
- `docs/ja/specdojo/samples/imp-interface-sample.md`: 変更、+2 / -2 行
- `docs/ja/specdojo/samples/imp-operations-sample.md`: 変更、+2 / -2 行
- `docs/ja/specdojo/samples/imp-test-sample.md`: 変更、+2 / -2 行

## 3. 申し送り

- schema と template は変更していない。
- npm run lint:fm と npm run lint:md は親 runner の検査で確認する。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
