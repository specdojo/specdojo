---
specdojo:
  id: prj-0001:pjr-m18b-review-grade-failure-blocks-completion
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
  registered_at: "2026-11-15T11:31:19Z"
  commit_type: fix
  commit_scope: review
---

# PJR-M18B review の段で grade が失敗したら、タスクを完了にしない

## 1. 概要

grade の失敗や grade-stale の結論では review を完了させず、再試行するか blocked にする

## 2. 入力

- 2026-11-15、kata-wave-2 の bac-task-completion-090 と sld-specdojo-090 で、review の前の grade が出力の形式の誤り（CAUSE requires a preceding FINDING / malformed `DONE_CRITERIA` entry）で失敗した。review は grade-stale と判定したのに、タスクは done になり、成果物の grade がないまま 140 に進んだ

## 3. 完了条件

- review の段の前の grade が失敗したとき（出力の形式の誤りなど）、決めた回数だけ grade を再試行する。それでも失敗したら、タスクを done にせず blocked にし、失敗の理由と次の操作を block の理由と result に残す。
- review の結論が `grade-stale`（grade が最新でない・ない）のとき、タスクを done にしない。
- grade が失敗した場合と grade-stale の場合を、回帰テストで確かめている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                          | 担当 | 状態 | メモ |
| --- | --------------------------------------------- | ---- | ---- | ---- |
| 1   | grade の失敗の再試行と blocked への遷移を足す | DEV  | open | -    |
| 2   | grade-stale の結論で完了させない              | DEV  | open | -    |
| 3   | 回帰テストを足す                              | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
