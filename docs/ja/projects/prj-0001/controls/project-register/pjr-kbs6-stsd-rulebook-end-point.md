---
specdojo:
  id: prj-0001:pjr-kbs6-stsd-rulebook-end-point
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-05T10:44:52Z"
  completed_at: "2026-11-05T10:58:39Z"
  conclusion: 終了点を置く場合と置かない場合の境界と、省くときの書き方を stsd-rulebook に足した
  derived_from:
    - PJR-3APD
    - PJR-00NY
  approach: rulebook-maintenance
  targets:
    - specdojo:stsd-rulebook
---

# PJR-KBS6 stsd の rulebook に、終了点を置かない境界の書き方を足す

## 1. 概要

3APD の段 6。差し戻せる完了や記録が残る中止のように、業務の終了と状態管理の継続が分かれる場合の、終了点と継続状態の書き方を stsd-rulebook に足す

## 2. 入力

- PJR-Q9AW の磨き込みで、完了は差し戻せ、中止の後も記録が残るため、stsd-task-execution では終了点を置かず理由を「概要」に書いた。rulebook は終了点を省く場合を「継続状態」で説明するが、この境界の書き方がない

## 3. 完了条件

- [[specdojo:stsd-rulebook]] の状態遷移図の規則に、業務の終了と状態管理の継続が分かれる場合（差し戻せる完了、記録が残る中止など）に、終了点を置くか、置かずに「概要」に何を書くかを足している。
- 既存の「終了点を省く場合は継続状態と理由を書く」規則と矛盾せず、同じことを 2 か所で説明していない。
- 足した規則が、[[stsd-task-execution]] の「概要」の書き方で満たせることを確かめている。
- 変えるのは対象の Kata だけで、ほかの Kata と成果物（`docs/ja/product/` 配下）は変えていない。
- `npm run -s lint:md` と `npm run -s lint:fm` が通っている。

## 4. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------- | ---- | ---- | ---- |
| 1   | 終了点と継続状態の規則を読み、足りない場合を整理する | BA   | open | -    |
| 2   | 規則を足し、検査を通す                               | BA   | open | -    |

## 5. 対応結果

- 実施内容: executor（sol）が [[specdojo:stsd-rulebook]] の状態遷移図の規則を直した（cced952ed）。終了点は、ライフサイクルを閉じる業務イベントと条件がある場合に置く。完了・中止の後も差し戻しや確認・記録の更新で状態管理が続く場合は置かない。省く場合は「概要」に業務上の到達点、管理を続ける状態と理由を書き、差し戻せる完了は戻りの遷移で、中止は出力遷移のない継続状態で示す。既存の規則へまとめ、別の節に同じ説明を足していない。
- 手入れの plan に載った grade の finding 2 件も直した。F001: 遷移 ID を振り直さず、削除した ID を再利用しない規則を足した（PJR-Q9AW で T-12・T-13 を欠番にした実例と合う）。F002: 本文構成の表の「概要」の内容に、状態の正本となる管理場所と、状態変更を起こす業務範囲を足した（template の記入の指示とそろえた）。
- orchestrator の確認: 変わった Kata は `stsd-rulebook` だけで、成果物は変わっていない。[[stsd-task-execution]] は、完了から `reopen` で戻り、中止は出力遷移を持たないため、足した規則を満たす。親の検証はすべて通った。
- 残課題: なし（図の rulebook は PJR-EAKN でそろえる）。

## 6. 関連ドキュメント

- [[specdojo:stsd-rulebook]]: 手入れの対象
- [[stsd-task-execution]]: 不足が見つかった成果物
