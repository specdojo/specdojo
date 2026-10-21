---
specdojo:
  id: prj-0001:pjr-cnnt-plan-stem-random-collision
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-21T22:09:05Z"
  derived_from:
    - PJR-T30J
---

# PJR-CNNT plan の名前の末尾の乱数が短く、同じ秒に作ると名前がぶつかることがある

## 1. 課題内容

plan と in-place の stem、イベントの名前の末尾の乱数が 2 バイト（16 進 4 桁）しかなく、同じ slug で同じ秒に 2 回作ると 6 万 5 千分の 1 の確率でぶつかる。PJR-T30J の検証で単体テストが 1 回落ちた

## 2. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 3. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
