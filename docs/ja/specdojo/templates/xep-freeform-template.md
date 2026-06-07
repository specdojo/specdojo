_FRONTMATTER_

# _PLAN_TITLE_

## 1. このフェーズで行うこと

_PHASE_DESCRIPTION_

## 2. 対象成果物

_DELIVERABLE_PATH_LINE_
_RESULT_REF_LINE_

_DONE_CRITERIA_BLOCK_

## 3. 進め方（自由形式）

対象成果物には、参照できる rulebook / recipe / sample が無い、またはタスクの性質上あえて参照しない。次の方針で進める。

- 類似成果物や対象領域の慣行を手がかりに、最小限の構成要素を判断して組み立てる。
- 判断の根拠を成果物または result に残す。

留意点:

- 独自色が強くなりやすい。後から rulebook 化する際の材料になるよう、迷った判断点を明示しておく。

## 4. 完了手順

1. 「このフェーズで行うこと」に従って成果物を更新する。
2. 必要な検証と lint を実行する。
3. result の done_criteria_checked セクションを記入する。

## 5. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
