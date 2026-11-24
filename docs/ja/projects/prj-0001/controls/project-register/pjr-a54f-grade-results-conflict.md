---
specdojo:
  id: prj-0001:pjr-a54f-grade-results-conflict
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
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

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- 関連: PJR-DF5Z（再開の前の同期）。
