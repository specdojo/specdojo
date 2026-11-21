---
specdojo:
  id: prj-0002:pjr-wbwx-discipline-name
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  registered_at: "2026-11-21T04:40:41Z"
---

# PJR-WBWX SpecDojo が提唱する分野の正式名称を決める

## 1. 背景

Spec道 では分かりにくいため、SDD と範囲の違う分野として Continuous Specification Engineering を正式名称に掲げるかを決める

## 2. 入力

- 候補は Continuous Specification Engineering。
- Spec道 は愛称として残す（分野・道・道場の二層または三層で使う案）。
- SDD（仕様駆動開発）との範囲の違い（成果物の体系・判断の記録・型と評定・運用中の維持）を示す必要がある。
- 略称の CSE は Computer Science and Engineering とぶつかる。
- 2026-11-21 の調査では、Continuous Specification Engineering を分野として定義した用語は見当たらなかった。近い研究に Continuous Requirements Engineering がある。

## 3. 検討した選択肢

| 選択肢 | 内容                                                                                      | 利点                                                                  | 懸念                                                                                                         |
| ------ | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| A      | Spec道 のまま                                                                             | 今の文書・LP を変えずに済む                                           | 英語圏に伝わらず、SDD のツールと見られやすい                                                                 |
| B      | Continuous Specification Engineering を正式名称にし、Spec道 を愛称、SpecDojo を道場とする | SDD との範囲の違いを名前で示せる。「磨き続ける」と CI/CD の連想が合う | 略称の CSE が既存の略称とぶつかる。「Specification」だけでは範囲が狭く聞こえるため、定義の文で補う必要がある |
| C      | 正式名称に SDD を使い、その上流と位置付ける                                               | 既に知られている言葉に乗れる                                          | 判断の記録・型・評定・運用中の維持が範囲の外に見える                                                         |

## 4. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 5. 採択理由

- _TODO_: 判断根拠を記載する。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | README、概要ガイド（`specdojo-overview-guide`）、specdojo-lp                                                   |
| 必要な対応 | 定義の文と、近い概念（SDD・Docs as Code・Continuous RE）との関係の表を正本の文書にまとめる。略称の扱いを決める |
| 追跡先     | 決定の後に todo として起票する                                                                                 |

## 8. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
