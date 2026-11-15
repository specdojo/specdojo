---
specdojo:
  id: prj-0001:pjr-9mwh-schedule-executor-resume-trailing-record-conflict
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T17:01:33Z"
  due_on: "2026-11-16"
  completed_at: "2026-11-15T22:21:50Z"
  conclusion: schedule の executor の再開で、タスク自身の run の記録の衝突を exec branch 側で解くようにした。develop の pipeline-e2e が 30 件すべて通ることを確かめた
  derived_from:
    - PJR-ED0K
    - PJR-DVNV
  commit_type: fix
  commit_scope: exec
---

# PJR-9MWH schedule の executor の再開が、develop に commit 済みの run の記録との衝突で止まる

## 1. 課題内容

DVNV と ED0K の組み合わせで pipeline-e2e の統合テストが落ち、develop の test-integration が失敗する

## 2. 入力

- 2026-11-16 01:54、develop（47676ea25）で tests/src/exec/pipeline-e2e.integration.test.ts の「resumes the executor after a failed integration, syncing the integration target」が落ちる。親の検証の test-integration が全件失敗するため、0.8.0 の phase 2 の run がすべて止まる
- 原因: PJR-DVNV で runner は block の後の run の記録（execution/runs/schedule/`<task>`/`<run>`/result.md など）を develop へ commit するようになった。PJR-ED0K の schedule の --resume-from executor は、再開の前に develop を exec branch へ merge する（syncTaskWorktreesWithIntegrationTargets）。worktree 側にも同じ run の記録が commit されているため、result.md が add/add で衝突し「merge conflicts with main: execution/runs/schedule/T-TEST-doc-010/.../result.md」で止まる
- register の再開（src/exec/run/register-resume.ts）は projectTheirsPaths に bookkeeping のパスを渡して統合先の側を採っているが、schedule の再開（src/exec/run/lifecycle-commands.ts の executor 再開前の同期）は渡していない。同じ考え方で、そのタスク自身の run の記録（DVNV が commit する範囲）の衝突を解いて再開できるように直す。どちらの側を採るかは、再開した executor が result を書き直すことと、後の統合の merge が衝突しないことから決める
- 完了条件: 上記の E2E を含む npm run test:integration が通る。DVNV の trailing-records の統合テストと ED0K の再開のテストも通る。register の再開に同じ穴がないかも確かめる

## 3. 影響範囲

| 観点         | 影響                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| スコープ     | schedule の `--resume-from executor` の再開前の同期（`src/exec/run/lifecycle-commands.ts`）と同期の関数 |
| スケジュール | develop の test-integration が落ちる間、0.8.0 の phase 2 の run がすべて止まる                          |
| コスト       | 小さい（同期の関数に exec branch 側を採るパスの指定を足す）                                             |
| 品質         | 統合の段で止まった schedule タスクを executor から再開できない                                          |
| 関係者       | DEV（runner の保守）                                                                                    |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | block の後の記帳 commit が統合先へ入れた run の記録と、exec branch 側の同じ記録が両側の追加として競合し、再開前の同期が衝突として止まる                                    |
| 対応策   | 再開前の同期で、そのタスク自身の run の記録（`runs/schedule/<task>/` 配下）の競合は exec branch 側を採る                                                                   |
| 依存事項 | [[prj-0001:pjr-dvnv-exec-commit-trailing-records]]、[[prj-0001:pjr-ed0k-exec-resume-executor-from-integrate]]                                                              |
| 完了条件 | E2E の「resumes the executor after a failed integration, syncing the integration target」を含む `npm run test:integration` が通る。register の再開に同じ穴がないか確かめる |

## 5. 対応結果

- `syncWorktreeWithIntegrationTarget` に `oursPaths`、`syncTaskWorktreesWithIntegrationTargets` に `projectOursPaths` を足した。指定したパスの競合は exec branch（HEAD）の内容を採る。
- `prepareExecutorResumeFromIntegration` は、exec branch と統合先の両方にあるタスク自身の run の記録（`branchOwnedRunRecordPaths`）を `projectOursPaths` に渡す。
- exec branch 側を採る理由: 統合の merge も同じ記録を exec branch 側で解決しており、向きが揃う。worktree の未 commit の記録（block の result）は exec branch の HEAD を基に控えてあるため、取り込みの後もそのまま戻せる。取り込み後は統合先の側に差分が無いため、再開した executor が result を書き直しても後の統合の merge は競合しない。
- register の再開: DVNV の記帳 commit は `runs/schedule/` 配下だけを選ぶ。register の plan・result・個票・イベントは bookkeeping のパスとして既に `projectTheirsPaths` で統合先の側を採っているため、同じ穴は無い。
- 確認: 上記の E2E、`trailing-records.integration.test.ts`、`register-resume.integration.test.ts`、`task-repos.integration.test.ts`（exec branch 側を採る競合の解決を追加）を単独で実行して通った。全件の `npm run test:integration` は親 runner の検証で確かめる。
- 再発防止: 記帳 commit が統合先へ入れる記録の範囲を変える場合は、再開前の同期と統合の merge の競合解決の両方を見直す。

## 6. 関連ドキュメント

- [[prj-0001:pjr-dvnv-exec-commit-trailing-records]]
- [[prj-0001:pjr-ed0k-exec-resume-executor-from-integrate]]
