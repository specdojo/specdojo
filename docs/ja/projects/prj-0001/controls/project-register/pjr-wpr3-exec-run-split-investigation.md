---
specdojo:
  id: prj-0001:pjr-wpr3-exec-run-split-investigation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-10-02T12:14:16Z"
  completed_at: "2026-10-07T22:18:00Z"
  conclusion: exec-run.ts の関数の分類・依存・重複・状態遷移を調べ、3 案を PJR-Q761 で比較した。利用者が選択肢 C を選んだ
---

# PJR-WPR3 exec-run.ts の分割方針の調査と選択肢の比較

## 1. 概要

exec-run.ts の関数・依存・初回と再開の重複を調べ、モジュールの境界と状態遷移の選択肢と推奨案を exec-run.ts の分割方針の決定の個票へ書く。決定はしない（v0.3.0 の公開後）

## 2. 完了条件

- 調査と比較だけを行い、`src/` のコードは変更しない。決定は [[prj-0001:pjr-q761-exec-run-module-split]] で利用者が行う。
- `src/exec-run.ts`（2026-10-07 時点で 7,948 行、トップレベルの関数 114 個）の関数を、段階（準備・worktree・agent の起動・親検証・reporter・統合・再開・register の記帳・CLI の登録など）ごとに分類した一覧を作る。関数ごとに行数と、主に呼び出す側・呼ばれる側を示す。
- 段階の間の依存と、他のモジュール（`exec-worktree*.ts`・`exec-register*.ts`・`exec-parent-validation.ts`・`exec-reporter.ts` など）への依存を整理し、分割したときに循環依存が生じうる箇所を挙げる。
- 初回の実行と再開（executor・reporter・統合の各段からの再開）の経路で重複している処理を、関数名と行の範囲で具体的に挙げる。
- 現在の暗黙の状態（`pipeline-state.json` の各段の状態と register の状態）の遷移を表にし、初回と再開を 1 つの状態遷移にまとめる場合の形を示す。
- 選択肢を 3 つ以上比べる（例: 段階ごとのモジュールへの分割のみ、分割と明示的な状態遷移の導入、段階的な切り出しの順序づけ）。各選択肢について、利点・懸念・既存のテストへの影響・作業量・切り出しの順序を書く。
- 推奨案を 1 つ示し、最初に切り出す範囲と、振る舞いを変えていないことを確かめる方法（既存の unit / integration テスト、追加すべきテスト）を書く。
- 選択肢の比較を [[prj-0001:pjr-q761-exec-run-module-split]] の「検討した選択肢」に書き、決定内容と承認の欄は `_TODO_` のまま残す。関数の一覧などの詳しい調査結果は本個票の対応結果に書く。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                     | 担当 | 状態 | メモ                            |
| --- | ---------------------------------------- | ---- | ---- | ------------------------------- |
| 1   | 関数の分類・依存・重複・状態遷移を調べる | ARC  | done | コードは変更していない          |
| 2   | 選択肢を比べ、推奨案を書く               | ARC  | done | PJR-Q761 の「検討した選択肢」へ |
| 3   | 方針を決める                             | PO   | open | PJR-Q761 で利用者が決める       |

## 4. 対応結果

### 4.1. 調査範囲と結論

2026-10-08 時点の `src/exec-run.ts` は 7,948 行、トップレベル関数は 114 個だった。TypeScript AST で関数宣言、行範囲、同一ファイル内の直接呼び出しを抽出し、実装と関連テストを照合した。`src/` のコードは変更していない。

主な結論は次のとおり。

- ファイル内には CLI 登録、実行対象の選択、agent 起動、親検証、reporter、worktree 統合、Schedule と Register の状態遷移、Job 実行が同居している。
- Register worktree の初回と executor 再開は `runAgentPipeline`、初回・各再開の統合は `finalizeRegisterWorktreeRun` をすでに共有している。一方、入口の復元・記帳と、Schedule / in-place / Register 間の pipeline 段制御には重複が残る。
- 一括して状態機械へ置き換えるより、既存の公開 export を façade で維持しながら、純粋な選択処理、agent 呼び出し、pipeline 段、ドメイン別統合の順に切り出す方が、差分と回帰時の切り戻し単位を小さくできる。
- 推奨は「段階的なモジュール切り出し後に、初回と再開を同じ遷移関数へ載せる」案である。これは調査上の推奨であり、採否は [[prj-0001:pjr-q761-exec-run-module-split|PJR-Q761 exec-run.ts の分割方針を決める]] で決定する。

### 4.2. 段階別の全体像

