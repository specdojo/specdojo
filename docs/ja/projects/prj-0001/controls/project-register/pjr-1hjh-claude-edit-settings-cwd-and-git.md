---
specdojo:
  id: prj-0001:pjr-1hjh-claude-edit-settings-cwd-and-git
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-11-23T00:35:38Z"
  due_on: null
---

# PJR-1HJH Claude の edit executor の既定の設定に、作業場所を保つ設定と git の読み取り・rm・mv の許可がない

## 1. 課題内容

cd でプロダクトの worktree に移ると相対パスの Edit の規則がずれて個票を書けず、git status・diff・log・show・grep・rm・mv も承認待ちで拒まれる。配布の settings.edit.json に CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR と git の許可を足すかを決める

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
