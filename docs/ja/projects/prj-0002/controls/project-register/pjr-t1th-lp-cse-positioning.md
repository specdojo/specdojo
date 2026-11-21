---
specdojo:
  id: prj-0002:pjr-t1th-lp-cse-positioning
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-11-21T09:48:26Z"
  due_on: null
  derived_from:
    - PJR-PW1Y
  commit_type: docs
---

# PJR-T1TH specdojo-lp に Continuous Specification Engineering の名称と位置付けを載せる

## 1. 概要

specdojo-lp の Hero・ToolFit・ページの description を、分野の定義の正本に合わせて直す

## 2. 入力

- 正本は specdojo-philosophy の「分野: Continuous Specification Engineering」の章（定義の文・近い概念との関係・略称の扱い）。
- specdojo-lp:src/components/sections/Hero.astro の「はじめよう、Spec道（仕様道）」の近くに、正式名称 Continuous Specification Engineering と、SpecDojo がその道場であることを短く示す。愛称の Spec道 は残す。
- specdojo-lp:src/components/sections/ToolFit.astro の SDD との比較の行（「SpecDojo はその上流で…」）を、正本の関係の表（SDD の上流・併用）と矛盾しない文にそろえる。
- specdojo-lp:src/pages/index.astro の description に正式名称を含めるかを決め、含める場合は日本語の定義の文から短くまとめる。略称を使う場合は CSpE とし、初出を「Continuous Specification Engineering（CSpE）」とする。

## 3. 完了条件

- LP の Hero で、正式名称 Continuous Specification Engineering と、SpecDojo がその道場であることが読み取れる。愛称の Spec道 が残っている。
- ToolFit の SDD との比較の行が、正本の関係の表（SDD の上流・併用）と矛盾しない。
- ページの description に正式名称を含めるかの判断と理由が本個票の対応結果に書かれている。
- 略称を使う場合は CSpE で、初出が「Continuous Specification Engineering（CSpE）」になっている。CSE などの別の略称を使っていない。specdojo-lp のビルドと検査が通る。

## 4. 作業内容

| No  | 作業                                        | 担当 | 状態 | メモ |
| --- | ------------------------------------------- | ---- | ---- | ---- |
| 1   | Hero に正式名称と位置付けを載せる           | BA   | open | -    |
| 2   | ToolFit の SDD との比較の行をそろえる       | BA   | open | -    |
| 3   | ページの description の扱いを決めて反映する | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:specdojo-philosophy]]: 正本。「分野: Continuous Specification Engineering」の章。
- [[prj-0002:pjr-pw1y-cse-definition]]: 派生元。定義の文・関係の表・略称の扱いと反映の範囲の決定。
- specdojo-lp（`src/components/sections/Hero.astro`・`ToolFit.astro`・`src/pages/index.astro`）: 対象。
