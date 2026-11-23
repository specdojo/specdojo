---
specdojo:
  id: prj-0001:xer-pjr-ef4z-20261123t020148z-5e942a5b
  type: exec-result
  task_id: PJR-EF4Z
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-EF4Z/pjr-ef4z-20261123T020148Z-5e942a5b/plan.md
  started_at: "2026-11-23T02:02:25.579Z"
  completed_at: "2026-11-23T02:12:50.820Z"
  agent: sonnet-executor
  block_reason: "integrate failed: Grade sidecar changed after checkpoint; reconcile before merge: docs/ja/projects/prj-0001/execution/grade/results/specdojo.ifx-api-rulebook.yaml"
---

# Edit Result

## 1. 実施内容

- `specdojo orchestrator integration-tests` と、毎晩 4 時の routine `rtn-nightly-integration-tests`（job は `job-nightly-integration-tests`、ロック待ち 3 時間）を追加した。単体テスト、文書、個票も更新した。統合後の `routine run --id` での確認は orchestrator に残した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/register-operation-guide.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+8 / -0 行
- `src/commands/orchestrator.ts`: 変更、+2 / -0 行
- `docs/ja/projects/prj-0001/jobs/job-nightly-integration-tests.yaml`: 追加、+18 / -0 行
- `docs/ja/projects/prj-0001/routines/rtn-nightly-integration-tests.yaml`: 追加、+18 / -0 行
- `src/commands/nightly-integration-tests.ts`: 追加、+242 / -0 行
- `tests/src/commands/nightly-integration-tests.test.ts`: 追加、+98 / -0 行

## 3. 申し送り

- 統合後に orchestrator が `routine run --id rtn-nightly-integration-tests` を 1 回流して確かめる（個票の作業内容の行 5 は `open` のまま）。
- 方式の決定: 任意シェルの action は足さず、`specdojo orchestrator integration-tests` を新設し、既存の `job` action（`task.steps` と `lock_wait_seconds` 10800 秒）から呼ぶ。時刻は毎晩 4 時（Asia/Tokyo）で、ほかの夜の routine と重ならない。
- CHANGELOG に書く事項: 区分 Added。`specdojo orchestrator integration-tests` を追加し、routine `rtn-nightly-integration-tests` で統合テストの全件を毎晩 1 回流して朝報告へ結果を残すようにした。
- ロック待ち（延期）の単体テストは、既存の job の機構に任せて追加していない。
- 保護された設定の変更は不要だった。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
