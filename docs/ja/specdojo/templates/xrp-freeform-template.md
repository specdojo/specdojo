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

## 4. 進め方（自由形式）

対象成果物には、参照できる rulebook / recipe / sample が無い、またはタスクの性質上あえて参照しない。次の方針で確認する。

- 類似成果物や対象領域の慣行と整合しているかを確認する。
- 判断の根拠を review result に残す。

## 5. 完了手順

1. レビュー観点ごとに pass / fail / unclear を判定し、根拠を記入する。
2. result の各レビュー観点セクションに記入する。

## 6. 異常終了の条件

- done_criteria を満たさない・対象ファイル不明・依存未解決の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; criterion=<id>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
