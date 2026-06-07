---
id: specdojo-exec-plan-guide
type: guide
status: draft
---

# SpecDojo 実行プランガイド

本ドキュメントは SpecDojo における **exec plan 実行時の進め方の選び方**を定義する。`mode: edit`（作成・更新）と `mode: review`（レビュー）の両方の exec plan に共通して適用する。

exec plan は「何を」「どこまで」行うかを示すが、「どう進めるか」は対象成果物の rulebook / recipe / sample の整備状況によって変わる。これは作成・更新タスクとレビュータスクの両方に共通する課題であるため、本書はその進め方を **進め方モード**（`approach_mode`）として整理し、状況に応じた選択を支援する。

## 1. このガイドの位置づけ

- exec plan（`exec/plans/<task-id>-plan.md`）は、`specdojo exec build` が `sch-track-<track>.yaml` と成果物カタログから自動生成する。生成内容や実行フローは [specdojo-schedule-and-exec-guide](specdojo-schedule-and-exec-guide.md) を参照する。
- exec plan が示すのは「対象成果物」「done_criteria」「完了手順」「異常終了の条件」であり、成果物をどう作る・どう確認するかは規定しない。
- 本書は、対象成果物に紐づく rulebook / recipe / sample の有無や組み合わせに応じた進め方を **進め方モード** として整理し、選定の基準と内容を示す。レビューでの適用方法は「進め方モードと review の関係」で扱う。
- 個別の成果物に適用する進め方モードは、`sch-strategy-<track>.yaml` の `owner_rules` に `approach_mode` として `local_id` 単位で静的に指定する。本書はモードの定義・選定基準・使い方を扱い、個別の割り当ては `sch-strategy-<track>.yaml` 側で管理する。`local_id` に対する進め方モードは、`mode: edit` と `mode: review` のどちらのタスクにも同じ値を適用する。
- 進め方モードは固定の一覧ではない。対象領域の広がりやプロジェクトの成熟度に応じて、今後追加・改訂される前提で記述する。

## 2. 参照する文書の役割

進め方モードを選ぶ前に、対象成果物に対して何が参照できるかを確認する。各文書の役割は次のとおりである。

| 種別     | 役割                           | 確認できること                       |
| -------- | ------------------------------ | ------------------------------------ |
| rulebook | 成果物として成立するための規約 | 構造、必須項目、禁止事項             |
| recipe   | 良い内容を書くための作り方     | 問い、観点、深掘り手順、レビュー観点 |
| sample   | 完成例                         | 粒度、文体、表の書き方               |

3 種類すべてが揃っているとは限らない。揃っていない組み合わせのときに何を優先するかを決めるのが、進め方モードである。

## 3. 進め方モードの考え方

進め方モードは、`local_id` ごとに次の 2 点を踏まえて選定し、`sch-strategy-<track>.yaml` の `owner_rules` に `approach_mode` として指定する。

- 対象成果物について、rulebook / recipe / sample のうちどれを参照できるか（または整備の見込みがあるか）
- タスクの目的が、成果物を作成・更新／レビューすることか、rulebook / recipe / sample 側を整えることか

owner ロールは、これらを踏まえて「進め方モード一覧」から最も適合するモードを選び、`sch-strategy-<track>.yaml` に指定する。同じ `local_id` であれば、`mode: edit` のタスクと `mode: review` のタスクに同じ進め方モードを適用する。

## 4. 進め方モード一覧

