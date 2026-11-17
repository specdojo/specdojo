---
specdojo:
  id: prj-0001:pjr-jkqx-unify-where-commands
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-16T11:00:17Z"
  due_on: null
  derived_from:
    - PJR-C5AF
  commit_type: refactor
  commit_scope: cli
---

# PJR-JKQX 場所を表示する where を 1 つのコマンドにまとめる

## 1. 概要

場所を表示する 6 つの where を 1 つのコマンドにまとめる。同じ種類の操作が系統ごとに分かれて数を増やしているため（PJR-C5AF）。

## 2. 入力

- PJR-C5AF のまとめる候補: exec・catalog・schedule・timeline・job・routine の where（6 つ）を、specdojo where `<種類>` か project の下の 1 つにまとめる。古いものは非推奨の別名として 1 版残す

## 3. 完了条件

- 場所を表示する操作が 1 つのコマンドで行え、種類を引数で選べる。
- 古い 6 つの where は非推奨の別名として 1 版残り、警告を出す。
- リファレンス・ガイド・オーケストレーターの定義が新しいコマンドを使う。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- `npm run check` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ |
| --- | ------------------------------------ | ---- | ---- | ---- |
| 1   | まとめたコマンドの形を決めて実装する | DEV  | open | -    |
| 2   | 古い where を非推奨の別名にする      | DEV  | open | -    |
| 3   | 文書を更新する                       | DEV  | open | -    |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-c5af-command-inventory]]
