---
specdojo:
  id: prj-0001:pjr-c95g-catalog-empty-groups-build
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-23T23:43:14Z"
  derived_from:
    - PJR-EKRW
---

# PJR-C95G init の小さいカタログの空の groups で catalog build が止まり worktree の実行ができない

## 1. 課題内容

init --catalog small が作るカタログのうち 15 個が成果物のない groups: [] になり、catalog build が空の groups をエラーにするため specdojo build が失敗する。worktree の準備が止まり、カタログを作ったリポジトリで exec run --register --worktree が実行できない。0.4.0 から公開中の 0.4.3 まで同じ

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