| 段階                    | 主な責務                                                          | 主な関数・行                                                                            | 直接依存する既存モジュール                                                                                        |
| ----------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 準備・選択              | option、agent 候補、phase、lock、prompt の解決                    | `pinnedExecutor` から `loadPrompt`（398-932）                                           | `exec-agent-config.ts`、`exec-strategy.ts`、`exec-run-lock.ts`、`exec-slot-lock.ts`                               |
| 親検証・契約            | executor prompt、再開時 target 被覆、親検証の実行と evidence 追記 | `resolveResumedCoverageTargets` から `executorRequirements`（942-1200）                 | `exec-evidence.ts`、`exec-parent-validation.ts`                                                                   |
| agent 起動              | reporter 選択、process 起動、retry、利用制限、保護機構            | `reporterRequirements` から `agentEnvironment`（1202-1596）                             | `exec-agent-config.ts`、`exec-agent-git-state.ts`、`exec-agent-protected-config.ts`、`exec-protection-handoff.ts` |
| Schedule 準備           | claim、plan/result/worktree、review 前 grade、完了事前判定        | `findClaimEventPath` から `readCompletionPreflight`（1598-2029）                        | `exec-events.ts`、`exec-plans.ts`、`exec-results.ts`、`exec-worktree*.ts`、`review-grade.ts`                      |
| Schedule 実行・統合     | executor / reporter / 親検証 / commit / merge / block / complete  | `runPreparedTask`（2031-2702）                                                          | `exec-pipeline-state.ts`、`exec-reporter.ts`、`exec-repo-integration.ts`、`exec-worktree-ops.ts`                  |
| 状態 CLI                | 自 CLI の validate / refresh / claim / complete / block 呼び出し  | `runPreparedTaskSafely` から `spawnBlock`（2709-2873）                                  | `spawn-self.ts`、`exec-events.ts`                                                                                 |
| Schedule orchestration  | auto/manual の準備、worker pool、実行                             | `runBatchMode` から `runManualMode`（2875-3272）                                        | `exec-schedule*.ts`、`exec-task-view.ts`                                                                          |
| in-place / Job          | worktree を使わない plan、Job command、任意 analysis              | `resolveInPlaceCommand` から `runJobMode`（3278-4310）                                  | `exec-plans.ts`、`exec-results.ts`、`job.ts`                                                                      |
| Register 選択・pipeline | Register agent 選択、executor、reporter、evidence                 | `resolveRegisterCommand` から `runAgentPipeline`（4316-4835）                           | `exec-register.ts`、`exec-evidence.ts`、`exec-reporter.ts`、`exec-pipeline-state.ts`                              |
| Register 記帳           | transition、管理対象 path、commit                                 | `spawnRegisterTransition` から `registerReporterManagedPaths`（4839-4951）              | `register.ts`、`register-events.ts`、`register-item.ts`                                                           |
| Register in-place       | 1 個票の plan/result/agent/transition                             | `runSingleRegisterItem`（4957-5164）                                                    | `exec-register.ts`、`exec-results.ts`                                                                             |
| Register worktree・統合 | setup、checkpoint、wait、commit、merge、review、cleanup           | `registerStatePaths` から `runSingleRegisterItemWorktree`（5169-6145）                  | `exec-worktree*.ts`、`exec-repo-integration.ts`、`exec-repo-trace.ts`                                             |
| Register 再開           | checkpoint 選択、入力復元、executor / reporter / integrate 再開   | `protectResumableRegisterWorktree` から `resumeSingleRegisterItemWorktree`（6150-6663） | `exec-register-resume.ts`、`exec-pipeline-state.ts`、`exec-task-repos.ts`                                         |
| CLI・cycle              | Register 実行、slot 表示、cycle、Schedule 再開、Commander 登録    | `runRegisterMode` から `registerResumeCommand`（6670-7948）                             | `commander`、`exec-run-lock.ts`、`exec-schedule*.ts`                                                              |

### 4.3. トップレベル関数一覧

「呼出元」「主な呼出先」は `src/exec-run.ts` 内の直接呼び出しを示す。`外部/CLI` は Commander callback またはテストから直接呼ばれる公開 helper を含む。呼出先が多い関数は主要な 4 件までを記載した。

