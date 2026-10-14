---
specdojo:
  id: prj-0001:pjr-3w2n-exec-run-split-shared
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-14T13:49:03Z"
  due_on: null
---

# PJR-3W2N exec-run.ts の共通部と agent の pipeline を分ける

## 1. 概要

src/exec-run.ts（8,584 行）のうち、実行モードに共通の型・agent の解決・worker pool・再試行と、executor / reporter の pipeline（runAgentPipeline・runReporterStage）を別のモジュールへ移す。動作は変えない

## 2. 完了条件

対象（2026-10-14 時点の宣言の名前。行数は目安）:

- 実行モードに共通の型と処理: `RunOpts` などの型、`resolveAgentOverride`、`runCompletionDrivenWorkerPool`、`buildTaskPhaseMap`、`selectCandidates`、`withProjectExecRunLock`、`executorEvidenceContract`、`resolveReporterAgentCandidates`、`executeAgent`、`runWithRetry` と、それらだけが使う補助の関数（ファイルの先頭から約 1,600 行）。
- executor / reporter の pipeline: `runReporterStage`、`runAgentPipeline`、`refreshParentValidationsForReporterResume` と、それらだけが使う補助の関数（約 500 行）。

段 4 の 1 件目であり、後続の [[prj-0001:pjr-2jfm-exec-run-split-modes]] と [[prj-0001:pjr-gbpx-exec-run-split-register]] は、本件で切り出した共通部を import する形で進める。

共通の条件（リファクタリングの段取りの共通の完了条件。PJR-QCMP の結果を見て調整する）:

- 移すだけにし、ロジックは変えない。分割の途中で不具合や改善点を見つけても直さず、result に書く。
- `src/exec-run.ts` が現在 export しているものは、すべて同じ名前で `src/exec-run.ts` から import できる（移した先から再 export する）。既存のテストは import のパスを含めて変更せずに通る。テストの追加は妨げない。
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
| 1   | 分割の前の `--help` の出力を `tmp/` に保存する                      | DEV          | open | `exec run`・`exec cycle`・`exec resume` |
| 2   | 対象の宣言をモジュールへ移し、`src/exec-run.ts` から再 export する  | DEV          | open | 移すだけ                                |
| 3   | 分割の後の `--help` の出力と比べ、テストと検証を通す                | DEV          | open | 差分なし                                |
| 4   | result に、移したものの対応表と残った行数、見つけた改善点を記録する | DEV          | open | -                                       |
| 5   | 統合の後に `exec run --register` を 1 回流して runner を確かめる    | orchestrator | open | close の条件                            |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-2jfm-exec-run-split-modes]]: 段 4 の 2 件目。
- [[prj-0001:pjr-gbpx-exec-run-split-register]]: 段 4 の 3 件目。
- [[prj-0001:pjr-qcmp-register-commands-split]]: 共通の完了条件を試した段 2。
