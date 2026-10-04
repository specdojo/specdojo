---
specdojo:
  id: prj-0001:pjr-ghkd-resume-sync-git-diff-outside-repo
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T11:46:27Z"
  due_on: null
---

# PJR-GHKD worktree の resume 前の同期で、衝突確認の git diff がリポジトリ外で実行される

## 1. 課題内容

exec run --register --resume は、reporter の再開前に integration target（project/prj-0001/develop）を worktree へ同期する。worktree に未 commit の変更があり develop に新しい commit がある状態で再開すると、同期後の衝突確認 git diff --name-only --diff-filter=U -z が Not a git repository で失敗し、resume refused になる（2026-10-04 の PJR-GBEV）。develop の変更（3 ファイル）と worktree の変更は重ならず、作業者が worktree で git merge を手で行うと衝突なく成功し、その後の resume も成功した

## 2. 影響範囲

| 観点         | 影響                                                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| スコープ     | worktree に未 commit の変更が残った状態での `--resume`（reporter・統合の再開）。develop が先に進んでいると必ず起きる |
| スケジュール | 再開できず、作業者が worktree で手作業の merge をしてから再開し直す必要がある                                        |
| コスト       | 原因の調査と手作業の同期                                                                                             |
| 品質         | 成果物は失われないが、runner の同期処理を経ない merge が worktree の履歴に入る                                       |
| 関係者       | DEV、register を resume する利用者                                                                                   |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | 未調査。同期の衝突確認の `git diff --name-only --diff-filter=U -z` を、worktree ではない cwd（または worktree を指さない Git 環境）で実行している可能性が高い。worktree の `.git` は相対パスの gitdir（`worktree.useRelativePaths`）である点も確認する |
| 対応策   | 同期の各 git 操作の cwd と Git 環境を worktree に固定する。未 commit の変更がある場合の同期（変更を保ったままの merge）を正しく扱う                                                                                                                    |
| 依存事項 | なし                                                                                                                                                                                                                                                   |
| 完了条件 | worktree に未 commit の変更があり integration target が先に進んだ状態で `--resume` しても、同期・再開・統合が成功する。相対パスの gitdir の worktree でも成功する。integration test で再現と修正を確認し、`npm run check` が通る                       |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-gbev-exec-reporter-machine-facts]]: 観測した再開。
- [[prj-0001:pjr-7mf6-parallel-register-run-integration]]: 同じ日に統合と再開まわりを変更した項目。
- `src/exec-repo-integration.ts`（エラーの「project: git diff failed」の形から、624 行目付近の `zeroSeparated(cwd, ["diff", "--name-only", "--diff-filter=U", "-z"])` が有力。`cwd` の解決を確認する）、`src/exec-run.ts`、`src/exec-register-resume.ts`
