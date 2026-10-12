---
specdojo:
  id: prj-0001:pjr-dxdc-job-manual-run-id-mismatch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: high
  owner: DEV
  registered_at: "2026-10-12T09:14:26Z"
---

# PJR-DXDC --scheduled-at なしの exec run --job で worktree と実行の Run ID が食い違う

## 1. 課題内容

task.review を宣言した Job を --scheduled-at なしで手動実行すると、worktree の作成時と worktree 内の子プロセスの実行時に別々に現在時刻を実行枠に使うため Run ID が食い違い、Job Run record was not created in worktree で失敗する

## 2. 影響範囲

| 観点         | 影響                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------- |
| スコープ     | `--scheduled-at` を指定しない `exec run --job`（`task.review` を宣言した Job の手動実行） |
| スケジュール | v0.3.0 の公開前に直す。routine 起動は `--scheduled-at` を渡すため影響しない               |
| コスト       | 手動実行が必ず失敗し、worktree が残る                                                     |
| 品質         | 手動実行でも同じ流れになるという PJR-MD3C の約束が守られない                              |
| 関係者       | Job を手動で実行する利用者と orchestrator                                                 |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | worktree を作る前の `materializeJobRun` は `opts.scheduledAt` が無いと現在時刻を実行枠に使い、worktree 内で Job を実行する子プロセスも別に現在時刻を使う。冪等キーが変わって Run ID が食い違い、runner が worktree 内に Run の記録を見つけられない                                                                                                                                                                                            |
| 対応策   | 親で確定した実行枠（または Run ID）を、worktree 内の子プロセスへ明示して渡す（例: 親で解決した `scheduled_at` を `--scheduled-at` として渡す）。親と子で同じ Run になることを保証する                                                                                                                                                                                                                                                         |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 完了条件 | `--scheduled-at` を指定せずに `task.review` を宣言した Job を実行すると、worktree の作成時と子プロセスの実行時の Run ID が一致し、Run の記録が worktree 内に作られることを統合テストで確認する。`--scheduled-at` を指定した場合の挙動が変わらないことも確認する。統合テストで子プロセスとして CLI を起動する場合は、実リポジトリの `node_modules/.bin/tsx` を絶対パスで起動する。fixture の `agent-members.yaml` は schema の必須項目を満たす |

## 4. 対応結果

worktree 作成前に親プロセスが確定した `scheduled_at` を、worktree 内の子プロセスへ
`--scheduled-at` として常に渡すようにした。これにより手動実行で引数を省略しても、親子が同じ
冪等キーと Job Run ID を使う。

統合テストへ `--scheduled-at` の省略ケースを追加し、親が表示する Run ID、子が完了した Run ID、
merge 対象の Run ID が一致し、対応する Job Run record が統合後のリポジトリに存在することを確認する。
既存の明示指定ケースも維持し、双方の経路を回帰テスト対象とした。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqza-routine-commit-after-run]]: Job Run を worktree で実行し review を経て統合する流れ
- [[prj-0001:pjr-md3c-job-review-agent]]: Job の review の宣言と agent の指名
