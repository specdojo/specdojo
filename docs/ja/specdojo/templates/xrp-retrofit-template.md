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

_PROJECT_CONTEXT_

## 3. 実装エビデンス

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の確認入力である。成果物との対応判定に使い、実装は変更しない。

_IMPLEMENTATION_EVIDENCE_

## 4. レビュー観点

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID  | ロール | viewpoint_id | 確認基準 |
| --- | ------ | ------------ | -------- |
_REVIEW_VIEWPOINT_ROWS_
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

_REVIEW_VIEWPOINT_DETAILS_

## 5. 進め方

1. 対象成果物、`depends_on`、プロジェクトコンテキストを読み、意図された仕様と `done_criteria` を確認する。
2. 「実装エビデンス」に列挙されたパスをすべて実際に読み、成果物内の記述と現在動作の対応を確認する。
3. 各対応を一致・乖離・実装から確認不能・未確認に分類する。成果物に実装上の事実が書かれていても、意図された仕様と異なる場合は pass にしない。
4. 乖離ごとに、文書が古い、実装が意図された仕様と異なる、承認根拠が不足、複数実装で挙動が異なる、のいずれかを判定し、実装または文書のどちらに修正が必要かを示す。
5. 実装から目的、業務判断、将来方針を推測しない。列挙されたエビデンスで判定できない場合は unclear とし、不足する根拠を明記する。

### 5.1. 判断根拠の記録

review result には、少なくとも次を記録する。

- 実際に参照した実装エビデンスのパスと確認した現在動作
- 成果物記述と実装の対応、および一致・乖離・確認不能・未確認の判定
- 乖離ごとの修正対象候補（実装・文書・意思決定）と根拠
- 調査できなかったパス、分岐、外部依存などの未確認範囲

各レビュー観点の pass / fail / unclear と証跡は `レビュー観点別結果`、問題点は `findings`、実装エビデンス全体の対応状況は `実践の型との整合確認` または申し送りへ記録する。

本タスクの実行に必要な retrofit の確認方針は、このセクションで完結する。approach 全体の定義を確認したい場合のみ、参考として [[specdojo:kata-guide]] を参照する。

## 6. 完了手順

1. レビュー観点ごとに pass / fail / unclear を判定し、根拠を記入する。
2. result の各レビュー観点セクションと実装エビデンスの対応記録を埋める。
3. `evidence` の文書参照は `[[id]]` 形式、実装参照はリポジトリルート相対パスで記載し、絶対パスを使わない。
4. fail / unclear、または recommendation が revise / reject でも、レビュー結果を記録できた場合は正常終了する（終了コード 0）。

## 7. 異常終了の条件

- `evidence_refs` 欠落、実装エビデンス不存在、対象ファイル不明、result 更新不能など、レビュー自体を完了できない場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; criterion=<id>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

_COMMON_CONVENTIONS_
