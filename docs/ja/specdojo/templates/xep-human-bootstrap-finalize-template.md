_FRONTMATTER_

# Finalize Plan: _TASK_ID_

## 1. このタスクで行うこと

_PHASE_DESCRIPTION_

このタスクは bootstrap と対になる確定作業である。bootstrap で一式として整備し、consolidate で最終調整した成果物と参考資料（rulebook / recipe / sample / template）を、まとめて完成版として確定する。

## 2. 対象成果物と参考資料

成果物（主対象）:

- `name`: _DELIVERABLE_NAME_
- `path`: `_DELIVERABLE_PATH_`
- `result`: `_RESULT_REF_`

参考資料（rulebook frontmatter から解決。`_MISSING_` はこの成果物には存在しないためスキップする）:

- rulebook: `_RULEBOOK_REF_`
- recipe: `_RECIPE_REF_`
- sample: `_SAMPLE_REF_`
- template: `_TEMPLATE_REF_`

## 3. 最終確認項目

レビュー後の成果物が、成果物カタログの `done_criteria` を満たしているかを確認する。確認結果は result の「確認チェックリスト」に記録する。満たしていない箇所があれば「確定手順」で最小限の修正を加える。

_DONE_CRITERIA_ITEMS_

参考資料については、種別ごとに次を確認し、確認結果を result の「参考資料の確認」に記録する。

- rulebook: 章構成・必須項目・禁止事項・判定基準が完成版の成果物と整合している
- recipe: 問い・観点・深掘り手順が完成版の作成過程に照らして有効である
- sample: 粒度・文体・表の書き方が完成例として適切である
- template: 章構成の骨組みとプレースホルダが雛形として再利用できる
- 共通: プロジェクト固有の内容が一般化されており、他プロジェクトでも再利用できる

## 4. 確定手順

1. 「このタスクで行うこと」に従い、レビュー後の成果物と参考資料を最終確認し、result の「確認チェックリスト」・「参考資料の確認」にチェックを付ける。
2. 「最終確認項目」で満たせていない箇所があれば、既存記述を尊重して最小限の修正を加える。
3. 成果物 frontmatter の `status` を `ready` に更新する（この昇格は human のみが行える）。差し戻す場合は昇格させず、理由を result に記載する。
4. 存在する参考資料それぞれの frontmatter の `status` を `ready` に更新する。既に `ready` の参考資料は、consolidate の修正で劣化がないことの確認のみでよい。確定できない参考資料は昇格させず、理由を result に記載する。
5. 昇格が済んだ対象ごとに、result の「確定対象」にチェックを付ける。
6. result の `実施内容`・`変更ファイル`・`確定判断` セクションを記入する。対象ごとの確認結果と確定判断（承認 / 差し戻し）、修正した場合はその内容を残す。

_COMMON_CONVENTIONS_
