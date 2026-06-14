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

## 4. 進め方

対象成果物に紐づく rulebook / recipe / sample / template は、いずれも指定されたファイルを実際に読み込んだうえで、次の役割に沿って確認の基準にする。読み込まずに記憶や推測で代替しない。レビューでは成果物を組み立てるのではなく、成果物が基準を満たすかを照合する。

1. rulebook: 指定された rulebook を読み込み、成果物が必須要素をすべて満たし、禁止事項に抵触していないかを構造面の基準として確認する。
2. recipe: 指定された recipe を読み込み、示された問い・観点に対して成果物の内容が十分かを確認する。
3. sample: 指定された sample を読み込み、粒度・文体・表現・表の書き方と整合しているかを確認する。
4. template: 指定された template を読み込み、章構成と整合しているか、`_TODO_` などのプレースホルダが残っていないかを確認する。

複数の文書間で記述に矛盾がある場合は rulebook を正として判定する（template の章構成が rulebook と食い違う場合も rulebook を正とする）。

本タスクの実行に必要な fully-guided の確認方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や edit への適用）を確認したい場合のみ、参考として [[specdojo-reference-materials-guide]] を参照する。

### 4.1. 参考資料が存在しない・内容が薄い場合

- 指定された rulebook / recipe / sample / template のいずれかが存在しない、または基準として機能しないほど内容が薄い場合は、その事実と判断を review result の `参考資料との整合確認` セクションに記録する。
- 欠落を理由にレビュー観点を unclear のまま放置しない。存在する他の参考資料と `depends_on` 成果物・プロジェクト文脈を基準にして判定根拠を補う。
- template が欠落する場合は、rulebook の構造を骨組みとして整合を確認する。
- 参考資料そのものの整備が必要と判断した場合でも、本タスクの範囲を超える整備は行わず、findings または申し送りに残す。

### 4.2. 判断根拠の記録

確認した文書・確認しなかった文書と、その判断根拠を review result に残す。記録先は次のとおり。

- レビュー観点ごとの pass / fail / unclear 判定と根拠: review result の `レビュー観点別結果` セクション（各 `RVP-NNN`）。
- 参照した rulebook / recipe / sample / template の使い分け、矛盾時に rulebook を正とした箇所、欠落・薄い参考資料の扱い: review result の `参考資料との整合確認` セクション。
- 検出した問題点・指摘事項: review result の `findings` セクション。

## 5. 完了手順

1. レビュー観点ごとに pass / fail / unclear を判定し、根拠を記入する。
2. result の各レビュー観点セクションに記入する。

## 6. 異常終了の条件

- done_criteria を満たさない・対象ファイル不明・依存未解決の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; criterion=<id>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
