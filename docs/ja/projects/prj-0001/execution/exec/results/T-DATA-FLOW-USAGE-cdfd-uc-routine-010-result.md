---
specdojo:
  id: prj-0001:xer-t-data-flow-usage-cdfd-uc-routine-010
  type: exec-result
  task_id: T-DATA-FLOW-USAGE-cdfd-uc-routine-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-DATA-FLOW-USAGE-cdfd-uc-routine-010-plan.md
  started_at: "2026-11-01T14:14:54.721Z"
  completed_at: "2026-11-01T14:28:45.706Z"
  agent: sol-executor
  execution: agent
  approach: draft
  targets:
    - cdfd-uc-routine
---

# Edit Result

## 1. 実施内容

- 系統別詳細 CDFD (routine 系) のドラフトを新規作成しました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/010-data-flow/cdfd-uc-routine.md`: routine 系の定期実行判定から Job によるタスク生成・委譲、自動実行、状態更新までのフローを定義するドラフトを新規作成しました。`cdfd-overview` のプロセス領域区分に基づき、3つの D2 図および領域・データストア・引き渡し・例外の各定義表を整備し、Prettier による整形を適用しています。

## 3. 申し送り

- 変更ファイル: docs/ja/product/010-business-specs/010-data-flow/cdfd-uc-routine.md。result は executor/reporter 分担に従って編集していません。
- 進め方と実践の型の適用: cdfd-overview、PJR-SJQC、prj-overview、共通規約、cdfd-uc-rulebook、Mermaid/D2 rulebook、recipe・sample・template を実読しました。template・recipe の箇条書きや横向き指定と最新 rulebook が異なる部分は、rulebook と今回の指示を優先しました。対象ファイルは未作成で、転記すべき `_CONTEXT_` はありません。
- 根拠と範囲: 六領域の ID・名称とデータストア区分を overview から引き継ぎ、入口を P-14 の「PDCA の各サイクルが到来した」としました。Job Run と routine 状態は実行記録に含め、共用領域の内部を複製していません。`based_on` は空配列とし、他成果物は変更していません。
- 補助根拠: docs/ja/product/040-system-design/sysd-job-execution.md、src/routine/routine.ts、src/job/job.ts により、Job 経由の委譲、Run 生成・再利用、事前条件スキップ、試行・結果・checkpoint 記録を確認しました。外部調査や新しい設定値・業務方針の選定は行っていません。
- 未決事項: `stsd-job-run`・`stsd-task-execution` は未作成です。既存の `stsd-routine-run` には一部成功と現行の試行中記録が未反映のため、BA・ARC・QE に状態正本の整備・整合を申し送ります。本文第8章に担当と対応時期を記載しました。
- 未決事項: 中断時の復旧・記録訂正、停止期間の補完範囲、routine 全体の重複起動に対するスキップ方針は既存の未決論点として残しました。PM・OPS・ARC・QE による判断後、fully-guided・finalize で確定してください。親 runner が設定済みの lint・D2・schema・test 等を実行します。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown の新規作成のみで、変更した YAML/YML ファイルがありません。）
- 適用外の検証: `specdojo catalog validate`（変更は docs/ja/product/ 配下のみで、docs/ja/projects/ 配下を変更していません。）

## 4. 進め方と実践の型の適用

cdfd-overview のプロセス領域定義と PJR-SJQC の決定に基づき、routine 系のデータフローを draft として新規作成しました。template および rulebook に準拠しつつ、指示に従い Orchestrator (P-14) を起点とした定期処理の流れを D2 図と表で具体化しています。
