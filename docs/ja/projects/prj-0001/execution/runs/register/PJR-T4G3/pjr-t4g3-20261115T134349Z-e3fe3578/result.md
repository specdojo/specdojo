---
specdojo:
  id: prj-0001:xer-pjr-t4g3-20261115t134349z-e3fe3578
  type: exec-result
  task_id: PJR-T4G3
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-T4G3/pjr-t4g3-20261115T134349Z-e3fe3578/plan.md
  started_at: "2026-11-15T13:47:55.254Z"
  completed_at: "2026-11-15T14:31:46.229Z"
  agent: opus-executor
  block_reason: "parent validation failed: validate-schema"
---

# Edit Result

## 1. 実施内容

- pipeline の失敗時に、runner が `claim` を持っている actor (`claimActor`) で `block` を実行するように変更し、別の agent が段を進めて失敗した際、タスクが `doing` のまま残ってしまう問題を解消した。
- `block` イベントの `meta` に `claim_actor` と `stage_actor` を保持するようにし、完了前の検査 (`readCompletionPreflight`) および `exec complete` も `claimActor` に揃えることで、fallback した agent が成功した後に正しくタスクを完了できるようにした。
- 回帰テストとして `tests/src/exec/run/block-after-actor-switch.test.ts` を追加した。

## 2. 変更ファイル

- `src/exec/run/in-place.ts`: `block` を実行する際の actor を `claimActor` に設定するための修正。
- `src/exec/run/lifecycle-commands.ts`: 完了前の検査および `complete` 操作の actor を `claimActor` に揃えるための修正。
- `src/exec/run/mode-shared.ts`: `block` イベントの `meta` に `claim_actor` と `stage_actor` を記録するための変更。
- `src/exec/run/schedule-prepare.ts`: 実行スケジュール準備における actor 制御の修正。
- `src/exec/run/schedule-task.ts`: タスク実行時の actor 制御の修正。
- `tests/src/exec/run/track-filter.test.ts`: 既存のテストスイートの更新。
- `tests/src/exec/run/block-after-actor-switch.test.ts`: actor が切り替わった後の `block` 行為に関する回帰テストの追加。

## 3. 申し送り

- 判断: 「runner 自身が `claim`・再開した `run` に限る」という制約は、`--force` で同一 actor の検査を外さず、runner が `claim` を持つ actor (`claimActor`) として `block` することで満たした。`run` 中に人や別の `run` が `claim` し直していれば、`last_by` が変わるため従来どおり `block` は拒否される。
- 判断: 完了条件が求めるのは `block` だけだが、完了前の検査 (`readCompletionPreflight`) と `exec complete` も `claimActor` に揃えた。原因が同じで、fallback した agent が成功してもタスクが `doing` のまま残る問題を解消するため。
- 次のアクション: 実 agent の fallback を伴う夜間の再現は executor では行っていない。統合後に orchestrator が、`doing` のまま残った `dct-index-080` と `sysd-cross-cutting-policy-080` を `exec release` などで戻してから確かめる。
- CHANGELOG に書く事項（Unreleased・不具合修正）: `exec run` で、`claim` した agent と別の agent（fallback・`--executor-by`・`--reporter-by`）が段を進めて失敗したとき、`block` が別の actor の作業として拒否され、タスクが `doing` のまま残る問題を修正した。fallback した agent が成功した場合に完了できない問題も直した。`block` イベントの `meta` に `claim_actor` と `stage_actor` を残す。
- 判断: 「runner 自身が claim・再開した run に限る」は、`--force` で同一 actor の検査を外さず、runner が claim を持つ actor（`claimActor`）として block することで満たした。run 中に人や別の run が claim し直していれば、`last_by` が変わるため従来どおり block は拒否される。
- 判断: 完了条件が求めるのは block だけだが、完了前の検査（`readCompletionPreflight`）と `exec complete` も `claimActor` に揃えた。原因が同じで、fallback した agent が成功してもタスクが doing のまま残るため。
- 次のアクション: 実 agent の fallback を伴う夜間の再現は executor では行っていない。統合後に orchestrator が、doing のまま残った `dct-index-080` と `sysd-cross-cutting-policy-080` を `exec release` などで戻してから確かめる。
- CHANGELOG に書く事項（Unreleased・不具合修正）: `exec run` で、claim した agent と別の agent（fallback・`--executor-by`・`--reporter-by`）が段を進めて失敗したとき、block が別の actor の作業として拒否され、タスクが doing のまま残る問題を修正した。fallback した agent が成功した場合に完了できない問題も直した。block イベントの meta に `claim_actor` と `stage_actor` を残す。

## 4. 進め方

actor が切り替わった際の `block` 挙動を調整し、実行中のタスクが正しく `blocked` ステータスへ遷移するように実装を変更しました。具体的には、`claim` を保持している runner 自身（`claimActor`）が `block` を行うようにし、これに関連する各種ライフサイクルコマンドやテストコードを更新しました。
