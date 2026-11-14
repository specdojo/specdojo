---
specdojo:
  id: prj-0001:pjr-t4g3-exec-block-after-actor-switch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
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
| 1   | runner の run なら claim した actor に依らず block する | DEV  | open | -    |
| 2   | block のイベントに両方の actor を残す                   | DEV  | open | -    |
| 3   | 回帰テストを足す                                        | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- PJR-52EE（失敗の見張りと自動の立て直し）
