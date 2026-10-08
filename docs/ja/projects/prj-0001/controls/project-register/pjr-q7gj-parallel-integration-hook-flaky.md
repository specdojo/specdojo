---
specdojo:
  id: prj-0001:pjr-q7gj-parallel-integration-hook-flaky
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-08T12:32:32Z"
  due_on: null
---

# PJR-Q7GJ 並列実行で統合の commit のフックのテストが一時的に失敗する

## 1. 課題内容

exec run --parallel で 3 件を並べて流したとき、PJR-PG6W の統合段の commit で lefthook の pre-commit が実行する全テストが失敗した。同じ worktree で全テストを実行し直すと 2039 件すべて通り、--resume で統合できた。並列の親検証・統合とフックのテストが重なり、資源の競合で一時的に失敗したとみられる。原因の特定か、統合の commit でのフックの扱いの見直しが要る。

2026-10-08 の PJR-6QDA の統合でも同じ失敗が起きた。このときは並列ではなく単独の実行だった。同じ worktree で全テストを実行し直すと 2084 件すべて通り、`--resume` で統合できた。並列実行に限った問題ではない。

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