| 段階                   | 関数                                        | 行範囲（行数）  | 主な呼出元                                                                         | 主な呼出先                                                                  |
| ---------------------- | ------------------------------------------- | --------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 準備・選択             | `pinnedExecutor`                            | 398-400 (3)     | `prepareSingleTask`, `resolveInPlaceCommand`                                       | -                                                                           |
| 準備・選択             | `pinnedReporter`                            | 402-404 (3)     | `prepareSingleTask`, `runInPlaceMode`                                              | -                                                                           |
| 準備・選択             | `resolveAgentOverride`                      | 409-448 (40)    | `resolveReporterAgentCandidates`, `prepareSingleTask`, `runCommandJobMode`         | -                                                                           |
| 準備・選択             | `runCompletionDrivenWorkerPool`             | 509-562 (54)    | `runBatchMode`, `runRegisterMode`                                                  | -                                                                           |
| 準備・選択             | `buildTaskPhaseMap`                         | 564-622 (59)    | `runBatchMode`, `runManualMode`, `runResumeMode`                                   | -                                                                           |
| 準備・選択             | `resolveTaskPhaseContext`                   | 624-653 (30)    | `prepareSingleTask`                                                                | -                                                                           |
| 準備・選択             | `selectCandidates`                          | 655-704 (50)    | `resolveReporterAgentCandidates`, `prepareSingleTask`, `resolveInPlaceCommand`     | -                                                                           |
| 準備・選択             | `collectBusyActors`                         | 709-723 (15)    | `prepareSingleTask`                                                                | -                                                                           |
| agent 起動             | `isRateLimitError`                          | 725-752 (28)    | `executeAgent`                                                                     | -                                                                           |
| 準備・選択             | `resolveExecDefaultsPath`                   | 754-773 (20)    | `resolveJoinSlotLimit`, `runBatchMode`, `runManualMode`                            | -                                                                           |
| 準備・選択             | `configuredWorktreeBase`                    | 775-786 (12)    | `runBatchMode`, `runManualMode`, `runRegisterMode`                                 | -                                                                           |
| 準備・選択             | `parseParallel`                             | 788-798 (11)    | `runBatchMode`, `runRegisterMode`, `registerRunCommand`                            | -                                                                           |
| 準備・選択             | `parseExecRunBusyPolicy`                    | 800-806 (7)     | `withProjectExecRunLock`                                                           | -                                                                           |
| 準備・選択             | `resolveRegisterWorktree`                   | 808-818 (11)    | `registerRunCommand`                                                               | -                                                                           |
| 準備・選択             | `resolveJoinSlotLimit`                      | 832-838 (7)     | `withProjectExecRunLock`                                                           | `resolveExecDefaultsPath`                                                   |
| 準備・選択             | `withProjectExecRunLock`                    | 840-904 (65)    | `registerRunCommand`, `registerCycleCommand`, `registerResumeCommand`              | `parseExecRunBusyPolicy`, `resolveJoinSlotLimit`                            |
| agent 起動             | `delay`                                     | 906-908 (3)     | `runWithRetry`                                                                     | -                                                                           |
| 準備・選択             | `expandPromptRefs`                          | 910-927 (18)    | `loadPrompt`, `runInPlaceMode`, `runCommandJobMode`                                | -                                                                           |
| 準備・選択             | `loadPrompt`                                | 929-932 (4)     | `prepareSingleTask`                                                                | `expandPromptRefs`                                                          |
| 親検証・契約           | `resolveResumedCoverageTargets`             | 942-954 (13)    | `buildExecutorPrompt`, `resumedTargetCoverageFailure`                              | -                                                                           |
| 親検証・契約           | `executorEvidenceContract`                  | 956-1043 (88)   | `buildExecutorPrompt`                                                              | -                                                                           |
| 親検証・契約           | `buildExecutorPrompt`                       | 1045-1056 (12)  | `prepareSingleTask`, `runPreparedTask`, `runInPlaceMode`                           | `resolveResumedCoverageTargets`, `executorEvidenceContract`                 |
| 親検証・契約           | `resumedTargetCoverageFailure`              | 1058-1073 (16)  | `runPreparedTask`, `runAgentPipeline`                                              | `resolveResumedCoverageTargets`                                             |
| 親検証・契約           | `runConfiguredParentValidationBatch`        | 1084-1103 (20)  | 親検証 wrapper 3 関数                                                              | -                                                                           |
| 親検証・契約           | `runConfiguredParentValidations`            | 1105-1111 (7)   | 外部/CLI                                                                           | `runConfiguredParentValidationBatch`                                        |
| 親検証・契約           | `refreshParentValidationsForReporterResume` | 1113-1159 (47)  | `runPreparedTask`, `resumeRegisterIntegration`, `resumeSingleRegisterItemWorktree` | `runConfiguredParentValidationBatch`                                        |
| 親検証・契約           | `appendParentValidationsToExecutorEvidence` | 1164-1190 (27)  | `runPreparedTask`, `runInPlaceMode`, `runAgentPipeline`                            | `runConfiguredParentValidationBatch`                                        |
| 準備・選択             | `executorRequirements`                      | 1192-1200 (9)   | `prepareSingleTask`, `resolveInPlaceCommand`                                       | -                                                                           |
| 準備・選択             | `reporterRequirements`                      | 1202-1210 (9)   | `resolveReporterAgentCandidates`, `prepareSingleTask`                              | -                                                                           |
| 準備・選択             | `resolveReporterAgentCandidates`            | 1212-1266 (55)  | `prepareSingleTask`, `runInPlaceMode`                                              | `reporterRequirements`, `resolveAgentOverride`, `selectCandidates`          |
| 準備・選択             | `loadRosterForExecutionPath`                | 1268-1284 (17)  | `runBatchMode`, `runManualMode`, `runInPlaceMode`                                  | -                                                                           |
| agent 起動             | `executeAgent`                              | 1286-1353 (68)  | `runWithRetry`                                                                     | `isRateLimitError`                                                          |
| agent 起動             | `reportProtectionHandoffRecord`             | 1366-1372 (7)   | `runWithRetry`, `spawnAgentInPlace`                                                | -                                                                           |
| agent 起動             | `rateLimitPrefix`                           | 1377-1379 (3)   | `runWithRetry`                                                                     | -                                                                           |
| agent 起動             | `runWithRetry`                              | 1381-1561 (181) | `runPreparedTask`, `runInPlaceMode`, `runReporterStage`                            | `executeAgent`, `rateLimitPrefix`, `reportProtectionHandoffRecord`, `delay` |
| worktree               | `pathInsideWorktree`                        | 1563-1569 (7)   | `agentEnvironment`, `runPreparedTask`, `registerPathsInsideWorktree`               | -                                                                           |
| worktree               | `reportProductWorktrees`                    | 1571-1578 (8)   | `prepareSingleTask`, `runSingleRegisterItemWorktree`                               | -                                                                           |
| agent 起動             | `agentEnvironment`                          | 1583-1596 (14)  | `runPreparedTask`, `runReporterStage`, `runAgentPipeline`                          | `pathInsideWorktree`                                                        |
| Schedule 準備          | `findClaimEventPath`                        | 1598-1603 (6)   | `prepareSingleTask`, `prepareScheduleIntegrationResume`                            | -                                                                           |
| Schedule 準備          | `gradeBeforeReviewPlan`                     | 1608-1641 (34)  | `prepareSingleTask`, `runInPlaceMode`                                              | -                                                                           |
| Schedule 準備          | `prepareSingleTask`                         | 1643-1978 (336) | `runBatchMode`, `runManualMode`, `runResumeMode`                                   | agent 選択、plan/result、claim、worktree 準備                               |
| 統合                   | `downgradeUnfilledResult`                   | 1986-2001 (16)  | `runPreparedTask`, `finalizeRegisterWorktreeRun`                                   | -                                                                           |
| Schedule 準備          | `checkCompletionBeforeIntegration`          | 2003-2010 (8)   | `readCompletionPreflight`                                                          | -                                                                           |
| Schedule 準備          | `readCompletionPreflight`                   | 2012-2029 (18)  | `runPreparedTask`                                                                  | `checkCompletionBeforeIntegration`                                          |
| Schedule 実行・統合    | `runPreparedTask`                           | 2031-2702 (672) | `runPreparedTaskSafely`, `runManualMode`, `runResumeMode`                          | agent、親検証、reporter、統合、状態遷移                                     |
| Schedule 実行          | `runPreparedTaskSafely`                     | 2709-2748 (40)  | `runBatchMode`                                                                     | `runPreparedTask`, `spawnBlock`                                             |
| 状態 CLI               | `spawnSelf`                                 | 2750-2754 (5)   | 各 `spawn*` helper                                                                 | -                                                                           |
| 状態 CLI               | `spawnValidate`                             | 2756-2760 (5)   | `registerRunCommand`, `runCycleMode`                                               | `spawnSelf`                                                                 |
| 状態 CLI               | `spawnRefresh`                              | 2762-2766 (5)   | `runBatchMode`, `registerRunCommand`, `runCycleMode`                               | `spawnSelf`                                                                 |
| 状態 CLI               | `spawnScheduleBuild`                        | 2768-2772 (5)   | `rebuildStaleGeneratedTracksForCycle`                                              | `spawnSelf`                                                                 |
| 状態 CLI               | `spawnIndexBuild`                           | 2777-2779 (3)   | `runBatchMode`, `runCycleMode`                                                     | `spawnSelf`                                                                 |
| 状態 CLI               | `spawnClaim`                                | 2781-2795 (15)  | `prepareSingleTask`, `runInPlaceMode`                                              | `spawnSelf`                                                                 |
| 状態 CLI               | `spawnComplete`                             | 2797-2801 (5)   | `runPreparedTask`, `runInPlaceMode`                                                | `spawnSelf`                                                                 |
| 状態 CLI               | `spawnRelease`                              | 2805-2824 (20)  | `prepareSingleTask`                                                                | `spawnSelf`                                                                 |
| 状態遷移               | `extractBlockReason`                        | 2832-2846 (15)  | Schedule / in-place / Register pipeline                                            | -                                                                           |
| 状態遷移               | `pipelineRecoveryMeta`                      | 2848-2860 (13)  | `runPreparedTask`, `runInPlaceMode`                                                | -                                                                           |
| 状態 CLI               | `spawnBlock`                                | 2862-2873 (12)  | Schedule の実行・安全 wrapper                                                      | `spawnSelf`                                                                 |
| Schedule orchestration | `runBatchMode`                              | 2875-3095 (221) | `registerRunCommand`, `runCycleMode`                                               | 準備、worker pool、実行、refresh                                            |
| Schedule 準備          | `resolveClaimingActor`                      | 3100-3111 (12)  | `runManualMode`, `runResumeMode`                                                   | -                                                                           |
| Schedule orchestration | `runManualMode`                             | 3113-3272 (160) | `registerRunCommand`                                                               | 準備、claim actor 解決、実行                                                |
| in-place 準備          | `resolveInPlaceCommand`                     | 3278-3330 (53)  | `runInPlaceMode`, `runJobMode`                                                     | `pinnedExecutor`, `selectCandidates`, `executorRequirements`                |
| in-place 準備          | `resolveInPlaceAgentPipeline`               | 3344-3379 (36)  | `runInPlaceMode`                                                                   | -                                                                           |
| agent 起動             | `spawnAgentInPlace`                         | 3381-3440 (60)  | `runInPlaceMode`, `runJobMode`, `runSingleRegisterItem`                            | `reportProtectionHandoffRecord`                                             |
| in-place 実行          | `runInPlaceMode`                            | 3444-3918 (475) | `registerRunCommand`                                                               | plan/result、executor、親検証、reporter、完了                               |
| Job 実行               | `runCommandJobMode`                         | 3920-4143 (224) | `runJobMode`                                                                       | command evidence、任意 reporter、Job 完了                                   |
| Job 実行               | `runJobMode`                                | 4145-4310 (166) | `registerRunCommand`                                                               | Job materialize、command / agent 分岐                                       |
| Register 選択          | `resolveRegisterCommand`                    | 4316-4376 (61)  | Register の 3 実行経路                                                             | `selectCandidates`                                                          |
| Register 選択          | `isRegisterPipelineRequested`               | 4381-4385 (5)   | Register の 3 実行経路                                                             | -                                                                           |
| Register 選択          | `parseRegisterExecutorSelection`            | 4396-4438 (43)  | `runRegisterMode`                                                                  | -                                                                           |
| Register 選択          | `selectedRegisterExecutor`                  | 4440-4446 (7)   | `runRegisterMode`                                                                  | -                                                                           |
| Register 選択          | `resolveRegisterPipelineCommand`            | 4451-4504 (54)  | Job / Register の pipeline 経路                                                    | `resolveAgentOverride`                                                      |
| reporter               | `runReporterStage`                          | 4509-4637 (129) | Job、`runAgentPipeline`、reporter 再開                                             | `agentEnvironment`, `runWithRetry`                                          |
| pipeline               | `runAgentPipeline`                          | 4645-4835 (191) | Job、Register 初回、executor 再開                                                  | executor、evidence、親検証、`runReporterStage`                              |
| Register 記帳          | `spawnRegisterTransition`                   | 4839-4847 (9)   | Register 実行・再開・派生 view 更新                                                | `spawnSelf`                                                                 |
| Register 記帳          | `commitRegisterItemChanges`                 | 4868-4889 (22)  | `runSingleRegisterItem`                                                            | `commitSubject`                                                             |
| path                   | `repoRelativePath`                          | 4891-4893 (3)   | Schedule / Register の記帳と統合                                                   | -                                                                           |
| 統合                   | `commitSubject`                             | 4899-4904 (6)   | Schedule / Register の commit                                                      | -                                                                           |
| Register 記帳          | `registerEventPathForTicket`                | 4906-4915 (10)  | Register 管理 path helper                                                          | -                                                                           |
| Register 記帳          | `registerRunnerManagedPaths`                | 4917-4943 (27)  | Register 初回 / 再開                                                               | `registerEventPathForTicket`, `repoRelativePath`                            |
| Register 記帳          | `registerReporterManagedPaths`              | 4945-4951 (7)   | Register pipeline 初回 / 再開                                                      | -                                                                           |
| Register in-place      | `runSingleRegisterItem`                     | 4957-5164 (208) | `runRegisterMode`                                                                  | plan/result、transition、agent / pipeline、commit                           |
| Register 記帳          | `registerStatePaths`                        | 5169-5190 (22)  | `commitRegisterState`                                                              | `repoRelativePath`, `registerEventPathForTicket`                            |
| Register 記帳          | `commitRegisterState`                       | 5194-5214 (21)  | wait / 成功統合                                                                    | `registerStatePaths`, `repoRelativePath`                                    |
| worktree               | `registerPathsInsideWorktree`               | 5216-5228 (13)  | `finalizeRegisterWorktreeRun`                                                      | `pathInsideWorktree`                                                        |
| Register 記帳          | `copyRepoPaths`                             | 5232-5249 (18)  | wait / 再開                                                                        | `repoRelativePath`                                                          |
| Register 記帳          | `registerFailureArtifactPaths`              | 5254-5258 (5)   | `registerWaitSummary`                                                              | `repoRelativePath`                                                          |
| Register 記帳          | `restorePreservedRegisterTicket`            | 5268-5302 (35)  | `syncExecBranchAfterWait`                                                          | `repoRelativePath`                                                          |
| Register 記帳          | `registerTransitionPaths`                   | 5307-5317 (11)  | `resumeSingleRegisterItemWorktree`                                                 | `registerEventPathForTicket`                                                |
| Register 記帳          | `registerBookkeepingPaths`                  | 5322-5338 (17)  | `resumeSingleRegisterItemWorktree`                                                 | `registerRunnerManagedPaths`                                                |
| Register 記帳          | `rebuildRootRegisterViews`                  | 5343-5347 (5)   | Register finalize / 再開                                                           | `spawnRegisterTransition`                                                   |
| Register 記帳          | `registerWaitSummary`                       | 5353-5423 (71)  | Register finalize / setup 失敗                                                     | copy、wait transition、commit、branch 同期                                  |
| Register 記帳          | `commitRegisterWaitState`                   | 5429-5462 (34)  | `registerWaitSummary`                                                              | `isRegisterResultPath`, `commitRegisterState`                               |
| Register 記帳          | `isRegisterResultPath`                      | 5464-5466 (3)   | `commitRegisterWaitState`                                                          | `repoRelativePath`                                                          |
| worktree               | `syncExecBranchAfterWait`                   | 5476-5543 (68)  | `registerWaitSummary`                                                              | copy、ticket 復元、commit                                                   |
| 統合                   | `recordIntegrateStage`                      | 5548-5564 (17)  | Schedule / Register 統合                                                           | -                                                                           |
| 統合                   | `recordRepoIntegration`                     | 5569-5585 (17)  | Schedule / Register 統合                                                           | -                                                                           |
| 統合                   | `integrateLogPath`                          | 5587-5589 (3)   | Schedule / Register 統合                                                           | -                                                                           |
| Register 統合          | `finalizeRegisterWorktreeRun`               | 5596-5922 (327) | 初回、reporter 再開、integrate 再開                                                | result、commit、merge、review / waiting、cleanup                            |
| Register worktree      | `runSingleRegisterItemWorktree`             | 5928-6145 (218) | `runRegisterMode`                                                                  | setup、agent / pipeline、`finalizeRegisterWorktreeRun`                      |
| 再開準備               | `protectResumableRegisterWorktree`          | 6150-6178 (29)  | `runSingleRegisterItemWorktree`                                                    | -                                                                           |
| 再開準備               | `resolveRegisterResumeReporter`             | 6182-6215 (34)  | `resumeSingleRegisterItemWorktree`                                                 | `resolveAgentOverride`                                                      |
| 再開準備               | `resolveRegisterResumeExecutor`             | 6219-6252 (34)  | `resumeSingleRegisterItemWorktree`                                                 | `resolveAgentOverride`                                                      |
| Register 再開          | `resumeRegisterIntegration`                 | 6258-6338 (81)  | `resumeSingleRegisterItemWorktree`                                                 | 親検証 refresh、`finalizeRegisterWorktreeRun`                               |
| Register 再開          | `resumeSingleRegisterItemWorktree`          | 6347-6663 (317) | `runRegisterMode`                                                                  | checkpoint 復元、同期、段分岐、共通 stage / finalize                        |
| Register orchestration | `runRegisterMode`                           | 6670-6896 (227) | `registerRunCommand`                                                               | 選択、並列 worker、初回 / 再開分岐                                          |
| CLI                    | `registerRunCommand`                        | 6898-7252 (355) | 外部/CLI                                                                           | option 定義、lock、Job / Register / Schedule 分岐                           |
| CLI                    | `formatExecSlotsReport`                     | 7256-7293 (38)  | `registerSlotsCommand`                                                             | -                                                                           |
| CLI                    | `registerSlotsCommand`                      | 7295-7320 (26)  | 外部/CLI                                                                           | slot 収集・表示                                                             |
| cycle                  | `rebuildStaleGeneratedTracksForCycle`       | 7335-7368 (34)  | `runBatchMode`, `runCycleMode`                                                     | `spawnScheduleBuild`                                                        |
| cycle                  | `runCycleMode`                              | 7391-7501 (111) | `registerCycleCommand`                                                             | resume、index、build、validate、refresh、auto                               |
| CLI                    | `registerCycleCommand`                      | 7503-7555 (53)  | 外部/CLI                                                                           | lock、`runCycleMode`                                                        |
| Schedule 再開          | `prepareScheduleIntegrationResume`          | 7560-7630 (71)  | `runResumeMode`                                                                    | checkpoint と claim 復元                                                    |
| Schedule 再開          | `runResumeMode`                             | 7637-7888 (252) | cycle、`registerResumeCommand`                                                     | deferred / pipeline 段判定、prepare、実行                                   |
| CLI                    | `registerResumeCommand`                     | 7890-7948 (59)  | 外部/CLI                                                                           | lock、`runResumeMode`                                                       |

