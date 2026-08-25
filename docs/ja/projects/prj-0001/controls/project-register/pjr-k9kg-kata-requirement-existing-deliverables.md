---
specdojo:
  id: prj-0001:pjr-k9kg-kata-requirement-existing-deliverables
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: BA
  registered_at: "2026-08-23T11:48:28Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-25T06:21:45Z"
  conclusion: "実在成果物が参照する5系統（opr、sysd-index、sysd-critical-flows、sysd-cross-cutting-policy、tsd）の recipe と template の要否を、実物の章構成と反復構造に照らして確定した。多くは必要だが未整備として項目を省略し、sysd-index の recipe と tsd の template は不要と判断した。sample: not-needed は8系統から4系統へ減らし、schema が構造を完全に規定する YAML 成果物3系統と include 専用 rulebook 1系統に限定して理由と適用範囲を記録した。not-needed としながら sample が実在した ccd-mermaid と ifd-mermaid は文書ID の宣言へ改め、双方向検証の警告を解消した。型そのものの新規作成は範囲外とした。"
---

# PJR-K9KG 実在する成果物が参照する rulebook 系統の実践の型の要否を確定する

## 1. 概要

実物がある成果物は基準を適用して要否を確定できる。PJR-XGJK により要否の宣言先は rulebook frontmatter へ移り、判断の単位も成果物ごとから rulebook 系統ごとへ変わった。本項目は、実在する成果物が参照する系統のうち要否が未確定のものを確定させる。

対象は次の5系統である。いずれも PJR-XGJK の移行時に、成果物ごとの `not-needed` と `undecided` が混在していたため、系統全体を確定扱いせず `undecided` へ集約したものである。元の `not-needed` は PJR-K4TA における現状追認であり、実質的な判断ではなかった。

| 系統                                 | recipe      | template    |
| ------------------------------------ | ----------- | ----------- |
| `opr-rulebook`                       | `undecided` | `undecided` |
| `sysd-index-rulebook`                | `undecided` | `undecided` |
| `sysd-critical-flows-rulebook`       | `undecided` | `undecided` |
| `sysd-cross-cutting-policy-rulebook` | `undecided` | `undecided` |
| `tsd-rulebook`                       | `undecided` | `undecided` |

あわせて、PJR-VV3M の方針と矛盾する宣言が2種類ある。

- `sample: not-needed` が8系統にある。PJR-VV3M は「sample は rulebook がある系統へ一律に作る」と定めたため、原則としてこの宣言は成立しない。
- そのうち `ccd-mermaid-rulebook` / `cdfd-mermaid-rulebook` / `ifd-mermaid-rulebook` の3系統は、`not-needed` としながら `ccd-sample.md` / `cdfd-sample.md` / `ifd-sample.md` が実在する。PJR-1Z1H で追加した双方向検証がこの矛盾を警告として検出している。

`sysd-rulebook` は119行と薄く sample も無い状態で、300〜400行の設計書を6本書いている。同一構造が並ぶ agent 設計書4件は recipe が必要と見込む。この見込みの妥当性も本項目で判断する。

## 2. 完了条件

- 上表の5系統について、recipe と template の要否が `undecided` 以外へ確定している。判断の根拠が記録されている。
- 判断は PJR-QESV の作る条件・作らない条件と PJR-VV3M の種別ごとの方針に照らして行う。実物がある成果物の内容を根拠にする。
- `sample: not-needed` の8系統について、PJR-VV3M の「rulebook がある系統へ一律に作る」との整合が取れている。例外を認める場合は、その理由と適用範囲が記録されている。
- `not-needed` としながら sample が実在する3系統の矛盾が解消している。宣言を改めるか実ファイルを整理するかは、判断の結果に従う。
- 実在する成果物の内容に照らして必要と判断した型は、文書 ID を宣言するか、必要だが未整備であることが分かる状態（項目の省略）になっている。型そのものの新規作成は本項目の範囲に含めない。
- PJR-1Z1H の双方向検証が、確定後の宣言に対して矛盾を報告しない。
- `npm run test:unit`、`catalog validate`、`catalog build` が成功する。

## 3. 作業内容

| No  | 作業                                                                     | 担当 | 状態 | メモ                                     |
| --- | ------------------------------------------------------------------------ | ---- | ---- | ---------------------------------------- |
| 1   | 対象5系統の実在成果物を読み、recipe と template の要否を判断する         | BA   | done | 基準は PJR-QESV と PJR-VV3M              |
| 2   | `sample: not-needed` の8系統を PJR-VV3M の方針と突き合わせる             | BA   | done | 例外を認めるなら理由と適用範囲を記録する |
| 3   | `not-needed` としながら sample が実在する3系統の矛盾を解消する           | BA   | done | ccd-mermaid / cdfd-mermaid / ifd-mermaid |
| 4   | 判断結果を rulebook frontmatter へ反映し、双方向検証が通ることを確認する | BA   | done | 型の新規作成は範囲外                     |

