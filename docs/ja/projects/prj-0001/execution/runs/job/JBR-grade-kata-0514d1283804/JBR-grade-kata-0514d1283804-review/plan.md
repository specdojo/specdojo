---
specdojo:
  id: prj-0001:xrp-jbr-grade-kata-0514d1283804-review
  type: exec-plan
  rulebook: none
  task_id: JBR-grade-kata-0514d1283804-review
  name: "実践の型の品質評価 の実行結果レビュー"
  mode: review
  status: ready
  project_id: prj-0001
  origin: job
  job_id: job-grade-kata
  run_id: JBR-grade-kata-0514d1283804
---

# Job Run Review Plan: 実践の型の品質評価

## 1. このフェーズで行うこと

Job Run が作成した出力を変更せずにレビューし、統合可能かを判定する。

## 2. Job Run

- `job_id`: `job-grade-kata`
- `run_id`: `JBR-grade-kata-0514d1283804`
- Run の状態: `succeeded`
- exec ブランチ: `exec/prj-0001-JBR-grade-kata-0514d1283804`
- 実行前 commit: `e32d00785460b9cc6227a831a39d70af557cc13b`
- 出力 commit: `a6f6b173e6d9b8521fa64c9de31c75dbf828311e`
- Job Run result: `_RUN../worktrees/prj-0001-JBR-grade-kata-0514d1283804/docs/ja/projects/prj-0001/execution/runs/job/JBR-grade-kata-0514d1283804/JBR-grade-kata-0514d1283804-review/result.md`
- review result: `../worktrees/prj-0001-JBR-grade-kata-0514d1283804/docs/ja/projects/prj-0001/execution/runs/job/JBR-grade-kata-0514d1283804/JBR-grade-kata-0514d1283804-review/result.md`

Job の目的:

文書単位の agy 単段評価を起動し、その実行結果に異常がないかを判断する。

Job 固有の確認事項:

runner が記録した command evidence の終了コードと、`grade run` の出力（stdout の
`graded:`・`resumed complete:`・`retry exhausted:` の行、stderr の
`grade run incomplete:`・`grade run stopped by rate limit:` に続く文書ごとの行）から
次を判断して報告する。

- 終了コード75（rate limit）または中断で未完了の文書が残っているか。残る場合は同じ
  `--run-id` で再開できる状態かを確認する。
- 失敗した文書があるか。ある場合は agent 側の失敗と、executor の marker を機械変換
  できず拒否したもののいずれかへ切り分ける。
- Run が `partial` の場合は、`graded:` の文書が1件以上あり、失敗した各文書が
  pipeline state に記録されて次の Run の `--incomplete` で選択できるかを確認する。
- `retry exhausted:` の文書があるか。ある場合は `grade state --path` で連続失敗回数を
  確かめ、人手での原因解消または state の再開判断を促す。
- agy 単段の verdict と score の分布に、評価設定の見直しを要する偏りがあるか。

選択された文書が0件の場合は no-op と判断する。判断できない事象は推測で埋めず、
観測した事実と未確認の範囲を分けて報告する。

## 3. 完了条件

1. `e32d00785460b9cc6227a831a39d70af557cc13b..a6f6b173e6d9b8521fa64c9de31c75dbf828311e` の差分が当該 Job Run の出力だけで構成されている。
2. Job Run の状態、command evidence、result の記述が相互に整合している。
3. score・verdict・finding・失敗文書がある場合は、その変化と理由を確認している。
4. Run が `partial` の場合は、完了分を統合でき、失敗分が次の Run で再試行できる記録を持つときだけ `complete-with-findings` とし、失敗した対象と理由を finding に残している。
5. Run が `failed` の場合、または `partial` でも完了分がない、失敗分を再試行できない、未開始の対象がある場合は `incomplete` とし、再開または人手対応に必要な理由を残している。
6. reviewer は Job Run の出力を修正せず、review result だけに判断を記録している。

## 4. 判断手順

1. `git diff --stat e32d00785460b9cc6227a831a39d70af557cc13b..a6f6b173e6d9b8521fa64c9de31c75dbf828311e` と `git diff --name-status e32d00785460b9cc6227a831a39d70af557cc13b..a6f6b173e6d9b8521fa64c9de31c75dbf828311e` で出力範囲を確認する。
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

`共通規約 sha256:0a9a60c0cf290acdf66e250274fb2db883829723ca3d3b292356b3276021b7f2` `docs/ja/projects/prj-0001/execution/conventions/0a9a60c0cf290acdf66e250274fb2db883829723ca3d3b292356b3276021b7f2.txt`
