_FRONTMATTER_

# Register Post-run Review Plan: _ITEM_ID_ _ITEM_TITLE_

## 1. このフェーズで行うこと

`exec run --register` が統合した変更を読み取り専用で確認し、登録項目を自動で close できるかを判定する。

この review は成果物の grade ではなく、登録項目の完了判定である。grade サイドカーの有無や鮮度は判定条件にしない。verdict は `complete`、`complete-with-findings`、`incomplete` のいずれかにする。

## 2. 確認対象

- 登録項目: `_ITEM_PATH_`
- edit plan: `_EDIT_PLAN_REF_`
- edit result: `_EDIT_RESULT_REF_`
- executor evidence: `_EDIT_EVIDENCE_REF_`
- 統合前 commit: `_BASE_COMMIT_`
- 統合後 commit: `_OUTPUT_COMMIT_`
- review result: `_RESULT_REF_`

## 3. 完了条件

1. 登録項目の「完了条件」を edit result、統合差分、検証結果と照合している。
2. `_BASE_COMMIT_.._OUTPUT_COMMIT_` の差分に対象外の変更が混入していない。
3. edit result と executor evidence に、完了を妨げる失敗、未実施の必須検証、未解消の申し送りがない。
4. 完了条件を満たす場合は `complete`、軽微な finding を残して完了できる場合は `complete-with-findings`、未充足・根拠不足・検証失敗がある場合は `incomplete` とする。
5. review executor は、確認のための読み取り専用コマンドだけを実行し、成果物、登録項目、edit plan/result を変更しない。

## 4. 判断手順

1. 登録項目の概要と完了条件、edit plan、edit result を読む。
2. `git diff --stat _BASE_COMMIT_.._OUTPUT_COMMIT_` と `git diff --name-status _BASE_COMMIT_.._OUTPUT_COMMIT_` を実行し、必要に応じて同じ範囲の差分本文を読む。
3. executor evidence がある場合は、変更一覧、検証結果、block 理由、申し送りを確認する。`_EDIT_EVIDENCE_REF_` が `-` の場合は、edit result と差分から確認できる範囲を判断根拠に明記する。
4. 個票の各完了条件について、満たした根拠または未充足事項を具体的に記録する。
5. result の「評価結果の確認」には、この review では grade を使わず、edit の検証結果を確認したことを書く。

## 5. 完了手順

1. review result の全セクションを埋める。
2. `decision` に `complete`、`complete-with-findings`、`incomplete` のいずれかを記録する。
3. verdict にかかわらず、review 自体を完了できた場合は終了コード 0 とする。

## 6. 異常終了の条件

- 登録項目、edit plan/result、または統合差分を読めず review 自体を完了できない場合は終了コード 1 とする。
- review executor は review result を含むファイルを編集しない。result の記入は reporter が行う。
