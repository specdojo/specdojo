---
specdojo:
  id: prj-0001:pjr-th4b-eslint-max-lines-guard
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-02T12:14:46Z"
---

# PJR-TH4B ESLint の max-lines と max-lines-per-function を warn で導入する

## 1. 概要

ファイルと関数の行数の上限を ESLint の warn で導入し、大きくなりすぎたファイルと関数を見えるようにする。上限値は分割後の実態を見て決める（v0.3.0 の公開後）

## 2. 完了条件

上限値は、[[prj-0001:pjr-y8p9-large-source-files-split]] などの分割の後の実態（2026-10-15）を見て、利用者が次のとおり決めた。空行とコメントは数えない。

| ルール                   | 上限  | 2026-10-15 時点の warn の件数 |
| ------------------------ | ----- | ----------------------------- |
| `max-lines`              | 1,000 | 0                             |
| `max-lines-per-function` | 200   | 25                            |

- `eslint.config.js` の `src/**/*.ts` に、`max-lines`（`max: 1000`、`skipBlankLines: true`、`skipComments: true`）と `max-lines-per-function`（`max: 200`、`skipBlankLines: true`、`skipComments: true`）を `warn` で加える。`tests/**/*.ts`・`packages/docs-lint/src/**/*.ts`・`tools/e2e/**/*.ts` には加えない（テストは fixture や表で長くなるため、本件の対象外とする）。
- `npm run lint:ts` は warn では失敗しない（`--max-warnings` を加えない）。
- `npm run lint:ts` を実行し、`max-lines` の warn が 0 件、`max-lines-per-function` の warn の件数と対象の関数の一覧を result に記録する。件数が上の表と大きく違う場合は理由を書く。
- 上限の値と、warn を関数の分割の候補として扱うことを、TypeScript の実装ルール（`.github/instructions/typescript.instructions.md`）の該当する章に書く。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 3. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ               |
| --- | ---------------------------------------------------- | ---- | ---- | ------------------ |
| 1   | `eslint.config.js` に 2 つのルールを warn で加える   | DEV  | done | `src/**/*.ts` のみ |
| 2   | `npm run lint:ts` の warn を数えて result に記録する | DEV  | done | 関数の一覧を含む   |
| 3   | TypeScript の実装ルールに上限と扱いを書く            | DEV  | done | -                  |

## 4. 対応結果

`eslint.config.js` の `src/**/*.ts` 限定で、空行とコメントを除く `max-lines` 1,000 行と `max-lines-per-function` 200 行を warn として設定した。`npm run lint:ts` に `--max-warnings` は追加していない。

`.github/instructions/typescript.instructions.md` に同じ上限と、warn をモジュールや関数の責務を見直して分割する候補として扱う方針を追記した。warn の件数と対象関数は、親 runner が実行する `npm run lint:ts` の結果を exec result に記録する。残課題はない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-y8p9-large-source-files-split]]: 分割の後の実態。
- `.github/instructions/typescript.instructions.md`
