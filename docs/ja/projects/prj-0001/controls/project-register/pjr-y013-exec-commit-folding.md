---
specdojo:
  id: prj-0001:pjr-y013-exec-commit-folding
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-09-20T04:55:16Z"
  due_on: "2026-09-30"
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

| No  | 作業                                                                                               | 担当 | 状態 | メモ                                                             |
| --- | -------------------------------------------------------------------------------------------------- | ---- | ---- | ---------------------------------------------------------------- |
| 1   | register worktree 実行の `start` / `review` 遷移 commit を merge commit / `wait` commit へ同梱する | DEV  | done | checkpoint を exec branch に置き、review も worktree 側で記録    |
| 2   | Schedule タスクの worktree 統合を同じ規則にし、merge commit のメッセージを整える                   | DEV  | done | `exec(<task-id>): <task name>` を subject にした merge 1件       |
| 3   | `exec resume` の各経路（reporter 再開、統合再開）を同じ規則に揃える                                | DEV  | done | 再開時の `start` も exec branch 側。wait 後は develop を取り込む |
| 4   | 統合テストを更新し、guide 3 本を改める                                                             | DEV  | done | 成功・失敗・再開の first-parent 件数と merge 本文を検証          |
| 5   | 実運用で 1 件実行し、`git log --first-parent` を確認する                                           | ARC  | open | オーケストレーターが直接対応                                     |

## 4. 対応結果

- `checkpointAndEnsureWorktree` は統合先 HEAD から exec branch と worktree を作り、plan / result / claim event（register は個票・イベントも）を worktree へ複製して exec branch にだけ checkpoint commit する。root 側の複製は未 commit のまま残し、claim（`doing`）や `in-progress` が root からも見える状態を保つ。
- `mergeWorktreeIntoCurrent` に `releaseRootPaths` を追加し、統合の直前に root 側の複製を HEAD の状態へ戻してから `--no-ff` で merge する。merge が失敗した場合は複製を元に戻す。`exec worktree merge` も同じ解放を行う。
- root 側の複製解放は途中で失敗しても解放済みファイルを復元する。`--dry-run` は実ファイルを解放せず、解放予定パスだけを重複判定から除外して merge 可否を確認する。
- register 成功時は worktree で `register review` を記録して exec branch に commit し、`exec(register <PJR-ID>): <title>` を subject、`Transition: start → review` / `Executor` / `Reporter` / `Refs` を本文とする merge commit 1件で統合する。root の派生ビューは merge 後に `register build` で作り直す。
- register 失敗時は worktree の個票・イベント・plan・result を root へ写して `register wait` し、`exec(register <PJR-ID>): wait` commit 1件にまとめる（`start` の遷移事象を含む）。同じ内容を exec branch にも commit したうえで統合ブランチを exec branch へ取り込み、再開後の merge が記帳ファイルで三方向差分にならないようにする。再開時の `start` は worktree 側で記録し、root には未 commit の複製だけを置く。
- merge 成功後に worktree 撤去だけが失敗した場合は root の `review` と merge commit を維持し、統合再開では状態遷移・commit・merge を再実行せず cleanup だけを行う。これにより撤去失敗からの再開でも first-parent の commit は増えない。
- Schedule 成功時の merge commit subject を `exec(<task-id>): <task name>` にした（commitlint の 100 文字上限で切り詰める）。`prepare execution` / `apply task changes` は exec branch 側に残る。
- 統合テスト（`exec-pipeline-e2e` / `exec-register-pipeline-e2e` / `exec-worktree-command` / `exec-worktree-ops`）で first-parent の増分、merge commit の親数・件名・遷移本文、失敗時の `wait` 1件を検証する形に更新し、`branch-workflow-guide` / `exec-worktree-guide` / `register-operation-guide` に加えて `schedule-operation-guide` の実行フローも改めた。
- 残課題は No. 5 の実運用確認のみであり、本変更の統合後に runner / オーケストレーターが `git log --first-parent` で確認する。

## 5. 関連ドキュメント

- [[specdojo:branch-workflow-guide]]
- [[specdojo:exec-worktree-guide]]
- [[specdojo:register-operation-guide]]
- [[specdojo:schedule-operation-guide]]
- [[prj-0001:pjr-j3g0-exec-resume-integrate-schedule-task]]
- `src/exec-run.ts`
- `src/exec-worktree-ops.ts`
- `src/exec-worktree-command.ts`
