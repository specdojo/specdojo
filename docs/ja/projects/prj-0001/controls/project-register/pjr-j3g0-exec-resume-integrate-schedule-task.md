---
specdojo:
  id: prj-0001:pjr-j3g0-exec-resume-integrate-schedule-task
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: ARC
  registered_at: "2026-09-15T14:15:36Z"
  due_on: "2026-09-30"
  block_reason: "agent exited with non-zero code: runner による検証 `test-integration` が failed となっているため。プランの完了条件である静的検査およびテストの成功を満たしていない。"
---

# PJR-J3G0 Schedule タスクの統合段だけを再開できるようにする

## 1. 概要

worktree で実行した Schedule タスクが executor・reporter 成功後の commit・merge で失敗して block した場合、register 項目の --resume にある統合段の再開に相当する経路が無い。exec resume --task は executor を再実行しようとするため、cdfd-check-010 では exec worktree commit / merge / remove と exec complete を手で順に実行して回復した。pipeline-state.json の executor・reporter が succeeded なら agent を起動せず統合だけを行う再開を exec resume に追加し、統合段の状態を Schedule タスクの pipeline-state にも記録する。

### 1.1. 観測（`T-DATA-FLOW-PDCA-cdfd-check-010`）

- `pipeline-state.json` は executor・reporter とも `succeeded`。統合段（`integrate`）の記録は無い。
- commit が失敗して block event が書かれ、worktree は成果物と記入済み result を保持したまま残った。
- `exec resume --task` は `blocked` を「再開不可」とし、`exec unblock` 後の dry-run では executor の再実行を提示した。
- 回復は次の手順を手で行った: result を修正 → `exec unblock` → worktree 内で `exec worktree commit` →
  `exec worktree merge` → `exec worktree remove` → `exec complete`。

register 項目の `exec run --register --worktree --resume` には統合段の再開（agent を起動せず commit → merge → 撤去）が
あるが、Schedule タスクには無い。

### 1.2. 対処の方向

- Schedule タスクでも `pipeline-state.json` に統合段の開始・失敗を記録する。
- `exec resume --task <task>` が、state の executor・reporter が `succeeded` で統合が未完了なら agent を起動せず
  統合だけを再開する。`blocked` の場合も、block の原因が統合段なら `unblock` 後に統合段から再開できるようにする。
- 前回 merge まで完了していた場合は再 merge せず、撤去と `complete` だけを進める。

## 2. 完了条件

- 統合段で失敗した Schedule タスクの worktree に対して `exec resume --task <task>` を実行すると、agent を起動せずに
  commit → merge → worktree 撤去 → complete が行われる。
- `pipeline-state.json` に統合段の開始・失敗・成功が記録される。
- 前回 merge 済みの場合に再 merge しない。
- 統合テストに、commit 失敗後の再開と、merge 済み後の再開の 2 ケースがある。
- [[specdojo:exec-operation-guide]] の再開の説明が Schedule タスクにも当てはまる記述になっている。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。

## 3. 作業内容

| No  | 作業                                                | 担当 | 状態 | メモ               |
| --- | --------------------------------------------------- | ---- | ---- | ------------------ |
| 1   | Schedule タスクの pipeline-state に統合段を記録する | ARC  | open | register と同じ形  |
| 2   | `exec resume --task` に統合段だけの再開を追加する   | ARC  | open | agent を起動しない |
| 3   | 統合テストと exec-operation-guide を更新する        | ARC  | open | 2 ケース           |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 再開の設計: [[specdojo:exec-operation-guide]]
- 発生の原因: [[prj-0001:pjr-19hx-result-prettier-emphasis-mangling]]
- register 側の worktree 統合: [[prj-0001:pjr-6776-worktree-branch-naming]]