| モード（`approach_mode`）           | 適用条件                                                                             | 入力                                                          | 進め方（`mode: edit` の場合）                                                                                                  | 留意点                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `freeform`（自由形式） | rulebook / recipe / sample のいずれも存在しない、またはタスクの性質上あえて参照しない | 成果物の目的、類似成果物、対象領域の慣行                       | 類似成果物や対象領域の慣行を手がかりに最小限の構成要素を判断し、組み立てる。判断の根拠を成果物または result に残す             | 独自色が強くなりやすい。後から rulebook化する際の材料になるよう、迷った判断点を明示しておく |
| `recipe-guided`（レシピ準拠） | recipe は存在するが rulebook / sample が未整備                                       | recipe の問い、深掘り手順、レビュー観点                        | recipe の章ごとの問いに沿って内容を広げ、レビュー観点で確認する。構造が recipe にない場合は recipe の手順から組み立てる        | recipe にない章や項目が必要になった場合は、rulebook 整備の課題として記録する                 |
| `fully-guided`（統合準拠） | rulebook / recipe / sample がすべて揃っている                                        | rulebook の構造・必須要素・禁止事項、recipe の作り方、sample の完成例 | rulebook で構造と必須要素を確認し、recipe の問いで内容を作り込み、sample で粒度・文体を合わせる。3 文書間に矛盾がある場合は rulebook を正とする | 3 文書をそのまま足し合わせず、対象プロジェクトの文脈に合わせて取捨選択する                   |
| `rule-refinement`（規約改善） | 既存の成果物（複数の実例）を起点に、rulebook / recipe / sample 側を整える            | 既存の成果物群、現行の rulebook / recipe / sample（あれば）   | 既存成果物に共通する構造・良い記述・課題を洗い出し、rulebook（規約）・recipe（作り方）・sample（完成例）として整理し直す       | 個別事情に寄った記述を一般化しすぎない。既存成果物との矛盾が見つかった場合は成果物側の改修候補として記録する |

## 5. 進め方モードと review の関係

進め方モードは `mode: review` のタスクにも同じ基準で選定・適用する。レビューでは「成果物を組み立てる」のではなく「成果物が満たすべき基準に照らして確認する」ため、各モードの進め方は次のように読み替える。

| モード（`approach_mode`）         | review での進め方                                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `freeform`（自由形式）       | 類似成果物や対象領域の慣行と整合しているかを確認し、判断の根拠を review result に残す                               |
| `recipe-guided`（レシピ準拠）  | recipe の章ごとの問いとレビュー観点に照らして確認する                                                               |
| `fully-guided`（統合準拠） | rulebook の必須要素・禁止事項、recipe の作り方、sample の粒度・文体に整合しているかを確認する                       |
| `rule-refinement`（規約改善）     | 既存成果物に共通する構造・良い記述・課題の洗い出しと整理が rulebook / recipe / sample へ反映されているかを確認する |

`done_criteria` や review plan の `レビュー観点`（`RVP-NNN`）が判定基準を示す場合は、それらを優先する。進め方モードは、判定基準だけでは読み取れない「どこまで参照に照らすか」「参照が乏しい場合にどう判断するか」を補う位置づけである。

## 6. モードの確認手順

exec plan を実行する側は、モードを自分で判定するのではなく、`sch-strategy-<track>.yaml` に指定された `approach_mode` を確認して従う。

1. 対象成果物の `local_id` を確認する（exec plan の「対象成果物」セクションで確認する）。
2. `sch-strategy-<track>.yaml` の `owner_rules` を確認し、対象 `local_id` に指定された `approach_mode` を確認する。
3. `approach_mode` が指定されている場合は、タスクの `mode` に応じて「進め方モード一覧」または「進め方モードと review の関係」の該当モードの進め方に従って作業する。
4. `approach_mode` が指定されていない場合は、対応する rulebook / recipe / sample の有無を確認し、最も適合するモードを暫定的に適用する。result に「`approach_mode` 未指定」として記録し、owner ロールへ `sch-strategy-<track>.yaml` への追記を提案する。

## 7. 進め方モードを追加する場合の指針

- モード名（`approach_mode` の値）は英語の kebab-case 識別子とし、入力と進め方が名称から推測できる形にする（例: `recipe-guided`）。「進め方モード一覧」の表では識別子に日本語の読みを括弧書きで併記する。
- 「進め方モード一覧」と同じ列（適用条件、入力、進め方、留意点）、および「進め方モードと review の関係」に review での進め方を追記する。
- 既存モードとの境界（どちらに分類するか迷わない条件）を明示する。
- 追加・改訂した場合は、本書を更新するとともに `sch-strategy.schema.yaml` の `owner_rules[].approach_mode` の `enum` に同じ識別子を追記し、関係するロールへ共有する。

## 8. 関連ドキュメント

- [prj-overview-recipe](../recipes/prj-overview-recipe.md): rulebook / recipe / sample の役割分担の記述例
- [specdojo-schedule-and-exec-guide](specdojo-schedule-and-exec-guide.md): exec plan の生成・実行フロー
- [specdojo-review-guide](specdojo-review-guide.md): review plan / review result の扱いと、進め方モードに基づくレビューの進め方
