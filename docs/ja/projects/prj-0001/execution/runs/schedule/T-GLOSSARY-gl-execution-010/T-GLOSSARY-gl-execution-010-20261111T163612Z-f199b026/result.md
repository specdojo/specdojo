---
specdojo:
  id: prj-0001:xer-t-glossary-gl-execution-010-20261111t163612z-f199b026
  type: exec-result
  task_id: T-GLOSSARY-gl-execution-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-GLOSSARY-gl-execution-010/T-GLOSSARY-gl-execution-010-20261111T163612Z-f199b026/plan.md
  started_at: "2026-11-11T16:36:13.485Z"
  completed_at: "2026-11-11T16:52:19.739Z"
  agent: sol-executor
  execution: agent
  approach: retrofit
  targets:
    - gl-execution
---

# Edit Result

## 1. 実施内容

- 用語集（実行）を `draft` ステータスで新設し、37 用語の定義、英語名、別名、分類、関連用語、出典を記述した。
- 実装エビデンスとして指定された 5 件の schema ファイル (`exec-common.schema.yaml`, `exec-evidence.schema.yaml`, `pipeline-state.schema.yaml`, `job.schema.yaml`, `routine.schema.yaml`) をすべて参照し、現在動作と意図された仕様を照合して反映した。
- 共通用語集で定義済みの用語（`task`, `plan`, `result` 等）は再定義せず参照とし、分類および関連用語のローカル参照は rulebook の基準に従い同一ファイル内の ID に限定した。
- 実装と文書間の乖離として、Job および routine の action 定義に関する記述不整合を確認したが、本タスクの範囲外であるため成果物への反映は見送り、後続の review finding 候補とした。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/060-glossary/gl-execution.yaml`: 用語集（実行）を新規作成し、37 用語の定義およびメタデータを記載した。

## 3. 申し送り

- 判断は「新設」。対象の `docs/ja/product/010-business-specs/060-glossary/gl-execution.yaml` が存在せず、カタログに配置先と完了条件が定義されていたため。変更はこの成果物のみ。共通用語集の task・plan・result・event・evidence・trial・routine・job は再定義せず参照した。分類と関連用語は rulebook に従い同一ファイル内の ID に限定した。
- 実際に参照した実装エビデンス: `docs/specdojo/schemas/v1/exec-common.schema.yaml`。`TaskOrigin` は schedule・register・job、`TaskMode` は edit・review を定義する。起点ごとの範囲・状態管理と既存仕様の一致を反映した。ただし、カタログの参照目的にあるタスク状態・event の定義はこの schema に含まれず、実装から確認不能と分類した。状態と claim 等の操作は既存の [[prj-0001:stsd-task-execution|ステータス定義（タスク実行）]]・[[clis-exec-commands|CLI仕様（exec コマンド群）]] を根拠として記述した。後続調査では状態・event の実装根拠をカタログへ追加する候補を確認する。
- 実際に参照した実装エビデンス: `docs/specdojo/schemas/v1/exec-evidence.schema.yaml`。executor のプロセス結果と `completion_status`、検査の発行元・適用外理由、`target_coverage`・`attempt_changes`・`handoff`、種類によって異なるログ量の制約を確認した。既存機能仕様・承認済み記録との一致を反映し、作業完了申告・タスク完了・文書成熟度を区別した。条件式と数値上限は転載せず schema 参照にした。
- 実際に参照した実装エビデンス: `docs/specdojo/schemas/v1/pipeline-state.schema.yaml`。executor・reporter と省略可能な integrate、段ごとの進捗・試行・成果参照、リポジトリ別統合結果、`branch-only`、再開で使う `integration_branches` を確認した。既存仕様と一致する責務境界を反映した。親検証は独立した段として `stages` に定義されていないことも区別した。
- 実際に参照した実装エビデンス: `docs/specdojo/schemas/v1/job.schema.yaml`。agent 委譲と command の種類別項目、reporter 指名による pipeline、入力型別の値域、事前判定・結果分析・統合前レビュー、冪等キー・checkpoint を確認した。種類と用途の関係を短く記述し、条件の正本を schema とした。Job Run の結果選択・再試行の動作確認は行っていない。
- 実際に参照した実装エビデンス: `docs/specdojo/schemas/v1/routine.schema.yaml`。interval と cron・timezone の起動条件、単一または配列の action、job と specdojo の種類別項目、機会処理方針、互換用途の commit と Job のレビュー宣言の優先関係を確認した。直接アクションは [[prj-0001:pjr-2jye-dashboard-daily-briefing|dashboard 更新用の直接アクションの決定記録]] と一致し、用語集へ反映した。
- 未反映の文書乖離: [[sysd-job-execution|Job実行設計]] 冒頭と [[specdojo:routine-operation-guide|routine運用ガイド]] の一部には action を job のみとする古い説明が残る。schema と承認済みの PJR-2JYE は specdojo の直接アクションを認めているため、文書側を整合させる後続 review finding 候補とする。本タスクの変更範囲外なので編集していない。
- 既存の未決事項を維持: routine の `policy.overlap: skip` と、[[stsd-routine-run|ステータス定義（定期処理の実行結果）]] が記す lock 取得失敗時の停止との関係は同文書の M-02 に残る。用語集では必ずスキップ結果が記録されるとは定義していない。実装・文書のどちらを変更するかは PO・ARC の判断対象。
- 指定された実装エビデンス5件はすべて存在し、実際に参照した。列挙外のコードは実装根拠として追加していない。schema が許容する形式の確認と実行時の動作確認は区別しており、状態遷移・権限・排他制御・due 判定・再試行・Git 統合・外部 agent の実動作は未確認。実装コードや保護設定は変更していない。
- reporter 向け: 本 handoff の判断・照合結果・未確認範囲を result へ反映すること。executor stage の指示に従い result は作成・更新していない。親検証に指定されたコマンドは実行せず runner に委ねた。検証用の一時スクリプトは削除済み。
- 適用外の検証: `node --import tsx tools/catalog-validate-if-configured.mjs`（executor の変更は docs/ja/product/ 配下の用語集のみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（executor は登録簿個票および既存の plan・result を変更していない。）

## 4. 進め方と実践の型の適用

retrofit
