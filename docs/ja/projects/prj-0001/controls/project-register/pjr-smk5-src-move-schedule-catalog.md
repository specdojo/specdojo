---
specdojo:
  id: prj-0001:pjr-smk5-src-move-schedule-catalog
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-15T22:12:18Z"
  due_on: null
---

# PJR-SMK5 schedule と catalog を src/schedule・src/catalog へ移す

## 1. 概要

codemod で schedule と catalog のファイルを各ディレクトリへ移す。 PJR-V23P の決定に基づく

## 2. 完了条件

[[prj-0001:pjr-v23p-src-subdirectory-layout]] の決定に基づく 3 件目の移動。[[prj-0001:pjr-w9rk-src-move-dashboard]]・[[prj-0001:pjr-kecw-src-move-small-features]] と同じ手順と名前の付け方で行う。テストのうち、ソースのファイル名と対応しないもの（`catalog-based-on`・`catalog-index`・`catalog-merge`・`catalog-plan-command`・`schedule-command`）も、対応表に明記して同じディレクトリへ移す。

移す対応表:

| 移す前                                         | 移した後                                       |
| ---------------------------------------------- | ---------------------------------------------- |
| `src/catalog-build-references.ts`              | `src/catalog/build-references.ts`              |
| `src/catalog-build-render.ts`                  | `src/catalog/build-render.ts`                  |
| `src/catalog-build.ts`                         | `src/catalog/build.ts`                         |
| `src/catalog-generate.ts`                      | `src/catalog/generate.ts`                      |
| `src/catalog-paths.ts`                         | `src/catalog/paths.ts`                         |
| `src/catalog-plan-generate.ts`                 | `src/catalog/plan-generate.ts`                 |
| `src/catalog-plan-prompt.ts`                   | `src/catalog/plan-prompt.ts`                   |
| `src/catalog-plan.ts`                          | `src/catalog/plan.ts`                          |
| `src/catalog-scaffold.ts`                      | `src/catalog/scaffold.ts`                      |
| `src/catalog-types.ts`                         | `src/catalog/types.ts`                         |
| `src/catalog.ts`                               | `src/catalog/catalog.ts`                       |
| `src/schedule-approach.ts`                     | `src/schedule/approach.ts`                     |
| `src/schedule-build.ts`                        | `src/schedule/build.ts`                        |
| `src/schedule-phase-sets.ts`                   | `src/schedule/phase-sets.ts`                   |
| `src/schedule-strategy-generate-document.ts`   | `src/schedule/strategy-generate-document.ts`   |
| `src/schedule-strategy-generate-scope.ts`      | `src/schedule/strategy-generate-scope.ts`      |
| `src/schedule-strategy-generate.ts`            | `src/schedule/strategy-generate.ts`            |
| `src/schedule-strategy-profiles.ts`            | `src/schedule/strategy-profiles.ts`            |
| `src/schedule.ts`                              | `src/schedule/schedule.ts`                     |
| `tests/src/catalog-based-on.test.ts`           | `tests/src/catalog/based-on.test.ts`           |
| `tests/src/catalog-build.test.ts`              | `tests/src/catalog/build.test.ts`              |
| `tests/src/catalog-generate.test.ts`           | `tests/src/catalog/generate.test.ts`           |
| `tests/src/catalog-index.test.ts`              | `tests/src/catalog/index.test.ts`              |
| `tests/src/catalog-merge.test.ts`              | `tests/src/catalog/merge.test.ts`              |
| `tests/src/catalog-paths.test.ts`              | `tests/src/catalog/paths.test.ts`              |
| `tests/src/catalog-plan-command.test.ts`       | `tests/src/catalog/plan-command.test.ts`       |
| `tests/src/catalog-plan-generate.test.ts`      | `tests/src/catalog/plan-generate.test.ts`      |
| `tests/src/catalog-plan.test.ts`               | `tests/src/catalog/plan.test.ts`               |
| `tests/src/catalog-scaffold.test.ts`           | `tests/src/catalog/scaffold.test.ts`           |
| `tests/src/schedule-build.test.ts`             | `tests/src/schedule/build.test.ts`             |
| `tests/src/schedule-command.test.ts`           | `tests/src/schedule/command.test.ts`           |
| `tests/src/schedule-strategy-generate.test.ts` | `tests/src/schedule/strategy-generate.test.ts` |

条件:

- `tools/src-move-codemod.mjs` で上の対応表のとおりに移す。移動と import の書き換えは codemod に任せ、codemod が報告した残りだけを手で直し、直した箇所を result に書く。
- 移すファイルやテストが `import.meta.url`・`__dirname` からパスを組み立てている場合は、1 階層深くなっても同じ場所を指すよう直す。
- 移す前と後で、`catalog`・`schedule` と、それぞれのサブコマンドの `--help` の出力が一致する。前後の出力を `tmp/` に保存して比べ、比べたコマンドと差分がないことを result に記録する。
- catalog と schedule は生成物を作るため、移す前と後のコードで `specdojo build` を流し、生成物に差分がない（生成時刻を除く）ことを確かめて result に記録する。
- `npm run build` の後に、`dist/` に移す前の古い出力が残らない。
- 設計書とガイドにある移したファイルの `src/...` のパスを直す。履歴のファイルは直さない。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 3. 作業内容

| No  | 作業                                                  | 担当 | 状態 | メモ             |
| --- | ----------------------------------------------------- | ---- | ---- | ---------------- |
| 1   | codemod で対応表のとおりに移す                        | DEV  | open | 手で書き換えない |
| 2   | `--help` と `specdojo build` の生成物を移す前と比べる | DEV  | open | -                |
| 3   | `dist/` の古い出力と文書のパスを確かめる              | DEV  | open | -                |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-v23p-src-subdirectory-layout]]: 決定。
- [[prj-0001:pjr-kecw-src-move-small-features]]: 前の移動。
