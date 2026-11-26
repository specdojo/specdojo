---
specdojo:
  id: prj-0001:watch-scan-report-20261126
  type: project
  status: draft
  rulebook: none
---

# 見張りの朝報告 2026-11-26

- 最後に見た時刻: `2026-11-26T11:03:27Z`
- 見張りは exec-defaults の `watch.remedies` で選んだ手当てだけを打つ。それ以外の次にすべきことは人かオーケストレーターが行う。
- 見張りの対象外は、手で始めた run・再開・直しの途中のため、記録に足さず解きもせず、手当ても打たない。

## 1. 集計

- 判断が要る（`needs_decision`）: 23
- 統合先の新しい commit が要る（`needs_target_sync`）: 0
- 使用量の上限（`usage_limit`）: 0
- 負荷による時間切れ（`load_timeout`）: 0
- 中断（`interrupted`）: 5
- 分けられなかった（`unknown`）: 10

## 2. 止まっているもの

### 2.1. 判断が要る

- `kra-day2-2026-11-26`（列、`stopped`、`2026-11-25T22:17:52.157Z` から）
  - 理由: 判断が要る（`queue_step_failed`）
  - 根拠: `docs/ja/projects/prj-0001/execution/queues/kra-day2-2026-11-26.json` の `step 1 (exec-run): specdojo exec run --auto --project prj-0001 --track kata-review-all --parallel 3 --loop --max-rounds 1000 --if-busy wait --on-rate-limit fallback --fallback-executor-by sol-executor`
  - 次にすべきこと: 止まった段の対象の止まりを先に片付け、`specdojo exec queue run` で列を続けるか `exec queue cancel` で止める
  - 最初に見つけた時刻: `2026-11-25T22:20:27Z`
