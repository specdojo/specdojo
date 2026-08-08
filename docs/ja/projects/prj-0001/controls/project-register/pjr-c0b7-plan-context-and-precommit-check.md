---
specdojo:
  id: prj-0001:pjr-c0b7-plan-context-and-precommit-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-C0B7 exec plan 共通規約へ project context の based_on 転記禁止と pre-commit 事前チェックを明記する

## 1. 概要

exec plan の共通規約テンプレート `docs/ja/specdojo/templates/xep-common-conventions-template.md` へ、次の2点を追記する。

1点目は、plan に提示される「プロジェクトコンテキスト」を成果物 frontmatter の `based_on` へ転記しないことの明示である。`project_context` は plan の参照範囲にのみ作用する設定であり、`depends_on` とは独立した文脈として渡される。`based_on` は「`depends_on` の推移閉包に含まれる先行成果物」であることを `catalog validate` が要求するため、project context を `based_on` へ転記すると検証エラーになる。

2点目は、作業完了前に pre-commit で実行される検査を先回りで実行し、失敗を修正してから終了することの明示である。現状の共通規約は prettier / markdownlint / schema 検証には触れているが、`typecheck`、`test`、`catalog validate` などコミット時に必ず走る検査群は網羅されていない。

本項目は、タスク `T-DATA-FLOW-cdfd-overview-005`（cdfd-overview の bootstrap）が block された事象を契機とする。当該タスクでは、agent が plan のプロジェクトコンテキストに示された `prj-0001:prj-overview` を成果物 frontmatter の `based_on` へ転記したため、pre-commit hook の `catalog-validate` が推移閉包エラーで終了コード 1 となり、commit が失敗して block に至った。agent は commit 実行まで検査失敗に気づけず、成果物の内容自体は完成していたにもかかわらずタスクが停止した。

## 2. 完了条件

- `xep-common-conventions-template.md` に、plan のプロジェクトコンテキストを `based_on` へ転記しない旨が記載されている。
- 同テンプレートに、完了前に pre-commit 相当の検査を実行し、失敗を修正してから終了する旨が記載されている。
- 追記した規約が、変更ファイル種別に応じて実行すべき検査を判断できる粒度になっている。
- 共通規約は全 exec plan に注入されるため、記述が特定の approach や成果物種別に依存していない。
- `npm run lint:md` と `npm test` が成功する（テンプレート配下の変更は pre-commit の `test` 対象である）。

## 3. 作業内容

| No  | 作業                                                          | 担当 | 状態 | メモ                                                         |
| --- | ------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------ |
| 1   | project context を `based_on` へ転記しない旨の追記            | ARC  | todo | 転記するとなぜ検証エラーになるかの理由も併記する             |
| 2   | pre-commit 相当の検査を完了前に実行する旨の追記               | ARC  | todo | 変更ファイル種別と検査コマンドの対応が判断できる形にする     |
| 3   | 既存の整形・静的検査に関する記述との整合確認                  | ARC  | todo | 重複記述にせず、既存箇条書きへ統合するか隣接させる           |
| 4   | 検証（`npm run lint:md` / `npm test`）                        | ARC  | todo | テンプレート変更は pre-commit の `test` 対象                 |
| 5   | `catalog validate` エラーメッセージへのヒント追加（要否判断） | ARC  | todo | テンプレート追記で足りるかを判断し、不要なら見送りを記録する |

## 4. 参考情報

### 4.1. 追記対象ファイル

- `docs/ja/specdojo/templates/xep-common-conventions-template.md`

同ファイルは frontmatter を持たない断片テンプレートであり、`_COMMON_CONVENTIONS_` プレースホルダを通じて各 exec plan テンプレート（`xep-bootstrap-template.md`、`xep-freeform-template.md` など）へ注入される。したがって、このファイルへの追記のみで全 plan に反映される。

### 4.2. project context と based_on の関係

- `project_context` は `.specdojo/specdojo.config.json` の project 設定項目であり、現在の値は `["prj-overview"]` である。
- 仕様上の位置づけは `specdojo:waza-guide` に記載がある。project context は plan の参照範囲にだけ作用し、schedule、`based_on`、commit scope を変更しない。
- 実装では `src/exec-plans.ts` の `projectContextSection()` が plan 本文へ「プロジェクトコンテキスト」章を描画するのみで、成果物 frontmatter には関与しない。
- `based_on` の自動生成は `src/catalog-generate.ts` の `fallbackMarkdown()` にあり、生成元は `depends_on` のみである。
- 検証は `src/catalog-build.ts` の `validateBasedOn()` が担い、同一プロジェクト内の参照が `depends_on` の推移閉包に含まれない場合にエラーとする。

### 4.3. pre-commit で実行される検査

`lefthook.yml` の `pre-commit` に定義された検査は次のとおり。staged ファイルが glob に一致した場合のみ実行される。

| 検査             | 対象 glob                                                                | コマンド                                     |
| ---------------- | ------------------------------------------------------------------------ | -------------------------------------------- |
| format           | `*.{ts,js,mjs,cjs,json,yaml,yml}`                                        | `npx prettier --write`                       |
| markdown         | `*.md`                                                                   | `npx prettier --write` と `npx markdownlint` |
| typecheck        | `src/**`、`tests/**`、`scripts/**`、`tools/**`、`tsconfig*.json`         | `npm run typecheck`                          |
| test             | `src/**`、`tests/**`、`docs/ja/specdojo/templates/**`、`vitest.config.*` | `npm test`                                   |
| register-build   | `docs/**/pjr-index.md`                                                   | `specdojo register build`                    |
| catalog-build    | `docs/**/dct-*.yaml`                                                     | `specdojo catalog build`                     |
| catalog-validate | `docs/ja/projects/**`                                                    | `specdojo catalog validate`                  |
| exec-refresh     | `docs/**/sch-*.yaml`                                                     | `specdojo exec refresh`                      |
| index-build      | `docs/**`                                                                | `specdojo index build`                       |

`commit-msg` では `npx commitlint` が実行される。

## 5. 対応結果

_TODO_
