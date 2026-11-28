---
specdojo:
  id: prj-0001:pjr-ag0c-guarded-push-new-branch-count
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-11-28T08:48:25Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-GDMB
---

# PJR-AG0C guarded-push の dry-run が、新しいブランチの commit の件数に全部の履歴を数える

## 1. 課題内容

remote にないブランチを guarded-push --dry-run で示すと、送る範囲を (new branch) とし、Commits に全履歴の件数（17597）を出す。remote にまだない commit だけを数えて示すように直す

## 2. 入力

- 2026-11-28 に feature/prj-0001/guarded-push-permissions で npx specdojo guarded-push --project prj-0001 --branch feature/prj-0001/guarded-push-permissions --dry-run を流すと Range: (new branch) 1b159b605f…、Commits: 17597 と出た
- push の動き自体には影響しないが、承認の前に示す範囲と件数が分かりにくく、利用者が送る中身を判断できない
- 担当 DEV・期限 2026-11-30 は indie の指示（2026-11-28）

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
