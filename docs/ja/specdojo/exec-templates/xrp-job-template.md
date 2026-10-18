_FRONTMATTER_

# Job Run Review Plan: _JOB_NAME_

## 1. このフェーズで行うこと

Job Run が作成した出力を変更せずにレビューし、統合可能かを判定する。

## 2. Job Run

- `job_id`: `_JOB_ID_`
- `run_id`: `_RUN_ID_`
- Run の状態: `_RUN_STATE_`
- exec ブランチ: `_BRANCH_`
- 実行前 commit: `_BASE_COMMIT_`
- 出力 commit: `_OUTPUT_COMMIT_`
- Job Run result: `_RUN_RESULT_REF_`
- review result: `_RESULT_REF_`

Job の目的:

_JOB_DESCRIPTION_

Job 固有の確認事項:

_ANALYSIS_DESCRIPTION_

## 3. 完了条件

1. `_BASE_COMMIT_.._OUTPUT_COMMIT_` の差分が当該 Job Run の出力だけで構成されている。
2. Job Run の状態、command evidence、result の記述が相互に整合している。
3. score・verdict・finding・失敗文書がある場合は、その変化と理由を確認している。
4. Run が `partial` の場合は、完了分を統合でき、失敗分が次の Run で再試行できる記録を持つときだけ `complete-with-findings` とし、失敗した対象と理由を finding に残している。
5. Run が `failed` の場合、または `partial` でも完了分がない、失敗分を再試行できない、未開始の対象がある場合は `incomplete` とし、再開または人手対応に必要な理由を残している。
6. reviewer は Job Run の出力を修正せず、review result だけに判断を記録している。

## 4. 判断手順

1. `git diff --stat _BASE_COMMIT_.._OUTPUT_COMMIT_` と `git diff --name-status _BASE_COMMIT_.._OUTPUT_COMMIT_` で出力範囲を確認する。
2. Job Run の plan・result・evidence・Run JSON と、Job が更新した成果物を照合する。
3. `succeeded` で完了条件を満たす場合は `complete`、軽微な finding を残して統合可能なら `complete-with-findings` とする。
4. `partial` で完了分を統合可能かつ失敗分を次の Run へ回せる場合は `complete-with-findings` とする。`partial` に `complete` は使わない。
5. 失敗、未完了、対象外変更、根拠不足がある場合は `incomplete` とし、改善指示と waiting の理由を明記する。

## 5. 完了手順

1. review result の全セクションを埋める。
2. `decision` に verdict を記録する。
3. verdict にかかわらず、レビュー自体を完了できた場合は終了コード 0 とする。

## 6. 異常終了の条件

- 出力 commit、Job Run の記録、result のいずれかを読めず、レビュー自体を完了できない場合は終了コード 1 とする。
- review executor は成果物や Job Run 出力を編集しない。

_COMMON_CONVENTIONS_
