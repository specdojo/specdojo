---
specdojo:
  id: prj-0001:pjr-df38-condense-trial-opr-agent-cli-update
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-04T14:31:13Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-1BRQ
  commit_type: docs
  commit_scope: operations
  approach: condense
  targets:
    - opr-agent-cli-update
---

# PJR-DF38 エージェント CLI の更新手順の冗長さを condense で直し、condense の動きを確かめる

## 1. 概要

PJR-1BRQ の統合後の確認として、既にある成果物 opr-agent-cli-update に approach condense を流し、対象だけが直ること、result の記録の表とリスト、Kata が原因の記録の手入れの plan への展開を確かめる

## 2. 入力

- PJR-1BRQ の完了条件: 統合の後にオーケストレーターが既にある成果物 1 件で condense を流して動きを確かめる（2026-11-05）
- 対象は draft の運用手順 opr-agent-cli-update（129 行、rulebook は specdojo:opr-rulebook）。stsd の試行（PJR-3APD）の対象とは重ならないものを選んだ（2026-11-05）

## 3. 完了条件

- [[opr-agent-cli-update]] の中の冗長な箇所を、`condense` の plan の手順（5 つの種類、3 つの直し方、下限）に沿って直す。手順・判断・例外・完了条件の意味を変えず、新しい内容を足さない。
- 変更するのは [[opr-agent-cli-update]] だけとし、ほかの成果物や Kata は変えない。
- result に、直した箇所とわざと残した箇所を 1 件ずつ記録する（frontmatter のリストと本文の表）。原因が Kata の場合は、`opr-rulebook` などの Kata の箇所を示す。示せない場合は `document` とする。
- 冗長な箇所が見つからない場合は、変更せずに、確かめた範囲と理由を result に記録する。
- 整形と Markdown の lint を通す。

## 4. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ |
| --- | ------------------------------------------ | ---- | ---- | ---- |
| 1   | 冗長な箇所を洗い出し、直すか残すかを決める | ARC  | open | -    |
| 2   | 成果物を直し、整形と lint を通す           | ARC  | open | -    |
| 3   | result に記録を書く                        | ARC  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[opr-agent-cli-update]]: 対象の成果物
- PJR-1BRQ: `condense` の実装
