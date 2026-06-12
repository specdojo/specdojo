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

- exec plan frontmatter の `task_kind` を確認する。
- `task_kind` が `reference-maintenance` の場合は、確認の向きを「成果物 → rulebook / recipe / sample」に切り替える。
- それ以外の場合は、対象成果物に紐づく rulebook / recipe / sample をそれぞれの役割に沿って確認の基準にする。
- rulebook の必須要素・禁止事項に反していないか確認する。
- recipe の問い・観点に対して内容が十分か確認する。
- sample の粒度・文体・表現と整合しているか確認する。
- 複数の文書間で記述に矛盾がある場合は rulebook を正とする。
- 判断の根拠を review result に残す。

詳細は [[specdojo-reference-materials-guide]] を参照する。

## 5. 完了手順

1. レビュー観点ごとに pass / fail / unclear を判定し、根拠を記入する。
2. result の各レビュー観点セクションに記入する。

## 6. 異常終了の条件

- done_criteria を満たさない・対象ファイル不明・依存未解決の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; criterion=<id>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
