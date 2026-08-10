---
specdojo:
  id: prj-0001:pjr-h95r-exec-complete-worktree-merge
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-08-10T01:52:33Z"
  due_on: "2026-08-31"
---

# PJR-H95R exec complete失敗時にworktree merge/削除が巻き戻されず状態不整合になる

## 1. 課題内容

resume等でclaiming actorと異なるactorとして完了させると、spawnComplete(exec complete)がactor不一致で失敗してもcommitWorktreeChanges/mergeWorktreeIntoCurrent/removeWorktreeは既に完了しており、schedule状態はdoingのまま成果物だけmerge済みという不整合が生じる。complete失敗時の巻き戻し、またはmerge前のactor一致検証を検討する。

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
