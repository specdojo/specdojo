---
specdojo:
  id: prj-0001:pjr-hchh-remove-unused-register-migration
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-21T14:01:58Z"
  block_reason: "parent validation failed: lint-md"
  derived_from:
    - PJR-GV43
---

# PJR-HCHH register migrate の削除で呼ばれなくなった移行の関数を消す

## 1. 概要

PJR-GV43 で register migrate を消したため、src/register/migrate-timestamps.ts と register.ts の migrateEmbeddedRegisterEvents・migrateRegisterEventsFromGit に呼び出し元がない。使われていないことを確かめて消す

## 2. 入力

- PJR-GV43 の対応結果の残課題（2026-11-21）: migrate-timestamps.ts と migrateEmbeddedRegisterEvents・migrateRegisterEventsFromGit は、register migrate の削除で呼び出し元がなくなった。別の項目で削除を判断する
- 利用者の決定（2026-11-21、indie）: 夜の間に流す

## 3. 完了条件

- `register migrate` の削除（PJR-GV43）で呼び出し元がなくなった `src/register/migrate-timestamps.ts`、`src/register/register.ts` の `migrateEmbeddedRegisterEvents`・`migrateRegisterEventsFromGit`、`src/register/command-types.ts` の対応する型と、それらだけが使う関数・テストを消す。
- 消す前に、`src`・`tests`・`tools`・`scripts` から呼ばれていないことを grep で確かめ、結果を個票の対応結果に書く。ほかから呼ばれているものは残し、理由を書く。
- `src/exec/core.ts` のイベント型（`note`・`link`・`estimate`）は、既存のイベントファイルを読むために残す。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分と行の文案を書く。利用者に影響がなければ「なし」と書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                           | 担当 | 状態 | メモ                                                                                                                                                             |
| --- | ------------------------------ | ---- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 呼び出し元がないことを確かめる | DEV  | done | `src`・`tests`・`tools`・`scripts` を grep。2 つの関数・対応する型は呼び出し元なし。`legacyHistoryEventToRegisterEvent` は専用テストがあるため残す               |
| 2   | 関数・型・テストを消す         | DEV  | done | 2 つの関数・`command-types.ts` の型・`events.ts` の `readEmbeddedRegisterEvents` ・`removeEmbeddedRegisterEvents` を削除。ファイル削除は実行できないため申し送り |
| 3   | 検証を通す                     | DEV  | open | 親 runner に委ねる（この環境では executor が sandbox 検証を実行しない）                                                                                          |

## 5. 対応結果

- `register migrate` の削除（`[[prj-0001:pjr-gv43-remove-deprecated-commands-0-10|PJR-GV43 register migrate の削除で呼ばれなくなった移行の関数を消す]]`）後に呼び出し元がなくなった関数・型を、呼び出し確認の上で削除した。
- 呼び出し元の確認: `src`・`tests`・`tools`・`scripts` から grep した結果、`migrateEmbeddedRegisterEvents`・`migrateRegisterEventsFromGit` の呼び出しは `register.ts` の `REGISTER_COMMAND_DEPENDENCIES` にのみ残っていた（`register migrate` 削除後）。`src/register/migrate-timestamps.ts` 内の `planRegisterTimestampMigration`・`summarizeTimestampMigration`・`createGitTimestampResolver` も外部からの import なし。
- 残した関数: `legacyHistoryEventToRegisterEvent`（`register.ts`）・`collectRegisterHistoryEvents`（`history.ts`）は別用途で使われているため残す（前者には専用テスト、後者は `maintenance-commands.ts` が使用）。`src/exec/core.ts` のイベント型（`note`・`link`・`estimate`）も既存のイベントファイルを読むため残す。
- ファイル削除: `src/register/migrate-timestamps.ts` と `tests/src/register/migrate-timestamps.test.ts` の物理的削除は、この executor sandbox ではファイル削除コマンドが利用できないため実施できていない。runner 側での `git rm` による削除を申し送る（下記）。
- 「それらだけが使う」関数として削除したもの: `src/register/events.ts` の `readEmbeddedRegisterEvents`・`removeEmbeddedRegisterEvents`（2 つの migrate 関数のみ使用。`updateSpecdojoFields` の unused import も除去）。

### 5.1. CHANGELOG に書く事項

- なし（利用者に影響がない内部クリーンアップのため）

## 6. 関連ドキュメント

- 親課題: `[[prj-0001:pjr-gv43-remove-deprecated-commands-0-10|PJR-GV43 register migrate の削除で呼ばれなくなった移行の関数を消す]]`
- 対象ファイル: `src/register/register.ts`、`src/register/command-types.ts`、`src/register/events.ts`、`src/register/migrate-timestamps.ts`（削除予定）、`tests/src/register/migrate-timestamps.test.ts`（削除予定）
