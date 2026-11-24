---
specdojo:
  id: prj-0001:xrp-jbr-night-approved-register-a56f170ee9d8-review
  type: exec-plan
  rulebook: none
  task_id: JBR-night-approved-register-a56f170ee9d8-review
  name: "承認済み登録項目の夜間実行 の実行結果レビュー"
  mode: review
  status: ready
  project_id: prj-0001
  origin: job
  job_id: job-night-approved-register
  run_id: JBR-night-approved-register-a56f170ee9d8
---

# job run Review Plan: 承認済み登録項目の夜間実行

## 1. このフェーズで行うこと

job run が作成した出力を変更せずにレビューし、統合可能かを判定する。

## 2. job run

- `job_id`: `job-night-approved-register`
- `run_id`: `JBR-night-approved-register-a56f170ee9d8`
- Run の状態: `succeeded`
- exec ブランチ: `exec/prj-0001-JBR-night-approved-register-a56f170ee9d8`
- 実行前 commit: `fec93ba744019ab2909b74e4dc017616cfe58d93`
- 出力 commit: `393bdfce2e38877482996f17bee9bdb936ca9276`
- job run result: `_RUN../worktrees/prj-0001-JBR-night-approved-register-a56f170ee9d8/docs/ja/projects/prj-0001/execution/runs/job/JBR-night-approved-register-a56f170ee9d8/JBR-night-approved-register-a56f170ee9d8-review/result.md`
- review result: `../worktrees/prj-0001-JBR-night-approved-register-a56f170ee9d8/docs/ja/projects/prj-0001/execution/runs/job/JBR-night-approved-register-a56f170ee9d8/JBR-night-approved-register-a56f170ee9d8-review/result.md`

Job の目的:

人が autopilot を承認した open todo・issue だけを実行し、朝報告を作る。

Job 固有の確認事項:

コマンドの終了結果と出力を確認する。

## 3. 完了条件

1. `fec93ba744019ab2909b74e4dc017616cfe58d93..393bdfce2e38877482996f17bee9bdb936ca9276` の差分が当該 job run の出力だけで構成されている。
2. job run の状態、command evidence、result の記述が相互に整合している。
3. score・verdict・finding・失敗文書がある場合は、その変化と理由を確認している。
4. Run が `partial` の場合は、完了分を統合でき、失敗分が次の Run で再試行できる記録を持つときだけ `complete-with-findings` とし、失敗した対象と理由を finding に残している。
5. Run が `failed` の場合、または `partial` でも完了分がない、失敗分を再試行できない、未開始の対象がある場合は `incomplete` とし、再開または人手対応に必要な理由を残している。
6. reviewer は job run の出力を修正せず、review result だけに判断を記録している。

## 4. 判断手順

1. `git diff --stat fec93ba744019ab2909b74e4dc017616cfe58d93..393bdfce2e38877482996f17bee9bdb936ca9276` と `git diff --name-status fec93ba744019ab2909b74e4dc017616cfe58d93..393bdfce2e38877482996f17bee9bdb936ca9276` で出力範囲を確認する。
2. job run の plan・result・evidence・Run JSON と、Job が更新した成果物を照合する。
3. `succeeded` で完了条件を満たす場合は `complete`、軽微な finding を残して統合可能なら `complete-with-findings` とする。
4. `partial` で完了分を統合可能かつ失敗分を次の Run へ回せる場合は `complete-with-findings` とする。`partial` に `complete` は使わない。
5. 失敗、未完了、対象外変更、根拠不足がある場合は `incomplete` とし、改善指示と waiting の理由を明記する。

## 5. 完了手順

1. review result の全セクションを埋める。
2. `decision` に verdict を記録する。
3. verdict にかかわらず、レビュー自体を完了できた場合は終了コード 0 とする。

## 6. 異常終了の条件

- 出力 commit、job run の記録、result のいずれかを読めず、レビュー自体を完了できない場合は終了コード 1 とする。
- review executor は成果物や job run 出力を編集しない。

`共通規約 sha256:0a9a60c0cf290acdf66e250274fb2db883829723ca3d3b292356b3276021b7f2` `docs/ja/projects/prj-0001/execution/conventions/0a9a60c0cf290acdf66e250274fb2db883829723ca3d3b292356b3276021b7f2.txt`