- `morning-a-2026-11-22`（列、`stopped`、`2026-11-21T23:24:06.976Z` から）
  - 理由: 判断が要る（`queue_step_failed`）
  - 根拠: `docs/ja/projects/prj-0001/execution/queues/morning-a-2026-11-22.json` の `step 2 (exec-run): specdojo exec run --register PJR-QTZ7 --resume --resume-from executor --worktree --if-busy wait --on-rate-limit fallback --project prj-0001`
  - 次にすべきこと: 止まった段の対象の止まりを先に片付け、`specdojo exec queue run` で列を続けるか `exec queue cancel` で止める
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `morning-a2-2026-11-22`（列、`stopped`、`2026-11-22T00:23:25.013Z` から）
  - 理由: 判断が要る（`queue_step_failed`）
  - 根拠: `docs/ja/projects/prj-0001/execution/queues/morning-a2-2026-11-22.json` の `step 2 (exec-run): specdojo exec run --register PJR-HCHH --worktree --if-busy wait --on-rate-limit fallback --project prj-0001`
  - 次にすべきこと: 止まった段の対象の止まりを先に片付け、`specdojo exec queue run` で列を続けるか `exec queue cancel` で止める
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `morning-a3-2026-11-22`（列、`stopped`、`2026-11-22T00:34:51.005Z` から）
  - 理由: 判断が要る（`queue_step_failed`）
  - 根拠: `docs/ja/projects/prj-0001/execution/queues/morning-a3-2026-11-22.json` の `step 1 (exec-run): specdojo exec run --register PJR-HCHH --resume --resume-from executor --executor-by sonnet-executor --fallback-executor-by opus-executor --worktree --if-busy wait --on-rate-limit fa`
  - 次にすべきこと: 止まった段の対象の止まりを先に片付け、`specdojo exec queue run` で列を続けるか `exec queue cancel` で止める
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `morning-a4-2026-11-22`（列、`stopped`、`2026-11-22T00:46:44.486Z` から）
  - 理由: 判断が要る（`queue_step_failed`）
  - 根拠: `docs/ja/projects/prj-0001/execution/queues/morning-a4-2026-11-22.json` の `step 1 (exec-run): specdojo exec run --register PJR-HCHH --resume --worktree --if-busy wait --on-rate-limit fallback --project prj-0001`
  - 次にすべきこと: 止まった段の対象の止まりを先に片付け、`specdojo exec queue run` で列を続けるか `exec queue cancel` で止める
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `morning-b-2026-11-22`（列、`stopped`、`2026-11-21T23:05:14.720Z` から）
  - 理由: 判断が要る（`queue_step_failed`）
  - 根拠: `docs/ja/projects/prj-0001/execution/queues/morning-b-2026-11-22.json` の `step 2 (exec-run): specdojo exec run --register PJR-BNAV --worktree --if-busy wait --on-rate-limit fallback --project prj-0001`
  - 次にすべきこと: 止まった段の対象の止まりを先に片付け、`specdojo exec queue run` で列を続けるか `exec queue cancel` で止める
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `morning-c-2026-11-22`（列、`stopped`、`2026-11-21T23:49:55.650Z` から）
  - 理由: 判断が要る（`queue_step_failed`）
  - 根拠: `docs/ja/projects/prj-0001/execution/queues/morning-c-2026-11-22.json` の `step 3 (exec-run): specdojo exec run --task T-KATA-WAVE-3-trc-requirements-to-tests-sample-050 --resume --resume-from executor --fallback-executor-by sonnet-executor --exec-defaults tmp/orchestrator/e`
  - 次にすべきこと: 止まった段の対象の止まりを先に片付け、`specdojo exec queue run` で列を続けるか `exec queue cancel` で止める
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `PJR-22XE`（register 項目、`review`、`2026-11-25T13:16:54Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-22xe.yaml` の `ready for review`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-25T22:20:27Z`
- `PJR-2Q0G`（register 項目、`review`、`2026-11-25T13:27:48Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-2q0g.yaml` の `ready for review`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-25T22:20:27Z`
- `PJR-69ZX`（register 項目、`review`、`2026-11-25T00:26:10Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-69zx.yaml` の `ready for review`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-25T13:00:29Z`
- `PJR-B0B8`（register 項目、`review`、`2026-11-25T11:31:21Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-b0b8.yaml` の `section "完了条件" updated`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-25T12:00:26Z`
- `PJR-FNB7`（register 項目、`review`、`2026-11-25T13:39:47Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-fnb7.yaml` の `ready for review`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-26T11:03:27Z`
- `PJR-JSEY`（register 項目、`review`、`2026-11-26T11:02:39Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-jsey.yaml` の `ready for review`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-26T11:03:27Z`
- `PJR-PXNQ`（register 項目、`review`、`2026-11-23T03:29:50Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-pxnq.yaml` の `ready for review`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `PJR-QCJ5`（register 項目、`review`、`2026-11-24T13:37:46Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-qcj5.yaml` の `ready for review`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-24T14:00:31Z`
- `PJR-T4E0`（register 項目、`review`、`2026-11-25T22:42:53Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-t4e0.yaml` の `ready for review`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-26T11:03:27Z`
- `PJR-V681`（register 項目、`review`、`2026-11-16T14:26:42Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-v681.yaml` の `ready for review`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `PJR-VEHX`（register 項目、`review`、`2026-11-16T15:27:14Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-vehx.yaml` の `ready for review`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `PJR-VM2S`（register 項目、`review`、`2026-11-24T03:44:33Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-vm2s.yaml` の `ready for review`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-24T04:00:17Z`
- `PJR-X1RW`（register 項目、`review`、`2026-11-16T15:35:01Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-x1rw.yaml` の `ready for review`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `pp4x-2026-11-22`（列、`stopped`、`2026-11-22T02:38:06.031Z` から）
  - 理由: 判断が要る（`queue_step_failed`）
  - 根拠: `docs/ja/projects/prj-0001/execution/queues/pp4x-2026-11-22.json` の `step 1 (exec-run): specdojo exec run --register PJR-PP4X --worktree --if-busy wait --on-rate-limit fallback --project prj-0001`
  - 次にすべきこと: 止まった段の対象の止まりを先に片付け、`specdojo exec queue run` で列を続けるか `exec queue cancel` で止める
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `release-0-10-removals-2026-11-21`（列、`stopped`、`2026-11-21T11:57:39.857Z` から）
  - 理由: 判断が要る（`queue_step_failed`）
  - 根拠: `docs/ja/projects/prj-0001/execution/queues/release-0-10-removals-2026-11-21.json` の `step 1 (exec-run): specdojo exec run --register PJR-GV43 --worktree --if-busy wait --on-rate-limit fallback --project prj-0001`
  - 次にすべきこと: 止まった段の対象の止まりを先に片付け、`specdojo exec queue run` で列を続けるか `exec queue cancel` で止める
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `wave3-pilot-tsp-index-2026-11-21`（列、`stopped`、`2026-11-21T08:49:54.944Z` から）
  - 理由: 判断が要る（`queue_step_failed`）
  - 根拠: `docs/ja/projects/prj-0001/execution/queues/wave3-pilot-tsp-index-2026-11-21.json` の `step 3 (exec-run): specdojo exec run --task T-KATA-WAVE-3-tsp-index-sample-080 --worktree --if-busy wait --on-rate-limit fallback --fallback-executor-by sol-executor --exec-defaults tmp/orchestrator/e`
  - 次にすべきこと: 止まった段の対象の止まりを先に片付け、`specdojo exec queue run` で列を続けるか `exec queue cancel` で止める
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`