### 4.4. 依存方向と循環依存のリスク

目標とする依存方向は `CLI -> domain orchestration -> pipeline stage -> adapter / state store` とし、型と純粋な遷移規則だけを下位の contract module に置く。

| 境界候補                    | 移す主な責務                                            | 依存先                                                                                                                | 循環を避ける条件                                                                       |
| --------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `exec-run-options.ts`       | option parse、agent / phase 選択、実行設定解決          | `exec-agent-config.ts`、`exec-strategy.ts`、`specdojo-config.ts`                                                      | `exec-run.ts` の orchestration を import しない                                        |
| `exec-agent-runner.ts`      | `executeAgent`、retry、rate limit、保護機構、agent 環境 | agent config / protection modules                                                                                     | Schedule / Register の型を受けず、cwd、候補、prompt、環境だけを入力にする              |
| `exec-pipeline-runner.ts`   | executor、親検証、reporter、evidence、stage checkpoint  | `exec-agent-runner.ts`、`exec-evidence.ts`、`exec-parent-validation.ts`、`exec-reporter.ts`、`exec-pipeline-state.ts` | Register 再開から直接 orchestration を呼ばず、共通の `runStage` API に依存する         |
| `exec-schedule-runner.ts`   | Schedule prepare、claim / block / complete、統合        | pipeline runner、worktree / repo integration                                                                          | CLI 登録を import しない。状態変更は callback または小さな port にする                 |
| `exec-register-runner.ts`   | Register 初回、記帳、wait / review、worktree 統合       | pipeline runner、register modules、worktree / repo integration                                                        | `exec-register-resume.ts` と相互 import しない。resume selector は純粋に target を返す |
| `exec-run-state-machine.ts` | 次段の純粋判定、許可遷移、checkpoint の正規化           | contract 型のみ                                                                                                       | Schedule / Register の副作用 module を import しない                                   |
| `exec-run-command.ts`       | Commander option と各 orchestrator の呼び分け           | Schedule / Register / Job runner                                                                                      | 実装 module から CLI module へ逆 import しない                                         |

