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

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **_OWNER_ROLE_LABEL_**
- 責務: _OWNER_ROLE_NOTE_

このロールが重視するレビュー観点:

_OWNER_ROLE_VIEWPOINTS_

## 4. 進め方

- exec plan frontmatter の `approach` を確認する。
- `approach` が `rulebook-maintenance` / `recipe-maintenance` / `sample-maintenance` / `template-maintenance` の場合は、参照の向きを「成果物 → 対象の参考資料」に切り替えて進める。
- それ以外の場合は、対象成果物に紐づく rulebook / recipe / sample / template の有無を確認し、`approach` に応じて参照範囲を決める。
  - `fully-guided`: rulebook / recipe / sample / template をそれぞれの役割に沿って活用する（構造・必須要素・禁止事項は rulebook、内容の組み立ては recipe、粒度・文体・表の書き方は sample、雛形は template を基準にし、プレースホルダは残さず埋める）。
  - `recipe-guided`: recipe が示す構成・問い・観点だけを使って組み立てる（rulebook / sample が存在しても構造・文体の基準にはしない）。
  - `freeform`: 参考資料より、類似成果物の実例やプロジェクト文脈を優先して組み立てる。
  - 未指定の場合は、存在するすべての参考資料をそれぞれの役割に沿って活用する。
- 複数の文書間で記述に矛盾がある場合、参照範囲に rulebook を含む `approach`（`fully-guided` など）では rulebook を正とする。
- `freeform` と参考資料メンテナンス系（`*-maintenance`）を除く `approach` では、参照してよい文書をこの plan に記載されたもの（対象成果物に紐づく rulebook / recipe / sample / template と、`対象成果物` セクションの `depends_on` 成果物）に限定する。plan に列挙されていない他のプロジェクト文書を独自に探索・参照しない。
- `freeform` と参考資料メンテナンス系を除く `approach` では、対象成果物の既存記述を尊重する。既存記述の破棄や全面的な書き換えは原則として行わず、`depends_on` の最新の決定事項と明確に矛盾する箇所のみ最小限を修正し、不足分は既存記述を基礎に加筆・補強する。
- `freeform` または参考資料メンテナンス系では、存在しない、または参照範囲から外れた文書がある場合に、他に存在する文書、類似成果物、対象領域の慣行を手がかりに判断する。それ以外の `approach` では、判断できない箇所を憶測で補わず _TODO_ / _ASSUMPTION_ として残す。いずれも判断の根拠を成果物または result に残す。

詳細は [[specdojo-reference-materials-guide]] を参照する。

## 5. 完了の狙い

この成果物が満たすべき狙い（成果物カタログの `done_criteria`）を、owner ロールの狙いと下流ロールの入力適合に分けて示す。「進め方」に従って参考資料に沿って記述する中で、owner の狙いを作成目標として満たすことを目指す。下流ロールの項目は、その文書から各ロールが自分の責務の成果物を作成できるよう入力として最低限成立させる範囲にとどめ、各ロールの内容を成果物に作り込まない（一文書一責務）。下流ロールの適合性検証や観点別の自己レビュー・修正ループは行わず、多観点での検証は後続の独立した review task に委ねる。

_DONE_CRITERIA_GOALS_

## 6. 完了手順

1. 「このフェーズで行うこと」と「進め方」に従って成果物を更新する。
2. 「完了の狙い」を満たしているかを確認し、不足があれば加筆・補強する（観点別の自己レビューや再確認ループは行わない）。
3. 共通規約に従って、必要な整形・静的検査を実行する。
4. result の `実施内容`・`変更ファイル`・`参考資料の活用` セクションを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 7. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

_COMMON_CONVENTIONS_
