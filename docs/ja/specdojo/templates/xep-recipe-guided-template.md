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

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **_OWNER_ROLE_LABEL_**
- 責務: _OWNER_ROLE_NOTE_

このロールが重視するレビュー観点:

_OWNER_ROLE_VIEWPOINTS_

## 4. 進め方

対象成果物に紐づく recipe を、指定されたファイルを実際に読み込んだうえで主な基準として参照する。読み込まずに記憶や推測で代替しない。

1. recipe: 指定された recipe を読み込み、示された構成・問い・観点・深掘り手順に沿って成果物を組み立てる。
2. recipe が答えを示さない箇所は、`depends_on` 成果物・類似成果物・プロジェクト文脈との整合で補う。

成果物は、冗長な記述や内容の重複を避け、簡潔でわかりやすく記載する。

rulebook / sample / template は未成熟と判断されているため、存在しても構造・文体・粒度の必須基準としては扱わない。recipe の指示が他の文書と矛盾する場合は recipe を優先する。

本タスクの実行に必要な recipe-guided の参照方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や review への適用）を確認したい場合のみ、参考として [[specdojo-reference-materials-guide]] を参照する。

### 4.1. recipe が存在しない・内容が薄い場合

- recipe は recipe-guided の唯一の主基準であるため、存在しない、または基準として機能しないほど内容が薄い場合は、その事実と判断を result の `参考資料の活用` セクションに記録する。
- その場合は `depends_on` 成果物・類似成果物・プロジェクト文脈を主な根拠に組み立て、何を recipe の代わりに根拠としたかを明示する。
- recipe そのものの整備が必要と判断した場合でも、本タスクの範囲を超える整備は行わず、申し送りに残す。

### 4.2. 既存記述の扱い

- 対象成果物に既存の記述がある場合は、まず内容を確認する。`depends_on` の最新の決定事項やプロジェクト文脈と矛盾する、または前提が変わって古くなった記述は破棄する。
- 古くなっていない記述は活かし、不足分を加筆・補強する。
- 破棄・加筆の判断根拠を result の `参考資料の活用` セクションに残す。

### 4.3. 判断根拠の記録

参照した文書と判断根拠を result に残す。記録先は次のとおり。

- done_criteria の充足状況: result の `done_criteria 確認` セクション。
- recipe を参照した箇所、recipe で判断できず補助材料で判断した箇所、rulebook / sample / template を基準にしなかった理由と代わりに根拠にした内容、既存記述の破棄・加筆の根拠: result の `参考資料の活用` セクション。

## 5. 全 role 観点による自己レビュー

成果物の更新後、owner の観点だけでなく、done_criteria に割り当てられたすべての role の観点で自己レビューする。この自己レビューは edit task 内で成果物の完成度を高めるために行うものであり、後続の独立した review task を代替しない。

<!-- markdownlint-disable MD055 MD056 -->
| ID | ロール | viewpoint_id | 確認基準 |
|---|---|---|---|
_REVIEW_VIEWPOINT_ROWS_
<!-- markdownlint-enable MD055 MD056 -->

_REVIEW_VIEWPOINT_DETAILS_

### 5.1. 自己レビューと修正の手順

1. 各レビュー観点を pass / fail / unclear で判定し、成果物内の根拠箇所を確認する。
2. fail / unclear がある場合は、その指摘を解消するよう成果物を修正する。
3. 修正後は、指摘箇所だけでなく、変更により新しい矛盾や抜けが発生していないかを全レビュー観点で再確認する。
4. 自己レビューは初回を含めて最大3回まで行う。すべての観点が pass になった場合は、その時点で終了する。
5. 3回実施しても fail / unclear が残る場合は、判定・根拠・未解消理由・必要な次のアクションを result の「自己レビュー結果」と「申し送り」に記録する。

## 6. 完了手順

1. 「このフェーズで行うこと」に従って成果物を更新する。
2. 「全 role 観点による自己レビュー」に従って、必要な修正と再確認を行う。
3. 必要な検証と lint を実行する。
4. result の「done_criteria 確認」と「自己レビュー結果」を記入する。

## 7. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。
