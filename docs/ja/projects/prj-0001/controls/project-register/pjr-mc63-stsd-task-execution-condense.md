---
specdojo:
  id: prj-0001:pjr-mc63-stsd-task-execution-condense
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
  registered_at: "2026-11-04T23:38:43Z"
  completed_at: "2026-11-05T10:30:34Z"
  conclusion: 冗長な 12 箇所を直し、意味を変えていないことを状態・遷移の数で確かめた
  derived_from:
    - PJR-3APD
  depends_on:
    - PJR-Q9AW
  approach: condense
  targets:
    - prj-0001:stsd-task-execution
---

# PJR-MC63 stsd-task-execution の冗長さを condense で直す

## 1. 概要

stsd の試行（3APD）の段 4。磨き込んだ stsd-task-execution の冗長な箇所を condense で直し、Kata が原因のものを記録する

## 2. 入力

- condense は書き足しの最後の edit の後、review の前に置く（PJR-CYG0）。Kata が原因の記録は、段 5 の手入れか作り直しかの判断の材料にする

## 3. 完了条件

- [[stsd-task-execution]] の冗長な箇所を、`vp-arc-conciseness` に沿って直している（繰り返し・表と本文の二重の説明・図をなぞる文など）。判断に要る背景・制約・例外・完了条件は残している。
- result の `condense_records` と本文の表に、直した箇所と残した箇所を、原因（document または kata の種類と場所）付きで記録している。
- 意味を変えていない。状態・遷移・イベントの数と名前が condense の前後で同じである。
- `docs/ja/product/010-business-specs/020-data-model/stsd-task-execution.md` 以外の成果物と Kata は変えていない。Kata に直すべき点を見つけた場合は、変えずに個票の対応結果に書く。
- `npm run -s lint:md` と `npm run -s lint:fm` が通っている。

## 4. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ |
| --- | ------------------------------------------ | ---- | ---- | ---- |
| 1   | 冗長な箇所を洗い出し、直すか残すかを決める | BA   | open | -    |
| 2   | 成果物を直し、検査を通す                   | BA   | open | -    |
| 3   | result に記録を書く                        | BA   | open | -    |

## 5. 対応結果

- 実施内容: executor（sol）が [[stsd-task-execution]] の冗長な箇所を condense で直した（f3a5732d4）。H1 直下の導入文を除き、遷移の説明の表で行ごとに繰り返していた `release`・`reopen` の扱い（基本状態を `todo` に戻して依存を再判定する）を、表の前の段落にまとめた。
- 記録: result の `condense_records` に 13 件。直した 12 件はすべて原因が document（繰り返し 9 件、表と本文の二重の説明 3 件）。残した 1 件は図の分割の説明で、分割した図の読み方に要るため残し、原因を kata（template）と記録した（Kata の修正の提案はない）。
- orchestrator の確認: condense の前後で、状態は 6 件、遷移 ID は T-01〜T-11・T-14〜T-18 の 16 件、図の矢印は 16 本で変わらない。変わった成果物は対象の 1 件だけで、親の検証はすべて通った。
- 残課題: なし。次は 3APD の段 5（Kata の手入れか作り直しかを人が判断する）。

## 6. 関連ドキュメント

- [[stsd-task-execution]]: 対象の成果物
- [[specdojo:stsd-rulebook]]: stsd の書き方の規範
