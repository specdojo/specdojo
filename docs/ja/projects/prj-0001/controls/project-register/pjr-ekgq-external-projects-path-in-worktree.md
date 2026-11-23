---
specdojo:
  id: prj-0001:pjr-ekgq-external-projects-path-in-worktree
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-11-23T01:37:52Z"
  due_on: null
  commit_type: fix
---

# PJR-EKGQ external_projects の path が worktree から解決され、exec run の worktree の準備が止まる

## 1. 課題内容

利用側の設定に external_projects を宣言すると、exec run --worktree の準備の specdojo build が、worktree から解決した path が存在しないとして設定の検証で止まり、すべての項目が waiting になる。ローカル設定では external_projects を上書きできず、宣言を外すしかない

## 2. 入力

<!-- 対話で得た前提・制約・委任範囲を記録する。完了・回答の判定条件とは分ける。 -->

-

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
