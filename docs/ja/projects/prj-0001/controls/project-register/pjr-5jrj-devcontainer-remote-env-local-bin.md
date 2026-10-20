---
specdojo:
  id: prj-0001:pjr-5jrj-devcontainer-remote-env-local-bin
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-20T11:22:39Z"
  derived_from:
    - PJR-GHBP
---

# PJR-5JRJ devcontainer で後から開く端末に ~/.local/bin が PATH に入らない

## 1. 課題内容

GHBP で post-create.sh の中では ~/.local/bin を PATH に足したが、devcontainer.json に remoteEnv がないため、container の作成の後に開く端末や VS Code の terminal では ~/.local/bin が PATH に入らず、そこに入った Claude Code などの CLI が見つからない（2026-10-20、v0.4.0 の環境の直し方を確かめる中で見つかった）

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
