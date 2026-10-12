---
specdojo:
  id: prj-0001:pjr-xy4c-devcontainer-codex-system-bwrap
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-12T12:52:35Z"
---

# PJR-XY4C devcontainer scaffold の codex でシステムの bubblewrap が sandbox を失敗させる

## 1. 課題内容

scaffold が使う typescript-node:22 のイメージに /usr/bin/bwrap があり、codex が同梱の bwrap ではなくそれを使うため codex sandbox が /proc のマウントで失敗する（PJR-27Z9 と同じ事象）。codex の provider を選んだ場合はシステムの bubblewrap を外し、同梱の bwrap を使わせる

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
