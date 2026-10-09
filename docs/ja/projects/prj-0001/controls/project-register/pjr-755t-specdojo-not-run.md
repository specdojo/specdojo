---
specdojo:
  id: prj-0001:pjr-755t-specdojo-not-run
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-09T03:54:26Z"
---

# PJR-755T 適用外の検査の判定が specdojo のサブコマンドを誤って反証し、not_run の記録も救えない

## 1. 課題内容

公開物の試用（2026-10-09）で、codex は catalog_path のない project の npx specdojo catalog validate を理由付きの not_applicable と記録したが、specdojo が依存にあるため A0NE の反証が block した。claude（sonnet）は未導入の prettier と catalog validate を not_run と記録して止まった。specdojo のサブコマンドは設定で適用条件を判定し、機械的に適用外と分かる not_run は runner が適用外として扱う方式を検討する。

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
