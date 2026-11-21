---
specdojo:
  id: prj-0001:pjr-df38-condense-trial-opr-agent-cli-update
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-04T14:31:13Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-04T22:48:37Z"
  conclusion: 完了条件を満たした
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

- 実施内容: `condense` で [[opr-agent-cli-update]] の冗長な箇所を直した。冒頭の導入文を「概要」の章へまとめ（元の文はすべて残す）、節の見出しと概要で既に述べている 1 文を削った。変わったのは対象の成果物の 6 行だけで、ほかの成果物と Kata は変わっていない（45231f869）。
- 記録: result の `condense_records` と本文の表に 4 件を書いた。直した 2 件（document）と、残した 2 件（kata:template と kata:rulebook）で、残した理由も書かれている。
- 振り分けの確認: Kata が原因の 2 件が、template と rulebook の手入れの plan に載り、recipe の plan には載らないことを、生成した plan で確かめた。
- 見つけた Kata の問題: `opr-template` と `bps-template` は、H1 の直下に概要を置いたうえで「概要」の章も置くため、同じことを 2 回書く作りになっている。別の項目で扱う。
- 残課題: なし。

## 6. 関連ドキュメント

- [[opr-agent-cli-update]]: 対象の成果物
- PJR-1BRQ: `condense` の実装
