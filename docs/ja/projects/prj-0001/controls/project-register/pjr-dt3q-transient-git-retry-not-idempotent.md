---
specdojo:
  id: prj-0001:pjr-dt3q-transient-git-retry-not-idempotent
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-17T09:33:16Z"
  due_on: null
---

# PJR-DT3Q git の一時的な失敗の再試行が worktree の作成で失敗する

## 1. 課題内容

src/exec/worktree.ts は dubious ownership などの一時的な git の失敗を再試行する。git worktree add -b は最初の試みで worktree と branch を作ったうえで失敗を返すことがあり、再試行が branch がすでにあるで失敗して run が waiting になる。2026-10-17 の PJR-MX4F で起きた

## 2. 影響範囲

| 観点         | 影響                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| スコープ     | `src/exec/worktree.ts` の一時的な git の失敗の再試行（`runGitWithTransientRetry`）と、それを使う worktree の作成 |
| スケジュール | 急がないが、exec run を無駄に止めるため早めに直す                                                                |
| コスト       | 再試行が失敗すると run が `waiting` になり、残った worktree と branch を人が片付けてから実行し直す必要がある     |
| 品質         | 一時的な失敗のための再試行が、かえって失敗の原因になる                                                           |
| 関係者       | exec の利用者                                                                                                    |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                 |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `git worktree add <path> -b <branch>` は、dubious ownership の一時的なエラーを返したときも worktree と branch を作り終えていることがある。再試行は同じ引数で起動するため、`a branch named ... already exists` で失敗する                                             |
| 対応策   | 一時的な失敗のあとに再試行する前に、目的の状態がすでにできているかを確かめる。worktree の作成では、目的の path に目的の branch の worktree があり、その先端が分岐元と同じなら、作成済みとして扱う。できかけの状態（branch だけある、など）なら片付けてから再試行する |
| 依存事項 | なし                                                                                                                                                                                                                                                                 |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                                                                                               |

### 3.1. 完了条件

- worktree の作成が一時的なエラーを返し、実際には worktree と branch ができていた場合に、再試行で失敗せず、そのまま run を続ける。
- branch だけができていて worktree がない、などのできかけの状態から、再試行で正しく作り直す。分岐元と違う commit を指す既存の branch は消さずに失敗させ、理由を出す。
- ほかの git の操作の再試行で、同じように「やり直すと失敗する」ものがないかを調べ、result に書く。
- 単体テストか統合テストで、作成済みの場合とできかけの場合を確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner のコードを変えるため、統合の後に orchestrator が `exec run --register` を 1 回流し、統合まで終わることを確かめる（本件の close の条件）。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-mx4f-integrate-conflict-commit-skips-dist-rebuild]]: 事象が起きた実行。