### 2.2. 中断

- `kra-day1-2026-11-25`（列、`running`、`2026-11-24T21:53:39.301Z` から）
  - 理由: 中断（`stale_running`）
  - 根拠: `docs/ja/projects/prj-0001/execution/queues/kra-day1-2026-11-25.json` の `state=running since=2026-11-24T21:53:39.301Z`
  - 次にすべきこと: 実行中のプロセスがないことを確かめ、`specdojo exec resume` で再開する
  - 最初に見つけた時刻: `2026-11-25T13:00:29Z`
- `kra-night1-2026-11-24`（列、`running`、`2026-11-24T13:56:57.633Z` から）
  - 理由: 中断（`stale_running`）
  - 根拠: `docs/ja/projects/prj-0001/execution/queues/kra-night1-2026-11-24.json` の `state=running since=2026-11-24T13:56:57.633Z`
  - 次にすべきこと: 実行中のプロセスがないことを確かめ、`specdojo exec resume` で再開する
  - 最初に見つけた時刻: `2026-11-24T18:00:25Z`
- `kra-night1b-2026-11-25`（列、`running`、`2026-11-24T17:53:39.097Z` から）
  - 理由: 中断（`stale_running`）
  - 根拠: `docs/ja/projects/prj-0001/execution/queues/kra-night1b-2026-11-25.json` の `state=running since=2026-11-24T17:53:39.097Z`
  - 次にすべきこと: 実行中のプロセスがないことを確かめ、`specdojo exec resume` で再開する
  - 最初に見つけた時刻: `2026-11-24T22:00:25Z`
- `PJR-6PD7`（register 項目、`in-progress`、`2026-09-13T02:11:37Z` から）
  - 理由: 中断（`stale_in-progress`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-6pd7.yaml` の `state=in-progress since=2026-09-13T02:11:37Z`
  - 次にすべきこと: 実行中のプロセスがないことを確かめ、`specdojo exec resume` で再開する
  - 最初に見つけた時刻: `2026-11-26T11:00:34Z`
- `rerun-70ss-2026-11-21`（列、`running`、`2026-11-21T00:03:58.232Z` から）
  - 理由: 中断（`stale_running`）
  - 根拠: `docs/ja/projects/prj-0001/execution/queues/rerun-70ss-2026-11-21.json` の `state=running since=2026-11-21T00:03:58.232Z`
  - 次にすべきこと: 実行中のプロセスがないことを確かめ、`specdojo exec resume` で再開する
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`

### 2.3. 分けられなかった

- `T-KATA-REVIEW-ALL-clis-sample-120`（schedule のタスク、`blocked`、`2026-11-25T16:25:30Z` から）
  - 理由: 分けられなかった（`unknown`）
  - 根拠: `docs/ja/projects/prj-0001/execution/exec/events/20261125T162530Z_opus-executor_T-KATA-REVIEW-ALL-clis-sample-120_block_96a725e9.json` の `agent exited with non-zero code`
  - 次にすべきこと: 記録とログを読み、止まった理由を確かめる
  - 最初に見つけた時刻: `2026-11-25T17:00:20Z`
- `T-KATA-REVIEW-ALL-cop-index-sample-120`（schedule のタスク、`blocked`、`2026-11-25T16:25:27Z` から）
  - 理由: 分けられなかった（`unknown`）
  - 根拠: `docs/ja/projects/prj-0001/execution/exec/events/20261125T162527Z_opus-executor_T-KATA-REVIEW-ALL-cop-index-sample-120_block_35487791.json` の `agent exited with non-zero code`
  - 次にすべきこと: 記録とログを読み、止まった理由を確かめる
  - 最初に見つけた時刻: `2026-11-25T17:00:20Z`
