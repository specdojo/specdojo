_FRONTMATTER_

# Edit Plan: _TASK_ID_

## 1. このフェーズで行うこと

_PHASE_DESCRIPTION_

## 2. 対象成果物

- path: `_DELIVERABLE_PATH_`
- result: `_RESULT_REF_`

**done_criteria:**

_DONE_CRITERIA_ITEMS_

## 3. 進め方

- exec plan frontmatter の `task_kind` を確認する。
- `task_kind` が `reference-maintenance` の場合は、参照の向きを「成果物 → rulebook / recipe / sample」に切り替えて進める。
- それ以外の場合は、対象成果物に紐づく recipe を主な基準として参照する。
- recipe が示す構成、問い、観点を使って成果物を組み立てる。
- rulebook / sample が存在しても、構造・文体・粒度の必須基準としては扱わない。
- recipe だけでは判断できない箇所は、類似成果物やプロジェクト文脈を補助材料にする。
- recipe を参照した箇所と、補助材料で判断した箇所を成果物または result に残す。

詳細は [[specdojo-reference-materials-guide]] を参照する。

## 4. 完了手順

1. 「このフェーズで行うこと」に従って成果物を更新する。
2. 必要な検証と lint を実行する。
3. result の done_criteria_checked セクションを記入する。

## 5. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
