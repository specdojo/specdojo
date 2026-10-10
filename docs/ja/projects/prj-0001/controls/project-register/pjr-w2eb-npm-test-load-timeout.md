---
specdojo:
  id: prj-0001:pjr-w2eb-npm-test-load-timeout
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-10T22:39:00Z"
---

# PJR-W2EB npm test の一括実行で負荷によりテストがタイムアウトする

## 1. 課題内容

npm test（vitest run）は単体と統合をまとめて既定の並列数で流すため、毎回別のテストが 1〜2 件タイムアウトで失敗する（10/11 に 2 回、exec-pipeline-e2e・exec-worktree-ops・doc-index）。test:unit と test:integration を分けて流すと全件通過する。npm run check が公開判定の基準 2 を満たせない。

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
