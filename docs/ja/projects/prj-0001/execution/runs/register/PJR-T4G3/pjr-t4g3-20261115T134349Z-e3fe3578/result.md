---
specdojo:
  id: prj-0001:xer-pjr-t4g3-20261115t134349z-e3fe3578
  type: exec-result
  task_id: PJR-T4G3
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-T4G3/pjr-t4g3-20261115T134349Z-e3fe3578/plan.md
  started_at: "2026-11-15T13:47:55.254Z"
  completed_at: "2026-11-15T15:52:12.759Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- claim した agent と別の agent が段を進めて失敗しても、runner が claim を持つ actor（新しい claimActor）で block するようにした。block イベントの meta に `claim_actor` と `stage_actor` を残す。完了前の検査と complete も同じ actor に揃えた。回帰テストを追加し、個票の作業内容と対応結果を更新した。

## 2. 変更ファイル

- `src/exec/run/in-place.ts`: 変更、+11 / -1 行
- `src/exec/run/lifecycle-commands.ts`: 変更、+20 / -5 行
- `src/exec/run/mode-shared.ts`: 変更、+9 / -0 行
- `src/exec/run/schedule-prepare.ts`: 変更、+11 / -0 行
- `src/exec/run/schedule-task.ts`: 変更、+21 / -13 行
- `tests/src/exec/run/track-filter.test.ts`: 変更、+1 / -0 行
- `tests/src/exec/run/block-after-actor-switch.test.ts`: 追加、+99 / -0 行

## 3. 申し送り

- 判断: 「runner 自身が claim・再開した run に限る」は、`--force` で同一 actor の検査を外さず、runner が claim を持つ actor（`claimActor`）として block することで満たした。run 中に人や別の run が claim し直していれば、`last_by` が変わるため従来どおり block は拒否される。
- 判断: 完了条件が求めるのは block だけだが、完了前の検査（`readCompletionPreflight`）と `exec complete` も `claimActor` に揃えた。原因が同じで、fallback した agent が成功してもタスクが doing のまま残るため。
- 次のアクション: 実 agent の fallback を伴う夜間の再現は executor では行っていない。統合後に orchestrator が、doing のまま残った `dct-index-080` と `sysd-cross-cutting-policy-080` を `exec release` などで戻してから確かめる。
- CHANGELOG に書く事項（Unreleased・不具合修正）: `exec run` で、claim した agent と別の agent（fallback・`--executor-by`・`--reporter-by`）が段を進めて失敗したとき、block が別の actor の作業として拒否され、タスクが doing のまま残る問題を修正した。fallback した agent が成功した場合に完了できない問題も直した。block イベントの meta に `claim_actor` と `stage_actor` を残す。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
