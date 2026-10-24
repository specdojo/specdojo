---
specdojo:
  id: prj-0001:pjr-zh10-orch-work-scripts-deps
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: easy
  owner: DEV
  registered_at: "2026-10-24T00:06:22Z"
  derived_from:
    - PJR-SAZC
---

# PJR-ZH10 orch の work の script が worktree の依存のなさで起動できない

## 1. 課題内容

PJR-SAZC で orch の work の script を worktree の中で手元のソースから orchestrator launch を起動する形にしたが、固定の worktree には node_modules がなく、commander が見つからずに落ちる。本体のソースを指して起動するよう直す

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
