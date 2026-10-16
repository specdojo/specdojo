---
specdojo:
  id: prj-0001:pjr-kecw-src-move-small-features
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
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

| No  | 作業                                                      | 担当 | 状態 | メモ                             |
| --- | --------------------------------------------------------- | ---- | ---- | -------------------------------- |
| 1   | codemod で対応表のとおりに移す                            | DEV  | done | 実装 21 件・テスト 13 件を移動   |
| 2   | `import.meta.url` などから組み立てるパスを直す            | DEV  | done | `routine` の dist 基準パスを補正 |
| 3   | `--help` を比べ、`dist/` の古い出力と文書のパスを確かめる | DEV  | done | 23 コマンド一致・古い出力なし    |

## 4. 対応結果

- `tools/src-move-codemod.mjs` に、従来の `tests/` 直下にある対応テストも `tests/src/` の移動先へ移せる処理を追加し、統合テストで確認した。codemod に対応表を渡し、実装 21 ファイルとテスト 13 ファイルを `src/job/`・`src/routine/`・`src/kata/`・`src/deliverable/`・`src/devcontainer/`・`src/review/`・`src/docs/` および対応する `tests/src/` 配下へ移した。相対 import の書き換えも codemod の出力を反映した。
- codemod の検出結果を確認し、`src/routine/routine.ts` がコンパイル後も `dist/specdojo.js` を基準に鮮度確認するよう、`import.meta.url` から組み立てるパスを 1 階層分補正した。`src/docs/viewpoint-document-kinds-check.ts` の `import.meta.url` は実行対象自身との比較にだけ使われ、リポジトリ内の相対パスを組み立てていないため補正不要であることを確認した。
- 現行の設計書・ガイド 3 文書と成果物カタログ 7 ファイルにある移動対象のパスを更新した。個票・plan・result などの履歴内にある旧パスは変更していない。
- 移動前後に `job`・`routine`・`kata`・`devcontainer`・`index`・`yaml-pages` と各サブコマンドの `--help` を合計 23 件比較し、すべて差分がないことを確認した。
- `npm run build` が成功し、`dist/job/`・`dist/routine/`・`dist/kata/`・`dist/deliverable/`・`dist/devcontainer/`・`dist/review/`・`dist/docs/` に出力された。移動前の旧出力 21 ファイルは残っていない。
- `specdojo catalog build` と `specdojo catalog validate` は成功した。validate が出力した未作成文書の `based_on` 警告は既存データに対する警告であり、本件のパス移動によるエラーはない。
- 残課題はない。lint・frontmatter・Markdown・schema・typecheck・unit test・integration test は親 runner が実行する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-v23p-src-subdirectory-layout]]: 決定。
- [[prj-0001:pjr-w9rk-src-move-dashboard]]: 最初の移動。
