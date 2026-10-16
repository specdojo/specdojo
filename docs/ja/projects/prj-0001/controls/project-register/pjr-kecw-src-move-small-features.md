---
specdojo:
  id: prj-0001:pjr-kecw-src-move-small-features
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-15T22:12:10Z"
  due_on: null
---

# PJR-KECW job・routine・kata・deliverable・devcontainer・review・docs を移す

## 1. 概要

codemod で小さい機能のファイルを src/job/・src/routine/・src/kata/・src/deliverable/・src/devcontainer/・src/review/・src/docs/ へ移す。 PJR-V23P の決定に基づく

## 2. 完了条件

[[prj-0001:pjr-v23p-src-subdirectory-layout]] の決定に基づく 2 件目の移動。[[prj-0001:pjr-w9rk-src-move-dashboard]] と同じ手順と名前の付け方（ディレクトリと重なる接頭辞を外す。ディレクトリと同じ名前のファイルは残す。外すと別のファイルと同じ名前になる場合は外さない）で行う。`tests/devcontainer-scaffold.test.ts` は `tests/src/` の外にあるため、`src/` と同じ構成へ合わせて移す。

移す対応表:

| 移す前                                             | 移した後                                                |
| -------------------------------------------------- | ------------------------------------------------------- |
| `src/job.ts`                                       | `src/job/job.ts`                                        |
| `src/job-definition.ts`                            | `src/job/definition.ts`                                 |
| `src/routine.ts`                                   | `src/routine/routine.ts`                                |
| `src/routine-definition.ts`                        | `src/routine/definition.ts`                             |
| `src/kata.ts`                                      | `src/kata/kata.ts`                                      |
| `src/kata-command.ts`                              | `src/kata/command.ts`                                   |
| `src/deliverable.ts`                               | `src/deliverable/deliverable.ts`                        |
| `src/deliverable-trash.ts`                         | `src/deliverable/trash.ts`                              |
| `src/devcontainer-command.ts`                      | `src/devcontainer/command.ts`                           |
| `src/devcontainer-scaffold.ts`                     | `src/devcontainer/scaffold.ts`                          |
| `src/review-grade.ts`                              | `src/review/grade.ts`                                   |
| `src/review-plan.ts`                               | `src/review/plan.ts`                                    |
| `src/review-types.ts`                              | `src/review/types.ts`                                   |
| `src/doc-index.ts`                                 | `src/docs/doc-index.ts`                                 |
| `src/index-command.ts`                             | `src/docs/index-command.ts`                             |
| `src/yaml-pages.ts`                                | `src/docs/yaml-pages.ts`                                |
| `src/yaml-pages-command.ts`                        | `src/docs/yaml-pages-command.ts`                        |
| `src/frontmatter-namespace.ts`                     | `src/docs/frontmatter-namespace.ts`                     |
| `src/template-frontmatter.ts`                      | `src/docs/template-frontmatter.ts`                      |
| `src/template-resolution.ts`                       | `src/docs/template-resolution.ts`                       |
| `src/viewpoint-document-kinds-check.ts`            | `src/docs/viewpoint-document-kinds-check.ts`            |
| `tests/src/job.test.ts`                            | `tests/src/job/job.test.ts`                             |
| `tests/src/routine.test.ts`                        | `tests/src/routine/routine.test.ts`                     |
| `tests/src/kata.test.ts`                           | `tests/src/kata/kata.test.ts`                           |
| `tests/src/kata-command.test.ts`                   | `tests/src/kata/command.test.ts`                        |
| `tests/src/deliverable-trash.integration.test.ts`  | `tests/src/deliverable/trash.integration.test.ts`       |
| `tests/devcontainer-scaffold.test.ts`              | `tests/src/devcontainer/scaffold.test.ts`               |
| `tests/src/review-grade.test.ts`                   | `tests/src/review/grade.test.ts`                        |
| `tests/src/review-plan.test.ts`                    | `tests/src/review/plan.test.ts`                         |
| `tests/src/doc-index.test.ts`                      | `tests/src/docs/doc-index.test.ts`                      |
| `tests/src/yaml-pages.test.ts`                     | `tests/src/docs/yaml-pages.test.ts`                     |
| `tests/src/template-frontmatter.test.ts`           | `tests/src/docs/template-frontmatter.test.ts`           |
| `tests/src/template-resolution.test.ts`            | `tests/src/docs/template-resolution.test.ts`            |
| `tests/src/viewpoint-document-kinds-check.test.ts` | `tests/src/docs/viewpoint-document-kinds-check.test.ts` |

対象外: `build-command`・`init-command`・`orchestrator`・`watch`・`agent`（`src/specdojo.ts` だけが使うコマンドの実装）と `practice-id`・`role-types` は、置き場所を [[prj-0001:pjr-mhhp-src-move-shared]] で決めるため本件では移さない。

条件:

- `tools/src-move-codemod.mjs` で上の対応表のとおりに移す。移動と import の書き換えは codemod に任せ、codemod が報告した残りだけを手で直し、直した箇所を result に書く。
- `src/docs/viewpoint-document-kinds-check.ts` は `import.meta.url` から相対パスを組み立てている。1 階層深くなってもパスが同じ場所を指すよう直す。移すテストが `import.meta.url`・`__dirname` からリポジトリのパスを組み立てている場合も同じく直す。
- 移す前と後で、`job`・`routine`・`kata`・`devcontainer`・`index`・`yaml-pages` と、それぞれのサブコマンドの `--help` の出力が一致する。前後の出力を `tmp/` に保存して比べ、比べたコマンドと差分がないことを result に記録する。
- `npm run build` の後に、`dist/` に移す前の古い出力が残らない。
- 設計書とガイドにある移したファイルの `src/...` のパスを直す。履歴のファイルは直さない。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 3. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ                                  |
| --- | --------------------------------------------------------- | ---- | ---- | ------------------------------------- |
| 1   | codemod で対応表のとおりに移す                            | DEV  | open | 手で書き換えない                      |
| 2   | `import.meta.url` などから組み立てるパスを直す            | DEV  | open | `viewpoint-document-kinds-check` ほか |
| 3   | `--help` を比べ、`dist/` の古い出力と文書のパスを確かめる | DEV  | open | -                                     |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-v23p-src-subdirectory-layout]]: 決定。
- [[prj-0001:pjr-w9rk-src-move-dashboard]]: 最初の移動。
