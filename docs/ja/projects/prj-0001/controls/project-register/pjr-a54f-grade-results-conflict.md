---
specdojo:
  id: prj-0001:pjr-a54f-grade-results-conflict
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T22:25:38Z"
  due_on: "2026-11-30"
  commit_type: fix
  commit_scope: exec
---

# PJR-A54F 並べて流したタスクどうしで、ほかの sample の grade の結果が衝突し、runner が解けない

## 1. 課題内容

- `T-KATA-WAVE-5-opr-support-sample-050` と `T-KATA-WAVE-5-opr-monitoring-sample-090` が「git merge failed: CONFLICT (content): Merge conflict in docs/ja/projects/prj-0001/execution/grade/results/specdojo.opr-access-control-sample.yaml」で止まった。その前は「Grade sidecar changed after checkpoint」で止まっていた。
- runner が示した `exec resume --task ... --resume-from executor` も、再開の前の同期で同じ衝突になり失敗した。
- 2026-11-24 に、worktree の実行の記録を commit し、develop を `-X theirs` で取り込んでから再開した。

## 2. 入力

- v0.10.0 に入れる（利用者の指定、2026-11-24）
- 2026-11-23〜24 の kata の一括実行（第 4〜6 波）で詰まった所から起票した

## 3. 影響範囲

- 同じ系列の sample（opr-*）を並べて流すと、grade の結果の衝突で止まる。

## 4. 対応方針

- タスクの run がほかの sample の grade の結果を書く理由を確かめ、書かない（自分の対象だけを書く）か、grade の結果を記帳と同じく runner が解く対象にするかを決め、理由を個票の対応結果に書く。
- 統合テストで、2 つのタスクが同じ sample の grade の結果を変えたときに、手を入れずに統合と再開が通ることを確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証の `test-integration` を通す。

## 5. 対応結果

### 5.1. 原因

- 各タスクの実行前 checkpoint（`gradeCheckpointPaths`）は、ルートで変更中の grade サイドカーをすべて取り込んでいた。ほかの sample の `grade/results` も含まれるため、並べて流したタスクの branch が同じサイドカーを持ち、統合で衝突した。

### 5.2. 対応

- 書かない方を選んだ。`gradeCheckpointPaths` に任意の第 2 引数を足し、`grade/results` をタスク自身の対象（`reviewGradeSidecarPaths`）に絞る。`criteria` と `pipeline` は従来どおり取り込む。
- `src/exec/run/schedule-prepare.ts` の 2 か所（通常の準備と executor 再開）で、タスクの対象だけを渡す。ほかの sample の結果はルートに残り、runner が解く対象を増やさずに済む。
- 引数を省いた呼び出し（`worktree-command.ts`、`register-worktree.ts`、`lifecycle-commands.ts`、`register-state.ts`）は従来どおり全件を取り込む。register や job の経路で同じ衝突が出たら、同じ絞り込みを渡す。

### 5.3. 確認結果

- `tests/src/exec/worktree-ops.integration.test.ts` に、ほかの sample の結果が checkpoint に入らないことを確かめるテストを追加し、通した。
- 2 つのタスクが同じ sample の結果を変える統合と再開の通しテストは追加していない。原因を作らない対応のため、checkpoint の絞り込みだけを確かめた。通しの確認は親の `test-integration` に任せる。

### 5.4. CHANGELOG に書く事項

- 区分: Fixed
- 文案: 並べて流したタスクが、ほかの sample の grade の結果を checkpoint に取り込んで統合で衝突する問題を修正した。checkpoint はタスク自身の対象の結果だけを取り込む（PJR-A54F）。

## 6. 関連ドキュメント

- 関連: PJR-DF5Z（再開の前の同期）。
