---
specdojo:
  id: prj-0001:pjr-csrm-validation-lag-other-sync-work
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-11-25T21:59:34Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-P8SX
---

# PJR-CSRM 親の検証の終わりに気づくまでの遅れが、統合の commit 以外の同期の処理で残る

## 1. 課題内容

P8SX で統合の commit を非同期にした後も、親の検証の終わりに気づくまでの遅れが平均約 30 秒、最大約 140 秒残る。npm ci・specdojo build・root への merge など、event loop を止める別の同期の処理を特定して除く。

## 2. 入力

- 2026-11-25 22:30〜2026-11-26 06:00 の全件レビュー（--parallel 4 と 3）で、validation-exit-timing は 246 件。`duration_ms` は平均 33.2 秒・最大 142.1 秒、`detection_lag_ms` は平均 29.8 秒・最大 139.9 秒、`event_loop_delay_max_ms` は平均 31.8 秒・最大 139.8 秒。
- P8SX の個票では、npm ci・specdojo build・root への merge を、計測で目立たないため同期のまま残したと記録している。

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
