---
specdojo:
  id: prj-0001:pjr-hchh-remove-unused-register-migration
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-21T14:01:58Z"
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

| No  | 作業                           | 担当 | 状態 | メモ |
| --- | ------------------------------ | ---- | ---- | ---- |
| 1   | 呼び出し元がないことを確かめる | DEV  | open | -    |
| 2   | 関数・型・テストを消す         | DEV  | open | -    |
| 3   | 検証を通す                     | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