- `T-KATA-REVIEW-ALL-cop-sample-120`（schedule のタスク、`blocked`、`2026-11-25T16:28:48Z` から）
  - 理由: 分けられなかった（`unknown`）
  - 根拠: `docs/ja/projects/prj-0001/execution/exec/events/20261125T162848Z_opus-executor_T-KATA-REVIEW-ALL-cop-sample-120_block_41e69bba.json` の `agent exited with non-zero code`
  - 次にすべきこと: 記録とログを読み、止まった理由を確かめる
  - 最初に見つけた時刻: `2026-11-25T17:00:20Z`
- `T-KATA-REVIEW-ALL-dct-index-sample-120`（schedule のタスク、`blocked`、`2026-11-25T16:29:54Z` から）
  - 理由: 分けられなかった（`unknown`）
  - 根拠: `docs/ja/projects/prj-0001/execution/exec/events/20261125T162954Z_opus-executor_T-KATA-REVIEW-ALL-dct-index-sample-120_block_85410b0b.json` の `agent exited with non-zero code`
  - 次にすべきこと: 記録とログを読み、止まった理由を確かめる
  - 最初に見つけた時刻: `2026-11-25T17:00:20Z`
- `T-KATA-REVIEW-ALL-dct-sample-120`（schedule のタスク、`blocked`、`2026-11-25T16:29:56Z` から）
  - 理由: 分けられなかった（`unknown`）
  - 根拠: `docs/ja/projects/prj-0001/execution/exec/events/20261125T162956Z_opus-executor_T-KATA-REVIEW-ALL-dct-sample-120_block_bc9cbfcf.json` の `agent exited with non-zero code`
  - 次にすべきこと: 記録とログを読み、止まった理由を確かめる
  - 最初に見つけた時刻: `2026-11-25T17:00:20Z`
- `T-KATA-REVIEW-ALL-gl-sample-120`（schedule のタスク、`blocked`、`2026-11-25T16:31:06Z` から）
  - 理由: 分けられなかった（`unknown`）
  - 根拠: `docs/ja/projects/prj-0001/execution/exec/events/20261125T163106Z_opus-executor_T-KATA-REVIEW-ALL-gl-sample-120_block_c1830a07.json` の `agent exited with non-zero code`
  - 次にすべきこと: 記録とログを読み、止まった理由を確かめる
  - 最初に見つけた時刻: `2026-11-25T17:00:20Z`
- `T-KATA-REVIEW-ALL-ifd-sample-120`（schedule のタスク、`blocked`、`2026-11-25T16:32:13Z` から）
  - 理由: 分けられなかった（`unknown`）
  - 根拠: `docs/ja/projects/prj-0001/execution/exec/events/20261125T163213Z_opus-executor_T-KATA-REVIEW-ALL-ifd-sample-120_block_c77f13dc.json` の `agent exited with non-zero code`
  - 次にすべきこと: 記録とログを読み、止まった理由を確かめる
  - 最初に見つけた時刻: `2026-11-25T17:00:20Z`
- `T-KATA-REVIEW-ALL-ifx-api-sample-120`（schedule のタスク、`blocked`、`2026-11-25T16:33:22Z` から）
  - 理由: 分けられなかった（`unknown`）
  - 根拠: `docs/ja/projects/prj-0001/execution/exec/events/20261125T163322Z_opus-executor_T-KATA-REVIEW-ALL-ifx-api-sample-120_block_2d399c14.json` の `agent exited with non-zero code`
  - 次にすべきこと: 記録とログを読み、止まった理由を確かめる
  - 最初に見つけた時刻: `2026-11-25T17:00:20Z`
- `T-KATA-REVIEW-ALL-ifx-cmd-sample-120`（schedule のタスク、`blocked`、`2026-11-25T16:33:35Z` から）
  - 理由: 分けられなかった（`unknown`）
  - 根拠: `docs/ja/projects/prj-0001/execution/exec/events/20261125T163335Z_opus-executor_T-KATA-REVIEW-ALL-ifx-cmd-sample-120_block_0b775d47.json` の `agent exited with non-zero code`
  - 次にすべきこと: 記録とログを読み、止まった理由を確かめる
  - 最初に見つけた時刻: `2026-11-25T17:00:20Z`
