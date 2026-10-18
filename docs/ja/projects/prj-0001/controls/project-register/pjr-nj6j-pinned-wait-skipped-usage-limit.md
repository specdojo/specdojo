---
specdojo:
  id: prj-0001:pjr-nj6j-pinned-wait-skipped-usage-limit
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-18T10:24:49Z"
  derived_from:
    - PJR-BHMH
---

# PJR-NJ6J --on-rate-limit wait が codex の usage limit で待たずに止まる

## 1. 課題内容

2026-10-18 19:04 に PJR-8TGQ を --on-rate-limit wait と codex-expert-executor で流したところ、codex が「try again at 11:17 PM」の usage limit を返し、runner は Pinned-agent wait skipped: resume time is invalid or exceeds 28800s を出して待たずに waiting で止まった。解除までは約 4 時間で、待てる上限（28,800 秒）より短い。src/exec/limit.ts の解除時刻の読み取りはこの形に対応しているように見えるため、どこで解除時刻が失われるかを調べて直す

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
