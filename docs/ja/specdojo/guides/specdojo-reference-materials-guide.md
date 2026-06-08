---
id: specdojo-reference-materials-guide
type: guide
status: draft
---

# SpecDojo 参考資料活用ガイド

本ドキュメントは SpecDojo における **exec plan 実行時に rulebook / recipe / sample をどう参照するか**を定義する。`mode: edit`（作成・更新）と `mode: review`（レビュー）の両方の exec plan に共通して適用する。

exec plan は「何を」「どこまで」行うかを示すが、対象成果物に紐づく rulebook / recipe / sample をどう使うかは規定しない。本書はその参照の仕方を、`approach_mode`（参照方針）と `task_kind`（作業対象）という2つのタスクメタデータに基づいて整理する。

## 1. このガイドの位置づけ

- exec plan（`exec/plans/<task-id>-plan.md`）は、`specdojo exec build` が `sch-track-<track>.yaml` と成果物カタログから自動生成する。生成内容や実行フローは [specdojo-schedule-and-exec-guide](specdojo-schedule-and-exec-guide.md) を参照する。
- exec plan が示すのは「対象成果物」「done_criteria」「完了手順」「異常終了の条件」であり、参考資料をどう使うかは規定しない。
- 本書は、`approach_mode` に基づく参照の進め方（`approach_mode` による進め方の使い分け）、`task_kind` が示す作業対象の扱い（`task_kind` による作業対象の伝達）、それらをタスクから確認する手順（エージェントの確認手順）を示す。レビューでの適用方法は「review への適用」で扱う。

## 2. 参照する文書の役割

参考資料として参照する文書の役割は次のとおりである。

| 種別     | 役割                           | 確認できること                       |
| -------- | ------------------------------ | ------------------------------------ |
| rulebook | 成果物として成立するための規約 | 構造、必須項目、禁止事項             |
| recipe   | 良い内容を書くための作り方     | 問い、観点、深掘り手順、レビュー観点 |
| sample   | 完成例                         | 粒度、文体、表の書き方               |

3 種類すべてが揃っているとは限らない。揃っていない場合の進め方は「`approach_mode` による進め方の使い分け」で扱う。

## 3. `approach_mode` による進め方の使い分け

`approach_mode` は、対象成果物の rulebook / recipe / sample の整備状況に応じて、エージェントが参考資料をどの程度参照するかを示す。整備状況の判断は人が行い、`sch-strategy-<track>.yaml` のフェーズまたは `owner_rules[].phase_overrides[]` に明示する（後者が優先される）。エージェントは参考資料の品質判定を行わず、`approach_mode` に示された進め方に従う。

| `approach_mode` | 参照方針                       | 進め方                                                                                                                       |
| --------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `fully-guided`  | rulebook / recipe / sample を参照する | rulebook で構造・必須要素・禁止事項を確認し、recipe の問いと深掘り手順に沿って内容を組み立て、sample で粒度・文体・表の書き方を合わせる |
| `recipe-guided` | recipe を主に参照する          | rulebook / sample は未成熟と判断されているため、recipe が示す構成・問い・観点だけを使って組み立てる。rulebook / sample が存在しても構造・文体の基準にはしない |
| `freeform`      | 参考資料に原則縛られない       | 参考資料より、対象領域の類似成果物の実例やプロジェクト文脈（背景・目的・関係者の意図）を優先して組み立てる。参考資料は矛盾しない範囲の参考にとどめる |

複数の文書間で記述に矛盾がある場合、`fully-guided` では rulebook（規約）を優先する。`recipe-guided` では rulebook を参照範囲に含めないため、recipe の指示を優先する。

判断の根拠を成果物または result に残す。特に `recipe-guided` / `freeform` では、rulebook / sample を基準にしなかった理由と、代わりに何を判断の根拠にしたかを明示する。後から rulebook / recipe / sample を整備する際の材料になる。

`done_criteria` や review plan の `レビュー観点`（`RVP-NNN`）が判定基準を示す場合は、それらを優先する。本章は、判定基準だけでは読み取れない「どこまで参照に照らすか」を補う位置づけである。

