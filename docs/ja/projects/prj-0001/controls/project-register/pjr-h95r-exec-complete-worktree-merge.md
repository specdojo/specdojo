---
specdojo:
  id: prj-0001:pjr-h95r-exec-complete-worktree-merge
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-10T01:52:33Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-10T04:18:49Z"
  conclusion: Schedule taskの完了可否をGit統合前に検証し、actorまたはstate不一致時はworktreeを保持して統合を中止
---

# PJR-H95R exec complete失敗時にworktree merge/削除が巻き戻されず状態不整合になる

## 1. 課題内容

resume等でclaiming actorと異なるactorとして完了させると、spawnComplete(exec complete)がactor不一致で失敗してもcommitWorktreeChanges/mergeWorktreeIntoCurrent/removeWorktreeは既に完了しており、schedule状態はdoingのまま成果物だけmerge済みという不整合が生じる。complete失敗時の巻き戻し、またはmerge前のactor一致検証を検討する。

## 2. 影響範囲

| 観点         | 影響                                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| スコープ     | schedule task の worktree 成功時に行う result 更新、commit、merge、worktree 削除、complete の一連の完了処理 |
| スケジュール | task が `doing` のまま成果物だけ統合されると、後続 task の Ready 判定が進まず手動復旧が必要になる           |
| コスト       | worktree の再作成、統合済み commit の確認、event の手動補正に再作業が発生する                               |
| 品質         | event log を正本とする task state と Git 上の成果物状態が一致しなくなる                                     |
| 関係者       | `exec run` / `exec resume` を運用する開発者、agent、Schedule 管理者                                         |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                          |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 成功時処理が `commitWorktreeChanges`、`mergeWorktreeIntoCurrent`、`removeWorktree` の後に `spawnComplete` を実行し、Git 統合前に `exec complete` の actor・state 条件を検証していなかった     |
| 対応策   | 最新 event log から state を再構築し、Git 操作の直前に `canCompleteTask` と同じ条件で preflight する。不一致時は失敗として worktree を保持し、commit / merge / remove / complete を実行しない |
| 依存事項 | 既存の event log 読み込み、Schedule index、`canCompleteTask` を利用し、新しい状態正本や actor 規則は追加しない                                                                                |
| 完了条件 | claim actor と実行 actor の不一致、および `doing` 以外の state が統合前に拒否され、同一 actor の `doing` task は従来どおり完了処理へ進めることをテストで確認する                              |

## 4. 対応結果

- `src/exec-run.ts` に統合前 preflight を追加し、agent 成功後かつ result 完了確認後、result の complete 更新や Git 操作より前に最新 state の完了可否を検証するようにした。
- preflight 失敗時は理由を標準エラーへ出して終了コードを失敗へ落とし、result frontmatter、worktree、exec branch、Schedule state を変更せず再実行用に保持する。root branch への commit / merge と worktree 削除も行わない。
- claim actor 一致、不一致、`blocked` state の3ケースを回帰テストへ追加した。対象テスト8件と TypeScript typecheck は成功した。
- 全体テストは988件が成功した。Git を子プロセス起動する既存16件は、テスト初期化時の `spawnSync git EPERM` により実装アサーション前に実行環境上で失敗したため、Git 子プロセスを許可する環境での再実行を申し送る。

## 5. 関連ドキュメント

- [[specdojo:schedule-operation-guide|Schedule実行運用ガイド]]
- [[prj-0001:xer-pjr-h95r-20260810t035508z-9fac|PJR-H95R Edit Result]]
- 実装: `src/exec-run.ts`
- 回帰テスト: `tests/src/exec-run-resolve-claiming-actor.test.ts`
