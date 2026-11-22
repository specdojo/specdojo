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
  completed_at: "2026-11-22T00:34:28.988Z"
  agent: qwen-executor
  block_reason: "parent validation failed: lint-md"
---

# Edit Result

## 1. 実施内容

- PJR-HCHH に基づき、呼び出し元がなくなった `migrateEmbeddedRegisterEvents` および `migrateRegisterEventsFromGit` を含む関連コードの削除を実施した。
- 削除対象には、`src/register/migrate-timestamps.ts`、およびそれに関連する型や関数（`readEmbeddedRegisterEvents`、`removeEmbeddedRegisterEvents` など）が含まれる。
- また、対応するテストファイル `tests/src/register/migrate-timestamps.test.ts` も削除した。
- 個票 `docs/ja/projects/prj-0001/controls/project-register/pjr-hchh-remove-unused-register-migration.md` の作業内容および対応結果を更新した。

## 2. 変更ファイル

- `src/register/command-types.ts`: 不要になったコマンドに関連する型定義を削除した。
- `src/register/events.ts`: 不要になった `readEmbeddedRegisterEvents` および `removeEmbeddedRegisterEvents` を削除した。
- `src/register/migrate-timestamps.ts`: 削除、+0 / -264 行
- `src/register/register.ts`: 不要になった `migrateEmbeddedRegisterEvents` および `migrateRegisterEventsFromGit` を削除した。
- `tests/src/register/migrate-timestamps.test.ts`: `src/register/migrate-timestamps.ts` の削除に伴い、対応するテストファイルを削除した。

## 3. 申し送り

- `legacyHistoryEventToRegisterEvent`（`tests/src/register/migrate-events.test.ts`）、`collectRegisterHistoryEvents`（`maintenance-commands.ts` が使用）、`src/exec/core.ts` のイベント型 `note`・`link`・`estimate`（既存のイベントファイル読込用）は使用中のため残した。
- `CHANGELOG.md` は変更していない。個票の `CHANGELOG に書く事項` には「なし」と記載した。

## 4. 進め方

まず `grep` を用いて `migrate-timestamps` に関連する参照が残っていないことを確認した。その後、対象の移行関数 `migrateEmbeddedRegisterEvents`、`migrateRegisterEventsFromGit`、およびそれに関連するユーティリティ関数、型定義、テストファイルを削除した。最後に個票のステータスと内容を更新して完了とした。
