---
specdojo:
  id: prj-0001:pjr-vnt1-business-spec-opening-structure
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  registered_at: "2026-11-05T13:01:37Z"
  derived_from:
    - PJR-3APD
---

# PJR-VNT1 業務仕様の冒頭は頭書きと目的・適用範囲の章にそろえる

## 1. 背景

業務仕様の文書の冒頭を、H1 直下の 1〜2 行の頭書きと「目的」「適用範囲」の章に分ける形にそろえる。stsd は 3APD の中で直し、ほかの種類は各 epic の Kata の手入れで適用する

## 2. 入力

- 利用者の指摘: stsd の「概要」は記述が多すぎる。H1 の下に 2 行程度の頭書きを置き、目的・適用範囲に分けたほうが分かりやすい。cdfd はそうなっている（2026-11-05）
- 現状: cdfd（全体概要・プロセス領域別・ユースケース別）は頭書き + 目的 + 適用範囲（PJR-PRYZ）。stsd・bps・opr・br・cdsd・cld は「概要」の章にまとめて書く。framework の standard は「目的・適用範囲」
- 利用者は案 A（stsd を試行の中で直し、ほかは各 epic の Kata の手入れで適用する）を選んだ（2026-11-05）

## 3. 検討した選択肢

| 選択肢 | 内容   | 利点   | 懸念   |
| ------ | ------ | ------ | ------ |
| A      | _TODO_ | _TODO_ | _TODO_ |

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

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 8. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
