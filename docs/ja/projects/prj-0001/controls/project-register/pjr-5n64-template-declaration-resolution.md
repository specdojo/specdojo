---
specdojo:
  id: prj-0001:pjr-5n64-template-declaration-resolution
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: BA
  registered_at: "2026-08-23T11:48:45Z"
  due_on: "2026-08-31"
---

# PJR-5N64 templateをrulebook宣言から解決し系統単位の標準templateを整備する

## 1. 概要

`catalog-generate.ts` の `findTemplate` はカタログの template 宣言を参照せず、`local_id` 命名規約でのみ解決するため、同一 rulebook 系統に複数件が並ぶ成果物へ template を共有できない。rulebook の多くが本文構成の章に見出しの羅列を持ち、実質 template を人間にしか読めない形で保持している。

起票後に前提が変わった。PJR-3N21 で実践の型の正本を rulebook frontmatter へ一本化し、PJR-XGJK でカタログから型宣言を削除したため、**カタログには template 宣言が存在しない**。したがって「カタログ宣言から解決する」という当初の方針は成立しない。解決元は rulebook frontmatter となる。

現状は次のとおりである。

| 対象                            | 件数  |
| ------------------------------- | ----- |
| 本文構成の章を持つ rulebook     | 92 本 |
| `template` を文書 ID で宣言     | 22 本 |
| `template: not-needed`          | 14 本 |
| `template: undecided`（未判断） | 54 本 |
| 項目の省略（必要だが未整備）    | 16 本 |

`findTemplate` は PJR-XGJK でも変更されておらず、`local_id` 命名規約のままである。宣言と実際の解決が食い違っている。

## 2. 完了条件

- `findTemplate` が rulebook frontmatter の `template` 宣言から解決する。`local_id` 命名規約による解決を残す場合は、どちらを優先するかと理由が記録されている。
- 同一 rulebook 系統に複数の成果物が並ぶ場合、系統の template を共有して scaffold できる。
- `template: not-needed` の系統では template を用いず、既存の最小 scaffold へ退避する。`undecided` と項目の省略の扱いも定義されている。
- 本文構成の章を持つ 92 本のうち、どこまでを template として切り出すかの範囲が決まり、理由が記録されている。92 本すべての整備を本項目の範囲とするかは、この判断に含める。
- 切り出した系統では、rulebook の本文構成章から見出しの羅列を削除し、各章の目的と必須任意の規約を残す。骨組みの正本は template とする。
- 生成される成果物の骨組みが、移行前後で失われていない。`deliverable scaffold` の出力を移行前と比較して確認する。
- 規約や生成物の文言を変えた場合、既存テストの期待値が新しい仕様と整合していることを確認する。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration`、`catalog validate`、`catalog build` が成功する。

## 3. 作業内容

| No  | 作業                                                                    | 担当 | 状態 | メモ                           |
| --- | ----------------------------------------------------------------------- | ---- | ---- | ------------------------------ |
| 1   | `findTemplate` の解決元を rulebook frontmatter へ変更する               | BA   | open | 命名規約との優先順位を決める   |
| 2   | 4状態（ID / `not-needed` / `undecided` / 項目の省略）の扱いを定義する   | BA   | open | 未整備時は最小 scaffold へ退避 |
| 3   | template として切り出す範囲を判断し、理由を記録する                     | BA   | open | 92本すべてを対象とするかを含む |
| 4   | 切り出した系統の rulebook 本文構成章を規約へ整理する                    | BA   | open | 骨組みの正本は template        |
| 5   | scaffold の出力を移行前後で比較し、骨組みが失われていないことを確認する | BA   | open | 退行の検出                     |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 正本を定めた決定: [[prj-0001:pjr-3n21-kata-declaration-ssot-split|PJR-3N21 実践の型の要否と所在の正本を分ける]]
- 種別ごとの作成方針: [[prj-0001:pjr-vv3m-kata-creation-policy-by-type|PJR-VV3M 実践の型は種別ごとに作成方針を変える]]
- 宣言を移行した項目: [[prj-0001:pjr-xgjk-kata-declaration-migrate-to-rulebook|PJR-XGJK 実践の型の宣言を rulebook frontmatter へ移行する]]
- 要否の判断基準: [[specdojo:kata-guide|実践の型ガイド]]
- 解決の実装: `src/kata.ts`、`src/catalog-generate.ts`
