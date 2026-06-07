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

## 4. 進め方（規約改善）

このタスクは、既存成果物（複数の実例）を起点に rulebook / recipe / sample 側を整える。次の方針で確認する。

- 既存成果物に共通する構造・良い記述・課題の洗い出しと整理が rulebook / recipe / sample へ反映されているかを確認する。

## 5. 完了手順

1. レビュー観点ごとに pass / fail / unclear を判定し、根拠を記入する。
2. result の各レビュー観点セクションに記入する。

## 6. 異常終了の条件

- done_criteria を満たさない・対象ファイル不明・依存未解決の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; criterion=<id>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
