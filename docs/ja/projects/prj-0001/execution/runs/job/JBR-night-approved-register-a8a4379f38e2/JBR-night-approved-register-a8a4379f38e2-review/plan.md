---
specdojo:
  id: prj-0001:xrp-jbr-night-approved-register-a8a4379f38e2-review
  type: exec-plan
  rulebook: none
  task_id: JBR-night-approved-register-a8a4379f38e2-review
  name: "承認済み登録項目の夜間実行 の実行結果レビュー"
  mode: review
  status: ready
  project_id: prj-0001
  origin: job
  job_id: job-night-approved-register
  run_id: JBR-night-approved-register-a8a4379f38e2
---

# Job Run Review Plan: 承認済み登録項目の夜間実行

## 1. このフェーズで行うこと

Job Run が作成した出力を変更せずにレビューし、統合可能かを判定する。

## 2. Job Run

- `job_id`: `job-night-approved-register`
- `run_id`: `JBR-night-approved-register-a8a4379f38e2`
- Run の状態: `succeeded`
- exec ブランチ: `exec/prj-0001-JBR-night-approved-register-a8a4379f38e2`
- 実行前 commit: `d20bb9353bfd6c9c0be99915ff9745f3f8faf3c6`
- 出力 commit: `ccacf5c902043ce9605b319ccc6b6872d40b9f52`
- Job Run result: `_RUN../worktrees/prj-0001-JBR-night-approved-register-a8a4379f38e2/docs/ja/projects/prj-0001/execution/runs/job/JBR-night-approved-register-a8a4379f38e2/JBR-night-approved-register-a8a4379f38e2-review/result.md`
- review result: `../worktrees/prj-0001-JBR-night-approved-register-a8a4379f38e2/docs/ja/projects/prj-0001/execution/runs/job/JBR-night-approved-register-a8a4379f38e2/JBR-night-approved-register-a8a4379f38e2-review/result.md`

Job の目的:

人が autopilot を承認した open todo・issue だけを実行し、朝報告を作る。

Job 固有の確認事項:

コマンドの終了結果と出力を確認する。

## 3. 完了条件

1. `d20bb9353bfd6c9c0be99915ff9745f3f8faf3c6..ccacf5c902043ce9605b319ccc6b6872d40b9f52` の差分が当該 Job Run の出力だけで構成されている。
2. Job Run の状態、command evidence、result の記述が相互に整合している。
3. score・verdict・finding・失敗文書がある場合は、その変化と理由を確認している。
4. Run が `partial` の場合は、完了分を統合でき、失敗分が次の Run で再試行できる記録を持つときだけ `complete-with-findings` とし、失敗した対象と理由を finding に残している。
5. Run が `failed` の場合、または `partial` でも完了分がない、失敗分を再試行できない、未開始の対象がある場合は `incomplete` とし、再開または人手対応に必要な理由を残している。
6. reviewer は Job Run の出力を修正せず、review result だけに判断を記録している。

## 4. 判断手順

1. `git diff --stat d20bb9353bfd6c9c0be99915ff9745f3f8faf3c6..ccacf5c902043ce9605b319ccc6b6872d40b9f52` と `git diff --name-status d20bb9353bfd6c9c0be99915ff9745f3f8faf3c6..ccacf5c902043ce9605b319ccc6b6872d40b9f52` で出力範囲を確認する。
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

`共通規約 sha256:13f1d90345b0d1f0bd602cc3e3f06afa7d772eb714e855b6103c85854bebda59` `docs/ja/projects/prj-0001/execution/conventions/13f1d90345b0d1f0bd602cc3e3f06afa7d772eb714e855b6103c85854bebda59.txt`
