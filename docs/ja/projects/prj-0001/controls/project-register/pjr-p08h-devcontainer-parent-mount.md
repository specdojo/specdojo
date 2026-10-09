---
specdojo:
  id: prj-0001:pjr-p08h-devcontainer-parent-mount
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-10-09T19:58:02Z"
  due_on: "2026-10-31"
---

# PJR-P08H devcontainer scaffold が親ディレクトリをマウントせずプロダクトリポジトリが見えない

## 1. 課題内容

templates/devcontainer/devcontainer.json に workspaceMount が無く、生成したコンテナからは app1-specdojo/ しか見えない。../app1 と ../app1-specdojo-worktrees を使えるよう、親ディレクトリをマウントする。

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
