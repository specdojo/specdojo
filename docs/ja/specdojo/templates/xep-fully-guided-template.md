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

- exec plan frontmatter の `task_kind` を確認する。
- `task_kind` が `reference-maintenance` の場合は、参照の向きを「成果物 → rulebook / recipe / sample」に切り替えて進める。
- それ以外の場合は、対象成果物に紐づく rulebook / recipe / sample をそれぞれの役割に沿って参照する。
- rulebook は構造・必須要素・禁止事項の基準として扱う。
- recipe は内容の組み立て方、問い、観点の基準として扱う。
- sample は粒度、文体、表現、表の書き方の基準として扱う。
- 複数の文書間で記述に矛盾がある場合は rulebook を正とする。
- 参照した文書と判断根拠を成果物または result に残す。

詳細は [[specdojo-reference-materials-guide]] を参照する。

## 4. 完了手順

1. 「このフェーズで行うこと」に従って成果物を更新する。
2. 必要な検証と lint を実行する。
3. result の done_criteria_checked セクションを記入する。

## 5. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
