---
specdojo:
  id: prj-0001:pjr-dxdc-job-manual-run-id-mismatch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-12T09:14:26Z"
---

# PJR-DXDC --scheduled-at なしの exec run --job で worktree と実行の Run ID が食い違う

## 1. 課題内容

task.review を宣言した Job を --scheduled-at なしで手動実行すると、worktree の作成時と worktree 内の子プロセスの実行時に別々に現在時刻を実行枠に使うため Run ID が食い違い、Job Run record was not created in worktree で失敗する

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
