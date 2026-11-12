---
specdojo:
  id: prj-0001:pjr-x04g-parallel-review-grade-sidecar-isolation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-12T13:48:52Z"
  derived_from:
    - PJR-Z4H8
  autopilot: approved
  commit_type: fix
  commit_scope: grade
---

# PJR-X04G 並べて流す review の段が、grade の共有ファイルを取り合わないようにする

## 1. 概要

schedule の review の段を --parallel で流しても、grade の pipeline の進み具合のファイルを run ごとに分け、ほかの run の統合を止めないようにする

## 2. 入力

- PJR-Z4H8 の修正。今晩の夜間に流す（indie が 2026-11-12 に承認）

## 3. 完了条件

- PJR-Z4H8 の原因（schedule の review の段の grade が、なぜ主の作業ツリーの `execution/grade/pipeline/*.json` を書き換えるか、grade の agent が失敗したときにも書き換わる理由）を確かめ、個票の対応結果に書いている。
- review の段を `--parallel` で流しても、ある run の grade の進み具合のファイルが、ほかの run の統合の前の確認（`Grade sidecar changed after checkpoint`）を止めない。run ごとの worktree に閉じる・対象ごとに分ける・確認の対象を自分の run の分に絞る、など、原因に合った形で直す。
- grade の agent が失敗したときに、進み具合のファイルが中途半端な状態で主の作業ツリーに残らない。
- 2 つの review の段を並べて流し、片方の grade が失敗しても、もう片方が統合まで進むことを回帰テスト（統合テストでよい）で確かめている。
- 関連する設計・ガイドを、振る舞いの変化に合わせて直している。直った後、`rtn-exec-cycle` などの `parallel` を 2 に上げてよいかの判断の材料を対応結果に書く（設定は変えない）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                                  | 担当     | 状態 | メモ |
| --- | ----------------------------------------------------- | -------- | ---- | ---- |
| 1   | 原因を確かめ、review の段の grade を run ごとに分ける | executor | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-z4h8-parallel-review-grade-sidecar-conflict]]