特に循環が生じやすい箇所は次の 4 点である。

1. `exec-register-resume.ts` は現在 `exec-pipeline-state.ts` だけに依存する純粋な選択・復元側である。ここへ `runAgentPipeline` を移すと Register orchestration との相互依存になるため、実行は共通 pipeline runner 側に置く。
2. `finalizeRegisterWorktreeRun` は Register transition と汎用 repository 統合の両方を呼ぶ。汎用 integration module が Register module を import すると逆向きになるため、`beforeProjectMerge` など既存 callback 境界を維持する。
3. `PreparedTask`、`RegisterRunContext`、`AgentRunCandidate` などが `exec-run.ts` 内部型のままだと、切り出し先が façade を import して循環する。共有 contract へ先に移す。
4. 既存テストは `exec-run.ts` から複数 helper を import している。呼出元を一度に変更せず、`exec-run.ts` から再 export する façade を移行期間中に残す。

### 4.5. 初回と再開、および実行形態間の重複

| 重複する処理                                                   | 初回側                                                    | 再開側 / 他経路                                                                              | 現状と切り出し方                                                                           |
| -------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| pipeline state 作成・executor の `running` / 完了記録          | `runPreparedTask` 2158-2293、`runAgentPipeline` 4682-4808 | `runInPlaceMode` 3663-3748、executor 再開は `runAgentPipeline` 6561-6579                     | state 作成、executor 実行、evidence 記録を stage runner へ統合する                         |
| reporter の開始、形式 retry、result 描画、状態記録             | `runPreparedTask` 2295-2418、`runInPlaceMode` 3750-3840   | `runReporterStage` 4509-4637、reporter 再開 6627-6643                                        | `runReporterStage` を共通実装にし、Schedule / in-place も呼ぶ                              |
| 親検証の初回追記と再開時 refresh                               | 初回は 2287-2293、4802-4808                               | Schedule reporter 再開 2134-2140、Register integrate 再開 6302-6311、reporter 再開 6617-6624 | `ensureParentValidations(stage, force)` の 1 API にする                                    |
| Register の item / worktree / plan / result / bookkeeping 準備 | 初回 `runSingleRegisterItemWorktree` 5934-6074            | 再開 `resumeSingleRegisterItemWorktree` 6353-6533                                            | `RegisterRunSession` を復元または新規作成する prepare 関数へまとめる                       |
| Register の `start` と root view 再構築                        | 初回 6017-6041                                            | 再開 6424-6453                                                                               | transition port として共通化し、理由だけを入力にする                                       |
| Register の実行後 finalize 呼び出し                            | 初回 6126-6144                                            | integrate 6317-6337、executor 6581-6597、reporter 6645-6662                                  | 呼び出し引数を outcome object にまとめ、1 つの終了経路にする。中核処理自体は既に共通化済み |
| Schedule と Register の commit / merge / cleanup               | Schedule `runPreparedTask` 2421-2701                      | Register `finalizeRegisterWorktreeRun` 5596-5922                                             | 状態遷移はドメイン別のまま、repository integration の共通 port だけを共有する              |

