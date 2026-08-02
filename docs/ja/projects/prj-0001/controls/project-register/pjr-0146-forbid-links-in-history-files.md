---
specdojo:
  id: prj-0001:pjr-0146-forbid-links-in-history-files
  type: project
  status: draft
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0146 履歴蓄積ファイル（plan/result/pjr-NNNN-<topic>等）はMarkdownリンクを禁止し`[[id]]`/パス表記に統一するルール化

## 1. 概要

plan/result/pjr-NNNN-`<topic>` 等、履歴として蓄積される成果物には、リンク先ファイル名変更のたびに追従修正が発生する Markdown リンク（`[]()`）を含めない。`docs/` 配下の文書を参照する場合は `id` を正とする `[[id]]`（wikilink）に統一し、`docs/` 外のファイル（`.github/instructions/` 等）や外部URLはリポジトリルートからの相対パス表記／URLそのままで記述するルールを定める。加えて、ルール違反（Markdownリンクの使用）を自動検知できるよう validation / lint チェックの仕組みを整備する。

`[[id]]` は `specdojo index build` の doc-index を介して `id` から解決するため、`id-and-file-naming-standard` の「ファイル名を変更しても `id` は変更しない」原則の下では、参照先ファイルがリネームされても参照側の修正が不要になる。`id` が未解決の場合もビルドエラーにはならず `[[id]]` の文字列表示に留まる（`src/doc-index.ts` の `replaceDocIndexRefs`、`.vitepress/config.mts` の wikilink 変換ルールで確認済み）。

## 2. 完了条件

- 対象となる成果物種別（plan/result/pjr-NNNN-`<topic>`等の履歴ファイル）が明文化されている。
- `docs/` 配下の参照は `[[id]]`、`docs/` 外の参照・外部URLはパス表記／URLのまま、Markdownリンク（`[]()`）は使わない、という記述ルールが `.github/instructions/` 配下のルール文書へ反映されている。
- 既存の履歴ファイル内リンクの扱い（移行要否）について方針が決まっている。
- 対象ファイル種別に対して、Markdownリンク（`[]()`）の使用を検知する validation / lint チェックが導入されている。
- 上記チェックが CI もしくは `npm run lint:md` 等の既存検証コマンドに組み込まれている。

## 3. 作業内容

| No  | 作業                                                                                  | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 対象ファイル種別の洗い出し                                                            | ARC  | open | -    |
| 2   | ルール文書への追記（`[[id]]`/パス表記の使い分け含む）                                 | ARC  | open | -    |
| 3   | 既存ファイルへの遡及要否の判断                                                        | ARC  | open | -    |
| 4   | 対象ファイル種別に対するMarkdownリンク使用検知の validation / lint チェック設計・実装 | ARC  | open | -    |
| 5   | 検証コマンド（CI / npm scripts）への組み込み                                          | ARC  | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- .github/instructions/markdown.instructions.md
- .github/instructions/specdojo-exec-workflow.instructions.md
- [[id-and-file-naming-standard|ドキュメントIDおよびファイル命名標準]]
- [[prj-0001:pjr-0148-extend-wikilink-id-resolution-beyond-docs-scope|docs/外へのwikilink解決範囲拡張の要否検討]]
