---
id: specdojo-exec-plan-guide
type: guide
status: draft
---

# SpecDojo 実行プランガイド

本ドキュメントは SpecDojo における **成果物作成の実行計画立案の進め方**を定義する。

exec plan は「何を」「どこまで」行うかを示すが、「どう作るか」は対象成果物の rulebook / recipe / sample の整備状況によって変わる。本書は、その進め方を **作成モード** として整理し、状況に応じた選択を支援する。

## 1. このガイドの位置づけ

- exec plan（`exec/plans/<task-id>-plan.md`）は、`specdojo exec build` が `sch-track-<track>.yaml` と成果物カタログから自動生成する。生成内容や実行フローは [specdojo-schedule-and-exec-guide](specdojo-schedule-and-exec-guide.md) を参照する。
- exec plan が示すのは「対象成果物」「done_criteria」「完了手順」「異常終了の条件」であり、成果物をどのように組み立てるかは規定しない。
- 本書は、対象成果物に紐づく rulebook / recipe / sample の有無や組み合わせに応じた進め方を **作成モード** として整理し、選定の基準と内容を示す。
- 個別の成果物に適用する作成モードは、`sch-strategy-<track>.yaml` の `owner_rules` に `creation_mode` として `local_id` 単位で静的に指定する。本書はモードの定義・選定基準・使い方を扱い、個別の割り当ては `sch-strategy-<track>.yaml` 側で管理する。
- 作成モードは固定の一覧ではない。対象領域の広がりやプロジェクトの成熟度に応じて、今後追加・改訂される前提で記述する。

## 2. 参照する文書の役割

作成モードを選ぶ前に、対象成果物に対して何が参照できるかを確認する。各文書の役割は次のとおりである。

| 種別     | 役割                           | 確認できること                       |
| -------- | ------------------------------ | ------------------------------------ |
| rulebook | 成果物として成立するための規約 | 構造、必須項目、禁止事項             |
| recipe   | 良い内容を書くための作り方     | 問い、観点、深掘り手順、レビュー観点 |
| sample   | 完成例                         | 粒度、文体、表の書き方               |

3 種類すべてが揃っているとは限らない。揃っていない組み合わせのときに何を優先するかを決めるのが、作成モードである。

## 3. 作成モードの考え方

作成モードは、`local_id` ごとに次の 2 点を踏まえて選定し、`sch-strategy-<track>.yaml` の `owner_rules` に `creation_mode` として指定する。

- 対象成果物について、rulebook / recipe / sample のうちどれを参照できるか（または整備の見込みがあるか）
- タスクの目的が、成果物を作成・更新することか、rulebook / recipe / sample 側を整えることか

owner ロールは、これらを踏まえて「作成モード一覧」から最も適合するモードを選び、`sch-strategy-<track>.yaml` に指定する。

## 4. 作成モード一覧

| モード（`creation_mode`）           | 適用条件                                                                             | 入力                                                          | 進め方                                                                                                                       | 留意点                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `free-creation`（自由作成） | rulebook / recipe / sample のいずれも存在しない、またはタスクの性質上あえて参照しない | 成果物の目的、類似成果物、対象領域の慣行                       | 類似成果物や対象領域の慣行を手がかりに最小限の構成要素を判断し、組み立てる。判断の根拠を成果物または result に残す             | 独自色が強くなりやすい。後から rulebook化する際の材料になるよう、迷った判断点を明示しておく |
| `recipe-expansion`（レシピ展開） | recipe は存在するが rulebook / sample が未整備                                       | recipe の問い、深掘り手順、レビュー観点                        | recipe の章ごとの問いに沿って内容を広げ、レビュー観点で確認する。構造が recipe にない場合は recipe の手順から組み立てる        | recipe にない章や項目が必要になった場合は、rulebook 整備の課題として記録する                 |
| `integrated-creation`（統合作成） | rulebook / recipe / sample がすべて揃っている                                        | rulebook の構造・必須要素・禁止事項、recipe の作り方、sample の完成例 | rulebook で構造と必須要素を確認し、recipe の問いで内容を作り込み、sample で粒度・文体を合わせる。3 文書間に矛盾がある場合は rulebook を正とする | 3 文書をそのまま足し合わせず、対象プロジェクトの文脈に合わせて取捨選択する                   |
| `rule-refinement`（規約改善） | 既存の成果物（複数の実例）を起点に、rulebook / recipe / sample 側を整える            | 既存の成果物群、現行の rulebook / recipe / sample（あれば）   | 既存成果物に共通する構造・良い記述・課題を洗い出し、rulebook（規約）・recipe（作り方）・sample（完成例）として整理し直す       | 個別事情に寄った記述を一般化しすぎない。既存成果物との矛盾が見つかった場合は成果物側の改修候補として記録する |

## 5. モードの確認手順

exec plan を実行する側は、モードを自分で判定するのではなく、`sch-strategy-<track>.yaml` に指定された `creation_mode` を確認して従う。

1. 対象成果物の `local_id` を確認する（exec plan の「対象成果物」セクションで確認する）。
2. `sch-strategy-<track>.yaml` の `owner_rules` を確認し、対象 `local_id` に指定された `creation_mode` を確認する。
3. `creation_mode` が指定されている場合は、「作成モード一覧」の該当モードの進め方に従って作業する。
4. `creation_mode` が指定されていない場合は、対応する rulebook / recipe / sample の有無を確認し、最も適合するモードを暫定的に適用する。result に「`creation_mode` 未指定」として記録し、owner ロールへ `sch-strategy-<track>.yaml` への追記を提案する。

## 6. 作成モードを追加する場合の指針

- モード名（`creation_mode` の値）は英語の kebab-case 識別子とし、入力と進め方が名称から推測できる形にする（例: `recipe-expansion`）。「作成モード一覧」の表では識別子に日本語の読みを括弧書きで併記する。
- 「作成モード一覧」と同じ列（適用条件、入力、進め方、留意点）で追記する。
- 既存モードとの境界（どちらに分類するか迷わない条件）を明示する。
- 追加・改訂した場合は、本書を更新するとともに `sch-strategy.schema.yaml` の `owner_rules[].creation_mode` の `enum` に同じ識別子を追記し、関係するロールへ共有する。

## 7. 関連ドキュメント

- [prj-overview-recipe](../recipes/prj-overview-recipe.md): rulebook / recipe / sample の役割分担の記述例
- [specdojo-schedule-and-exec-guide](specdojo-schedule-and-exec-guide.md): exec plan の生成・実行フロー
- [specdojo-review-guide](specdojo-review-guide.md): レビュー観点の扱い方
