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
- `freeform` または参考資料メンテナンス系では、存在しない、または参照範囲から外れた文書がある場合に、他に存在する文書、類似成果物、対象領域の慣行を手がかりに判断する。それ以外の `approach` では、判断できない箇所を憶測で補わず `_TODO_` / `_ASSUMPTION_` として残す。いずれも判断の根拠を成果物または result に残す。

詳細は [[specdojo-reference-materials-guide]] を参照する。

## 5. 全 role 観点による自己レビュー

成果物の更新後、owner の観点だけでなく、レビュー観点に割り当てられたすべての role の観点で自己レビューする。この自己レビューは edit task 内で成果物の完成度を高めるために行うものであり、後続の独立した review task を代替しない。

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
4. result の「自己レビュー結果」を記入する。

## 7. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。
