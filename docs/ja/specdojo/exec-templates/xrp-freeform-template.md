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

## 3. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `_GRADE_SUBJECT_PATH_`
- grade の対象種別（`--target`）: `_GRADE_TARGET_`
- 評価結果サイドカー: `_GRADE_RESULT_PATH_`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

## 4. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID  | ロール | viewpoint_id | 完了条件 |
| --- | ------ | ------------ | -------- |
_DONE_CRITERIA_ROWS_
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

## 5. 進め方

freeform のタスクは、実践の型に縛られず、類似成果物の実例とプロジェクト文脈に沿って成果物を作成・更新することを求めた。内容の品質は grade が評価済みである。review は実例やプロジェクト文脈との整合を照合し直さず、評価結果の finding として扱う。

1. フェーズ説明と完了条件が求めた作成・更新が、対象成果物に行われたかを確認する。
2. 実践の型とプロジェクト文脈が矛盾し、プロジェクト文脈を優先した箇所がある場合は、実行記録にその理由が残っているかを確認する。
3. finding が残っている場合は、このタスクの完了を妨げるかを判断する。
4. 完了可否の判断に一般的な用語・標準の確認が必要で、実行 agent が Web 検索能力を持つ場合は、関連情報を確認して出典を判断根拠に添える。Web 検索能力がない場合は、確認できない事項を判断根拠に記録する。

本タスクの実行に必要な freeform の確認方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や edit への適用）を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

## 6. 完了手順

1. 共通規約の `review の判断手順` に従い、評価結果の鮮度を確認してから完了可否を判断する。
2. result の各セクションを埋める。`評価結果の確認` には鮮度確認のコマンドと出力、grade の `verdict` / `score` / finding 件数を書く。`判断根拠` には照合した内容を、`未充足事項・改善指示` には未充足事項と改善指示を書く。`approach に応じた確認` には前章で確認した内容を、`decision` には `verdict` を書く。review result の記入はタスク完了に必須であり、未記入のまま終了しない（詳細は共通規約を参照）。
3. 文書の参照は `[[id]]` 形式（Obsidian wikilink）で記載する。行番号アンカー（`#L12-L18` など）や絶対パスは使わない。位置の補足が必要な場合は本文で述べる。
4. verdict が `complete` 以外でも、review result を記録できた場合は正常終了する（終了コード 0）。

## 7. 異常終了の条件

- 対象ファイル不明・依存未解決・result 更新不能など、review 自体を完了できない場合は異常終了する（終了コード 1）。評価結果が最新でない・評価不能であることは異常終了の理由にせず、verdict として記録する。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

_COMMON_CONVENTIONS_