## 4. `task_kind` による作業対象の伝達

`task_kind` は、タスクの対象を表す補助メタデータである。作成・更新かレビューかは `mode`（`edit` / `review`）で表し、`task_kind` では通常成果物作業か参考資料メンテナンスかを区別する。`sch-strategy-<track>.yaml` のフェーズまたは `owner_rules[].phase_overrides[]` に明示する（後者が優先される）。

| `task_kind`             | 意味                                                   | 参照の向き                                                |
| ----------------------- | ------------------------------------------------------ | ---------------------------------------------------------- |
| `deliverable`           | 通常の成果物を作成・更新・レビューする                 | rulebook / recipe / sample → 成果物                        |
| `reference-maintenance` | 成果物から rulebook / recipe / sample を改善する       | 成果物 → rulebook / recipe / sample（参照の向きが逆になる） |

`task_kind` が省略されている場合は、`deliverable` として扱う。`mode: edit` では通常の成果物作成・更新、`mode: review` では通常の成果物レビューとして扱う。

`reference-maintenance` のタスクでは、対象の rulebook / recipe / sample を「見直す対象」として扱い、複数の成果物・review result・対象領域の慣行を根拠に、構造・問い・禁止事項・サンプルとしての妥当性を見直す。この場合の `approach_mode` は、rulebook / recipe / sample 自体の改善方針ではなく、改善の手がかりとして他の参考資料をどう使うかを示す。

参考資料メンテナンスは自動で差し込まれない。必要な場合は、`task_kind: reference-maintenance` の phase / phase_set を `sch-strategy-<track>.yaml` に明示的に記述する。

## 5. エージェントの確認手順

1. exec plan の frontmatter で `approach_mode` ・ `task_kind` の有無と値を確認する（生成元は `sch-strategy-<track>.yaml` のフェーズまたは `owner_rules[].phase_overrides[]` であり、後者が優先される）。
2. `task_kind` が `reference-maintenance` の場合は「`task_kind` による作業対象の伝達」に従い、参照の向きを成果物 → 参考資料に切り替える。
3. それ以外（`deliverable` または未指定）の場合は、対象成果物に紐づく rulebook / recipe / sample の有無を確認する（exec plan の「対象成果物」セクション、またはカタログの登録情報で確認する）。
4. `approach_mode` が指定されている場合は「`approach_mode` による進め方の使い分け」の表に従って参照範囲を決め、未指定の場合は存在するすべての参考資料をそれぞれの役割に沿って活用する。
5. 参照した文書・参照しなかった文書と、その判断根拠を成果物または result に記録する。

## 6. review への適用

review でも「`approach_mode` による進め方の使い分け」と「`task_kind` による作業対象の伝達」を同じ基準で適用する。レビューでは「成果物を組み立てる」のではなく「成果物が満たすべき基準に照らして確認する」ため、次のように読み替える。

- `fully-guided`: rulebook の必須要素・禁止事項、recipe の問いとレビュー観点、sample の粒度・文体との整合を確認する。
- `recipe-guided`: recipe の問いとレビュー観点に照らして確認し、rulebook / sample の構造・文体は基準にしない。
- `freeform`: 参考資料より、対象領域の類似成果物の実例やプロジェクト文脈との整合を確認する。
- `task_kind` が `reference-maintenance` の場合は、「`task_kind` による作業対象の伝達」に従って確認観点を読み替える。
- 判断の根拠を review result に残す。

## 7. 関連ドキュメント

- [prj-overview-recipe](../recipes/prj-overview-recipe.md): rulebook / recipe / sample の役割分担の記述例
- [specdojo-schedule-and-exec-guide](specdojo-schedule-and-exec-guide.md): exec plan の生成・実行フロー
- [specdojo-review-guide](specdojo-review-guide.md): review plan / review result の扱いと、参考資料の活用方法
- [specdojo-command-usage-guide](specdojo-command-usage-guide.md): `approach_mode` / `task_kind` の定義とタスク生成・テンプレート選択への反映
