---
specdojo:
  id: prj-0001:pjr-cy80-checkpoint-inspect-failure-no-detail
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-17T11:14:31Z"
  due_on: null
---

# PJR-CY80 checkpoint の確認の git の失敗が原因を残さない

## 1. 課題内容

src/exec/worktree-ops-lifecycle.ts は checkpoint の前に git diff --cached --quiet で変更を確かめ、終了コードが 0 と 1 以外なら Failed to inspect execution checkpoint changes. とだけ出す。git の終了コードと stderr を記録しないため、2026-10-17 の PJR-GBWW で止まった原因を特定できなかった

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
