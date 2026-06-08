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

- 対象成果物に紐づく rulebook / recipe / sample の有無を確認する。
- 存在する文書を、それぞれの役割に沿って確認の基準にする。
  - rulebook がある場合: 必須要素・禁止事項を満たしているかを確認する。
  - recipe がある場合: 章ごとの問いとレビュー観点に照らして確認する。
  - sample がある場合: 粒度・文体が整合しているかを確認する。
- 複数の文書間で記述に矛盾がある場合は、rulebook を正とする。
- 存在しない文書がある場合は、他に存在する文書、類似成果物、対象領域の慣行と整合しているかを確認し、判断の根拠を review result に残す。
- `sch-strategy-<track>.yaml` の `owner_rules[].phase_overrides[]` でこのフェーズに `ignore_references` が指定されている場合は、該当する種別の文書を確認の基準から外し、その代わりに何を根拠にしたかを記録する。

詳細は [specdojo-reference-materials-guide](../guides/specdojo-reference-materials-guide.md) を参照する。

## 5. 完了手順

1. レビュー観点ごとに pass / fail / unclear を判定し、根拠を記入する。
2. result の各レビュー観点セクションに記入する。

## 6. 異常終了の条件

- done_criteria を満たさない・対象ファイル不明・依存未解決の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; criterion=<id>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
