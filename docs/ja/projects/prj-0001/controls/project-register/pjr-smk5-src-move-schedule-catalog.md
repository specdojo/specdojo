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

| No  | 作業                                                  | 担当 | 状態 | メモ                         |
| --- | ----------------------------------------------------- | ---- | ---- | ---------------------------- |
| 1   | codemod で対応表のとおりに移す                        | DEV  | done | 実装 19 件・テスト 13 件     |
| 2   | `--help` と `specdojo build` の生成物を移す前と比べる | DEV  | done | 14 コマンド・65 生成物が一致 |
| 3   | `dist/` の古い出力と文書のパスを確かめる              | DEV  | done | 旧出力・旧パスの残存なし     |

## 4. 対応結果

- `tools/src-move-codemod.mjs` が `tests/` 間の明示マッピングを受け取れるようにし、自動検出したテスト移動と重複しない処理と統合テストを追加した。対応表を入力して、実装 19 件を `src/catalog/`・`src/schedule/`、テスト 13 件を `tests/src/catalog/`・`tests/src/schedule/` へ移し、相対 import を書き換えた。
- codemod の検出結果に基づく手修正は、`tools/catalog-validate-if-configured.mjs` の動的 import 2 か所、`tests/src/catalog/plan.test.ts` の `import.meta.url` 基準パス、`tests/src/catalog/build.test.ts` の実装パス fixture、現行設計書 1 件と成果物カタログ 6 件の実装パスである。個票・plan・result など履歴内の旧パスは変更していない。
- 移動前後に `catalog`・`schedule` と各サブコマンドの `--help` を合計 14 件比較し、すべて差分がないことを確認した。
- 移動前後に `specdojo build --scope catalog --project prj-0001` と `specdojo build --scope exec --project prj-0001` を実行し、catalog・schedule・execution の生成物 65 件に差分がないことを確認した。pipeline が禁止する index build は実行していない。
- `npm run build` が成功し、`dist/catalog/`・`dist/schedule/` に新しい出力 19 件が生成された。移動前の `dist/` 直下の `catalog*.js`・`schedule*.js` は残っていない。
- `npx prettier --write`、`specdojo catalog validate`、`git diff --check` は成功した。catalog validate の未作成文書に対する `based_on` 警告は既存データ由来であり、今回の移動によるエラーはない。親 runner が lint・typecheck・unit test・integration test・schema 検証を実行する。
- 残課題はない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-v23p-src-subdirectory-layout]]: 決定。
- [[prj-0001:pjr-kecw-src-move-small-features]]: 前の移動。
