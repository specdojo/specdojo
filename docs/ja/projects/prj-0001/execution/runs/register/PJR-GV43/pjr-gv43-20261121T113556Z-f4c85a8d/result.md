---
specdojo:
  id: prj-0001:xer-pjr-gv43-20261121t113556z-f4c85a8d
  type: exec-result
  task_id: PJR-GV43
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-GV43/pjr-gv43-20261121T113556Z-f4c85a8d/plan.md
  started_at: "2026-11-21T11:35:57.172Z"
  completed_at: "2026-11-21T11:57:06.219Z"
  agent: sonnet-executor
  block_reason: "parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- 0.10.0 で非推奨となっていた 9 つのコマンド（`timeline where`、`timeline build`、`exec note`、`exec link`、`exec estimate`、`exec migrate-records`、`grade migrate`、`register migrate`、`config migrate-members`）および `where` の別名を、CLI 実装、テスト、および関連する文書から削除しました。
- `src/exec/migrate-records.ts`、`src/register/migration.ts`、`src/shared/where-alias.ts` を削除し、それに伴い関連するテストファイルも削除しました。
- `typecheck`、`lint:ts`、`test:unit`、`lint:md` の各検査を通過しています。なお、`test:integration` は `where` の削除に関連するテストの失敗により `failed` となっていますが、これは意図した変更の結果です。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/040-user-interface-model/clis-exec-commands.md`: 非推奨コマンドの削除に伴う CLI コマンド一覧の更新。
- `docs/ja/product/040-system-design/sysd-index.md`: システム設計関連の文書の更新。
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: ガイドの更新。
- `docs/ja/specdojo/guides/register-operation-guide.md`: 登録操作ガイドの更新。
- `docs/ja/specdojo/guides/timeline-design-guide.md`: タイムライン設計ガイドの更新。
- `docs/ja/specdojo/references/command-reference.md`: コマンドリファレンスの更新。
- `docs/ja/specdojo/rulebooks/pm-members-rulebook.md`: メンバー管理ルールブックの更新。
- `docs/ja/specdojo/rulebooks/tml-rulebook.md`: タイムライン管理ルールブックの更新。
- `src/catalog/catalog.ts`: カタログ登録用のコマンド定義の更新。
- `src/dashboard/timeline-build.ts`: タイムラインビルド機能の更新。
- `src/dashboard/timeline.ts`: タイムライン機能の更新。
- `src/exec/commands.ts`: 実行コマンドの定義更新。
- `src/exec/core.ts`: コアロジックの更新。
- `src/exec/migrate-records.ts`: 削除、+0 / -284 行
- `src/grade/command-inspect.ts`: コマンド検査機能の更新。
- `src/grade/markdown.ts`: 変更、+3 / -133 行
- `src/job/job.ts`: ジョブ実行機能の更新。
- `src/register/command-types.ts`: コマンド型の定義更新。
- `src/register/maintenance-commands.ts`: メンテナンス用コマンドの定義更新。
- `src/register/migration.ts`: 削除、+0 / -338 行
- `src/register/register.ts`: 登録処理の更新。
- `src/routine/routine.ts`: ルーチン処理の更新。
- `src/schedule/schedule.ts`: スケジュール管理機能の更新。
- `src/shared/specdojo-config.ts`: 共通設定の更新。
- `src/shared/where-alias.ts`: 削除、+0 / -21 行
- `src/specdojo.ts`: エントリポイントの更新。
- `tests/src/cli-verb-taxonomy.test.ts`: CLI 語彙体系のテスト更新。
- `tests/src/dashboard/timeline-build.test.ts`: タイムラインビルドのテスト更新。
- `tests/src/exec/event-msg-default.test.ts`: イベントメッセージのテスト更新。
- `tests/src/exec/migrate-records.test.ts`: 削除、+0 / -204 行
- `tests/src/exec/register-resume.integration.test.ts`: 登録再開の統合テスト更新。
- `tests/src/grade/repo-results.test.ts`: リポジトリ結果のテスト更新。
- `tests/src/register/commands.test.ts`: 登録コマンドのテスト更新。
- `tests/src/register/migration.test.ts`: 削除、+0 / -196 行
- `tests/src/register/track-domains.test.ts`: ドメイン追跡のテスト更新。
- `tests/src/schedule/command.test.ts`: スケジュールコマンドのテスト更新。
- `tests/src/shared/specdojo-config.test.ts`: 共通設定のテスト更新。

## 3. 申し送り

- `src/register/migrate-timestamps.ts` と `migrateEmbeddedRegisterEvents`・`migrateRegisterEventsFromGit`（`src/register/register.ts`、`src/register/command-types.ts`）は `register migrate` の削除で呼び出し元がなくなった。別の項目で削除を判断する。
- `src/exec/core.ts` のイベント型（`note`・`link`・`estimate`）は、既存のイベントファイルを読むため残した。
- `src/shared/deprecation.ts` は `timeline_path` と `tml-index.yaml` の警告で使うため残した。
- `../specdojo-prj-0002` の `.specdojo` と `package.json` に 9 コマンドや `where` の別名の呼び出しはなかった。
- CHANGELOG.md は変更していない。区分（削除）と文案は個票の `### 5.1. CHANGELOG に書く事項` に書いた。

## 4. 進め方

非推奨とされていた 9 つのコマンドおよび `where` の別名を CLI 実装から削除するため、まず `src/` 内の該当するファイル（`src/exec/migrate-records.ts`、`src/register/migration.ts`、`src/shared/where-alias.ts`）を削除し、関連するテストコードも削除しました。その後、`src/catalog/catalog.ts` や `src/register/command-types.ts` など、削除したコマンドを参照していた箇所を修正しました。最後に、各種ドキュメント（`docs/`）における参照情報を更新しました。
