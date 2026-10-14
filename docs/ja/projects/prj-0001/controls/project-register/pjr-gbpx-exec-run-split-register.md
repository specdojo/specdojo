---
specdojo:
  id: prj-0001:pjr-gbpx-exec-run-split-register
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-14T13:49:29Z"
  due_on: null
  completed_at: "2026-10-14T17:50:08Z"
  conclusion: register の実行を core・state・mode・worktree・resume・command の 6 モジュール、run・cycle・resume のコマンドの登録を lifecycle-commands へ移し、exec-run.ts は 66 行の再 export になった。--help と export は分割の前後で一致し、分割後の runner で PJR-JSEY が統合まで通った
---

# PJR-GBPX exec-run.ts の register の実行とコマンドの登録を分ける

## 1. 概要

src/exec-run.ts のうち、register の実行（worktree での実行・統合・再開）と、run・cycle・resume のコマンドの登録を別のモジュールへ移す。動作は変えない

## 2. 完了条件

対象（2026-10-14 時点の宣言の名前。行数は目安）:

- register の実行: `parseRegisterExecutorSelection`、`resolveRegisterPipelineCommand`、`autoSelectRegisterPipelineAgents`、`runSingleRegisterItem`、`commitRegisterState`、`registerWaitSummary`、`syncExecBranchAfterWait`、`runRegisterMode` と補助の関数。worktree での実行と統合・再開（`finalizeRegisterWorktreeRun`、`runSingleRegisterItemWorktree`、`resumeRegisterIntegration`、`resumeSingleRegisterItemWorktree`）は別のモジュールに分けてよい（合わせて約 2,100 行）。
- コマンドの登録と cycle・resume: `registerRunCommand`、`rebuildStaleGeneratedTracksForCycle`、`runCycleMode`、`registerCycleCommand`、`prepareScheduleIntegrationResume`、`runResumeMode`、`registerResumeCommand`（約 1,050 行）。

[[prj-0001:pjr-2jfm-exec-run-split-modes]] の統合の後に行う。本件の後、`src/exec-run.ts` は再 export と、どこにも移さなかった小さな宣言だけになる想定である。

共通の条件（リファクタリングの段取りの共通の完了条件。PJR-QCMP の結果を見て調整する）:

- 移すだけにし、ロジックは変えない。分割の途中で不具合や改善点を見つけても直さず、result に書く。
- `src/exec-run.ts` が現在 export しているものは、すべて同じ名前で `src/exec-run.ts` から import できる（移した先から再 export する）。既存のテストは import のパスを含めて変更せずに通る。テストの追加は妨げない。再 export は `export *` を使わず、分割の前に `src/exec-run.ts` が export していた名前だけを明示的に再 export する（PJR-K6KB では `export *` で内部用の関数まで公開された）。
- 分割の前後で、`exec run`・`exec cycle`・`exec resume` の `--help` の出力が一致する。前後の出力を `tmp/` に保存して比べ、比べたコマンドの一覧と差分がないことを result に記録する。
- 新しく作るモジュールはそれぞれ 1,000 行以下を目安とする。1 つの関数が大きいなどで超える場合は、理由を result に書く。関数の中身の分割は本件では行わない。
- 新しい循環 import を作らない。移した先のモジュールから `src/exec-run.ts` を import しない。
- ファイル名は既存の `src/exec-*.ts` の命名に揃え、`exec-run-` で始める。
- モジュールの構成に触れている設計書（[[sysd-index]] など）があれば更新する。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- 本件は runner 自身のコードを変えるため、統合の後に orchestrator が小さな `exec run --register` を 1 回流し、統合まで終わることを確かめる（本件の close の条件）。

## 3. 作業内容

| No  | 作業                                                                | 担当         | 状態 | メモ                                    |
| --- | ------------------------------------------------------------------- | ------------ | ---- | --------------------------------------- |
| 1   | 分割の前の `--help` の出力を `tmp/` に保存する                      | DEV          | done | `exec run`・`exec cycle`・`exec resume` |
| 2   | 対象の宣言をモジュールへ移し、`src/exec-run.ts` から再 export する  | DEV          | done | register 系 7 モジュールへ移動          |
| 3   | 分割の後の `--help` の出力と比べ、テストと検証を通す                | DEV          | done | 3 コマンドとも差分なし                  |
| 4   | result に、移したものの対応表と残った行数、見つけた改善点を記録する | reporter     | open | reporter stage で記録                   |
| 5   | 統合の後に `exec run --register` を 1 回流して runner を確かめる    | orchestrator | open | close の条件                            |

## 4. 対応結果

register の選択・in-place 実行を `src/exec-run-register-core.ts`、状態記帳を
`src/exec-run-register-state.ts`、worktree 実行・統合を
`src/exec-run-register-worktree.ts`、再開を `src/exec-run-register-resume.ts`、複数項目の
実行制御を `src/exec-run-register-mode.ts` へ移した。run コマンドの登録は
`src/exec-run-register-command.ts`、slots・cycle・resume の実行とコマンド登録は
`src/exec-run-lifecycle-commands.ts` へ移した。

`src/exec-run.ts` は 3,531 行から 66 行になり、既存の公開名だけを明示的に再 export する
façade とした。新しいモジュールは最大でも `src/exec-run-lifecycle-commands.ts` の 710 行で、
すべて 1,000 行以下である。新しいモジュールから `src/exec-run.ts` への import と、新しい循環
import はない。分割前後で `exec run`・`exec cycle`・`exec resume` の `--help` に差分がなく、
公開 export の名前も一致することを確認した。

ロジックの改善や不具合修正は行っていない。統合後の runner の実動作確認は、完了条件どおり
orchestrator が [[prj-0001:pjr-jsey-exec-run-split-smoke]] で行う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-2jfm-exec-run-split-modes]]: 段 4 の 2 件目（先に行う）。
- [[prj-0001:pjr-th4b-eslint-max-lines-guard]]: 分割後の行数の上限。
