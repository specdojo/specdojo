---
specdojo:
  id: prj-0001:pjr-pt5n-stsd-kata-confirm
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: medium
  registered_at: "2026-11-05T11:23:37Z"
  completed_at: "2026-11-05T11:24:16Z"
  conclusion: 手入れした stsd の Kata をこのまま確定し、retrofit に使う
  derived_from:
    - PJR-3APD
    - PJR-00NY
---

# PJR-PT5N 手入れした stsd の Kata を確定する

## 1. 背景

3APD の段 7。段 6 で手入れした stsd の Kata（rulebook・図の rulebook・sample）を確定し、retrofit に使ってよいかを決める

## 2. 入力

- 段 6 で stsd-rulebook（PJR-KBS6）・stsd-mermaid-rulebook（PJR-EAKN）・stsd-sample（PJR-KM8C）を手入れした。recipe と template は変えていない
- KM8C で sample の図が分割の例だけになり、1 図の例がなくなった。rulebook は閾値以下の図を分けなくてよいとしているため、このまま確定し、retrofit の後の磨き込みと review で小さな図を分けていないかを確かめる（2026-11-05 利用者が推奨の案 A を選んだ）

## 3. 検討した選択肢

| 選択肢 | 内容                                                                   | 利点                                                      | 懸念                                               |
| ------ | ---------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------- |
| A      | 手入れした Kata をこのまま確定する                                     | sample が短いまま。図を分けるかは rulebook の閾値で決まる | retrofit で小さな図まで分けるおそれがある          |
| B      | sample の手入れをもう 1 件流し、1 図の例を主にして分割の例を短く添える | 両方の書き方の例がそろう                                  | sample が長くなり、確定までに 1 回分の時間がかかる |

## 4. 決定内容

A を採る。手入れした stsd の Kata（`stsd-rulebook`・`stsd-mermaid-rulebook`・`stsd-sample`）と、変えていない `stsd-recipe`・`stsd-template` を確定し、段 8 の retrofit に使う。

## 5. 採択理由

- 代表の 1 件 [[stsd-task-execution]] は、手入れした規則をすべて満たしている（PJR-KBS6・PJR-EAKN の対応結果）。
- rulebook は閾値以下の図を分けなくてよいとしており、sample に 1 図の例がなくても規則は読み取れる。小さな図を分けていないかは、retrofit の後の磨き込みと review で確かめる。

## 6. 承認

| 項目     | 内容                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------- |
| 決定者   | indie                                                                                             |
| 決定日   | 2026-11-05                                                                                        |
| 承認方式 | commit                                                                                            |
| 証跡     | この個票の decided の記帳の commit。orchestrator の提案に利用者が「推奨でお願いします」と回答した |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容                                                                                           |
| ---------- | ---------------------------------------------------------------------------------------------- |
| 影響範囲   | 残りの stsd の 4 件（retrofit の対象）                                                         |
| 必要な対応 | 段 8 の retrofit、段 9〜11 の磨き込み・condense・review で、小さな図を分けていないかを確かめる |
| 追跡先     | PJR-3APD の段 8 以降の子項目                                                                   |

## 8. 関連ドキュメント

- [[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]・[[specdojo:stsd-sample]]: 確定する Kata