Schedule 再開は `runResumeMode` で `PreparedTask` に `pipelineResumeStage` を埋め、初回と同じ `runPreparedTask` に合流している。Register 再開も executor は `runAgentPipeline`、全段の終了は `finalizeRegisterWorktreeRun` に合流する。この既存の合流点を維持し、合流前の「どこから始めるか」という分岐を純粋な遷移関数へ移すのが安全である。

### 4.6. 現在の状態遷移

`pipeline-state.json` は executor と reporter を必須、integrate を任意で持つ。各段の共通 status は `pending` / `running` / `succeeded` / `failed` / `rate_limited` / `blocked` である。integrate の repository 別状態は `pending` / `merged` / `unchanged` / `failed` である。

| 現在位置  | event / 条件                 | pipeline state                                   | Register item                                            | 次の処理                      |
| --------- | ---------------------------- | ------------------------------------------------ | -------------------------------------------------------- | ----------------------------- |
| 新規      | pipeline 作成                | executor / reporter=`pending`、integrate=未作成  | `start` で `in-progress`                                 | executor                      |
| executor  | 起動                         | executor=`running`、attempt 加算                 | `in-progress`                                            | agent 完了待ち                |
| executor  | 成功                         | executor=`succeeded`、`artifact_ref` に evidence | `in-progress`                                            | 親検証、reporter              |
| executor  | 利用制限 / 保護 block / 失敗 | `rate_limited` / `blocked` / `failed`            | worktree 実行は `waiting`                                | executor 再開または再実行判断 |
| reporter  | 起動                         | reporter=`running`                               | `in-progress`                                            | reporter 完了待ち             |
| reporter  | 成功                         | reporter=`succeeded`、result ref                 | `in-progress`                                            | integrate                     |
| reporter  | 利用制限 / 失敗              | `rate_limited` / `failed`                        | `waiting`                                                | reporter 再開                 |
| integrate | commit / merge 開始          | integrate=`running`、repository=`pending`        | `in-progress`                                            | repository ごとの統合         |
| integrate | repository 成功 / 変更なし   | repository=`merged` / `unchanged`                | `in-progress`                                            | 次 repository または cleanup  |
| integrate | 失敗                         | integrate / repository=`failed`                  | merge 前は `waiting`、merge 済み cleanup 失敗は `review` | integrate 再開                |
| integrate | 成功・cleanup 完了           | integrate=`succeeded`                            | `review`                                                 | 人が確認して close            |

