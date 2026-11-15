---
specdojo:
  id: prj-0001:pjr-1gcd-exec-condense-records-missing-retry
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-14T22:52:38Z"
  derived_from:
    - PJR-52EE
  commit_type: fix
  commit_scope: exec
---

# PJR-1GCD condense_records がない executor の結果を executor の段からやり直す

## 1. 概要

condense_records 欠落を reporter の失敗ではなく executor の失敗として扱う

## 2. 入力

- 2026-11-15 の夜間に bes-index-080 で、qwen が `condense_records` を出さず reporter で止まった。reporter の再実行では直らず、orchestrator が opus で executor の段から手でやり直した

## 3. 完了条件

- condense の approach で executor の evidence に `condense_records` がない（または形式が正しくない）とき、reporter の失敗にせず executor の段の失敗として記録する。
- 失敗の理由と次の操作（`exec resume --task <id> --resume-from executor`、必要なら `--executor-by` で agent を替える）を、block の理由と result に残す。
- 再開したとき、reporter だけを流し直して同じ失敗を繰り返さない。
- 同じ evidence の形式の欠けを reporter の段より前に検査する仕組みを、ほかの approach の必須項目にも当てはめられるか検討し、結論を対応結果に書いている。
- 欠けた場合と正しい場合を、回帰テストで確かめている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------- | ---- | ---- | ---- |
| 1   | condense_records の欠けを executor の段の失敗として扱う | DEV  | done | -    |
| 2   | block の理由と再開の案内を足す                          | DEV  | done | -    |
| 3   | 回帰テストを足す                                        | DEV  | done | -    |

## 5. 対応結果

### 5.1. 実施内容

- `src/exec/evidence.ts` に approach が executor の報告に求める項目の検査（`executorReportContractFailure`）を足した。`condense` の edit で `condense_records` がない、または形式が正しくないときに失敗とする。`enforceExecutorReportContract` は失敗時に evidence を `completion_status: incomplete` とし、理由と次の操作を `block_reason` に入れて保存する。
- 検査は reporter の起動前に置いた。schedule の worktree 実行（`schedule-task.ts`）、in-place 実行（`in-place.ts`）、register と Job の pipeline（`agent-pipeline.ts` の `runReporterStage`）の 3 か所で、失敗時は executor の段を `blocked` にし、reporter を起動しない。block の理由は従来の経路で result の `block_reason` と block イベントに残る。schedule の block は `pipeline_stage=executor` で記録される。
- 次の操作の文言は `executorStageResumeHint` で作る。schedule は `specdojo exec resume --task <id> --resume-from executor`、register は `specdojo exec run --register <id> --worktree --resume --resume-from executor` で、どちらも `--executor-by <nickname>` で agent を替えられることを添える。
- 再開: register は evidence が `incomplete` のため executor の段から再開する（既存の選択規則）。schedule は案内どおり `--resume-from executor` を付けて再開できるよう、`lifecycle-commands.ts` の前提と `selectScheduleExecutorResume` を、executor の段が `blocked` かつ evidence が `incomplete` の run も受け付けるよう広げた。前回の理由は申し送りとして再開した executor に渡る。
- 検査を `runReporterStage` と schedule の reporter の直前に置いたため、この変更より前に記録され reporter の段で止まった run を reporter だけで再開した場合も、同じ evidence で reporter を流し直さず executor の段へ戻す。
- 回帰テスト: `tests/src/exec/executor-report-contract.test.ts`（欠落・配列でない・要素の形式不正で失敗、`[]` と正しい記録で成功、ほかの approach と review は対象外、evidence の保存と再開の案内）を足し、`tests/src/exec/register-resume.test.ts` に executor の段で止めた run を `--resume-from executor` で再開できるケースを足した。
- 文書: `exec-config-guide`（executor の報告の説明）、`plan-result-lifecycle-guide`（condense の記録）、`exec-operation-guide` と `command-reference`（`--resume-from executor` の対象）に反映した。

### 5.2. 判断した点

- 検査の位置は executor の終了直後ではなく reporter の起動直前にした。reporter の前なら reporter は動かず、reporter だけの再開にも同じ検査が効くため。
- approach は schedule と in-place では task の `approach`、`runReporterStage` では result の scaffold の `approach` から取る。reporter が `condense_records` を要求する判定と同じ情報源にそろえるため。
- schedule の案内は完了条件どおり `--resume-from executor` とし、そのために再開の前提を広げた。広げる範囲は「executor の段が `blocked` かつ evidence が `incomplete`」に限り、保護機構による block など従来拒否していた状態は変えていない。
- 失敗時も evidence の `stage.status` はプロセスの実際の結果（`succeeded`）のままにした。`completion_status: incomplete` で未完了を表す既存の規約に合わせるため。

### 5.3. ほかの approach への当てはめの検討

- 結論: 同じ仕組み（`executorReportContractFailure` に approach ごとの必須項目を足す）で当てはめられる。ただし現時点で executor の報告に必須の項目を持つ approach は `condense` だけなので、ほかは足していない。
- 根拠: executor の prompt が追加の項目を求めるのは `condense` の `condense_records` だけで、ほかの approach の必須事項は result の scaffold と reporter の出力の schema で検査している。新しい approach が executor の報告に項目を求めるときは、この関数に条件を足せば reporter より前の検査と executor の段からの再開がそのまま働く。

### 5.4. CHANGELOG に書く事項

- `condense` の pipeline で executor が `condense_records` を出さない、または形式が正しくない場合、reporter の失敗ではなく executor の段の失敗として止まり、`block_reason` と result に再開の操作（`--resume-from executor`、agent を替える `--executor-by`）を残すようになった。
- schedule の `exec resume --task <id> --resume-from executor` が、上記で executor の段に止まったタスクも受け付けるようになった。
- reporter の段で止まった既存の run も、reporter だけの再開で同じ失敗を繰り返さず executor の段へ戻る。

### 5.5. 残課題

- なし。

## 6. 関連ドキュメント

- PJR-52EE（失敗の見張りと自動の立て直し）
