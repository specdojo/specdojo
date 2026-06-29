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

rulebook / recipe / sample / template に原則縛られず、対象領域の類似成果物の実例とプロジェクト文脈との整合を優先して確認する。レビューでは成果物を組み立てるのではなく、成果物が基準を満たすかを照合する。次の基準で確認する。

1. レビュー観点（`RVP-NNN`）を満たしているかを主な基準にする。
2. `depends_on` 成果物の最新の決定事項・用語・制約、およびプロジェクト文脈（背景・目的・関係者の意図）との整合を確認する。
3. 参考資料は、対象領域の実例やプロジェクト文脈と矛盾しない範囲の補助基準にとどめる。
4. 内部情報だけで判断できない一般的な観点・用語・標準があり、実行 agent が Web 検索能力を持つ場合は、関連情報を確認して出典を添える。Web 検索能力がない場合は、利用可能な内部情報の範囲で判定し、確認できない事項を result に記録する。

参考資料とプロジェクト文脈が矛盾する場合は、プロジェクト文脈を優先し、その理由を記録する。

本タスクの実行に必要な freeform の確認方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や edit への適用）を確認したい場合のみ、参考として [[specdojo-reference-materials-guide]] を参照する。

### 4.1. 判断根拠の記録

確認した内容と判断根拠を review result に残す。記録先は次のとおり。

- レビュー観点ごとの pass / fail / unclear 判定と根拠: review result の `レビュー観点別結果` セクション（各 `RVP-NNN`）。
- 優先した実例・プロジェクト文脈、参考資料を補助に使った場合の判断根拠、参考資料とプロジェクト文脈が矛盾しプロジェクト文脈を優先した箇所とその理由、Web 出典: review result の `参考資料との整合確認` セクション。
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
