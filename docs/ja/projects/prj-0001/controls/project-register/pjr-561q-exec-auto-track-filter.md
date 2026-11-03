---
specdojo:
  id: prj-0001:pjr-561q-exec-auto-track-filter
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
  registered_at: "2026-11-03T05:23:03Z"
  due_on: "2026-11-07"
  derived_from:
    - PJR-GQN3
  commit_type: feat
  commit_scope: exec
---

# PJR-561Q exec run --auto で選ぶタスクを track で絞れない

## 1. 課題内容

exec run --auto は対象のタスクが失敗すると、ほかの track の ready のタスクへ進む。--track で選ぶタスクを 1 つの track に限れるようにする

## 2. 入力

- 2026-11-03 に track data-flow-uc-rewrite の 3 タスクを exec run --auto --parallel 3 で流したところ、3 タスクとも checkpoint の commit が markdownlint の MD032 で拒否されて始まる前に失敗した（原因は phase の説明で箇条書きの前に空行がなかったこと、72749b20e で修正済み）
- その後 --auto が launch の track の review タスク 3 件（T-LAUNCH-pm-communication-plan-105・pm-members-105・pm-organization-105）を claim し、worktree を作って agent を動かし始めた。オーケストレーターが止めて claim を release した（628f502e3）。execution: human のタスク 8 件は自動で飛ばされた
- 利用者は、この不具合を直してから 3 タスクを並列で流すと判断した。直し方の案は exec run --auto に --track `<track>` を足し、選ぶタスクをその track に限る形（2026-11-03）

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
