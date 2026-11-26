---
specdojo:
  id: prj-0001:watch-scan-report-20261125
  type: project
  status: draft
  rulebook: none
---

# 見張りの朝報告 2026-11-25

- 最後に見た時刻: `2026-11-25T14:00:28Z`
- 見張りは手を打たない。次にすべきことは人かオーケストレーターが行う。

## 1. 集計

- 判断が要る（`needs_decision`）: 32
- 統合先の新しい commit が要る（`needs_target_sync`）: 0
- 使用量の上限（`usage_limit`）: 0
- 負荷による時間切れ（`load_timeout`）: 0
- 中断（`interrupted`）: 4
- 分けられなかった（`unknown`）: 0

## 2. 止まっているもの

### 2.1. 判断が要る

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
- `PJR-32PN`（register 項目、`review`、`2026-11-25T12:40:23Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-32pn.yaml` の `ready for review`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-25T13:00:29Z`
- `PJR-66ER`（register 項目、`review`、`2026-11-25T10:43:50Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-66er.yaml` の `ready for review`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-25T13:00:29Z`
- `PJR-69ZX`（register 項目、`review`、`2026-11-25T00:26:10Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-69zx.yaml` の `ready for review`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-25T13:00:29Z`
- `PJR-6XG2`（register 項目、`review`、`2026-11-24T17:39:30Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-6xg2.yaml` の `ready for review`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-24T18:00:25Z`
- `PJR-ANF0`（register 項目、`review`、`2026-11-24T23:52:45Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-anf0.yaml` の `ready for review`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-25T13:00:29Z`
- `PJR-B0B8`（register 項目、`review`、`2026-11-25T11:31:21Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-b0b8.yaml` の `section "完了条件" updated`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-25T12:00:26Z`
- `PJR-M120`（register 項目、`review`、`2026-11-24T23:42:18Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-m120.yaml` の `ready for review`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-25T13:00:29Z`
- `PJR-P8SX`（register 項目、`review`、`2026-11-25T12:50:03Z` から）
  - 理由: 判断が要る（`review_pending`）
  - 根拠: `docs/ja/projects/prj-0001/controls/project-register/events/pjr-p8sx.yaml` の `ready for review`
  - 次にすべきこと: post-review の結果を読み、close するか差し戻すかを決める
  - 最初に見つけた時刻: `2026-11-25T13:00:29Z`
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
- `T-BUSINESS-SPECS-KATA-2-cdsd-execution-140`（schedule のタスク、`blocked`、`2026-11-15T12:20:52Z` から）
  - 理由: 判断が要る（`manual_block`）
  - 根拠: `docs/ja/projects/prj-0001/execution/exec/events/20261115T122052Z_indie_T-BUSINESS-SPECS-KATA-2-cdsd-execution-140_block_377028f8.json` の `差し戻し: 完了条件が未充足のため、手直しの todo の後に確定に戻す（PJR-TN43）`
  - 次にすべきこと: 手で止めた人の理由を読み、その指示（手直しの todo など）が済んでから再開する
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `T-BUSINESS-SPECS-KATA-2-stsd-task-execution-140`（schedule のタスク、`blocked`、`2026-11-15T12:20:43Z` から）
  - 理由: 判断が要る（`manual_block`）
  - 根拠: `docs/ja/projects/prj-0001/execution/exec/events/20261115T122043Z_indie_T-BUSINESS-SPECS-KATA-2-stsd-task-execution-140_block_2b6e84f8.json` の `差し戻し: 完了条件が未充足のため、手直しの todo の後に確定に戻す（PJR-TN43）`
  - 次にすべきこと: 手で止めた人の理由を読み、その指示（手直しの todo など）が済んでから再開する
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `T-KATA-WAVE-1-bes-index-140`（schedule のタスク、`blocked`、`2026-11-15T11:11:15Z` から）
  - 理由: 判断が要る（`manual_block`）
  - 根拠: `docs/ja/projects/prj-0001/execution/exec/events/20261115T111115Z_indie_T-KATA-WAVE-1-bes-index-140_block_462f7d75.json` の `差し戻し: 完了条件が未充足のため、手直しの todo の後に確定に戻す（PJR-TN43）`
  - 次にすべきこと: 手で止めた人の理由を読み、その指示（手直しの todo など）が済んでから再開する
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `T-KATA-WAVE-1-sf-index-140`（schedule のタスク、`blocked`、`2026-11-15T11:11:14Z` から）
  - 理由: 判断が要る（`manual_block`）
  - 根拠: `docs/ja/projects/prj-0001/execution/exec/events/20261115T111114Z_indie_T-KATA-WAVE-1-sf-index-140_block_dca78e24.json` の `差し戻し: 完了条件が未充足のため、手直しの todo の後に確定に戻す（PJR-TN43）`
  - 次にすべきこと: 手で止めた人の理由を読み、その指示（手直しの todo など）が済んでから再開する
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `T-PROJECT-KATA-pm-quality-management-plan-140`（schedule のタスク、`blocked`、`2026-11-15T12:32:06Z` から）
  - 理由: 判断が要る（`manual_block`）
  - 根拠: `docs/ja/projects/prj-0001/execution/exec/events/20261115T123206Z_indie_T-PROJECT-KATA-pm-quality-management-plan-140_block_cd43e9f5.json` の `差し戻し: 完了条件が未充足のため、手直しの todo の後に確定に戻す（PJR-TN43）`
  - 次にすべきこと: 手で止めた人の理由を読み、その指示（手直しの todo など）が済んでから再開する
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `T-PROJECT-KATA-pm-raci-140`（schedule のタスク、`blocked`、`2026-11-15T12:32:10Z` から）
  - 理由: 判断が要る（`manual_block`）
  - 根拠: `docs/ja/projects/prj-0001/execution/exec/events/20261115T123210Z_indie_T-PROJECT-KATA-pm-raci-140_block_d0c3e31c.json` の `差し戻し: 完了条件が未充足のため、手直しの todo の後に確定に戻す（PJR-TN43）`
  - 次にすべきこと: 手で止めた人の理由を読み、その指示（手直しの todo など）が済んでから再開する
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `T-PROJECT-KATA-prj-assumptions-constraints-dependencies-140`（schedule のタスク、`blocked`、`2026-11-15T12:32:15Z` から）
  - 理由: 判断が要る（`manual_block`）
  - 根拠: `docs/ja/projects/prj-0001/execution/exec/events/20261115T123215Z_indie_T-PROJECT-KATA-prj-assumptions-constraints-dependencies-140_block_e6e0f813.json` の `差し戻し: 完了条件が未充足のため、手直しの todo の後に確定に戻す（PJR-TN43）`
  - 次にすべきこと: 手で止めた人の理由を読み、その指示（手直しの todo など）が済んでから再開する
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `T-PROJECT-KATA-prj-comparison-of-alternatives-140`（schedule のタスク、`blocked`、`2026-11-15T12:32:19Z` から）
  - 理由: 判断が要る（`manual_block`）
  - 根拠: `docs/ja/projects/prj-0001/execution/exec/events/20261115T123219Z_indie_T-PROJECT-KATA-prj-comparison-of-alternatives-140_block_61b012f7.json` の `差し戻し: 完了条件が未充足のため、手直しの todo の後に確定に戻す（PJR-TN43）`
  - 次にすべきこと: 手で止めた人の理由を読み、その指示（手直しの todo など）が済んでから再開する
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`
- `T-STSD-PILOT-stsd-task-execution-140`（schedule のタスク、`blocked`、`2026-11-15T12:20:48Z` から）
  - 理由: 判断が要る（`manual_block`）
  - 根拠: `docs/ja/projects/prj-0001/execution/exec/events/20261115T122048Z_indie_T-STSD-PILOT-stsd-task-execution-140_block_6cfce93d.json` の `差し戻し: 完了条件が未充足のため、手直しの todo の後に確定に戻す（PJR-TN43）`
  - 次にすべきこと: 手で止めた人の理由を読み、その指示（手直しの todo など）が済んでから再開する
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
- `rerun-70ss-2026-11-21`（列、`running`、`2026-11-21T00:03:58.232Z` から）
  - 理由: 中断（`stale_running`）
  - 根拠: `docs/ja/projects/prj-0001/execution/queues/rerun-70ss-2026-11-21.json` の `state=running since=2026-11-21T00:03:58.232Z`
  - 次にすべきこと: 実行中のプロセスがないことを確かめ、`specdojo exec resume` で再開する
  - 最初に見つけた時刻: `2026-11-24T01:00:29Z`

## 3. この日に解けたもの

- `PJR-G2XJ`（register 項目、`2026-11-24T18:00:25Z`）
- `T-KATA-REVIEW-ALL-atc-index-sample-110`（schedule のタスク、`2026-11-24T22:00:25Z`）
- `PJR-B0B8`（register 項目、`2026-11-25T12:00:26Z`）
- `T-KATA-REVIEW-ALL-trc-requirements-to-tests-sample-130`（schedule のタスク、`2026-11-25T13:00:29Z`）
- `T-KATA-REVIEW-ALL-tsd-sample-140`（schedule のタスク、`2026-11-25T13:00:29Z`）
- `T-KATA-REVIEW-ALL-imp-data-sample-110`（schedule のタスク、`2026-11-25T13:00:29Z`）
- `T-KATA-REVIEW-ALL-trc-requirements-to-tests-sample-130`（schedule のタスク、`2026-11-25T14:00:28Z`）
- `T-KATA-REVIEW-ALL-tsd-sample-140`（schedule のタスク、`2026-11-25T14:00:28Z`）

## 4. 読めなかった記録

- なし
