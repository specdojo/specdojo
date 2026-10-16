---
specdojo:
  id: prj-0001:pjr-yh9q-src-move-grade-register
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-15T22:12:26Z"
  due_on: null
---

# PJR-YH9Q grade と register を src/grade・src/register へ移す

## 1. 概要

codemod で grade と register のファイルを各ディレクトリへ移す。 PJR-V23P の決定に基づく

## 2. 完了条件

[[prj-0001:pjr-v23p-src-subdirectory-layout]] の決定に基づく 4 件目の移動。これまでの移動（[[prj-0001:pjr-smk5-src-move-schedule-catalog]] など）と同じ手順と名前の付け方で行う。[[prj-0001:pjr-6cds-grade-test-depends-on-stored-results]] で `tests/src/grade.test.ts` を直した後に行う。

移す対応表:

| 移す前                                          | 移した後                                        |
| ----------------------------------------------- | ----------------------------------------------- |
| `src/grade-apply.ts`                            | `src/grade/apply.ts`                            |
| `src/grade-command-apply.ts`                    | `src/grade/command-apply.ts`                    |
| `src/grade-command-inspect.ts`                  | `src/grade/command-inspect.ts`                  |
| `src/grade-command-plan.ts`                     | `src/grade/command-plan.ts`                     |
| `src/grade-command-shared.ts`                   | `src/grade/command-shared.ts`                   |
| `src/grade-core.ts`                             | `src/grade/core.ts`                             |
| `src/grade-markdown.ts`                         | `src/grade/markdown.ts`                         |
| `src/grade-pipeline-state.ts`                   | `src/grade/pipeline-state.ts`                   |
| `src/grade-plan.ts`                             | `src/grade/plan.ts`                             |
| `src/grade-result.ts`                           | `src/grade/result.ts`                           |
| `src/grade-target-discovery.ts`                 | `src/grade/target-discovery.ts`                 |
| `src/grade-targets.ts`                          | `src/grade/targets.ts`                          |
| `src/grade.ts`                                  | `src/grade/grade.ts`                            |
| `src/register-command-types.ts`                 | `src/register/command-types.ts`                 |
| `src/register-core.ts`                          | `src/register/core.ts`                          |
| `src/register-create-commands.ts`               | `src/register/create-commands.ts`               |
| `src/register-date.ts`                          | `src/register/date.ts`                          |
| `src/register-event-merge.ts`                   | `src/register/event-merge.ts`                   |
| `src/register-events.ts`                        | `src/register/events.ts`                        |
| `src/register-history.ts`                       | `src/register/history.ts`                       |
| `src/register-item.ts`                          | `src/register/item.ts`                          |
| `src/register-maintenance-commands.ts`          | `src/register/maintenance-commands.ts`          |
| `src/register-migrate-timestamps.ts`            | `src/register/migrate-timestamps.ts`            |
| `src/register-migration.ts`                     | `src/register/migration.ts`                     |
| `src/register-renumber.ts`                      | `src/register/renumber.ts`                      |
| `src/register-transition-commands.ts`           | `src/register/transition-commands.ts`           |
| `src/register-update.ts`                        | `src/register/update.ts`                        |
| `src/register-views.ts`                         | `src/register/views.ts`                         |
| `src/register.ts`                               | `src/register/register.ts`                      |
| `tests/src/grade-result.test.ts`                | `tests/src/grade/result.test.ts`                |
| `tests/src/grade-triggers.test.ts`              | `tests/src/grade/triggers.test.ts`              |
| `tests/src/grade.test.ts`                       | `tests/src/grade/grade.test.ts`                 |
| `tests/src/register-commands.test.ts`           | `tests/src/register/commands.test.ts`           |
| `tests/src/register-commit.integration.test.ts` | `tests/src/register/commit.integration.test.ts` |
| `tests/src/register-date.test.ts`               | `tests/src/register/date.test.ts`               |
| `tests/src/register-event-merge.test.ts`        | `tests/src/register/event-merge.test.ts`        |
| `tests/src/register-history.test.ts`            | `tests/src/register/history.test.ts`            |
| `tests/src/register-item.test.ts`               | `tests/src/register/item.test.ts`               |
| `tests/src/register-migrate-events.test.ts`     | `tests/src/register/migrate-events.test.ts`     |
| `tests/src/register-migrate-timestamps.test.ts` | `tests/src/register/migrate-timestamps.test.ts` |
| `tests/src/register-migration.test.ts`          | `tests/src/register/migration.test.ts`          |
| `tests/src/register-view-order.test.ts`         | `tests/src/register/view-order.test.ts`         |
| `tests/src/register.test.ts`                    | `tests/src/register/register.test.ts`           |

`tests/tools/grade-per-document.test.ts` は `tools/` のテストのため移さない（import の書き換えは codemod に任せる）。

条件:

- `tools/src-move-codemod.mjs` で上の対応表のとおりに移す。移動と import の書き換えは codemod に任せ、codemod が報告した残りだけを手で直し、直した箇所を result に書く。
- 移すファイルやテストが `import.meta.url`・`__dirname` からパスを組み立てている場合は、1 階層深くなっても同じ場所を指すよう直す。
- 移す前と後で、`grade`・`register` と、それぞれのサブコマンドの `--help` の出力が一致する。前後の出力を `tmp/` に保存して比べ、比べたコマンドと差分がないことを result に記録する。
- `npm run build` の後に、`dist/` に移す前の古い出力が残らない。
- 設計書とガイドにある移したファイルの `src/...` のパスを直す。履歴のファイルは直さない。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 3. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ             |
| --- | --------------------------------------------------------- | ---- | ---- | ---------------- |
| 1   | codemod で対応表のとおりに移す                            | DEV  | open | 手で書き換えない |
| 2   | `--help` を比べ、`dist/` の古い出力と文書のパスを確かめる | DEV  | open | -                |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-v23p-src-subdirectory-layout]]: 決定。
- [[prj-0001:pjr-6cds-grade-test-depends-on-stored-results]]: 先に行う。
