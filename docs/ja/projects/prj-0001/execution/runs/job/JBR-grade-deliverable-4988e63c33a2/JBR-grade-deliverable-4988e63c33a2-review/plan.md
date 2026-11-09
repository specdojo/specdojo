---
specdojo:
  id: prj-0001:xrp-jbr-grade-deliverable-4988e63c33a2-review
  type: exec-plan
  rulebook: none
  task_id: JBR-grade-deliverable-4988e63c33a2-review
  name: "成果物の継続品質評価 の実行結果レビュー"
  mode: review
  status: ready
  project_id: prj-0001
  origin: job
  job_id: job-grade-deliverable
  run_id: JBR-grade-deliverable-4988e63c33a2
---

# Job Run Review Plan: 成果物の継続品質評価

## 1. このフェーズで行うこと

Job Run が作成した出力を変更せずにレビューし、統合可能かを判定する。

## 2. Job Run

- `job_id`: `job-grade-deliverable`
- `run_id`: `JBR-grade-deliverable-4988e63c33a2`
- Run の状態: `succeeded`
- exec ブランチ: `exec/prj-0001-JBR-grade-deliverable-4988e63c33a2`
- 実行前 commit: `55ee20c7c53e53fc001ae579382a0a283387d277`
- 出力 commit: `fbba42c2858928d9acd70bbe262b155455d3c065`
- Job Run result: `_RUN../worktrees/prj-0001-JBR-grade-deliverable-4988e63c33a2/docs/ja/projects/prj-0001/execution/runs/job/JBR-grade-deliverable-4988e63c33a2/JBR-grade-deliverable-4988e63c33a2-review/result.md`
- review result: `../worktrees/prj-0001-JBR-grade-deliverable-4988e63c33a2/docs/ja/projects/prj-0001/execution/runs/job/JBR-grade-deliverable-4988e63c33a2/JBR-grade-deliverable-4988e63c33a2-review/result.md`

Job の目的:

成果物を文書単位の agy 単段評価へ流し、最新の品質と done_criteria 充足状況を更新する。

Job 固有の確認事項:

runner が記録した command evidence の終了コードと、stdout に出力された
`results.tsv` から次を判断して報告する。

- 終了コード75（rate limit）または中断で未完了の段が残っているか。残る場合は同じ
  `--run-id` で再開できる状態かを確認する。
- `failed` の段があるか。ある場合は agent 側の失敗、`grade apply` による executor の
  marker の機械変換の拒否、done_criteria の過不足のいずれかへ切り分ける。
- Run が `partial` の場合は、`passed` の成果物が1件以上あり、各 `failed` の成果物と
  失敗段が pipeline state に記録されて次の Run の `--incomplete` で選択できるかを確認する。
- `retry_exhausted` の成果物があるか。ある場合は失敗段と連続失敗回数を示し、人手での
  原因解消または state の再開判断を促す。
- agy 単段の verdict と score に、評価設定の見直しを要する偏りがあるか。
- 未充足の done_criteria がある成果物と、その確認担当ロールを特定する。

選択された成果物が0件の場合は no-op と判断する。判断できない事象は推測で埋めず、
観測した事実と未確認の範囲を分けて報告する。

## 3. 完了条件

1. `55ee20c7c53e53fc001ae579382a0a283387d277..fbba42c2858928d9acd70bbe262b155455d3c065` の差分が当該 Job Run の出力だけで構成されている。
2. Job Run の状態、command evidence、result の記述が相互に整合している。
3. score・verdict・finding・失敗文書がある場合は、その変化と理由を確認している。
4. Run が `partial` の場合は、完了分を統合でき、失敗分が次の Run で再試行できる記録を持つときだけ `complete-with-findings` とし、失敗した対象と理由を finding に残している。
5. Run が `failed` の場合、または `partial` でも完了分がない、失敗分を再試行できない、未開始の対象がある場合は `incomplete` とし、再開または人手対応に必要な理由を残している。
6. reviewer は Job Run の出力を修正せず、review result だけに判断を記録している。

## 4. 判断手順

1. `git diff --stat 55ee20c7c53e53fc001ae579382a0a283387d277..fbba42c2858928d9acd70bbe262b155455d3c065` と `git diff --name-status 55ee20c7c53e53fc001ae579382a0a283387d277..fbba42c2858928d9acd70bbe262b155455d3c065` で出力範囲を確認する。
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
