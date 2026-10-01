---
specdojo:
  id: prj-0001:pjr-h9r2-resume-sync-uncommitted-overlap
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-01T20:01:26Z"
---

# PJR-H9R2 再開前の統合先の取り込みが worktree の未 commit の変更と重なると再開できない

## 1. 課題内容

PJR-GENJ の再開前の取り込みは、executor が worktree に残した未 commit の変更と統合先の変更が同じファイルに及ぶと、git merge が上書きを拒み再開できない。executor の成果を退避または commit してから取り込み、衝突は現行どおり理由を示して止める

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
