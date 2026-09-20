---
specdojo:
  id: prj-0001:pjr-y013-exec-commit-folding
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: ARC
  registered_at: "2026-09-20T04:55:16Z"
  due_on: "2026-09-30"
  block_reason: rate limit reached
---

# PJR-Y013 exec の記帳 commit を merge commit に畳み develop の本線を 1 タスク 1 commit にする

## 1. 概要

2026-09-13 以降の develop の 253 commit のうち、exec の記帳が 182 件（72%）を占める。register 1 件の worktree 実行で、develop の第一親線に次の 5〜6 commit が並ぶ。

| commit                                                                                             | 件数（9/13〜9/20） |
| -------------------------------------------------------------------------------------------------- | ------------------ |
| `exec(register PJR-XXXX): start` / `wait` / `review`                                               | 43                 |
| `exec(register PJR-XXXX): <title>`（apply）、`exec(T-…): prepare execution` / `apply task changes` | 137                |
| `Merge branch 'exec/…'`                                                                            | 45                 |
| 実質的な変更（feat / fix / docs / build）                                                          | 70                 |

`git log --first-parent` で本線を追っても実質的な変更が埋もれるため、記帳を merge commit に畳む（案 A）。記帳を別ブランチへ分離する案 B は、成果物と実行記録が同じ commit にある対応関係を壊し、`exec validate` / grade / dashboard が 2 ブランチを読む設計変更になるため採らない。

### 1.1. 決定事項

- worktree 実行（register / Schedule タスクとも）では、`prepare execution` と `apply task changes` は exec ブランチにだけ置き、develop には `--no-ff` の merge commit を 1 つ作る。squash / rebase は使わない（`branch-workflow-guide` の方針を維持）。
- register の `start` 遷移は独立した commit にせず、成功時は merge commit に、失敗時は `exec(register PJR-XXXX): wait` commit に同梱する。`review` 遷移も merge commit に同梱する。
- merge commit のメッセージは `exec(register PJR-XXXX): <title>` を subject とし、本文に遷移（`start → review`）、executor / reporter、`Refs: PJR-XXXX` を書く。Schedule タスクは `exec(T-…): <task name>` を subject にする。
- 失敗時は現行どおり worktree を保持し、develop には `wait` commit 1 つ（遷移事象と plan / result を含む）を作る。再開後の成功は merge commit 1 つになる。
- in-place 実行（`--register-commit`）は現行どおり 1 commit。
- 既存の履歴は書き換えない。

## 2. 完了条件

- register の worktree 実行が成功したとき、develop の第一親線に増える commit が merge commit 1 つだけで、その commit に `start` / `review` の遷移事象、plan / result、成果物の変更が含まれている。
- 失敗したとき、develop の第一親線に増える commit が `wait` commit 1 つだけで、`start` の遷移事象を含む。
- Schedule タスクの worktree 実行も同様に merge commit 1 つになり、`prepare` / `apply` は exec ブランチ側に残る。
- `exec resume`（reporter 再開、統合再開）でも同じ規則で commit される。
- 統合テストで、成功・失敗・再開の各経路で develop の第一親線の commit 数とメッセージが検証されている。
- `branch-workflow-guide` の「register 遷移 commit だけを除外しない」を「遷移は merge commit に同梱する」に改め、`exec-worktree-guide` / `register-operation-guide` の commit 説明が更新されている。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                                                               | 担当 | 状態 | メモ                                              |
| --- | -------------------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------- |
| 1   | register worktree 実行の `start` / `review` 遷移 commit を merge commit / `wait` commit へ同梱する | DEV  | open | codex-expert-executor / gemma-reporter / worktree |
| 2   | Schedule タスクの worktree 統合を同じ規則にし、merge commit のメッセージを整える                   | DEV  | open | 作業 1 と同一タスク                               |
| 3   | `exec resume` の各経路（reporter 再開、統合再開）を同じ規則に揃える                                | DEV  | open | 同上                                              |
| 4   | 統合テストを更新し、guide 3 本を改める                                                             | DEV  | open | 同上                                              |
| 5   | 実運用で 1 件実行し、`git log --first-parent` を確認する                                           | ARC  | open | オーケストレーターが直接対応                      |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:branch-workflow-guide]]
- [[specdojo:exec-worktree-guide]]
- [[specdojo:register-operation-guide]]
- [[prj-0001:pjr-j3g0-exec-resume-integrate-schedule-task]]
- `src/exec-run.ts`
- `src/exec-register.ts`
- `src/exec-worktree-ops.ts`
