_FRONTMATTER_

# _PLAN_TITLE_

## 1. このフェーズで行うこと

_PHASE_DESCRIPTION_

## 2. 対象成果物

_DELIVERABLE_PATH_LINE_
_RESULT_REF_LINE_

_DONE_CRITERIA_BLOCK_

## 3. 進め方（レシピ準拠）

対象成果物には recipe が存在するが、rulebook / sample は未整備である。次の方針で進める。

- recipe の章ごとの問いに沿って内容を広げ、レビュー観点で確認する。
- 構造が recipe にない場合は、recipe の手順から組み立てる。

留意点:

- recipe にない章や項目が必要になった場合は、rulebook 整備の課題として記録する。

## 4. 完了手順

1. 「このフェーズで行うこと」に従って成果物を更新する。
2. 必要な検証と lint を実行する。
3. result の done_criteria_checked セクションを記入する。

## 5. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