## 4. 対応結果

PJR-QESV と PJR-VV3M の基準を、実在成果物の章構成と内容差へ適用した。必要だが未整備の型は frontmatter の項目を省略し、不要な型は `not-needed`、整備済みの型は文書 ID で宣言した。型そのものは新規作成していない。

### 4.1. recipe / template の判断

| rulebook 系統                        | recipe       | template     | 判断根拠                                                                                                   |
| ------------------------------------ | ------------ | ------------ | ---------------------------------------------------------------------------------------------------------- |
| `opr-rulebook`                       | 必要・未整備 | 必要・未整備 | 実行可能性・復旧条件・証跡の深掘りで品質差が出る。実物は rulebook の固定12章を使用している                 |
| `sysd-index-rulebook`                | 不要         | 必要・未整備 | SSOT への導線は規約を満たせば内容がほぼ決まる。実物は固定5章を使用している                                 |
| `sysd-critical-flows-rulebook`       | 必要・未整備 | 必要・未整備 | 最大5件の選定、失敗境界、再実行性の深掘りが必要で、実物は固定5章とフロー別の反復構造を使用している         |
| `sysd-cross-cutting-policy-rulebook` | 必要・未整備 | 必要・未整備 | 横断ルールの抽出、例外、検証方法に品質差が出る。実物は固定5章と Rule ID 単位の反復構造を使用している       |
| `tsd-rulebook`                       | 必要・未整備 | 不要         | 採用理由・設定・検証・運用上の注意の深さに品質差が出る。一方、実物の章数と構成は技術領域ごとに大きく異なる |
| `sysd-rulebook`                      | 必要・未整備 | 不要         | provider 別設計4件で同種の深掘り観点が反復する一方、hub・個別設計・Job設計では章構成が異なる               |

`sysd-rulebook` は recipe の見込みも合わせて確定した。agent 設計4件は約300〜400行で共通の設計観点を持つため recipe を必要とし、同じ系統に hub と Job 設計も含むため固定 template は不要と判断した。

### 4.2. sample の判断

- `ccd-mermaid-rulebook` と `ifd-mermaid-rulebook` は、実在する `specdojo:ccd-sample` と `specdojo:ifd-sample` を宣言した。
- `pjr-rulebook` と `sysd-rulebook` は Markdown 系統であるため sample を必要とし、未整備を表すため `sample` 項目を省略した。
- `sch-rulebook`、`ifx-index-rulebook`、`tml-rulebook` は、`additionalProperties: false`、必須キー、列挙値、入れ子の型を schema が規定する YAML 成果物であるため、PJR-VV3M が認める「構造が schema で完全に決まる YAML 成果物」の例外として `sample: not-needed` を維持した。例外はこの3系統に限定する。
- `cdfd-mermaid-rulebook` は `cdfd-rulebook` から `includes` される記法部品であり、sample のアンカーは主 rulebook が保持する。`specdojo:cdfd-sample` は主 `cdfd-rulebook` が宣言済みであるため、記法部品側の `sample: not-needed` を維持した。例外は、主 rulebook が sample を宣言済みで、成果物から直接参照されない include 専用 rulebook に限定する。

双方向検証で報告されていた `ccd-sample` と `ifd-sample` の未宣言警告は、対応する文書 ID の宣言により解消した。`cdfd-sample` は主 `cdfd-rulebook` の宣言対象であり、検証上の未宣言警告は発生していない。

## 5. 関連ドキュメント

- 要否の判断基準: [[specdojo:kata-guide|実践の型ガイド]]
- 判断基準の決定: [[prj-0001:pjr-qesv-kata-creation-criteria|PJR-QESV 実践の型の要否判断基準]]
- 種別ごとの作成方針: [[prj-0001:pjr-vv3m-kata-creation-policy-by-type|PJR-VV3M 実践の型は種別ごとに作成方針を変える]]
- 宣言先の決定: [[prj-0001:pjr-3n21-kata-declaration-ssot-split|PJR-3N21 実践の型の要否と所在の正本を分ける]]
- 対象を undecided へ集約した項目: [[prj-0001:pjr-xgjk-kata-declaration-migrate-to-rulebook|PJR-XGJK 実践の型の宣言を rulebook frontmatter へ移行する]]
- 矛盾を検出する検証を追加した項目: [[prj-0001:pjr-1z1h-rulebook-sample-declaration-gap|PJR-1Z1H 実践の型の宣言の欠落を埋める]]
