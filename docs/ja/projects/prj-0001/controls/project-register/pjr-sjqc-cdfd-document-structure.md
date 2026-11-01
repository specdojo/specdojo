---
specdojo:
  id: prj-0001:pjr-sjqc-cdfd-document-structure
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: PO
  registered_at: "2026-11-01T09:52:37Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-T1D1
    - PJR-RVTB
---

# PJR-SJQC 概念データフローの文書体系を overview と系統別の詳細 3 文書にする

## 1. 背景

CDFD を、共通・基盤と register・schedule・routine の関係を描く cdfd-overview と、系統ごとの詳細 3 文書（ユースケース別 CDFD）に分ける。プロセスグループ別 6 文書は非推奨にする。図は縦向き、入口のイベントを描き、配色は G 案とする

## 2. 入力

- 全体概要を使い方の流れ（register 系・schedule 系・routine 系・共通）で分けた（PJR-RXVC）後、詳細の CDFD 8 文書はプロセスグループ別のままで軸が合っていない（2026-11-01）
- 利用者は、cdfd-overview で共通・基盤と register・schedule・routine の関係を描き、register と schedule が epic と track でつながる全体関係も overview で示し、3 系統は詳細の文書で描く分け方を提案した（2026-11-01）
- PJR-RVTB の試行で、縦向き（direction: down）と系統ごとの入口のイベントを cdfd-overview で確かめた。配色は、トランザクションデータを中間の緑（#c8e6c9 / #2e7d32）、マスタ・構成データを薄い緑（#e8f5e9 / #43a047）、物理保管をトランザクションデータと同じ色にした G 案を利用者が確かめた（2026-11-01）

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
