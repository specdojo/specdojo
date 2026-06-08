_FRONTMATTER_

# _PLAN_TITLE_

## 1. このフェーズで行うこと

_PHASE_DESCRIPTION_

## 2. 対象成果物

_DELIVERABLE_PATH_LINE_
_RESULT_REF_LINE_

_DONE_CRITERIA_BLOCK_

## 3. 進め方

- 対象成果物に紐づく rulebook / recipe / sample の有無を確認する。
- 存在する文書を、それぞれの役割に沿って活用する。
  - rulebook がある場合: 構造・必須要素・禁止事項を満たしているかの基準にする。
  - recipe がある場合: 章ごとの問いや深掘り手順に沿って内容を組み立てる。
  - sample がある場合: 粒度・文体・表の書き方を合わせる手本にする。
- 複数の文書間で記述に矛盾がある場合は、rulebook を正とする。
- 存在しない文書がある場合は、他に存在する文書、類似成果物、対象領域の慣行を手がかりに最小限の構成要素を判断して組み立て、判断の根拠を成果物または result に残す。
- `sch-strategy-<track>.yaml` の `owner_rules[].phase_overrides[]` でこのフェーズに `ignore_references` が指定されている場合は、該当する種別の文書を判断材料から外し、その代わりに何を根拠にしたかを記録する。

詳細は [[specdojo-reference-materials-guide]] を参照する。

## 4. 完了手順

1. 「このフェーズで行うこと」に従って成果物を更新する。
2. 必要な検証と lint を実行する。
3. result の done_criteria_checked セクションを記入する。

## 5. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
