---
specdojo:
  id: prj-0001:pjr-2jfm-exec-run-split-modes
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-14T13:49:19Z"
  due_on: null
---

# PJR-2JFM exec-run.ts の schedule・in-place・job の実行モードを分ける

## 1. 概要

src/exec-run.ts のうち、schedule のタスクの実行（prepareSingleTask・runPreparedTask・batch・manual）、in-place の実行、Job の実行をモードごとのモジュールへ移す。動作は変えない

## 2. 完了条件

対象（2026-10-14 時点の宣言の名前。行数は目安）:

- schedule のタスクの実行: `prepareSingleTask`、`runPreparedTask`、`runPreparedTaskSafely`、`runBatchMode`、`runManualMode` と、それらだけが使う補助の関数（約 1,650 行。`runPreparedTask` だけで約 680 行あるため、2 つのモジュールに分けてよい）。
- in-place の実行: `resolveInPlaceCommand`、`spawnAgentInPlace`、`runInPlaceMode` と補助の関数（約 640 行）。
- Job の実行: `runCommandJobMode`、`resolveJobReviewAgents`、`runJobWorktreeMode`、`runJobMode` と補助の関数（約 940 行）。

[[prj-0001:pjr-3w2n-exec-run-split-shared]] の統合の後に行う。

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
| 2   | 対象の宣言をモジュールへ移し、`src/exec-run.ts` から再 export する  | DEV          | done | モード別の 6 モジュールへ移動           |
| 3   | 分割の後の `--help` の出力と比べ、テストと検証を通す                | DEV          | done | 3 コマンドとも差分なし                  |
| 4   | result に、移したものの対応表と残った行数、見つけた改善点を記録する | reporter     | open | reporter stage で記録                   |
| 5   | 統合の後に `exec run --register` を 1 回流して runner を確かめる    | orchestrator | open | close の条件                            |

## 4. 対応結果

Schedule の準備を `src/exec-run-schedule-prepare.ts`、単一タスクの実行を
`src/exec-run-schedule-task.ts`、batch・manual と stale track の再構築を
`src/exec-run-schedule-mode.ts` へ移した。in-place は
`src/exec-run-in-place.ts`、Job は `src/exec-run-job.ts` へ移した。複数のモードと
残存する register 実行から使う CLI 起動・統合記録の補助関数は
`src/exec-run-mode-shared.ts` へ移した。

`src/exec-run.ts` は 6,949 行から 3,531 行になった。新しいモジュールは最大でも
`src/exec-run-job.ts` の 983 行であり、いずれも 1,000 行以下である。分割前後で
`exec run`・`exec cycle`・`exec resume` の `--help` に差分がないことと、公開 export
52 件の名前が一致することを確認した。新しいモジュールから `src/exec-run.ts` への
import はない。

ロジックの改善や不具合修正は行っていない。統合後の runner の実動作確認は、完了条件どおり
orchestrator が [[prj-0001:pjr-jsey-exec-run-split-smoke]] で行う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-3w2n-exec-run-split-shared]]: 段 4 の 1 件目（先に行う）。
- [[prj-0001:pjr-gbpx-exec-run-split-register]]: 段 4 の 3 件目。
