---
specdojo:
  id: specdojo-reference-materials-guide
  type: guide
  status: draft
---

# 参考資料活用ガイド

本ドキュメントは SpecDojo における **exec plan 実行時に rulebook / recipe / sample / template をどう参照するか**を定義する。`mode: edit`（作成・更新）と `mode: review`（レビュー）の両方の exec plan に共通して適用する。

`reference` は一覧・比較のための文書種別であり、本書でいう exec plan の参考資料種別には含めない。

exec plan は「何を」「どこまで」行うかを示すが、対象成果物に紐づく rulebook / recipe / sample / template をどう使うかは規定しない。本書はその参照の仕方を、`approach`（進め方）というタスクメタデータに基づいて整理する。

**対象読者**

- exec plan に従って成果物を作成・更新・レビューする人、エージェント、exec 設定の保守者

**この文書で分かること**

- rulebook・recipe・sample・template の役割、`approach` に応じた参照方法、参考資料メンテナンスとレビューへの適用

**次に読む文書**

- plan・result の生成規則は [plan/resultライフサイクルガイド](specdojo-plan-result-lifecycle-guide.md)、実行手順は [exec運用ガイド](specdojo-exec-operation-guide.md)、レビュー手順は [レビューガイド](specdojo-review-guide.md) を参照してください。

## 1. このガイドの位置づけ

- exec plan（`exec/plans/<task-id>-plan.md`）は、`specdojo exec plan` または `specdojo exec run` が `sch-track-<track>.yaml` と成果物カタログからオンデマンド生成する。生成内容は [specdojo-plan-result-lifecycle-guide](specdojo-plan-result-lifecycle-guide.md)、実行フローは [specdojo-exec-operation-guide](specdojo-exec-operation-guide.md) を参照する。
- exec plan が示すのは「対象成果物」「完了の狙い（edit）/ レビュー観点（review）」「完了手順」「異常終了の条件」であり、参考資料をどう使うかは規定しない。
- 本書は、`approach` に基づく参照の進め方（`approach` による進め方の使い分け）、参考資料を見直す進め方の扱い（参考資料メンテナンスの進め方）、それらをタスクから確認する手順（エージェントの確認手順）を示す。レビューでの適用方法は「review への適用」で扱う。

## 2. 参照する文書の役割

参考資料として参照する文書の役割は次のとおりである。

| 種別     | 役割                           | 確認できること                                     |
| -------- | ------------------------------ | -------------------------------------------------- |
| rulebook | 成果物として成立するための規約 | 構造、必須項目、禁止事項                           |
| recipe   | 良い内容を書くための作り方     | 問い、観点、深掘り手順、レビュー観点               |
| sample   | 完成例                         | 粒度、文体、表の書き方                             |
| template | 成果物の雛形                   | 章構成の骨組み、記述すべき箇所を示すプレースホルダ |

template は、記述する部分を _TODO_ などのプレースホルダとして配置した雛形である。内容が埋まった完成例である sample と役割を分担し、成果物作成の開始点として使う。

4 種類すべてが揃っているとは限らない。揃っていない場合の進め方は「`approach` による進め方の使い分け」で扱う。

### 2.1. プロジェクトコンテキスト

プロジェクトコンテキストは、成果物ごとの作成順序・根拠関係を表す `depends_on` と分離して、プロジェクト共通の Why、用語、判断原則を実行 agent へ渡す仕組みである。`specdojo.config.json` の project 単位で、文書 ID の配列として設定する。

```json
{
  "projects": {
    "prj-0001": {
      "project_context": ["prj-overview"]
    }
  }
}
```

