_FRONTMATTER_

# Edit Plan: _TASK_ID_

## 1. このフェーズで行うこと

_PHASE_DESCRIPTION_

## 2. 対象成果物

- 成果物名: _DELIVERABLE_NAME_
- 根拠: _DELIVERABLE_DEPENDS_ON_
- 概要: _DELIVERABLE_OVERVIEW_
- path: `_DELIVERABLE_PATH_`
- result: `_RESULT_REF_`

**done_criteria:**

_DONE_CRITERIA_ITEMS_

## 3. 進め方

- rulebook / recipe / sample に原則縛られず、対象成果物の実例やプロジェクト文脈を優先する。
- done_criteria とこの plan のフェーズ説明を満たすことを主な基準にする。
- 参考資料を使った場合は、使った文書と判断根拠を成果物または result に残す。
- 参考資料とプロジェクト文脈が矛盾する場合は、プロジェクト文脈を優先し、その理由を記録する。

詳細は [[specdojo-reference-materials-guide]] を参照する。

## 4. 完了手順

1. 「このフェーズで行うこと」に従って成果物を更新する。
2. 必要な検証と lint を実行する。
3. result の done_criteria_checked セクションを記入する。

## 5. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
