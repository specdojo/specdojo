---
specdojo:
  id: prj-0001:xer-pjr-v0fq-20261117t011559z-46db65de
  type: exec-result
  task_id: PJR-V0FQ
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-V0FQ/pjr-v0fq-20261117T011559Z-46db65de/plan.md
  started_at: "2026-11-17T01:17:18.739Z"
  completed_at: "2026-11-17T02:09:36.732Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 逐次実行 Job の実装を確認し、前回失敗したガイド書式と YAML サンプル表示テストを修正しました。設計・標準・個票を更新し、sandbox 内の検証は通過しました。親検証は runner が再実行します。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-job-execution.md`: 変更、+20 / -12 行
- `docs/ja/specdojo/guides/routine-operation-guide.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/standards/job-definition-standard.md`: 変更、+20 / -5 行
- `docs/specdojo/schemas/v1/job-run.schema.yaml`: 変更、+23 / -0 行
- `docs/specdojo/schemas/v1/job.schema.yaml`: 変更、+62 / -1 行
- `src/exec/evidence.ts`: 変更、+8 / -3 行
- `src/exec/run/job.ts`: 変更、+48 / -19 行
- `src/exec/run/lock.ts`: 変更、+36 / -1 行
- `src/exec/run/register-command.ts`: 変更、+5 / -6 行
- `src/exec/run/shared.ts`: 変更、+4 / -0 行
- `src/job/definition.ts`: 変更、+131 / -5 行
- `src/job/job.ts`: 変更、+68 / -4 行
- `tests/src/docs/yaml-pages.test.ts`: 変更、+12 / -1 行
- `tests/src/exec/run/lock.test.ts`: 変更、+22 / -0 行
- `docs/ja/specdojo/guides/job-sequence-guide.md`: 追加、+78 / -0 行
- `docs/ja/specdojo/samples/job-sequence.yaml`: 追加、+68 / -0 行
- `src/exec/run/job-lock.ts`: 追加、+85 / -0 行
- `src/exec/run/job-sequence.ts`: 追加、+157 / -0 行
- `tests/src/exec/job-sequence.integration.test.ts`: 追加、+314 / -0 行
- `tests/src/job/sequence.test.ts`: 追加、+81 / -0 行

## 3. 申し送り

- 既存 command Job の `task.steps` を採用し、入力・冪等キー・attempt・routine を再利用する。定義検証と凍結は job 層、順序制御・排他・evidence は exec 層が担当する。判断と理由は個票の対応結果に記録済み。
- 各段は終了コードと任意の状態ファイルで判定する。失敗・延期後の停止／継続を指定でき、失敗・延期を含む Run は failed に確定する。retry は凍結済み定義で先頭から再実行する。
- 親 runner は指定された lint・型検査・単体／統合テスト・schema 検査を再実行し、その結果を最終根拠にする。result は編集していないため、本報告と個票の対応結果を reporter／runner が反映する。
- 統合後、PJR-JSEY に本項目を加え、実 provider 設定で resume → auto → register → grade の連続実行と同一 Run の retry を確認する。実 agent の起動は利用枠を消費するため sandbox では未実施。
- CHANGELOG 文案（追加）: command Job の `task.steps` で exec・grade・ビルドを順次実行できる。段ごとの停止／継続、状態による完了判定、有限の lock 待機、実行時間上限、attempt ごとの結果・理由・evidence を記録し、routine／cron から起動できる。個票にも記録済み。
- 人の確認が必要: `実 agent による連続実行と retry（統合後の PJR-JSEY）`（実 provider 設定と利用枠を使う確認。個票に後続手順を記録済み。）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
