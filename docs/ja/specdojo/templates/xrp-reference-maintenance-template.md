_FRONTMATTER_

# Review Plan: _TASK_ID_

## 1. このフェーズで行うこと

_PHASE_DESCRIPTION_

## 2. 対象成果物

- 成果物名: _DELIVERABLE_NAME_
- 根拠: _DELIVERABLE_DEPENDS_ON_
- 概要: _DELIVERABLE_OVERVIEW_
- path: `_DELIVERABLE_PATH_`
- rulebook: `_RULEBOOK_REF_`
- result: `_RESULT_REF_`

## 3. レビュー観点

<!-- markdownlint-disable MD055 MD056 -->
| ID | ロール | viewpoint_id | 確認基準 |
|---|---|---|---|
_REVIEW_VIEWPOINT_ROWS_
<!-- markdownlint-enable MD055 MD056 -->

_REVIEW_VIEWPOINT_DETAILS_

## 4. 進め方

- 確認の向きを「成果物 → rulebook / recipe / sample」に切り替える。
- 対象成果物に紐づく rulebook / recipe / sample が見直しに値するかを、複数の成果物、review result、対象領域の慣行と照らして確認する。
- 構造・問い・禁止事項・サンプルとしての妥当性が成果物の実態と整合しているか確認する。
- 判断の根拠を review result に残す。

詳細は [[specdojo-reference-materials-guide]] を参照する。

## 5. 完了手順

1. レビュー観点ごとに pass / fail / unclear を判定し、根拠を記入する。
2. result の各レビュー観点セクションに記入する。

## 6. 異常終了の条件

- done_criteria を満たさない・対象ファイル不明・依存未解決の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; criterion=<id>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
