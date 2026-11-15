---
specdojo:
  id: prj-0001:pjr-v2gh-strategy-generate-keep-modeline
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-15T10:47:27Z"
  commit_type: fix
  commit_scope: schedule
---

# PJR-V2GH schedule strategy generate が schema の modeline を落とさないようにする

## 1. 概要

書き出す strategy の先頭に schema の modeline を必ず付ける

## 2. 入力

- 2026-11-15、kata-wave-2 の strategy を --force で書き出したとき、先頭の # yaml-language-server: $schema= の行が消え、develop の validate:schema が落ちて 005 の 3 件が止まった（PJR-TN43 の C）

## 3. 完了条件

- `schedule strategy generate` が新しく書くときも `--force` で書き直すときも、先頭に `# yaml-language-server: $schema=` の modeline を置く。既存の modeline があれば保つ。
- `schedule build` が書く track にも同じ扱いがあることを確かめ、無ければそろえる。
- 書き出した strategy が `npm run validate:schema` を通ることを、回帰テストで確かめている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。保護された設定の変更は、変更案を書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                    | 担当 | 状態 | メモ |
| --- | --------------------------------------- | ---- | ---- | ---- |
| 1   | strategy の書き出しに modeline を付ける | DEV  | open | -    |
| 2   | track の書き出しを確かめる              | DEV  | open | -    |
| 3   | 回帰テストを足す                        | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
