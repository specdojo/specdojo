---
specdojo:
  id: prj-0001:xer-t-data-flow-cdfd-routine-010
  type: exec-result
  task_id: T-DATA-FLOW-cdfd-routine-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-DATA-FLOW-cdfd-routine-010-plan.md
  started_at: "2026-08-09T21:25:13.486Z"
  completed_at: "2026-08-09T21:34:58.737Z"
  agent: codex-expert-edit-agent
  execution: agent
  approach: retrofit
  targets:
    - prj-0001:cdfd-routine
---

# Edit Result

## 1. 実施内容

- 対象成果物が存在しないことを確認し、`P-05 定期運用` の領域別 CDFD として新設した。
- 依存成果物、全体概要、プロジェクト概要、成果物カタログの done criteria、CDFD の構造・Mermaid 記法 rulebook を照合し、定期運用の利用者、対象範囲、委譲境界、受入条件を整理した。
- 指定された3つの実装エビデンスを読み、routine の定義選択・due 判定・状態更新、登録項目と Schedule task への委譲、exec-cycle の順次制御、Job Run の生成・重複判定・result / checkpoint 更新を表と図へ反映した。
- project busy、対象なし、利用制限、cycle step 別失敗、再開時刻待ち、重複 Job Run、cron の取りこぼし、Job failure、状態更新途中の例外について、記録内容と次回判定を主要例外として定義した。
- 実装と意図仕様の一致を成果物へ反映し、承認根拠を確認できない差異は未決事項として分離した。成果物の `status` は `draft` とした。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/010-data-flow/cdfd-routine.md`（新規）
- `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-routine-010-result.md`（本 result）

## 3. 申し送り

- `policy.overlap: skip` は routine 定義として受理されるが、現在の routine 全体 lock は重複起動を skip として返さず異常終了する。意図する運用を PM・ARC・QE が確認し、文書に合わせて実装を変更するか、許容値・用語を現在動作に合わせるかを後続 review finding または PJR 候補として判断する必要がある。
- routine は委譲前に `last_run` と cron の `last_scheduled_for` を書き、通常の返却後に `last_result` を書く。途中の想定外例外では新しい試行時刻と古いまたは未記録の結果が併存し得るため、attempt の識別、状態訂正、または原子的更新の要否を PM・ARC・QE が判断する必要がある。
- Job の完了処理は `noop` とその checkpoint 更新を扱えるが、今回確認した routine からの Job 実行経路には `noop` の判定条件がない。Job 利用例を定義するときに、変更なしを `succeeded` とするか `noop` とするかを Job owner・BA・QE が決める必要がある。
- `catalog validate` の既存警告は、ほかの成果物カタログに記載された未作成文書に関するものであり、本タスクの対象外として変更していない。

## 4. 進め方と実践の型の適用

### 4.1. 参照した意図仕様と実践の型

- `docs/ja/product/010-business-specs/010-data-flow/cdfd-register-operation.md`: 個票 Frontmatter を登録項目の正本とし、Agent 成功を `review`、失敗を `waiting` へ渡す境界を確認した。
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-task-execution.md`: Ready task、自動実行、project busy、deferred limit の再開、task event・result 更新、および `P-05` との委譲境界を確認した。
- `docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md`: `P-05` を「時期・条件に基づいて継続作業を起動する」領域とし、個々の task 処理を `P-04`、複数実行の分離を `P-06` へ委譲する全体境界を確認した。`cdfd-overview` は `based_on` へ直接追加せず、本文で引き継ぐ境界だけを反映した。
- `docs/ja/projects/prj-0001/020-project-definition/prj-overview.md`: 人と AI Agent が同じ正本を参照できること、判断・作業を共有して継承可能にすること、主要判断は人間が担うことを利用者・未決事項の記述へ反映した。プロジェクトコンテキストは `based_on` へ転記していない。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-flow.yaml`: routine、register / Schedule、cycle、Job の正常経路と、busy・対象なし・利用制限・重複・取りこぼし後の記録を表と図で確認できることを完了条件として適用した。
- `docs/ja/specdojo/rulebooks/cdfd-rulebook.md`: 目的と適用範囲、領域内プロセス一覧、概念データフロー、主要例外・委譲、受入確認、未決事項の構成と、一ノード一プロセスの境界を適用した。
- `docs/ja/specdojo/rulebooks/cdfd-mermaid-rulebook.md`: 領域内 `flowchart TB`、プロセス・イベント・データストア・外部主体の形状、全エッジの名詞ラベル、凡例を適用した。

recipe / sample / template は plan で指定されておらず、`cdfd-rulebook` とその includes で本文構造・記法が完結していたため使用していない。

### 4.2. 実装エビデンスと抽出した現在動作

| 実装エビデンス    | 抽出した現在動作                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/routine.ts`  | `rtn-*.yaml` は interval または cron / timezone の一方、action kind、filter、limit、strategy、parallel、loop、Job 入力を検証する。due 一括実行は enabled な定義を選び、interval は `last_run`、cron は `last_scheduled_for` と `missed_run` から occurrence を求める。register は個票から実行可能 type・status・priority を選び、ID 昇順と limit を適用する。委譲前に `last_run` と必要時の `last_scheduled_for`、通常返却後に `last_result` を記録する。project busy の特殊終了を `skipped` として扱う |
| `src/exec-run.ts` | project 単位 lock の busy policy は skip / wait / fail である。exec-cycle は同一 lock 内で due deferred-limit task の resume、doc index、Schedule validate / refresh、Ready task auto の順に実行する。resume 失敗後は継続し、index / validate / refresh 失敗では auto を中止し、実行済み step の失敗を終了結果へ集約する。利用制限は block event に再開時刻・試行回数・worktree を残し、due 時に排他的に unblock する。Job Run は in-place で実行し、未記入 result を失敗として Job Run へ反映する      |
| `src/job.ts`      | Job Definition は入力、task、idempotency key、任意 checkpoint を検証する。入力は指定値、checkpoint、Git HEAD、default から解決し、idempotency key の hash から Run ID を作る。完了済みの同一 Run は重複完了として再実行せず、未完了・失敗済み Run は attempt を追加する。成功・noop の許可条件で checkpoint を更新し、Run 履歴から最新 checkpoint を再導出できる                                                                                                                                        |

