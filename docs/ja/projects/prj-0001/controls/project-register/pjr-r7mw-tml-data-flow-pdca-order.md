---
specdojo:
  id: prj-0001:pjr-r7mw-tml-data-flow-pdca-order
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: easy
  registered_at: "2026-10-28T00:45:33Z"
  derived_from:
    - PJR-WAGY
---

# PJR-R7MW tml-index の data-flow-pdca の order が依存先と同じで timeline build が止まる

## 1. 課題内容

data-flow-pdca が depends_on の data-flow と同じ order 3 を持ち、timeline build が order の矛盾で停止する。3ae6b0596（2026-09-15）で track を切り出したときからの不整合

## 2. 影響範囲

| 観点         | 影響                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------- |
| スコープ     | `timeline build` と、それを使う `catalog_status` の導出・strategy 生成                         |
| スケジュール | 着手の wave の計算だけ。既存の Schedule のタスクは変わらない                                   |
| コスト       | なし                                                                                           |
| 品質         | `timeline build` が止まり、prj-0001 で PJR-WAGY の `catalog_status` の導出を確かめられなかった |

## 3. 対応方針

| 項目     | 内容                                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------------- |
| 原因     | 3ae6b0596（2026-09-15）で data-flow-pdca を切り出したとき、依存先の data-flow と同じ order 3 を付けた |
| 対応策   | 利用者の判断で、data-flow-pdca の order を 4 にする                                                   |
| 依存事項 | なし                                                                                                  |
| 完了条件 | `timeline build --project prj-0001` がエラーなく通る                                                  |

## 4. 対応結果

- `tml-index.yaml` の data-flow-pdca の order を 3 から 4 にした（881e270cc、develop へのマージは eec39bb1a）。data-flow-pdca は impact-analysis と同じ wave 4 になった。
- `timeline build --project prj-0001` が警告なしで通り、`track_catalog_status` も出力された（data-flow・data-flow-pdca は `primary`）。
- 再発防止は既存の検証で足りる。order の矛盾は `timeline build` がエラーで検出する。

## 5. 関連ドキュメント

- [[specdojo:timeline-design-guide]]