- `T-KATA-REVIEW-ALL-imp-interface-sample-140`（schedule のタスク、`blocked`、`2026-11-26T10:43:42Z` から）
  - 理由: 分けられなかった（`unknown`）
  - 根拠: `docs/ja/projects/prj-0001/execution/exec/events/20261126T104342Z_opus-executor_T-KATA-REVIEW-ALL-imp-interface-sample-140_block_41574910.json` の `resumed executor target coverage has duplicate entries: specdojo:imp-interface-sample; specdojo exec resume --task T-KATA-REVIEW-ALL-imp-interface-sample-140 --resume-from executor (add --executor-by`
  - 次にすべきこと: 記録とログを読み、止まった理由を確かめる
  - 最初に見つけた時刻: `2026-11-26T11:00:34Z`

## 3. 見張りの対象外

- `T-BUSINESS-SPECS-KATA-2-cdsd-execution-140`（schedule のタスク、`blocked`、`2026-11-15T12:20:52Z` から）
  - 触らない理由: 人かオーケストレーターの claim（`claimed by indie`）
- `T-BUSINESS-SPECS-KATA-2-stsd-task-execution-140`（schedule のタスク、`blocked`、`2026-11-15T12:20:43Z` から）
  - 触らない理由: 人かオーケストレーターの claim（`claimed by indie`）
- `T-KATA-WAVE-1-bes-index-140`（schedule のタスク、`blocked`、`2026-11-15T11:11:15Z` から）
  - 触らない理由: 人かオーケストレーターの claim（`claimed by indie`）
- `T-KATA-WAVE-1-sf-index-140`（schedule のタスク、`blocked`、`2026-11-15T11:11:14Z` から）
  - 触らない理由: 人かオーケストレーターの claim（`claimed by indie`）
- `T-PROJECT-KATA-pm-quality-management-plan-140`（schedule のタスク、`blocked`、`2026-11-15T12:32:06Z` から）
  - 触らない理由: 人かオーケストレーターの claim（`claimed by indie`）
- `T-PROJECT-KATA-pm-raci-140`（schedule のタスク、`blocked`、`2026-11-15T12:32:10Z` から）
  - 触らない理由: 人かオーケストレーターの claim（`claimed by indie`）
- `T-PROJECT-KATA-prj-assumptions-constraints-dependencies-140`（schedule のタスク、`blocked`、`2026-11-15T12:32:15Z` から）
  - 触らない理由: 人かオーケストレーターの claim（`claimed by indie`）
- `T-PROJECT-KATA-prj-comparison-of-alternatives-140`（schedule のタスク、`blocked`、`2026-11-15T12:32:19Z` から）
  - 触らない理由: 人かオーケストレーターの claim（`claimed by indie`）
- `T-STSD-PILOT-stsd-task-execution-140`（schedule のタスク、`blocked`、`2026-11-15T12:20:48Z` から）
  - 触らない理由: 人かオーケストレーターの claim（`claimed by indie`）

## 4. 手当て

- なし

## 5. この日に解けたもの

- `PJR-6PD7`（register 項目、`2026-11-25T21:00:27Z`）
- `PJR-ANF0`（register 項目、`2026-11-25T22:00:38Z`）
- `PJR-32PN`（register 項目、`2026-11-25T22:20:27Z`）
- `PJR-M120`（register 項目、`2026-11-25T22:20:27Z`）
- `PJR-P8SX`（register 項目、`2026-11-25T22:20:27Z`）
- `PJR-5C3M`（register 項目、`2026-11-25T22:20:27Z`）
- `PJR-3M4M`（register 項目、`2026-11-25T23:00:28Z`）
- `PJR-6PD7`（register 項目、`2026-11-25T23:00:28Z`）
- `PJR-DZMV`（register 項目、`2026-11-25T23:00:28Z`）
- `PJR-Q5YP`（register 項目、`2026-11-25T23:00:28Z`）
- `PJR-6XG2`（register 項目、`2026-11-26T11:00:34Z`、`done` になった）
- `PJR-66ER`（register 項目、`2026-11-26T11:00:34Z`、`done` になった）
- `T-KATA-REVIEW-ALL-cdt-sample-120`（schedule のタスク、`2026-11-26T11:00:34Z`、`done` になった）
- `T-KATA-REVIEW-ALL-imp-interface-sample-140`（schedule のタスク、`2026-11-26T11:00:34Z`、`blocked` になった）

## 6. 読めなかった記録

- なし
