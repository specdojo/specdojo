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

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の確認入力である。実行記録にある対応記録の突き合わせに使い、実装は変更しない。

_IMPLEMENTATION_EVIDENCE_

## 4. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `_GRADE_SUBJECT_PATH_`
- grade の対象種別（`--target`）: `_GRADE_TARGET_`
- 評価結果サイドカー: `_GRADE_RESULT_PATH_`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

## 5. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID  | ロール | viewpoint_id | 完了条件 |
| --- | ------ | ------------ | -------- |
_DONE_CRITERIA_ROWS_
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

## 6. 進め方

retrofit のタスクは、既存の実装を根拠に成果物を意図された仕様へ合わせることを求めた。成果物の内容の品質は grade が評価済みである。review は成果物を読み直して判定せず、実装との対応が記録されているかを確認する。

1. フェーズ説明と完了条件が求めた作成・更新が、対象成果物に行われたかを確認する。
2. 実行記録に、「実装エビデンス」に列挙された各パスについて、成果物の記述との対応と判定（一致・乖離・確認不能・未確認）が残っているかを確認する。記録のないパスは未充足事項とする。
3. 乖離ごとに修正対象候補（実装・文書・意思決定）と根拠が記録されているか、調査できなかった範囲が明示されているかを確認する。
4. 実装から目的・業務判断・将来方針を推測して成果物へ書いた形跡が finding にある場合は、このタスクの完了を妨げるかを判断する。

本タスクの実行に必要な retrofit の確認方針は、このセクションで完結する。approach 全体の定義を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

## 7. 完了手順

1. 共通規約の `review の判断手順` に従い、評価結果の鮮度を確認してから完了可否を判断する。
2. result の各セクションを埋める。`評価結果の確認` には鮮度確認のコマンドと出力、grade の `verdict` / `score` / finding 件数を書く。`判断根拠` には照合した内容を、`未充足事項・改善指示` には未充足事項と改善指示を書く。`approach に応じた確認` には実装エビデンスの対応記録の確認結果と未確認範囲を、`decision` には `verdict` を書く。review result の記入はタスク完了に必須であり、未記入のまま終了しない（詳細は共通規約を参照）。
3. 文書の参照は `[[id]]` 形式、実装参照はリポジトリルート相対パスで記載し、絶対パスを使わない。
4. verdict が `complete` 以外でも、review result を記録できた場合は正常終了する（終了コード 0）。

## 8. 異常終了の条件

- `evidence_refs` 欠落、実装エビデンス不存在、対象ファイル不明、result 更新不能など、review 自体を完了できない場合は異常終了する（終了コード 1）。評価結果が最新でない・評価不能であることは異常終了の理由にせず、verdict として記録する。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

_COMMON_CONVENTIONS_
