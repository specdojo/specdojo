---
specdojo:
  id: prj-0001:pjr-08ek-opencode-extra-roots
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-18T12:17:01Z"
  due_on: "2026-11-30"
---

# PJR-08EK exec で opencode の executor がプロダクトリポジトリの worktree を編集できない

## 1. 課題内容

exec の opencode 起動にだけプロダクトの worktree の許可が渡らず、external_directory の deny で編集がすべて拒まれる

## 2. 入力

- repos を宣言した project で、プロダクトのファイルの変更を求める項目を opencode-executor で exec run --register --worktree に流すと、プロダクトの worktree への Edit がすべて permission `external_directory` の deny で拒まれた
- 環境: specdojo 0.7.0、opencode 1.19.5、Linux（devcontainer）
- 起票案は利用者が作成した tmp/specdojo-issue-1-opencode-extra-roots.md

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
