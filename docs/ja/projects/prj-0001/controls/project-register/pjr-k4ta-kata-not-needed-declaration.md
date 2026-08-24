---
specdojo:
  id: prj-0001:pjr-k4ta-kata-not-needed-declaration
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: BA
  registered_at: "2026-08-23T04:52:41Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-24T09:43:33Z"
  conclusion: 成果物カタログの各成果物へ rulebook / recipe / sample / template の要否を宣言できるようにし、不要と判断した型は not-needed と明示する仕組みを導入した。kata-guide に4種それぞれの作る条件と作らない条件を追加し、catalog build が宣言の実在性を検証、schedule assessment が not-needed の型を維持タスクの対象から外すようにした。prj-0001 の全成果物へ要否を宣言し、ID宣言496件はすべて実在する型へ解決する。未作成成果物への一律の not-needed は PJR-JT1Y で undecided へ移行した。
---

# PJR-K4TA 実践の型の要否宣言を導入し、既存の実践の型を棚卸しする

## 1. 概要

PJR-QESV の決定に基づき、成果物カタログへ実践の型の要否を宣言できるようにする。作らないと判断した型は not-needed として記録し、未整備と区別する。strategy 生成では not-needed の型に対応する maintenance フェーズを生成しない。あわせて ryu-guide の bootstrap と freeform の記述を決定内容へ揃え、既存の rulebook 106 件、recipe 19 件、sample 107 件、template 93 件を基準に照らして分類する。

棚卸し（作業項目7）は一括の調査として行う。成果物ごとに maintenance タスクを生成する方式は、84 種別 × 4 種で膨大な数になり、基準が固まった直後は判断がまとめて付くため利点が小さい。

新しい approach は追加しない。要否の判断は `bootstrap`（新規の立ち上げ）と maintenance 系（既存の見直し）に内包できる。

## 2. 完了条件

- 成果物カタログの schema が、成果物ごとに実践の型（rulebook / recipe / sample / template）の要否を宣言できる。作らないと判断した型は `not-needed` として記録でき、未整備（宣言なし）と区別できる。
- `catalog validate` が、宣言された実践の型の doc id が実在することを検証する。存在しない ID の宣言はエラーになる。
- strategy 生成が、`not-needed` と宣言された型に対応する `*-maintenance` のフェーズを生成しない。
- approach の判定で `not-needed` を欠落として扱わない。必要と判断した型がすべて揃っていれば `fully-guided` を選べる。
- [[specdojo:ryu-guide|実践の進め方ガイド]] の `bootstrap` が「必要と判断した型を揃える」と読める記述になり、どの型を作るかの判断が初期整備の作業に含まれることが分かる。
- 同ガイドの `freeform` に、実践の型に頼れない場合に代わりに根拠とするもの（カタログの `done_criteria`、schema、既存の類似成果物）が明記されている。
- 実践の型の作成条件が guide または standard に記載され、PJR-QESV の決定内容と一致する。
- 既存の実践の型（rulebook 106 件、recipe 19 件、sample 107 件、template 93 件）が基準に照らして分類され、`not-needed` と未整備が宣言へ反映されている。
- `npm run validate:schema`、`npm run validate:catalog`、`npm run lint:md`、`npm run test:unit` が成功する。

## 3. 作業内容

| No  | 作業                                                         | 担当 | 状態 | メモ                                                                         |
| --- | ------------------------------------------------------------ | ---- | ---- | ---------------------------------------------------------------------------- |
| 1   | 要否宣言の項目設計と schema 追加                             | BA   | done | 既存の `rulebook: none` との関係を整理する                                   |
| 2   | 宣言された実践の型の実在検証を `catalog validate` へ追加     | BA   | done | 存在しない ID の宣言を検出する。`dct-planning.yaml` の `tml-rulebook` が実例 |
| 3   | `not-needed` の型に対応する maintenance フェーズを生成しない | BA   | done | `src/schedule-strategy-profiles.ts` の maintenance pass                      |
| 4   | approach 判定で `not-needed` を欠落扱いしない                | BA   | done | assessment と strategy 生成の両方を確認する                                  |
| 5   | `ryu-guide` の `bootstrap` と `freeform` の記述を更新        | BA   | done | 一式の意味、頼れない場合の根拠を明記する                                     |
| 6   | 作成条件を guide または standard へ記載                      | BA   | done | 記載先は `kata-guide` か新設の standard を検討する                           |
| 7   | 既存の実践の型を基準に照らして棚卸しする                     | BA   | done | 一括の調査として行い、成果物ごとの個別タスクには分割しない                   |
| 8   | 棚卸し結果を宣言へ反映する                                   | BA   | done | `not-needed` と未整備を区別して記録する                                      |

## 4. 対応結果

- `dct.schema.yaml` とカタログ型へ `rulebook` / `recipe` / `sample` / `template` の要否宣言を追加した。文書 ID は必要かつ整備済み、`not-needed` は不要と判断済み、項目省略は要否未判断または必要だが未整備を表す。
- `catalog validate` へ宣言 ID の形式・実在・文書内 ID 整合の検証を追加し、`schedule assessment` では `not-needed` を欠落とみなさず、必要な型がすべて利用可能なら `fully-guided` を選べるようにした。`not-needed` の型を指定した maintenance は strategy へ生成しない。
- [[specdojo:kata-guide|実践の型活用ガイド]] に4種の作成条件、[[specdojo:ryu-guide|実践の進め方ガイド]] に必要な型だけを整える `bootstrap` と、`done_criteria`・schema・類似成果物を根拠にする `freeform` を記載した。
- 26件の DCT template、27件のプロジェクト DCT、1件の DCT sample、計345エントリを一括棚卸しした。宣言結果は rulebook が ID 321・`not-needed` 3・未宣言21、recipe が ID 47・`not-needed` 277・未宣言21、sample が ID 289・`not-needed` 35・未宣言21、template が ID 48・`not-needed` 276・未宣言21となった。テンプレートとプロジェクト DCT の重複エントリを含む集計である。
- 登録時の基準件数に対し、実行時の実ファイルは rulebook 106件・recipe 19件・sample 106件・template 92件だった。sample と template は各1件少なかったため、実在する全ファイルを棚卸しの基準とした。
- 未宣言21件には、実践の型を元から宣言していない管理・生成成果物と、参照先が未整備の `mtp-index` / `uis-index` / `bds-index` を含む。`not-needed` へ推測で確定せず、未整備として区別した。

## 5. 関連ドキュメント

- 根拠となる決定: [[prj-0001:pjr-qesv-kata-creation-criteria|PJR-QESV 実践の型は必要なものだけ作り、不要と判断した結果を宣言に残す]]
- approach の分岐: [[specdojo:ryu-guide|実践の進め方ガイド]]
- 実践の型の役割: [[specdojo:kata-guide|実践の型活用ガイド]]
- 変更対象の実装: `src/schedule-strategy-profiles.ts` の maintenance pass、`src/catalog-build.ts` の検証
- 不整合が顕在化した宣言: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-planning.yaml`
