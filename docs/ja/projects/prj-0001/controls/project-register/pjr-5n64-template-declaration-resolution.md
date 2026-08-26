---
specdojo:
  id: prj-0001:pjr-5n64-template-declaration-resolution
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: BA
  registered_at: "2026-08-23T11:48:45Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-26T05:49:08Z"
  conclusion: template の解決元を local_id 命名規約から rulebook frontmatter の宣言へ変更し、同一系統の成果物が1つの template を共有できるようにした。正本が rulebook であるため命名規約による解決は意図的に残していない。4状態のうち文書IDは使用し、not-needed・undecided・項目の省略はカタログ情報による最小雛形へ退避する。成果物情報を展開するプレースホルダを追加し、代表として OPR 系統を template 化して rulebook の本文構成章を規約へ整理した。本文構成を持つ92本すべての template 化は範囲外とし、固定骨組みを持たない系統まで切り出すと undecided の意味を失うことを理由として記録した。命名規約の廃止で到達不能になる成果物用 template がないことも確認した。
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

| No  | 作業                                                                    | 担当 | 状態 | メモ                         |
| --- | ----------------------------------------------------------------------- | ---- | ---- | ---------------------------- |
| 1   | `findTemplate` の解決元を rulebook frontmatter へ変更する               | BA   | done | 命名規約フォールバックは廃止 |
| 2   | 4状態（ID / `not-needed` / `undecided` / 項目の省略）の扱いを定義する   | BA   | done | 3つの非 ID 状態は最小雛形    |
| 3   | template として切り出す範囲を判断し、理由を記録する                     | BA   | done | 代表移行は OPR 系統          |
| 4   | 切り出した系統の rulebook 本文構成章を規約へ整理する                    | BA   | done | 骨組みの正本は template      |
| 5   | scaffold の出力を移行前後で比較し、骨組みが失われていないことを確認する | BA   | done | 単体テストで回帰を固定       |

## 4. 対応結果

`deliverable scaffold` の template 解決を、`local_id` と同名のファイル探索から rulebook frontmatter の `template` 文書 ID へ変更した。命名規約フォールバックは、宣言を正本とする PJR-3N21 の決定と競合し、`not-needed` の明示を無視し得るため廃止した。

4状態の生成時の扱いは次のとおりとした。

| rulebook の `template` | scaffold の扱い                                  |
| ---------------------- | ------------------------------------------------ |
| 文書 ID                | 宣言 ID の template を使用                       |
| `not-needed`           | template を使用せず、カタログ情報による最小雛形  |
| `undecided`            | 判断を先取りせず、カタログ情報による最小雛形     |
| 項目省略               | 必要だが未整備のため、カタログ情報による最小雛形 |

同一 rulebook 系統で template を共有するため、`_LOCAL_ID_`、`_DELIVERABLE_NAME_`、`_DELIVERABLE_OVERVIEW_`、`_BASED_ON_` を生成時プレースホルダとして追加した。代表移行対象には、`opr-index` と `opr-<term>` が同じ rulebook を参照し、固定の12要件を持つ一方で template 項目が省略されていた OPR 系統を選んだ。`opr-template` へ既存の12章の骨組みを移し、rulebook 側は章の目的・必須性・index / term の責務分担を正本とする本文要件へ整理した。

本文構成を持つ92本すべての template 化は本項目の範囲に含めない。既存の文書 ID 宣言22系統は新しい解決処理で利用可能になり、`not-needed` 14系統は作成対象外、`undecided` 54系統は個別の要否判断前に作成しない。項目省略16系統のうち OPR を本項目で整備し、残る系統は各 rulebook の対象・schema・成果物実績を確認する template maintenance で扱う。全件を機械的に切り出すと、固定骨組みを持たない系統まで template 化して `undecided` の意味を失うためである。

既存の Markdown / YAML template の展開結果を検証するテストは維持し、宣言経由でも Frontmatter の平坦化、`_PROJECT_ID_` の置換、記入プレースホルダの保持が変わらないことを確認できるようにした。加えて、OPR の異なる `local_id` へ共有 template を適用する回帰テストと、`not-needed` / `undecided` / 項目省略で同名 template が存在しても最小雛形へ退避する回帰テストを追加した。executor 後の単体・統合・schema 検証は pipeline の親 runner が実施し、evidence を正本とする。

## 5. 関連ドキュメント

- 正本を定めた決定: [[prj-0001:pjr-3n21-kata-declaration-ssot-split|PJR-3N21 実践の型の要否と所在の正本を分ける]]
- 種別ごとの作成方針: [[prj-0001:pjr-vv3m-kata-creation-policy-by-type|PJR-VV3M 実践の型は種別ごとに作成方針を変える]]
- 宣言を移行した項目: [[prj-0001:pjr-xgjk-kata-declaration-migrate-to-rulebook|PJR-XGJK 実践の型の宣言を rulebook frontmatter へ移行する]]
- 要否の判断基準: [[specdojo:kata-guide|実践の型ガイド]]
- 解決の実装: `src/kata.ts`、`src/catalog-generate.ts`
