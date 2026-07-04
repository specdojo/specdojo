---
specdojo:
  id: specdojo-reference-materials-guide
  type: guide
  status: draft
---

# SpecDojo 参考資料活用ガイド

本ドキュメントは SpecDojo における **exec plan 実行時に rulebook / recipe / sample / template をどう参照するか**を定義する。`mode: edit`（作成・更新）と `mode: review`（レビュー）の両方の exec plan に共通して適用する。

exec plan は「何を」「どこまで」行うかを示すが、対象成果物に紐づく rulebook / recipe / sample / template をどう使うかは規定しない。本書はその参照の仕方を、`approach`（進め方）というタスクメタデータに基づいて整理する。

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

template は、記述する部分を `_TODO_` などのプレースホルダとして配置した雛形である。内容が埋まった完成例である sample と役割を分担し、成果物作成の開始点として使う。

4 種類すべてが揃っているとは限らない。揃っていない場合の進め方は「`approach` による進め方の使い分け」で扱う。

## 3. `approach` による進め方の使い分け

`approach` は、タスクの進め方プロファイルである。`fully-guided` / `recipe-guided` / `freeform` は、対象成果物の rulebook / recipe / sample / template の整備状況に応じて、エージェントが参考資料をどの程度参照するかを示す。`bootstrap` は、成果物と参考資料一式を同じタスクで一貫して初期作成する進め方を示す。`rulebook-maintenance` / `recipe-maintenance` / `sample-maintenance` / `template-maintenance` は、成果物を根拠に対象の参考資料を見直す進め方を示す（詳細は「参考資料メンテナンスの進め方」）。整備状況の判断は人が行い、`sch-strategy-<track>.yaml` のフェーズまたは `owner_rules[].phase_overrides[]` に明示する（後者が優先される）。エージェントは参考資料の品質判定を行わず、`approach` に示された進め方に従う。

| `approach`             | 参照方針                                         | 進め方                                                                                                                                                                                                         |
| ---------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fully-guided`         | rulebook / recipe / sample / template を参照する | template があれば雛形として開始点に使い、rulebook で構造・必須要素・禁止事項を確認し、recipe の問いと深掘り手順に沿って内容を組み立て、sample で粒度・文体・表の書き方を合わせる。プレースホルダは残さず埋める |
| `recipe-guided`        | recipe を主に参照する                            | rulebook / sample / template は未成熟と判断されているため、recipe が示す構成・問い・観点だけを使って組み立てる。rulebook / sample / template が存在しても構造・文体の基準にはしない                            |
| `freeform`             | 参考資料に原則縛られない                         | 参考資料より、対象領域の類似成果物の実例やプロジェクト文脈（背景・目的・関係者の意図）を優先して組み立てる。参考資料は矛盾しない範囲の参考にとどめる                                                           |
| `bootstrap`            | 成果物と参考資料を同時に整備する                 | 成果物と rulebook / recipe / sample / template を同じタスクで初期作成し、構造・用語・粒度が互いに矛盾しない一式として揃える                                                                                    |
| `rulebook-maintenance` | 成果物を根拠に rulebook を見直す                 | 参照の向きを「成果物 → rulebook」に切り替え、章構成・必須項目・禁止事項・判定基準の妥当性を見直す（「参考資料メンテナンスの進め方」を参照する）                                                                |
| `recipe-maintenance`   | 成果物を根拠に recipe を見直す                   | 参照の向きを「成果物 → recipe」に切り替え、問い・観点・深掘り手順・レビュー観点の有効性を見直す（「参考資料メンテナンスの進め方」を参照する）                                                                  |
| `sample-maintenance`   | 成果物を根拠に sample を見直す                   | 参照の向きを「成果物 → sample」に切り替え、粒度・文体・表の書き方が完成例として適切かを見直す（「参考資料メンテナンスの進め方」を参照する）                                                                    |
| `template-maintenance` | 成果物を根拠に template を見直す                 | 参照の向きを「成果物 → template」に切り替え、章構成の骨組みとプレースホルダの配置・網羅性を見直す（「参考資料メンテナンスの進め方」を参照する）                                                                |

複数の文書間で記述に矛盾がある場合、`fully-guided` では rulebook（規約）を優先する（template の章構成が rulebook と食い違う場合も rulebook を正とする）。`recipe-guided` では rulebook を参照範囲に含めないため、recipe の指示を優先する。

判断の根拠を成果物または result に残す。特に `recipe-guided` / `freeform` では、rulebook / sample / template を基準にしなかった理由と、代わりに何を判断の根拠にしたかを明示する。後から rulebook / recipe / sample / template を整備する際の材料になる。

`fully-guided` / `recipe-guided` および `approach` 未指定では、参照してよい文書を exec plan に記載されたもの（対象成果物に紐づく rulebook / recipe / sample / template と、`対象成果物` セクションの `depends_on` 成果物）に限定する。plan に列挙されていない他のプロジェクト文書を独自に探索・参照しない。`freeform` は対象領域の類似成果物の実例やプロジェクト文脈を参照する進め方であるため、この限定の対象外とする。

`fully-guided` / `recipe-guided` および `approach` 未指定では、対象成果物の既存記述を尊重する。既存記述の破棄や全面的な書き換えは原則として行わず、`depends_on` の最新の決定事項と明確に矛盾する箇所のみ最小限を修正し、不足分は既存記述を基礎に加筆・補強する。`freeform` は参考資料より類似成果物の実例やプロジェクト文脈を優先して組み立てる進め方であるため、この尊重方針の対象外とする。

`done_criteria` や review plan の `レビュー観点`（`RVP-NNN`）が判定基準を示す場合は、それらを優先する。本章は、判定基準だけでは読み取れない「どこまで参照に照らすか」を補う位置づけである。

## 4. 参考資料メンテナンスの進め方

`rulebook-maintenance` / `recipe-maintenance` / `sample-maintenance` / `template-maintenance` は、通常の成果物作業とは参照の向きが逆になる進め方である。作成・更新かレビューかを `mode`（`edit` / `review`）で表す点は他の `approach` と同じである。

| `approach`                                    | 参照の向き                                                           |
| --------------------------------------------- | -------------------------------------------------------------------- |
| `fully-guided` / `recipe-guided` / `freeform` | rulebook / recipe / sample / template → 成果物                       |
| `bootstrap`                                   | 成果物 ↔ rulebook / recipe / sample / template（一式として初期整備） |
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
3. それ以外の場合は、対象成果物に紐づく rulebook / recipe / sample / template の有無を確認する（exec plan の「対象成果物」セクション、またはカタログの登録情報で確認する）。
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

- [prj-overview-recipe](../recipes/prj-overview-recipe.md): rulebook / recipe / sample の役割分担の記述例
- [specdojo-plan-result-lifecycle-guide](specdojo-plan-result-lifecycle-guide.md): exec plan / result の生成、命名、アーカイブ
- [specdojo-exec-operation-guide](specdojo-exec-operation-guide.md): exec plan を使った実行フロー
- [specdojo-review-guide](specdojo-review-guide.md): review plan / review result の扱いと、参考資料の活用方法
- [specdojo-exec-config-guide](specdojo-exec-config-guide.md): `approach` を含む phase の実行要件
