---
specdojo:
  id: prj-0001:pjr-3hxq-sld-specdojo-rework-wave-2
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-15T12:22:16Z"
  block_reason: "executor reported incomplete: sld-specdojo に F001〜F015 を反映した（grade の実行状態と .specdojo 設定の行を追加、generated 削除手順と worktree の記述を訂正、対応表と未決事項を整理）。個票の対応結果も追記した。status は draft のまま。再 grade（grade run --target deli…"
  commit_type: docs
  commit_scope: sld
  approach: fully-guided
  targets:
    - sld-specdojo
---

# PJR-3HXQ sld-specdojo を grade の指摘で手直しする（kata-wave-2 の 2 回目）

## 1. 概要

sld-specdojo を最新の grade の指摘で直す

## 2. 入力

- T-KATA-WAVE-2-sld-specdojo-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）
- 最新の grade の未充足の完了条件と major の指摘を取り込み、本文の未決の目印を片付ける（決められないものは留保として追跡先をつなぐ）

## 3. 完了条件

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く（留保の範囲だけが未充足として残る場合は、その理由を書く）。
- 本文の未決の目印（`_TODO_`・`_ASSUMPTION_`・`_UNDECIDED_`）は、決められるものは決め、決められないものは期限付きの留保として追跡先をつなぐ。
- 成果物の `status` は変えない（確定は人が 140 で行う）。
- 動いている grade の lock や実行状態のファイルを消してよいとしている誤りを直し、片付けてよい場所と残すべき場所を実装の配置と合わせている。`.specdojo` の設定の保管と、grade の実行状態の置き場所の区分を正す。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ |
| --- | ----------------------------------- | ---- | ---- | ---- |
| 1   | 最新の grade の指摘を取り込んで直す | ARC  | open | -    |
| 2   | grade し直して結果を書く            | ARC  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