再開対象の選択は `exec-register-resume.ts` が担う。

- executor が `rate_limited` / `blocked`、または evidence のない `running` なら executor から再開する。
- executor が `running` でも有効な evidence があれば `succeeded` として復元し、reporter から再開する。
- executor が `succeeded` で reporter が未成功なら reporter、両方 `succeeded` なら integrate から再開する。
- `--resume-from executor` は reporter 段にいる場合だけ executor へ戻せる。integrate 段から executor へは戻さない。

初回と再開を同じ遷移にまとめる場合は、CLI の `--resume` 自体を別フローにせず、「checkpoint を新規作成するか読み込むか」だけを入口の差にする。

| 統一後の state      | 成功時の次 state                                   | 失敗時の保持        | 実行する副作用                                                     |
| ------------------- | -------------------------------------------------- | ------------------- | ------------------------------------------------------------------ |
| `prepare`           | `executor`                                         | `prepare`           | 新規は plan/result/worktree 作成、再開は artifact 復元と統合先同期 |
| `executor`          | `parent_validation`                                | `executor`          | agent、evidence、attempt 記録                                      |
| `parent_validation` | reporter 有りなら `reporter`、無しなら `integrate` | `parent_validation` | allowlist 検証と evidence 追記                                     |
| `reporter`          | `integrate`                                        | `reporter`          | reporter、result 描画                                              |
| `integrate`         | `cleanup`                                          | `integrate`         | repository ごとの commit / merge、進捗 checkpoint                  |
| `cleanup`           | `done`                                             | `cleanup`           | worktree / branch 撤去、派生 view 再構築                           |
| `done`              | -                                                  | -                   | Schedule complete または Register review                           |

