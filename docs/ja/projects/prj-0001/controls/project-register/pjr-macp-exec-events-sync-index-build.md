---
specdojo:
  id: prj-0001:pjr-macp-exec-events-sync-index-build
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-11-28T08:47:36Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-QCJ5
---

# PJR-MACP exec のイベントの同期ブランチで、人の記帳の commit が index-build の hook で止まる

## 1. 課題内容

人が exec reopen などを記帳すると、同期用の worktree に登録簿の一覧（git 管理外の pjr-index.md）がなく、pre-commit の index-build で commit が止まる。記帳は手元に残り、手で register build してから commit と branch-push をやり直す必要がある

## 2. 入力

- 2026-11-28 に indie が exec reopen --task T-KATA-REVIEW-CALIBRATION-opr-sample-150 を流したところ git commit failed で止まった。hook の index-build が「Generated project register index is missing or invalid: .../generated/pjr-index.md。Run: specdojo register build」で失敗していた
- 回避: 同期用の worktree（.git/specdojo/sync/exec-events/…/worktree）で register build を流してから commit し、register branch-push --sync exec-events で push した（5767e550de）
- 直し方の案: 同期用の worktree で commit する前に runner が一覧を作る、または同期のブランチではこの hook を飛ばす。どちらにするかは executor が決めて理由を記録する
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