- `project_context` を省略した場合の既定値は `["prj-overview"]` とする。
- 空配列 `[]` を設定すると、その project の project context を無効化できる。
- project 修飾のない ID は、plan 生成時に対象 project の ID で修飾する。既に project 修飾された ID はそのまま使う。
- project context は、成果物を解決できる agent 向け edit / review plan に適用する。`freeform` や `bootstrap` も対象に含む。
- `rulebook-maintenance` / `recipe-maintenance` / `sample-maintenance` / `template-maintenance`、human 向け `finalize`、成果物を伴わない機械的タスク、project context 文書自身を対象とするタスクには追加しない。
- project context は plan 本文の参照範囲だけを広げる。schedule の実行順序、カタログの `depends_on` / `based_on`、plan frontmatter の `targets` と commit 許可範囲には追加しない。

agent は plan に列挙された project context を作業開始前に読み、成果物の目的・用語・判断をプロジェクトレベルの Why と整合させる。Why の全文を各成果物へ再掲せず、対象成果物の責務に必要な結論・影響だけを反映する。

## 3. `approach` による進め方の使い分け

`approach` は、タスクの進め方プロファイルである。`fully-guided` / `recipe-guided` / `freeform` は、対象成果物の rulebook / recipe / sample / template の整備状況に応じて、エージェントが参考資料をどの程度参照するかを示す。`bootstrap` は、成果物と参考資料一式を同じタスクで一貫して初期作成する進め方を示す。`cross-deliverable-dedup` は、明示した成果物群の正本を選び、重複を要約と参照へ置き換える進め方を示す。`rulebook-maintenance` / `recipe-maintenance` / `sample-maintenance` / `template-maintenance` は、成果物を根拠に対象の参考資料を見直す進め方を示す（詳細は「参考資料メンテナンスの進め方」）。`finalize` / `bootstrap-finalize` は `execution: human` と組み合わせて使う確定プロファイルであり、human が対象を最終確認して frontmatter の `status` を `ready` へ昇格する（`ready` への昇格は human のみが行える）。整備状況の判断は人が行い、`sch-strategy-<track>.yaml` のフェーズ、`cross_deliverable_passes`、または `owner_rules[].phase_overrides[]` に明示する（owner rule の override が優先される）。エージェントは参考資料の品質判定を行わず、`approach` に示された進め方に従う。

