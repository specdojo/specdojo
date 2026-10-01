---
specdojo:
  id: prj-0001:pjr-k1zd-opencode-plugin-bootstrap-protected-false-positive
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-01T15:29:49Z"
---

# PJR-K1ZD opencode が生成するプラグインの導入ファイルを保護設定の検査が検出する

## 1. 課題内容

opencode の reporter が worktree の .opencode/ にプラグインを自動導入し、package.json・package-lock.json・node_modules とそれらを ignore する .gitignore を生成する。保護設定の検査がこれらを agent による変更として検出し、exec run が止まる。git が ignore する opencode の導入ファイルだけを安全なものとして除外する

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
