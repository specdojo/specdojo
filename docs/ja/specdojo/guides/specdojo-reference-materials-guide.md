---
id: specdojo-reference-materials-guide
type: guide
status: draft
---

# SpecDojo 参考資料活用ガイド

本ドキュメントは SpecDojo における **exec plan 実行時に rulebook / recipe / sample をどう参照するか**を定義する。`mode: edit`（作成・更新）と `mode: review`（レビュー）の両方の exec plan に共通して適用する。

exec plan は「何を」「どこまで」行うかを示すが、対象成果物に紐づく rulebook / recipe / sample をどう使うかは規定しない。本書はその参照の仕方を共通の進め方として整理し、あわせて整備状況やフェーズの性質に応じて参照範囲を絞り込む `ignore_references` の使い方を示す。

## 1. このガイドの位置づけ

- exec plan（`exec/plans/<task-id>-plan.md`）は、`specdojo exec build` が `sch-track-<track>.yaml` と成果物カタログから自動生成する。生成内容や実行フローは [specdojo-schedule-and-exec-guide](specdojo-schedule-and-exec-guide.md) を参照する。
- exec plan が示すのは「対象成果物」「done_criteria」「完了手順」「異常終了の条件」であり、参考資料をどう使うかは規定しない。
- 本書は、対象成果物に紐づく rulebook / recipe / sample を**どう参照するか**の共通の進め方（「進め方の基本」）と、特定の `local_id` ・特定のフェーズで参照範囲を絞り込む `ignore_references`（「`ignore_references` による参照範囲の調整」）を示す。レビューでの適用方法は「review への適用」で扱う。

## 2. 参照する文書の役割

参考資料として参照する文書の役割は次のとおりである。

| 種別     | 役割                           | 確認できること                       |
| -------- | ------------------------------ | ------------------------------------ |
| rulebook | 成果物として成立するための規約 | 構造、必須項目、禁止事項             |
| recipe   | 良い内容を書くための作り方     | 問い、観点、深掘り手順、レビュー観点 |
| sample   | 完成例                         | 粒度、文体、表の書き方               |

3 種類すべてが揃っているとは限らない。揃っていない場合の進め方は「進め方の基本」で扱う。

## 3. 進め方の基本

対象成果物に rulebook / recipe / sample のいずれが存在するかにかかわらず、エージェントは次の基本方針で進める。

1. 対象成果物に紐づく rulebook / recipe / sample の有無を確認する（exec plan の「対象成果物」セクション、またはカタログの登録情報で確認する）。
2. 存在する文書を、それぞれの役割に沿って活用する。
   - rulebook がある場合: 構造・必須要素・禁止事項を満たしているかの基準にする。
   - recipe がある場合: 章ごとの問いや深掘り手順に沿って内容を組み立て、レビュー観点で確認する。
   - sample がある場合: 粒度・文体・表の書き方を合わせる手本にする。
3. 複数の文書間で記述に矛盾がある場合は、rulebook（規約）を正とする。
4. 存在しない文書がある場合は、他に存在する文書、類似成果物、対象領域の慣行を手がかりに最小限の構成要素を判断し、組み立てる。判断の根拠を成果物または result に残す。後から rulebook / recipe / sample を整備する際の材料になるよう、迷った判断点を明示しておく。
5. rulebook / recipe / sample をそのまま足し合わせず、対象プロジェクトの文脈に合わせて取捨選択する。

`done_criteria` や review plan の `レビュー観点`（`RVP-NNN`）が判定基準を示す場合は、それらを優先する。本章は、判定基準だけでは読み取れない「どこまで参照に照らすか」「参照が乏しい場合にどう判断するか」を補う位置づけである。

## 4. `ignore_references` による参照範囲の調整

成果物と、その rulebook / recipe / sample の整備順序は一律ではない。rulebook / recipe / sample がまだ整っていない段階で成果物を組み立てたい場合や、整っていても特定のフェーズではあえて参照させたくない場合がある。`sch-strategy-<track>.yaml` の `owner_rules[].phase_overrides[].ignore_references` は、こうした状況に対応するための機能である。

### 4.1. 指定方法

- owner ロールが `sch-strategy-<track>.yaml` の `owner_rules[].phase_overrides[]` に、`phase`（対象フェーズ）と `ignore_references`（参照させない種別の配列）を指定する。
- `ignore_references` に指定できる値は `rulebook` / `recipe` / `sample` のいずれかで、複数指定できる。
- 指定された `local_id` ・フェーズの組み合わせでは、`ignore_references` に挙げた種別の文書が存在していても、エージェントはその文書を進め方の判断材料として使わない。
- `phase_overrides[]` を指定しない、または `ignore_references` を省略した場合は、存在するすべての参考資料を「進め方の基本」に従って活用する。

### 4.2. 想定する利用例

| 状況                                                                       | 設定例                                                          | ねらい                                                                                   |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 草案フェーズでは、未成熟な rulebook に縛られず自由に組み立てたい           | 該当フェーズに `ignore_references: [rulebook]`                  | 既存 rulebook の制約を外し、成果物の実例から後で rulebook を改善できるようにする         |
| 充実フェーズでは recipe の問いに沿って内容を広げ、sample の文体には寄せない | 該当フェーズに `ignore_references: [sample]`                    | recipe を中心に内容を組み立て、sample の文体差に引きずられないようにする                 |
| 整備状況によらず、特定フェーズでは特定の参考資料を意図的に外したい          | 該当フェーズに `ignore_references: [recipe, sample]` など       | rulebook の必須要素のみを基準にし、recipe / sample の影響を受けずに組み立てたい場合に使う |

### 4.3. エージェントの確認手順

1. 対象成果物の `local_id` と、現在のフェーズを確認する（exec plan の「対象成果物」「このフェーズで行うこと」セクションで確認する）。
2. `sch-strategy-<track>.yaml` の `owner_rules[].phase_overrides[]` を確認し、対象 `local_id` ・対象フェーズに `ignore_references` が指定されているかを確認する。
3. 指定されている場合は、その種別の文書を判断材料から外し、残りの参考資料と「進め方の基本」に従って進める。参照を外したことと、その代わりに何を判断の根拠にしたかを成果物または result に記録する。
4. 指定されていない場合は、存在するすべての参考資料を「進め方の基本」に従って活用する。

## 5. review への適用

review でも「進め方の基本」と `ignore_references` を同じ基準で適用する。レビューでは「成果物を組み立てる」のではなく「成果物が満たすべき基準に照らして確認する」ため、次のように読み替える。

- rulebook がある場合: 必須要素・禁止事項を満たしているかを確認する。
- recipe がある場合: 章ごとの問いとレビュー観点に照らして確認する。
- sample がある場合: 粒度・文体が整合しているかを確認する。
- 存在しない、または `ignore_references` で対象から外された文書がある場合は、他に存在する文書、類似成果物、対象領域の慣行と整合しているかを確認し、判断の根拠を review result に残す。

## 6. 関連ドキュメント

- [prj-overview-recipe](../recipes/prj-overview-recipe.md): rulebook / recipe / sample の役割分担の記述例
- [specdojo-schedule-and-exec-guide](specdojo-schedule-and-exec-guide.md): exec plan の生成・実行フロー
- [specdojo-review-guide](specdojo-review-guide.md): review plan / review result の扱いと、参考資料の活用方法
- [specdojo-command-usage-guide](specdojo-command-usage-guide.md): `exec build` が生成する edit-plan / review-plan / result のテンプレート構成
