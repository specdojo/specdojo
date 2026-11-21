---
specdojo:
  id: prj-0002:pjr-kgh2-overview-guide-cse-positioning
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-11-21T09:48:25Z"
  due_on: null
  derived_from:
    - PJR-PW1Y
  commit_type: docs
---

# PJR-KGH2 概要ガイドの「SpecDojoとは」を Continuous Specification Engineering の位置付けに合わせる

## 1. 概要

specdojo-overview-guide の「SpecDojoとは」の位置付けの文を直し、分野の定義の正本を参照させる

## 2. 入力

- 正本は specdojo-philosophy の「分野: Continuous Specification Engineering」の章（定義の文・近い概念との関係・略称の扱い）。
- 「SpecDojoとは」冒頭の「SpecDojo は、Spec道（仕様道）の道場です。」を「SpecDojo は、Continuous Specification Engineering（愛称 Spec道）を実践する道場です。」の趣旨に直し、正本の章への参照を置く。定義の文と関係の表は再掲しない。
- 同じ章の「仕様駆動開発のツールに対しては、その上流で仕様と設計の体系を担います。」は正本の関係の表と矛盾しないことを確かめて残す。「目的別の次の読み物」の「SpecDojoの考え方を理解する」で specdojo-philosophy の案内に分野の定義が含まれると分かるようにする。
- 概要ガイドは status ready のため、変更は人間の確認を経る。略称を使う場合は CSpE とし、初出を「Continuous Specification Engineering（CSpE）」とする。

## 3. 完了条件

- 「SpecDojoとは」で、SpecDojo が Continuous Specification Engineering（愛称 Spec道）を実践する道場であることが読み取れ、正本の章を参照している。
- 定義の文と関係の表を再掲していない。SDD の上流とする文が正本の関係の表と矛盾しない。
- 「目的別の次の読み物」から分野の定義の正本へたどれる。
- `npm run lint:md` が通る。

## 4. 作業内容

| No  | 作業                                                         | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------------ | ---- | ---- | ---- |
| 1   | 「SpecDojoとは」の位置付けの文を直し、正本の章への参照を置く | BA   | open | -    |
| 2   | 「目的別の次の読み物」の案内を直す                           | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:specdojo-philosophy]]: 正本。「分野: Continuous Specification Engineering」の章。
- [[prj-0002:pjr-pw1y-cse-definition]]: 派生元。定義の文・関係の表・略称の扱いと反映の範囲の決定。
- [[specdojo:specdojo-overview-guide]]: 対象。