| `approach`                | 参照方針                                         | 進め方                                                                                                                                                                                                         |
| ------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fully-guided`            | rulebook / recipe / sample / template を参照する | template があれば雛形として開始点に使い、rulebook で構造・必須要素・禁止事項を確認し、recipe の問いと深掘り手順に沿って内容を組み立て、sample で粒度・文体・表の書き方を合わせる。プレースホルダは残さず埋める |
| `recipe-guided`           | recipe を主に参照する                            | rulebook / sample / template は未成熟と判断されているため、recipe が示す構成・問い・観点だけを使って組み立てる。rulebook / sample / template が存在しても構造・文体の基準にはしない                            |
| `freeform`                | 参考資料に原則縛られない                         | 参考資料より、対象領域の類似成果物の実例やプロジェクト文脈（背景・目的・関係者の意図）を優先して組み立てる。参考資料は矛盾しない範囲の参考にとどめる                                                           |
| `bootstrap`               | 成果物と参考資料を同時に整備する                 | 成果物と rulebook / recipe / sample / template を同じタスクで初期作成し、構造・用語・粒度が互いに矛盾しない一式として揃える                                                                                    |
| `cross-deliverable-dedup` | 成果物群の正本選択と重複整理を行う               | scope 内の成果物だけを横断し、詳細を正本へ集約して他文書を要約・参照化する。参考資料は変更せず、各成果物の必須情報と追跡性を維持する                                                                           |
| `rulebook-maintenance`    | 成果物を根拠に rulebook を見直す                 | 参照の向きを「成果物 → rulebook」に切り替え、章構成・必須項目・禁止事項・判定基準の妥当性を見直す（「参考資料メンテナンスの進め方」を参照する）                                                                |
| `recipe-maintenance`      | 成果物を根拠に recipe を見直す                   | 参照の向きを「成果物 → recipe」に切り替え、問い・観点・深掘り手順・レビュー観点の有効性を見直す（「参考資料メンテナンスの進め方」を参照する）                                                                  |
| `sample-maintenance`      | 成果物を根拠に sample を見直す                   | 参照の向きを「成果物 → sample」に切り替え、粒度・文体・表の書き方が完成例として適切かを見直す（「参考資料メンテナンスの進め方」を参照する）                                                                    |
| `template-maintenance`    | 成果物を根拠に template を見直す                 | 参照の向きを「成果物 → template」に切り替え、章構成の骨組みとプレースホルダの配置・網羅性を見直す（「参考資料メンテナンスの進め方」を参照する）                                                                |
| `finalize`                | 成果物のみを human が確定する                    | human が `done_criteria` を最終確認し、必要なら最小限の修正を加えて、成果物 frontmatter の `status` を `ready` へ昇格する。参考資料は対象に含めない                                                            |
| `bootstrap-finalize`      | 成果物と参考資料を human がまとめて確定する      | `bootstrap` と対になる確定作業。human が成果物と rulebook / recipe / sample / template を最終確認し、それぞれの frontmatter の `status` を `ready` へ昇格する                                                  |

複数の文書間で記述に矛盾がある場合、`fully-guided` では rulebook（規約）を優先する（template の章構成が rulebook と食い違う場合も rulebook を正とする）。`recipe-guided` では rulebook を参照範囲に含めないため、recipe の指示を優先する。

判断の根拠を成果物または result に残す。特に `recipe-guided` / `freeform` では、rulebook / sample / template を基準にしなかった理由と、代わりに何を判断の根拠にしたかを明示する。後から rulebook / recipe / sample / template を整備する際の材料になる。

`fully-guided` / `recipe-guided` および `approach` 未指定では、参照してよい文書を exec plan に記載されたもの（対象成果物に紐づく rulebook / recipe / sample / template、`対象成果物` セクションの `depends_on` 成果物、プロジェクトコンテキスト）に限定する。plan に列挙されていない他のプロジェクト文書を独自に探索・参照しない。`freeform` は対象領域の類似成果物の実例やプロジェクト文脈を参照する進め方であるため、この限定の対象外とする。

`fully-guided` / `recipe-guided` および `approach` 未指定では、対象成果物の既存記述を尊重する。既存記述の破棄や全面的な書き換えは原則として行わず、`depends_on` の最新の決定事項と明確に矛盾する箇所のみ最小限を修正し、不足分は既存記述を基礎に加筆・補強する。`freeform` は参考資料より類似成果物の実例やプロジェクト文脈を優先して組み立てる進め方であるため、この尊重方針の対象外とする。

`done_criteria` や review plan の `レビュー観点`（`RVP-NNN`）が判定基準を示す場合は、それらを優先する。本章は、判定基準だけでは読み取れない「どこまで参照に照らすか」を補う位置づけである。

## 4. 参考資料メンテナンスの進め方

`rulebook-maintenance` / `recipe-maintenance` / `sample-maintenance` / `template-maintenance` は、通常の成果物作業とは参照の向きが逆になる進め方である。作成・更新かレビューかを `mode`（`edit` / `review`）で表す点は他の `approach` と同じである。

| `approach`                                    | 参照の向き                                                           |
| --------------------------------------------- | -------------------------------------------------------------------- |
| `fully-guided` / `recipe-guided` / `freeform` | rulebook / recipe / sample / template → 成果物                       |
| `bootstrap`                                   | 成果物 ↔ rulebook / recipe / sample / template（一式として初期整備） |
| `cross-deliverable-dedup`                     | scope 内の成果物 ↔ 成果物（正本選択と参照化）                        |
| `rulebook-maintenance`                        | 成果物 → rulebook（参照の向きが逆になる）                            |
| `recipe-maintenance`                          | 成果物 → recipe（参照の向きが逆になる）                              |
| `sample-maintenance`                          | 成果物 → sample（参照の向きが逆になる）                              |
| `template-maintenance`                        | 成果物 → template（参照の向きが逆になる）                            |

メンテナンスのタスクでは、対象の参考資料を「見直す対象」として扱い、複数の成果物・review result・対象領域の慣行を根拠に、次の観点で妥当性を見直す。

| `approach`             | 見直す対象 | 主な見直し観点                                                   |
| ---------------------- | ---------- | ---------------------------------------------------------------- |
| `rulebook-maintenance` | rulebook   | 章構成、必須項目、禁止事項、判定基準                             |
| `recipe-maintenance`   | recipe     | 問い、観点、深掘り手順、レビュー観点                             |
| `sample-maintenance`   | sample     | 粒度、文体、表の書き方、完成例としての妥当性                     |
| `template-maintenance` | template   | 章構成の骨組み、プレースホルダの配置・網羅性、雛形としての妥当性 |

参考資料メンテナンスは自動で差し込まれない。必要な場合は、`approach: rulebook-maintenance` のように対象を指定した phase / phase_set を `sch-strategy-<track>.yaml` に明示的に記述する。

## 5. エージェントの確認手順

1. exec plan の frontmatter で `approach` の有無と値を確認する（生成元は `sch-strategy-<track>.yaml` のフェーズまたは `owner_rules[].phase_overrides[]` であり、後者が優先される）。
2. `approach` が `rulebook-maintenance` / `recipe-maintenance` / `sample-maintenance` / `template-maintenance` の場合は「参考資料メンテナンスの進め方」に従い、参照の向きを成果物 → 対象の参考資料に切り替える。
3. それ以外の場合は、対象成果物に紐づく rulebook / recipe / sample / template の有無と、exec plan のプロジェクトコンテキストを確認する。
4. `approach` が指定されている場合は「`approach` による進め方の使い分け」の表に従って参照範囲を決め、未指定の場合は存在するすべての参考資料をそれぞれの役割に沿って活用する。
5. 参照した文書・参照しなかった文書と、その判断根拠を成果物または result に記録する。

## 6. review への適用

review でも「`approach` による進め方の使い分け」を同じ基準で適用する。レビューでは「成果物を組み立てる」のではなく「成果物が満たすべき基準に照らして確認する」ため、次のように読み替える。

通常の成果物編集を行う edit plan は観点別の自己レビューを行わず、`done_criteria` を「完了の狙い」として提示するにとどめる。多観点での判定と証跡は独立した review plan が担う。以下の `approach` ごとの参照方針は、edit 時の記述と review plan の双方に適用する。

- `fully-guided`: rulebook の必須要素・禁止事項、recipe の問いとレビュー観点、sample の粒度・文体との整合を確認する。template がある場合は、章構成が雛形と整合しているか、プレースホルダが残っていないかを確認する。
- `recipe-guided`: recipe の問いとレビュー観点に照らして確認し、rulebook / sample / template の構造・文体は基準にしない。
- `freeform`: 参考資料より、対象領域の類似成果物の実例やプロジェクト文脈との整合を確認する。
- `rulebook-maintenance` / `recipe-maintenance` / `sample-maintenance` / `template-maintenance`: 「参考資料メンテナンスの進め方」に従い、対象の参考資料が見直しに値するかという向きで確認観点を読み替える。
- 判断の根拠を review result に残す。

## 7. 関連ドキュメント

- [プロジェクト概要 作成レシピ](../recipes/prj-overview-recipe.md): rulebook / recipe / sample の役割分担の記述例
- [plan/resultライフサイクルガイド](specdojo-plan-result-lifecycle-guide.md): exec plan / result の生成、命名、アーカイブ
- [exec運用ガイド](specdojo-exec-operation-guide.md): exec plan を使った実行フロー
- [レビューガイド](specdojo-review-guide.md): review plan / review result の扱いと、参考資料の活用方法
- [exec設定ガイド](specdojo-exec-config-guide.md): `approach` を含む phase の実行要件
