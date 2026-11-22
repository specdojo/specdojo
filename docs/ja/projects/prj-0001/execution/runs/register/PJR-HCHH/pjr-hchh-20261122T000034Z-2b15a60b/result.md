---
specdojo:
  id: prj-0001:xer-pjr-hchh-20261122t000034z-2b15a60b
  type: exec-result
  task_id: PJR-HCHH
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-HCHH/pjr-hchh-20261122T000034Z-2b15a60b/plan.md
  started_at: "2026-11-22T00:00:35.404Z"
  completed_at: "2026-11-22T00:46:20.540Z"
  agent: qwen-executor
  block_reason: "agent exited with non-zero code: parent validation failed: lint-md"
---

# Edit Result

## 1. 実施内容

- PJR-HCHH: 呼び出し元のなくなった `migrateEmbeddedRegisterEvents`・`migrateRegisterEventsFromGit`、および対応する型、`readEmbeddedRegisterEvents`・`removeEmbeddedRegisterEvents` を削除しました。
- あわせて `src/register/migrate-timestamps.ts` とそのテストファイルを削除しました。
- 個票 `docs/ja/projects/prj-0001/controls/project-register/pjr-hchh-remove-unused-register-migration.md` の作業内容および対応結果を更新しました。

## 2. 変更ファイル

- `src/register/command-types.ts`: 不要になったコマンド型の定義を削除しました。
- `src/register/events.ts`: 不要になったイベント関連の関数（`readEmbeddedRegisterEvents`・`removeEmbeddedRegisterEvents`）を削除しました。
- `src/register/migrate-timestamps.ts`: 削除対象の移行関数を含むファイルを削除しました。
- `src/register/register.ts`: 呼び出し元がなくなった移行関数（`migrateEmbeddedRegisterEvents`・`migrateRegister-events-from-git`）の定義を削除しました。
- `tests/src/register/migrate-timestamps.test.ts`: `src/register/migrate-timestamps.ts` に対応するテストファイルを削除しました。

## 3. 申し送り

- `legacyHistoryEventToRegisterEvent`（`tests/src/register/migrate-events.test.ts`）、`collectRegisterHistoryEvents`（`maintenance-commands.ts` が使用）、`src/exec/core.ts` のイベント型 `note`・`link`・`estimate`（既存のイベントファイル読込用）は使用中のため残した。
- `CHANGELOG.md` は変更していない。個票の `CHANGELOG に書く事項` には「なし」と記載した。

## 4. 進め方

PJR-GV43 の完了に伴い、呼び出し元を失った移行処理一式を特定しました。`src/register/migrate-timestamps.ts` および `src/register/register.ts` 内の関数、それらに関連する型定義を削除し、テストコードも併せて削除することで、プロジェクトから不要な移行ロジックを排除しました。
