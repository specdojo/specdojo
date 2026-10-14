---
specdojo:
  id: prj-0001:pjr-3w2n-exec-run-split-shared
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-14T13:49:03Z"
  due_on: null
  completed_at: "2026-10-14T15:19:05Z"
  conclusion: exec-run.ts の共通部を exec-run-shared・exec-run-agent、pipeline を exec-run-agent-pipeline へ移し、exec-run.ts は 8,584 行から 6,949 行になった。--help と export は分割の前後で一致し、分割後の runner で PJR-JSEY が統合まで通った
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
- `src/exec-run.ts` が現在 export しているものは、すべて同じ名前で `src/exec-run.ts` から import できる（移した先から再 export する）。既存のテストは import のパスを含めて変更せずに通る。テストの追加は妨げない。再 export は `export *` を使わず、分割の前に `src/exec-run.ts` が export していた名前だけを明示的に再 export する（PJR-K6KB では `export *` で内部用の関数まで公開された）。
- 分割の前後で、`exec run`・`exec cycle`・`exec resume` の `--help` の出力が一致する。前後の出力を `tmp/` に保存して比べ、比べたコマンドの一覧と差分がないことを result に記録する。
- 新しく作るモジュールはそれぞれ 1,000 行以下を目安とする。1 つの関数が大きいなどで超える場合は、理由を result に書く。関数の中身の分割は本件では行わない。
- 新しい循環 import を作らない。移した先のモジュールから `src/exec-run.ts` を import しない。
- ファイル名は既存の `src/exec-*.ts` の命名に揃え、`exec-run-` で始める。
- モジュールの構成に触れている設計書（[[sysd-index]] など）があれば更新する。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- 本件は runner 自身のコードを変えるため、統合の後に orchestrator が小さな `exec run --register` を 1 回流し、統合まで終わることを確かめる（本件の close の条件）。

## 3. 作業内容

| No  | 作業                                                                | 担当         | 状態  | メモ                                    |
| --- | ------------------------------------------------------------------- | ------------ | ----- | --------------------------------------- |
| 1   | 分割の前の `--help` の出力を `tmp/` に保存する                      | DEV          | done  | `exec run`・`exec cycle`・`exec resume` |
| 2   | 対象の宣言をモジュールへ移し、`src/exec-run.ts` から再 export する  | DEV          | done  | 3 モジュールへ分割                      |
| 3   | 分割の後の `--help` の出力と比べ、テストと検証を通す                | DEV          | doing | help 差分なし、親検証待ち               |
| 4   | result に、移したものの対応表と残った行数、見つけた改善点を記録する | DEV          | open  | reporter が記録する                     |
| 5   | 統合の後に `exec run --register` を 1 回流して runner を確かめる    | orchestrator | open  | close の条件                            |

## 4. 対応結果

- `src/exec-run-shared.ts` を追加し、`RunOpts` などの共通型、agent override と候補選択、completion-driven worker pool、task phase 解決、exec run lock の共通処理を移した。
- `src/exec-run-agent.ts` を追加し、executor prompt と evidence 契約、親検証の呼び出し、reporter 候補解決、agent 起動・再試行、worktree 向け環境構築を移した。
- `src/exec-run-agent-pipeline.ts` を追加し、`runAgentPipeline`、`runReporterStage`、`refreshParentValidationsForReporterResume` を移した。新規 3 モジュールはいずれも `src/exec-run.ts` を import しない。
- `src/exec-run.ts` の既存 export 52 件は、`export *` を使わず同じ名前で明示的に再 export した。分割前後で export 名の追加・削除がないことを確認した。
- `exec run`、`exec cycle`、`exec resume` の `--help` を分割前後で比較し、3 コマンドとも差分がないことを確認した。
- 実装モジュールの参照先を `sysd-index`、`sysd-critical-flows`、`sysd-antigravity-agent-settings` で更新した。
- 整形後の行数は `src/exec-run.ts` が 6,949 行、`src/exec-run-shared.ts` が 633 行、`src/exec-run-agent.ts` が 768 行、`src/exec-run-agent-pipeline.ts` が 430 行である。
- ロジックの変更や、今回の分割と同時に直すべき不具合・改善点は見つからなかった。親検証は executor 終了後に runner が実行し、統合後の `exec run --register` による確認は orchestrator が行う。

## 5. 関連ドキュメント

- [[prj-0001:pjr-2jfm-exec-run-split-modes]]: 段 4 の 2 件目。
- [[prj-0001:pjr-gbpx-exec-run-split-register]]: 段 4 の 3 件目。
- [[prj-0001:pjr-qcmp-register-commands-split]]: 共通の完了条件を試した段 2。
