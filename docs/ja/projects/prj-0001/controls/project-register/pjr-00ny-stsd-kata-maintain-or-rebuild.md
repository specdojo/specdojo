---
specdojo:
  id: prj-0001:pjr-00ny-stsd-kata-maintain-or-rebuild
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  registered_at: "2026-11-05T10:44:15Z"
  derived_from:
    - PJR-3APD
    - PJR-MC63
---

# PJR-00NY stsd の Kata は作り直さず手入れとする

## 1. 背景

3APD の段 5。代表の 1 件（stsd-task-execution）を材料に、stsd の Kata を手入れするか作り直すかを決める

## 2. 入力

- 作り直しの目安（章立ての変更が半分を超える、図の表記を Mermaid から D2 へ変える、rulebook の規則の半分ほどが合わない）にどれも当たらない。最終版の章立ては template の 5 章と同じで、合わなかった点は 3 つ（PJR-Q9AW の対応結果）
- 状態遷移図は Mermaid の stateDiagram-v2 が合うため、D2 へ移さない
- frontmatter の id の書き方（プロジェクト修飾の有無）は stsd に限らず cdfd・cdfd-uc・bps の rulebook にもあるため、stsd の手入れとは別の項目で扱う

## 3. 検討した選択肢

| 選択肢 | 内容                                                              | 利点                                                          | 懸念                                                      |
| ------ | ----------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------- |
| A      | Kata を手入れする（rulebook・図の rulebook・sample の不足を直す） | 磨き込んだ 1 件と、ほかの stsd の Kata がそのまま使える。早い | 合わなかった 3 点のほかに、まだ見えていない不足が残りうる |
| B      | Kata を消して bootstrap で作り直す                                | 実物から Kata を組み立て直せる                                | 作り直しの目安にどれも当たらず、手間に見合わない          |

## 4. 決定内容

A を採る。stsd の Kata は作り直さず手入れとし、図の表記は Mermaid のままにする。手入れは PJR-KBS6（stsd-rulebook）・PJR-EAKN（stsd-mermaid-rulebook）・PJR-KM8C（stsd-sample）の順に行う。frontmatter の `id` の書き方は stsd に限らないため、別の項目（PJR-PHY7）で扱う。

## 5. 採択理由

- 最終版の章立ては template の 5 章と同じで、章立ての変更はない。
- 状態遷移図は Mermaid の `stateDiagram-v2` で問題なく書けた。D2 へ移す理由がない。
- 合わなかったのは 3 点で、2 つの rulebook の箇条書き約 80 項目のごく一部である（PJR-Q9AW の対応結果）。
- condense（PJR-MC63）で直した 12 か所の原因はすべて文書側で、Kata が原因の冗長さはなかった。

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

| 項目       | 内容                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------ |
| 影響範囲   | stsd の rulebook・図の rulebook・sample。ほかの stsd の成果物は段 8 の retrofit で合わせる |
| 必要な対応 | 3 件の手入れの後、段 7 で人が Kata を確定する                                              |
| 追跡先     | PJR-KBS6・PJR-EAKN・PJR-KM8C・PJR-PHY7                                                     |

## 8. 関連ドキュメント

- [[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]・[[specdojo:stsd-sample]]: 手入れの対象
- [[stsd-task-execution]]: 判断の材料にした代表の 1 件
