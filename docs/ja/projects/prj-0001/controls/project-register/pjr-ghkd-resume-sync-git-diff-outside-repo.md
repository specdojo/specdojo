---
specdojo:
  id: prj-0001:pjr-ghkd-resume-sync-git-diff-outside-repo
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T11:46:27Z"
  due_on: null
  completed_at: "2026-10-06T10:43:12Z"
  conclusion: Git 実行ヘルパーの cwd を対象リポジトリへ固定し、resume 前の同期が実行ディレクトリに依存しないようにした。PJR-27Y0 の resume で同期（merge）が成功することを実地で確認した
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
| 原因     | Git 実行ヘルパーは `git -C <repo>` を指定する一方、子プロセスの `cwd` を指定せず runner の `cwd` を継承していた。相対 gitdir の linked worktree を同期する経路では、衝突確認の `git diff` が worktree 自体を実行ディレクトリとして保証されていなかった |
| 対応策   | 同期の各 git 操作の cwd と Git 環境を worktree に固定する。未 commit の変更がある場合の同期（変更を保ったままの merge）を正しく扱う                                                                                                                    |
| 依存事項 | なし                                                                                                                                                                                                                                                   |
| 完了条件 | worktree に未 commit の変更があり integration target が先に進んだ状態で `--resume` しても、同期・再開・統合が成功する。相対パスの gitdir の worktree でも成功する。integration test で再現と修正を確認し、`npm run check` が通る                       |

## 4. 対応結果

- `src/exec-worktree.ts` の Git 実行ヘルパーで、`git -C <repo>` に加えて子プロセスの `cwd` も対象リポジトリへ固定した。再開前の同期に含まれる stash、merge、衝突確認、commit は同じヘルパーを使うため、runner の実行ディレクトリに依存しない。
- `tests/src/exec-register-resume.integration.test.ts` の reporter 再開 E2E を `worktree.useRelativePaths=true` で実行し、worktree の `.git` が相対 gitdir であることを確認するようにした。未 commit の executor 変更と統合先の非競合変更を保持したまま同期・親検証・reporter・統合まで完了する既存の確認に、障害時の条件を追加した。
- `npm run test:integration` を含む親 runner の検証で、再現シナリオと全体への影響を確認する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-gbev-exec-reporter-machine-facts]]: 観測した再開。
- [[prj-0001:pjr-7mf6-parallel-register-run-integration]]: 同じ日に統合と再開まわりを変更した項目。
- `src/exec-repo-integration.ts`（エラーの「project: git diff failed」の形から、624 行目付近の `zeroSeparated(cwd, ["diff", "--name-only", "--diff-filter=U", "-z"])` が有力。`cwd` の解決を確認する）、`src/exec-run.ts`、`src/exec-register-resume.ts`
