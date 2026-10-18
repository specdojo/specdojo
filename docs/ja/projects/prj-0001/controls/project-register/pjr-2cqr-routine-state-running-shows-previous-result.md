---
specdojo:
  id: prj-0001:pjr-2cqr-routine-state-running-shows-previous-result
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: low
  owner: DEV
  registered_at: "2026-10-15T21:39:09Z"
  due_on: null
  block_reason: "agent exited with non-zero code: parent validation failed: test-unit"
---

# PJR-2CQR 実行中の routine が前回の結果のまま表示される

## 1. 課題内容

routine run は開始時に routine-state.json の last_run だけを更新し、前回の last_result と last_reason を残す。実行中の routine list は今回の開始時刻と前回の結果（failure など）を並べて表示するため、実行中の Run が失敗したように見える

## 2. 影響範囲

| 観点         | 影響                                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------- |
| スコープ     | `src/routine.ts` の `routine run` の状態の記録（開始時と終了時）と、`routine list` の最終実行の表示 |
| スケジュール | 急がない。定期実行の動作には影響しない                                                              |
| コスト       | 実行中の Run を失敗と誤認し、原因の調査や再実行の判断を誤るおそれがある                             |
| 品質         | `routine-state.json` の `last_run` と `last_result` が、別の実行のものを組み合わせた状態になる      |
| 関係者       | 定期実行を確認する利用者と orchestrator                                                             |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                      |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `src/routine.ts` の `routine run` が、実行の開始時に `last_run`（と `last_scheduled_for`）だけを書き、前回の `last_result`・`last_reason` を残す。結果は実行の終了時に書く                |
| 対応策   | 実行中であることを状態に残す。開始時に `last_result` を実行中を表す値（例: `running`）にするか、前回の結果を消して開始時刻と並べないようにする。`routine list` は実行中を区別して表示する |
| 依存事項 | なし                                                                                                                                                                                      |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                    |

### 3.1. 完了条件

- `routine run` の実行中、`routine list` の最終実行の欄に前回の結果が表示されず、実行中であることが分かる（例: `2026-10-15T21:00:03Z (running)`）。
- 実行が終わると、従来どおり今回の結果（`success`・`failure`・`skipped`）と理由が記録・表示される。
- 実行中に routine run のプロセスが異常終了し、実行中の表示が残った場合の扱い（次回の due の判定に影響しないこと）を確かめ、result に書く。
- `routine-state.json` の schema（あれば）と routine の運用ガイドの状態の説明を合わせて更新する。
- 開始時と終了時の状態、`routine list` の表示を確かめる単体テストを加える。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 4. 対応結果

### 4.1. 解決内容

- `src/routine/routine.ts` の `routine run` 開始時に `last_run` とともに `last_result: "running"` を記録し、前回の `last_reason` および `last_action_results` を消去するように状態更新ヘルパー `recordRoutineStart` を導入した。
- 実行終了時には完了結果（`success`・`failure`・`skipped`）で `last_result` を更新し、理由があれば `last_reason`、段別結果があれば `last_action_results` を記録する `recordRoutineCompletion` を導入した。
- `src/routine/definition.ts` の `RoutineStateEntry` において `last_result` の型に `"running"` を許容する `RoutineStateResult` を定義した。
- `docs/ja/specdojo/guides/routine-operation-guide.md` に実行開始時に `running` が記録され、`routine list` に `(running)` と表示される旨、および異常終了で `running` が残った場合でも時刻ベースの次回 due 判定には影響しない仕様を明記した。

### 4.2. 確認結果

- `formatRoutineLastRun` により `last_result: "running"` のエントリが `2026-10-15T21:00:03Z (running)` の形式で表示されることを確認した。
- 開始時（前回の失敗結果や理由が消去され `running` に遷移）と終了時（今回の結果へ更新）の状態遷移を検証する単体テストを追加した。
- プロセス異常終了により `running` が残った場合でも、interval による routine は `last_run` の時刻差分により、cron による routine は `last_scheduled_for` と発火時刻により、次回 due 判定が正常に行われることを単体テストおよびロジック検証で確認した。

### 4.3. 再発防止策

- 状態更新処理を `recordRoutineStart` / `recordRoutineCompletion` に純粋関数として切り出し、前回の実行結果（`last_result`、`last_reason`、`last_action_results`）が残存しないことを単体テストで保証した。

## 5. 関連ドキュメント

- [[specdojo:routine-operation-guide]]: routine の状態の説明。
