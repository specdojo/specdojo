---
specdojo:
  id: prj-0001:pjr-t4g3-exec-block-after-actor-switch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-14T22:53:22Z"
  derived_from:
    - PJR-52EE
  commit_type: fix
  commit_scope: exec
---

# PJR-T4G3 claim した agent と別の agent の段で失敗しても blocked にする

## 1. 概要

pipeline の失敗時は claim した actor に依らず blocked へ遷移させる

## 2. 入力

- 2026-11-15 の夜間に dct-index-080 と sysd-cross-cutting-policy-080 で、agy-gpt-oss-executor が claim したあと別の agent が段を進め、失敗時の block が「task is being worked on by another actor」で弾かれ doing のまま残った

## 3. 完了条件

- pipeline の段を、claim した agent と違う agent（fallback・`--executor-by`・`--reporter-by` で替えた agent）が進めて失敗したとき、runner がタスクを blocked にできる。タスクが doing のまま残らない。
- block のイベントには、claim した actor と、実際に失敗した段の actor の両方を残す。
- 人や別の run が claim しているタスクを runner が誤って blocked にしないよう、runner 自身が claim・再開した run に限る。
- 再現の手順（claim 後に fallback した agent の段が失敗する）を回帰テストで確かめている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------- | ---- | ---- | ---- |
| 1   | runner の run なら claim した actor に依らず block する | DEV  | done | -    |
| 2   | block のイベントに両方の actor を残す                   | DEV  | done | -    |
| 3   | 回帰テストを足す                                        | DEV  | done | -    |

## 5. 対応結果

### 5.1. 原因と修正

schedule の runner は、fallback や `--executor-by` で段を進めた agent の名前で `PreparedTask.actor` を上書きし、その値を `exec block --by` に渡していた。claim を持つのは最初の actor のため、`canBlockTask` の同一 actor の検査で「task is being worked on by another actor」となり、タスクが doing のまま残った。成功時の完了前検査と `exec complete` にも同じ値を渡しており、fallback した agent が成功しても完了できなかった。

`PreparedTask` に、runner が claim・再開した claim を持つ actor（`claimActor`）を足した。block・完了前検査・complete はこの actor を使う。`actor` は従来どおり段を進めた agent を表す。

- 新規の claim では、claim した actor を `claimActor` にする。
- `exec resume` の再開では、claim を持つ actor（`last_by`）を `claimActor` にする。executor を替えるため claim を取り直した場合は、取り直した actor にする。
- 統合段の再開では、block イベントの `last_by` を `claimActor` にする。

block イベントの meta に `claim_actor`（claim を持つ actor）と `stage_actor`（失敗した段の actor。reporter 段なら reporter）を残す。schedule の各 block（executor・reporter の失敗、rate limit、統合失敗、runner の例外）と、`exec run --track-state` の in-place の block に付けた。

### 5.2. 成果物と検証

- 実装: `src/exec/run/schedule-prepare.ts`、`src/exec/run/schedule-task.ts`、`src/exec/run/lifecycle-commands.ts`、`src/exec/run/mode-shared.ts`、`src/exec/run/in-place.ts`。
- 回帰テスト: `tests/src/exec/run/block-after-actor-switch.test.ts` を追加した。claim した agent から fallback した agent の段が失敗したとき、claim した actor で block し、meta に両方の actor が残ることを確かめる。`tests/src/exec/run/track-filter.test.ts` の fixture に `claimActor` を足した。
- 追加したテストと関連テスト（`track-filter`・`resume`・`inplace`）を vitest で実行し、`tsc -b` も通った。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` は親 runner が実行する。

### 5.3. 判断と申し送り

- 「runner 自身が claim・再開した run に限る」は、`--force` で同一 actor の検査を外す方法ではなく、runner が claim を持つ actor として block する方法で満たした。runner の run 中に人や別の run が claim し直した場合は `last_by` が変わるため、従来どおり block を拒否する。
- 完了条件が求めるのは block だけだが、成功時の完了前検査と complete も `claimActor` に揃えた。原因が同じで、fallback した agent が成功してもタスクが doing のまま残るためである。
- 実 agent の fallback を伴う夜間の再現は executor では行っていない。統合後に orchestrator が、doing のまま残った `dct-index-080` と `sysd-cross-cutting-policy-080` を `exec release` などで戻してから確かめる。

### 5.4. CHANGELOG に書く事項

- 区分: 不具合修正（Unreleased）。文案: `exec run` で、claim した agent と別の agent（fallback・`--executor-by`・`--reporter-by`）が段を進めて失敗したとき、block が別の actor の作業として拒否され、タスクが doing のまま残る問題を修正しました。fallback した agent が成功した場合に完了できない問題も直しました。block イベントの meta に `claim_actor` と `stage_actor` を残します。

## 6. 関連ドキュメント

- PJR-52EE（失敗の見張りと自動の立て直し）
