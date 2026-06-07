_FRONTMATTER_

# _PLAN_TITLE_

## 1. このフェーズで行うこと

_PHASE_DESCRIPTION_

## 2. 対象成果物

_DELIVERABLE_PATH_LINE_
_RESULT_REF_LINE_

_DONE_CRITERIA_BLOCK_

## 3. 進め方（規約改善）

このタスクは、既存成果物（複数の実例）を起点に rulebook / recipe / sample 側を整える。次の方針で進める。

- 既存成果物に共通する構造・良い記述・課題を洗い出す。
- 洗い出した内容を rulebook（規約）・recipe（作り方）・sample（完成例）として整理し直す。

留意点:

- 個別事情に寄った記述を一般化しすぎない。
- 既存成果物との矛盾が見つかった場合は、成果物側の改修候補として記録する。

## 4. 完了手順

1. 「このフェーズで行うこと」に従って成果物を更新する。
2. 必要な検証と lint を実行する。
3. result の done_criteria_checked セクションを記入する。

## 5. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
