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
| ID | ロール | viewpoint_id | 確認基準 |
|---|---|---|---|
_REVIEW_VIEWPOINT_ROWS_
<!-- markdownlint-enable MD055 MD056 -->

_REVIEW_VIEWPOINT_DETAILS_

owner ロールの観点は、成果物がその責務を果たしているかを確認する。owner 以外のロールの観点は、その文書から各ロールが自分の責務の成果物を作成できるかという入力適合性の最低限の確認とし、各ロールの内容まで踏み込む過剰な再レビューはしない（一文書一責務）。

## 4. 進め方

対象成果物に紐づく recipe を、指定されたファイルを実際に読み込んだうえで主な確認基準にする。読み込まずに記憶や推測で代替しない。レビューでは成果物を組み立てるのではなく、成果物が基準を満たすかを照合する。

主な確認基準とする recipe（rulebook frontmatter から解決）: `_RECIPE_REF_`（`_MISSING_` の場合は「recipe が存在しない・内容が薄い場合」に従う）。

1. recipe: 指定された recipe を読み込み、示された問い・観点に照らして成果物の内容が十分かを確認する。
2. recipe だけでは判断できない箇所は、`depends_on` 成果物・類似成果物・プロジェクト文脈との整合を確認する。

rulebook / sample / template は未成熟と判断されているため、存在しても構造・文体・粒度の必須基準としては扱わない。recipe の指示が他の文書と矛盾する場合は recipe を優先する。

本タスクの実行に必要な recipe-guided の確認方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や edit への適用）を確認したい場合のみ、参考として [[specdojo-reference-materials-guide]] を参照する。

### 4.1. recipe が存在しない・内容が薄い場合

- recipe は recipe-guided の唯一の主基準であるため、存在しない、または基準として機能しないほど内容が薄い場合は、その事実と判断を review result の `参考資料との整合確認` セクションに記録する。
- 欠落を理由にレビュー観点を unclear のまま放置しない。`depends_on` 成果物・類似成果物・プロジェクト文脈を基準にして判定根拠を補い、何を recipe の代わりに根拠としたかを明示する。
- recipe そのものの整備が必要と判断した場合でも、本タスクの範囲を超える整備は行わず、findings または申し送りに残す。

### 4.2. 判断根拠の記録

確認した文書と判断根拠を review result に残す。記録先は次のとおり。

- レビュー観点ごとの pass / fail / unclear 判定と根拠: review result の `レビュー観点別結果` セクション（各 `RVP-NNN`）。
- recipe に照らした確認内容、rulebook / sample / template を基準にしなかった理由と代わりに根拠にした内容、欠落・薄い recipe の扱い: review result の `参考資料との整合確認` セクション。
- 検出した問題点・指摘事項: review result の `findings` セクション。

## 5. 完了手順

1. レビュー観点ごとに pass / fail / unclear を判定し、根拠を記入する。
2. result の各レビュー観点セクションに記入する。result には各 RVP の `### RVP-NNN（ロール: viewpoint_id）` と `確認基準` が展開済みなので、`result` / `evidence` / `notes` を埋める。
3. `evidence` の参照は `[[id]]` 形式（Obsidian wikilink）で記載する。行番号アンカー（`#L12-L18` など）や絶対パスは使わない。位置の補足が必要な場合は `evidence` 本文で述べる。
4. fail / unclear、または recommendation が revise / reject でも、レビュー結果を記録できた場合は正常終了する（終了コード 0）。

## 6. 異常終了の条件

- 対象ファイル不明・依存未解決・result 更新不能など、レビュー自体を完了できない場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; criterion=<id>; ref=<path>`）。
- agent 自身は claim / complete / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

_COMMON_CONVENTIONS_
