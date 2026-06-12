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

- 参照の向きを「成果物 → rulebook / recipe / sample」に切り替えて進める。
- 対象成果物に紐づく rulebook / recipe / sample を「見直す対象」として扱う。
- 複数の成果物、review result、対象領域の慣行を根拠に、構造・問い・禁止事項・サンプルとしての妥当性を見直す。
- 参考資料間で記述に矛盾がある場合は、成果物の実態と整合する側に揃える。
- 見直しの根拠とした成果物・記録を result に残す。

詳細は [[specdojo-reference-materials-guide]] を参照する。

## 4. 完了手順

1. 「このフェーズで行うこと」に従って参考資料を更新する。
2. 必要な検証と lint を実行する。
3. result の done_criteria_checked セクションを記入する。

## 5. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
