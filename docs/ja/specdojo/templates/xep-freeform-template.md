_FRONTMATTER_

# Edit Plan: _TASK_ID_

## 1. このフェーズで行うこと

_PHASE_DESCRIPTION_

## 2. 対象成果物

- `name`: _DELIVERABLE_NAME_
- `depends_on`: _DELIVERABLE_DEPENDS_ON_
- `overview`: _DELIVERABLE_OVERVIEW_
- `path`: `_DELIVERABLE_PATH_`
- `result`: `_RESULT_REF_`

**done_criteria:**

_DONE_CRITERIA_ITEMS_

## 3. 進め方

rulebook / recipe / sample / template に原則縛られないため、対象成果物の文脈から記載内容を組み立てる。次の手順で記載内容を決める。

1. `depends_on` に挙がった成果物を読み、前提・決定事項・用語・制約を把握し、それらと整合する内容にする。
2. `name`・`overview`・`done_criteria` から、この成果物が答えるべき問いと記載すべき項目の仮説を立てる。done_criteria の各項目を満たす記述を必ず含める。
3. プロジェクト文脈（背景・目的・関係者の意図）を `depends_on` の成果物や関連ドキュメントから確認し、仮説を裏付けるか修正する。
4. 内部情報だけで判断できない一般的な観点・用語・標準がある場合は、Web 検索で関連情報を取得し、出典を添えて反映する。
5. 仮説と収集した情報をもとに成果物を記述する。判断に迷う箇所は `_TODO_` / `_ASSUMPTION_` で残し、根拠と次のアクションを書く。

記載にあたっては次を守る。

- 対象成果物に既存の記述がある場合は、まず内容を確認する。`depends_on` の最新の決定事項やプロジェクト文脈と矛盾する、または前提が変わって古くなった記述は破棄する。古くなっていない記述は活かし、不足分を加筆・補強する。破棄・加筆の判断根拠を result に残す。
- 参考資料より、対象領域の類似成果物の実例とプロジェクト文脈を優先し、参考資料は矛盾しない範囲の参考にとどめる。
- 参考資料とプロジェクト文脈が矛盾する場合は、プロジェクト文脈を優先し、その理由を記録する。
- done_criteria とこの plan のフェーズ説明を満たすことを主な基準にする。
- 仮説の根拠、参照した `depends_on` 成果物、Web 出典、参考資料を使った場合の判断根拠を成果物または result に残す。

## 4. 完了手順

1. 「このフェーズで行うこと」に従って成果物を更新する。
2. 必要な検証と lint を実行する。
3. result の done_criteria_checked セクションを記入する。

## 5. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