遷移 API は `nextStage(checkpoint, requestedResumeFrom?)` を純粋関数とし、副作用側は `runStage(stage, context)` の outcome を checkpoint へ反映する。初回は空の checkpoint、再開は永続 checkpoint を同じ loop に渡す。最初の切り出しでは現行互換のため executor 再開時の新しい `run_id` 発行を維持し、同一 `run_id` の attempt に統合するかは別判断にする。

### 4.7. 選択肢と推奨案

比較の詳細は [[prj-0001:pjr-q761-exec-run-module-split|PJR-Q761 exec-run.ts の分割方針を決める]] の「検討した選択肢」に記載した。

推奨は選択肢 C「段階的に切り出し、その後に明示的な状態遷移を導入」である。最初の切り出しは次の順にする。

1. `AgentRunCandidate` など共有 contract と、option / agent 選択の純粋 helper を移す。`exec-run.ts` の既存 export は再 export で維持する。
2. `executeAgent` / `runWithRetry` / 保護機構を `exec-agent-runner.ts` へ移す。
3. `runReporterStage` と executor evidence / 親検証処理を `exec-pipeline-runner.ts` へ移し、Schedule と in-place の重複をその API へ寄せる。
4. Register の setup / bookkeeping / finalize / resume と Schedule の prepare / finalize をドメイン別 module へ移す。
5. 既存の checkpoint schema と再開挙動を維持したまま、初回と再開の開始段判定を純粋な状態遷移へ置き換える。
6. 最後に Commander 登録だけを `exec-run-command.ts` へ移し、`exec-run.ts` は互換 façade とする。

振る舞いを変えていないことは、次で確認する。

- 既存 unit: `tests/src/exec-run*.test.ts`、`tests/src/exec-pipeline-state.test.ts`、`tests/src/exec-register-resume.test.ts`。
- 既存 integration: `tests/src/exec-pipeline-e2e.integration.test.ts`、`tests/src/exec-register-pipeline-e2e.integration.test.ts`、`tests/src/exec-task-repos.integration.test.ts`、`tests/src/exec-register-worktree.integration.test.ts`。
- 既存 CLI / in-place: `tests/src/exec-run-inplace.test.ts`、`tests/src/exec-run-lock-command.test.ts`、`tests/src/exec-cycle.integration.test.ts`。
- 追加する characterization test: 初回・executor / reporter / integrate 再開の開始段と遷移列、各段の失敗後 checkpoint、merge 済み cleanup 再開、親検証再実行、`run_id` と attempt の現行互換。
- 追加する構造 test: 下位 module が `exec-run.ts` や CLI module を import しないこと、および既存の `exec-run.ts` export が維持されること。

残課題は、v0.3.0 公開後に PJR-Q761 で案を決定し、実装項目へ分割することである。本調査では決定、コード変更、schema 変更を行っていない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-q761-exec-run-module-split]]（分割方針の決定）
