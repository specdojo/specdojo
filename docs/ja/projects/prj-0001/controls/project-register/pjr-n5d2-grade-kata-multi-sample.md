---
specdojo:
  id: prj-0001:pjr-n5d2-grade-kata-multi-sample
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-11-21T03:11:12Z"
  derived_from:
    - PJR-SW7T
---

# PJR-N5D2 grade run --kata が、rulebook に複数並べた sample の一部しか選ばない

## 1. 課題内容

rulebook の frontmatter の sample に複数の sample を並べた型（opd・opr）で、--kata が `<name>-sample` だけを選び、ほかの sample を評価の対象から外す

## 2. 入力

- 2026-11-21、grade run --target kata --kata opd --kata opr --dry-run で、選ばれた sample は opd-sample と opr-sample だけだった。opd-rulebook は sample を 4 件（うち opd-index-sample を除く 3 件が漏れた）、opr-rulebook は 8 件（opr-sample 以外の 7 件が漏れた）並べている
- --kata と --path は一緒に使えないため、漏れた 10 件は別の grade run で --path を並べて評価した（run id regrade-kata-op-samples-2026-11-21）
- PJR-SW7T の対応結果では、型名の解決は docs/ja/specdojo/samples/`<name>-sample``.*`（または rulebook の frontmatter で指定された sample）を対象とすると書かれている

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
