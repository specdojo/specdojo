---
specdojo:
  id: prj-0001:pjr-2m84-integrate-merge-abort
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-09-21T11:31:17Z"
  due_on: "2026-10-05"
---

# PJR-2M84 統合の merge commit 失敗時に merge を中断して develop を merge 途中のまま残さない

## 1. 概要

worktree 統合（`finalizeRegisterWorktreeRun` および Schedule タスクの統合段）は、exec ブランチを `git merge --no-ff` で develop へ取り込む。merge commit の作成が pre-commit hook で失敗すると、runner は merge を中断せずに失敗処理へ進む。develop は「conflict なし・merge 途中（`MERGE_HEAD` あり）」の状態で残り、続く `wait` 遷移の commit が `fatal: cannot do a partial commit during a merge` で失敗する。結果として develop は merge 途中のまま、register も `waiting` になり、人が `git commit` で merge を完了するしかない（PJR-YWPH、2026-09-21）。

hook で落ちた実際の原因（typecheck か lint か）は block reason に hook の装飾付き出力の先頭しか残らず、切り分けにも時間がかかった。

### 1.1. 決定事項

- merge commit が失敗した場合、runner は `git merge --abort` で develop を merge 前の状態に戻し、worktree と exec ブランチを保持したまま `waiting` へ遷移する。`wait` commit は merge 前の状態で行う。
- block reason には hook の装飾（罫線・色）を除いた失敗ステップ名と最初のエラー行を残し、全文は evidence（`integrate.log` 等）へ書く。
- `exec resume` の統合再開（PJR-J3G0）で同じ merge をやり直せることを統合テストで保証する。
- `--abort` 自体が失敗した場合（極端な状態）は、その旨を stderr に出して手順（`git merge --abort` の手動実行）を案内する。

## 2. 完了条件

- merge commit を hook で失敗させる統合テストで、develop に `MERGE_HEAD` が残らず、`wait` commit が成功し、worktree と exec ブランチが保持されている。
- block reason に失敗ステップ名と最初のエラー行が含まれ、装飾が含まれていない。
- 統合再開で同じタスクの merge をやり直して成功する統合テストがある。
- `exec-worktree-guide` の失敗時の復旧手順が更新されている。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                                                                           | 担当 | 状態 | メモ                                              |
| --- | -------------------------------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------- |
| 1   | merge commit 失敗時の `git merge --abort` と block reason の整形を `exec-worktree-ops` / `exec-run` に実装する | DEV  | open | codex-expert-executor / gemma-reporter / worktree |
| 2   | hook で merge commit を落とす統合テストと、統合再開のやり直しテストを追加する                                  | DEV  | open | 作業 1 と同一タスク                               |
| 3   | `exec-worktree-guide` の復旧手順を更新する                                                                     | DEV  | open | 同上                                              |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:exec-worktree-guide]]
- [[prj-0001:pjr-j3g0-exec-resume-integrate-schedule-task]]
- [[prj-0001:pjr-y013-exec-commit-folding]]
- [[prj-0001:pjr-ywph-register-plan-grade-findings]]
- `src/exec-worktree-ops.ts`
- `src/exec-run.ts`