### 4.3. 照合分類と反映判断

| 分類             | 照合結果                                                                                                                                                                                        | 対応                                                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 一致             | 全体概要の `P-05`、依存成果物の register / Schedule 境界、DCT の action・cycle・Job・例外観点は、確認した現在動作と大枠で一致した                                                               | 8プロセス、action / due / 結果記録の補足表、Mermaid 図、10例外、委譲・受入条件として成果物へ反映した                                                   |
| 乖離             | 定義は `policy.overlap: skip` だけを許可するが、routine 全体 lock の重複は skip 結果ではなく異常終了する                                                                                        | 現在動作を例外表へ記録し、意図を推測せず `_UNDECIDED_` と申し送りへ分離した。候補は実装を skip に変更するか、定義の policy・用語を実動作に合わせること |
| 実装から確認不能 | `noop` の業務判定条件、定期運用定義を新設・変更・停止する承認者、途中例外時の routine 状態訂正方針は指定実装から確認できない                                                                    | 確定仕様へせず、影響と決定者を未決事項へ記録した                                                                                                       |
| 未確認           | 外部スケジューラの再試行・監視設定、指定3ファイルから委譲される register / Schedule / lock / index 各モジュールの内部分岐、実際の `rtn-*.yaml` / `job-*.yaml` 利用定義は evidence_refs 外である | 列挙外コードや利用例を根拠へ追加せず、依存成果物が定める領域境界と、指定実装から確認できる入出力だけを記述した                                         |

対象成果物は存在しなかったため、判断は **新設** とした。成果物カタログに path と done criteria があり、`cdfd-rulebook` に標準構造があることを根拠とする。既存成果物の status や記述を置き換える作業はない。

### 4.4. 整形・静的検査

- `npx prettier --write docs/ja/product/010-business-specs/010-data-flow/cdfd-routine.md docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-routine-010-result.md`: 成功。
- `npx markdownlint docs/ja/product/010-business-specs/010-data-flow/cdfd-routine.md docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-routine-010-result.md`: 成功。
- `npx tsx src/specdojo.ts catalog validate`: tsx の IPC socket 作成が sandbox の `EPERM` で起動前に失敗した。
- `node --import tsx src/specdojo.ts catalog validate`: 成功。全 DCT が `OK`。未作成の他成果物に関する既存警告のみで、本成果物の `based_on`・path・ID にエラーはない。
- `node --import tsx src/specdojo.ts index build`: 成功。doc index を1031件で再生成した。
- `git diff --check`: 成功。空白エラーなし。
