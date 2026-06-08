_FRONTMATTER_

# _PLAN_TITLE_

## 1. このフェーズで行うこと

_PHASE_DESCRIPTION_

## 2. 対象成果物

_DELIVERABLE_PATH_LINE_
_RULEBOOK_REF_LINE_
_RESULT_REF_LINE_

## 3. レビュー観点

_REVIEW_VIEWPOINTS_TABLE_

_REVIEW_VIEWPOINTS_DETAIL_

## 4. 進め方

- exec plan frontmatter の `approach_mode` ・ `task_kind` を確認する。
- `task_kind` が `reference-maintenance` 以外の `deliverable-review`（または未指定）の場合は、対象成果物に紐づく rulebook / recipe / sample の有無を確認し、`approach_mode` に応じて確認の基準を決める。
  - `fully-guided`: rulebook の必須要素・禁止事項、recipe の問いとレビュー観点、sample の粒度・文体との整合を確認する。
  - `recipe-guided`: recipe の問いとレビュー観点に照らして確認する（rulebook / sample の構造・文体は基準にしない）。
  - `freeform`: 参考資料より、類似成果物の実例やプロジェクト文脈との整合を確認する。
  - 未指定の場合は、存在するすべての参考資料をそれぞれの役割に沿って確認の基準にする。
- `task_kind` が `reference-maintenance` の場合は、確認の向きを「成果物 → rulebook / recipe / sample」に切り替え、対象の参考資料が見直しに値するかを確認する。
- 複数の文書間で記述に矛盾がある場合、確認の基準に rulebook を含む `approach_mode`（`fully-guided` など）では rulebook を正とする。
- 存在しない、または確認の基準から外れた文書がある場合は、他に存在する文書、類似成果物、対象領域の慣行と整合しているかを確認し、判断の根拠を review result に残す。

詳細は [[specdojo-reference-materials-guide]] を参照する。

## 5. 完了手順

1. レビュー観点ごとに pass / fail / unclear を判定し、根拠を記入する。
2. result の各レビュー観点セクションに記入する。

## 6. 異常終了の条件

- done_criteria を満たさない・対象ファイル不明・依存未解決の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; criterion=<id>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
