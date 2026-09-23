---
specdojo:
  id: prj-0001:pjr-88k2-grade-apply-trailing-blank
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-09-05T22:34:28Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-08T12:37:12Z"
---

# PJR-88K2 grade apply が本文末尾に余分な空行を残す

## 1. 概要

`grade apply` が評価結果を書き込むとき、本文末尾に余分な空行が残る。`lint:md` が
`MD012/no-multiple-blanks` で失敗する。

```text
docs/ja/specdojo/samples/otp-sample.md:102 error MD012/no-multiple-blanks
  Multiple consecutive blank lines [Expected: 1; Actual: 2]
```

違反行はいずれも全行数 +1 の位置にあり、文書末尾で発生している。finding コメントの挿入位置
とは無関係で、[[prj-0001:pjr-g1qz-grade-finding-comment-lint]] で対処した問題とは別である。

## 2. 発生状況

sample の走査で観測した。

| 時点            | 走査済み | 違反 |
| --------------- | -------- | ---- |
| 26 件 commit 時 | 26       | 1    |
| 82 件 commit 時 | 82       | 4    |

発生率は 5% 前後で推移する。走査を続けるかぎり一定の割合で発生し、そのつど orchestrator が
手作業で除去している。

`lint:md` は pre-commit hook に含まれるため、放置すると評価結果を commit できない。評価の実施
そのものが commit を妨げる状態になる。

## 3. 完了条件

- `grade apply` の書き込み後、本文末尾の改行が1つになる。
- 評価前から末尾に余分な空行がある文書でも、書き込み後は1つに正規化される。
- finding コメントの挿入位置や既存の本文には影響しない。
- 走査済みの文書へ再適用しても差分が生じない（冪等である）。
- 回帰テストで末尾の改行数を検証する。

## 4. 検討事項

- 末尾の正規化を `grade apply` の責務とするか、`prettier` などの整形へ委ねるかを決める。
  hook の `format` は staged file を整形するが、走査は commit を挟まず連続で書き込むため、
  途中の状態が lint に引っかかる。
- 原因が frontmatter の書き戻しにあるのか、finding の挿入処理にあるのかを切り分ける。違反行が
  常に末尾であることから、本文の再構成時に改行を付加している可能性が高い。

## 5. 作業内容

| No  | 作業                           | 担当 | 状態 | メモ                                         |
| --- | ------------------------------ | ---- | ---- | -------------------------------------------- |
| 1   | 余分な改行が入る箇所を特定する | ARC  | done | finding 挿入後の本文再構成で終端空行を温存   |
| 2   | 末尾を1改行へ正規化する        | ARC  | done | `grade apply` の書き込み責務として正規化     |
| 3   | 回帰テストを追加する           | ARC  | done | 末尾改行数、本文保持、再適用の冪等性を検証   |
| 4   | 走査済み文書の違反を解消する   | ARC  | done | 既発生分は orchestrator が対処済み、追加なし |

## 6. 対応結果

`insertFindings` が本文を再構成する際、連続改行を最大2個までにしか畳まず、入力由来の終端空行を
残していたことが原因だった。`grade apply` は文書ごとの書き込み間に Prettier を実行しないため、
整形処理へ委ねず、再構成した本文の末尾にある空行を1改行へ正規化するよう変更した。

回帰テストでは、評価前から末尾に余分な空行がある文書を対象に、書き込み後の終端が厳密に
1改行であること、既存本文を保持すること、同じ評価を再適用しても差分がないことを確認する。
既発生分は orchestrator が対処済みであり、既存文書への追加修正や残課題はない。

## 7. 関連ドキュメント

- [[prj-0001:pjr-g1qz-grade-finding-comment-lint]]: finding の挿入位置に関する別の問題。
- [[prj-0001:pjr-excv-grade-per-document-pipeline]]: 問題が観測された走査経路。
