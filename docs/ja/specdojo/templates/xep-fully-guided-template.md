_FRONTMATTER_

# _PLAN_TITLE_

## 1. このフェーズで行うこと

_PHASE_DESCRIPTION_

## 2. 対象成果物

_DELIVERABLE_PATH_LINE_
_RESULT_REF_LINE_

_DONE_CRITERIA_BLOCK_

## 3. 進め方（統合準拠）

対象成果物には rulebook / recipe / sample がすべて揃っている。次の方針で進める。

- rulebook で構造と必須要素を確認し、recipe の問いで内容を作り込み、sample で粒度・文体を合わせる。
- 3 文書間に矛盾がある場合は rulebook を正とする。

留意点:

- 3 文書をそのまま足し合わせず、対象プロジェクトの文脈に合わせて取捨選択する。

## 4. 完了手順

1. 「このフェーズで行うこと」に従って成果物を更新する。
2. 必要な検証と lint を実行する。
3. result の done_criteria_checked セクションを記入する。

## 5. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
