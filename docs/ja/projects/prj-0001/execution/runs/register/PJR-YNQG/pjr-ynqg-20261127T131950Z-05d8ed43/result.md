---
specdojo:
  id: prj-0001:xer-pjr-ynqg-20261127t131950z-05d8ed43
  type: exec-result
  task_id: PJR-YNQG
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-YNQG/pjr-ynqg-20261127T131950Z-05d8ed43/plan.md
  started_at: "2026-11-27T13:19:59.118Z"
  completed_at: "2026-11-27T13:41:41.866Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 診断 agent の設定選択・重複防止・夜間回数制限・時間制限・朝報告への転記を実装し、偽 agent の統合テスト、schema、関連文書、個票を更新した。executor の検査は成功。親検証は runner に委ねる。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-job-execution.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/guides/exec-config-guide.md`: 変更、+16 / -0 行
- `docs/ja/specdojo/guides/register-operation-guide.md`: 変更、+10 / -0 行
- `docs/ja/specdojo/guides/routine-operation-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+5 / -2 行
- `docs/specdojo/schemas/v1/exec-defaults.schema.yaml`: 変更、+18 / -0 行
- `src/commands/watch-scan.ts`: 変更、+35 / -8 行
- `src/exec/watch-remedy.ts`: 変更、+5 / -0 行
- `tests/docs/specdojo/schemas/exec-defaults-schema.test.ts`: 変更、+19 / -0 行
- `src/exec/watch-diagnosis.ts`: 追加、+241 / -0 行
- `tests/src/commands/watch-diagnosis.integration.test.ts`: 追加、+273 / -0 行

## 3. 申し送り

- agent は読み取りと標準出力への案の返却だけを担当し、朝報告への書き込みは見張りが代行する方式を採用した。書き込み権限を agent に与えずに済むため。1 晩は日付変更をまたぐ正午〜翌正午、既定は3回・300秒とし、同じ止まりは失敗後や翌晩も再依頼しない。
- 保護された設定の変更案は個票の5.2節に記載した。`watch.diagnosis.by`、`max_per_night`、`timeout_seconds` と診断専用の review member を設定する。provider ごとの読み取り専用設定を適用・確認するまで有効化しない。通常の review 設定にも書き込み許可があるため流用しない。
- 親 runner が型検査・lint・unit/integration/docs テスト・全体 schema 検査を実行する。executor では重複実行していない。result は reporter が記入する。
- 統合後に orchestrator が build、PJR-YNQG を対象にした exec smoke、実際の見張り routine 1回を実行し、診断案・権限制限・状態変更がないことを確認してから close する。個票の該当行は理由付きで open のまま残した。CHANGELOG の文案は5.4節に記載済み。
- 人の確認が必要: `npx specdojo exec smoke --project prj-0001 --register PJR-JSEY --targets PJR-YNQG --executor-by claude-executor --reporter-by gemma26-reporter`（統合後のホスト操作と実agent起動が必要。orchestratorが確認してからcloseする。）
- 人の確認が必要: `npx specdojo routine run --project prj-0001 --id rtn-exec-watch-scan`（統合後、承認済みの診断専用権限設定を用意して実routineを1回確認する。）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
