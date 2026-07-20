_FRONTMATTER_

# Review Plan: _TASK_ID_

## 1. このフェーズで行うこと

_PHASE_DESCRIPTION_

## 2. 対象成果物

- `name`: _DELIVERABLE_NAME_
- `depends_on`: _DELIVERABLE_DEPENDS_ON_
- `overview`: _DELIVERABLE_OVERVIEW_
- `path`: `_DELIVERABLE_PATH_`
- `rulebook`: `_RULEBOOK_REF_`
- `result`: `_RESULT_REF_`

## 3. レビュー観点

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID  | ロール | viewpoint_id | 確認基準 |
| --- | ------ | ------------ | -------- |
_REVIEW_VIEWPOINT_ROWS_
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

_REVIEW_VIEWPOINT_DETAILS_

owner ロールの観点は、成果物がその責務を果たしているかを確認する。owner 以外のロールの観点は、その文書から各ロールが自分の責務の成果物を作成できるかという入力適合性の最低限の確認とし、各ロールの内容まで踏み込む過剰な再レビューはしない（一文書一責務）。

## 4. 進め方

- exec plan frontmatter の `approach` を確認する。
- `approach` が `rulebook-maintenance` / `recipe-maintenance` / `sample-maintenance` / `template-maintenance` の場合は、確認の向きを「成果物 → 対象の参考資料」に切り替え、対象の参考資料が見直しに値するかを確認する。
- それ以外の場合は、対象成果物に紐づく rulebook / recipe / sample / template の有無を確認し、`approach` に応じて確認の基準を決める。
  - `fully-guided`: rulebook の必須要素・禁止事項、recipe の問いとレビュー観点、sample の粒度・文体、template の章構成との整合を確認する（プレースホルダが残っていないことも確認する）。
  - `recipe-guided`: recipe の問いとレビュー観点に照らして確認する（rulebook / sample / template の構造・文体は基準にしない）。
  - `freeform`: 参考資料より、類似成果物の実例やプロジェクト文脈との整合を確認する。
  - 未指定の場合は、存在するすべての参考資料をそれぞれの役割に沿って確認の基準にする。
- 複数の文書間で記述に矛盾がある場合、確認の基準に rulebook を含む `approach`（`fully-guided` など）では rulebook を正とする。
- `freeform` と参考資料メンテナンス系（`*-maintenance`）を除く `approach` では、確認に用いてよい文書をこの plan に記載されたもの（対象成果物に紐づく rulebook / recipe / sample / template と、`対象成果物` セクションの `depends_on` 成果物）に限定する。クロス文書整合のレビュー観点では `depends_on` 成果物を読み込んで対象成果物と突き合わせる。plan に列挙されていない他のプロジェクト文書を独自に探索・参照しない。
- 存在しない、または確認の基準から外れた文書がある場合は、他に存在する文書、類似成果物、対象領域の慣行と整合しているかを確認し、判断の根拠を review result に残す。

詳細は [[specdojo-reference-materials-guide]] を参照する。

## 5. 完了手順

1. レビュー観点ごとに pass / fail / unclear を判定し、根拠を記入する。
2. result の各レビュー観点セクションに記入する。result には各 RVP の `### RVP-NNN（ロール: viewpoint_id）` と `確認基準` が展開済みなので、`result` / `evidence` / `notes` を埋める。レビュー結果の記入はタスク完了に必須であり、未記入のまま終了しない（詳細は共通規約を参照）。
3. `evidence` の参照は `[[id]]` 形式（Obsidian wikilink）で記載する。行番号アンカー（`#L12-L18` など）や絶対パスは使わない。位置の補足が必要な場合は `evidence` 本文で述べる。
4. fail / unclear、または recommendation が revise / reject でも、レビュー結果を記録できた場合は正常終了する（終了コード 0）。

## 6. 異常終了の条件

- 対象ファイル不明・依存未解決・result 更新不能など、レビュー自体を完了できない場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; criterion=<id>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

_COMMON_CONVENTIONS_
