---
specdojo:
  id: prj-0001:pjr-ry4c-register-commit-git-status-buffer
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-13T21:18:07Z"
  due_on: null
---

# PJR-RY4C 未追跡のファイルが多いと register の --commit が git status failed で止まる

## 1. 課題内容

gitResult の spawnSync が maxBuffer を指定しないため、git status --porcelain の出力が既定の上限（1 MB）を超えると失敗し、原因を示さない git status failed になる。2026-10-14 に未追跡のファイル 8,575 個で register close --commit が止まった

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
