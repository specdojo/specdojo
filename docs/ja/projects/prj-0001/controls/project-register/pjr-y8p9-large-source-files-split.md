---
specdojo:
  id: prj-0001:pjr-y8p9-large-source-files-split
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: low
  owner: DEV
  registered_at: "2026-10-02T12:14:39Z"
---

# PJR-Y8P9 1,000 行を超える残りのソースの分割

## 1. 概要

dashboard.ts・exec-worktree-ops.ts・exec-plans.ts・exec.ts・job.ts・exec-trial.ts・catalog-build.ts など 1,000 行を超えるファイルを必要に応じて分ける。動作は変えない（v0.3.0 の公開後）

## 2. 完了条件

1 件では量が多すぎるため、2026-10-15 に利用者の承認を得て 5 件に分けた。本項目はそれらをまとめる親の項目とする。

- 次の 5 件がすべて完了している。
- 完了後、`src/` に 1,000 行を超えるファイルが残る場合は、その一覧と理由を対応結果に記録する。

## 3. 作業内容

| No  | 作業                                                                            | 担当 | 状態 | メモ                                                   |
| --- | ------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------ |
| 1   | `register.ts` の残りのドメインの処理を分ける                                    | DEV  | open | [[prj-0001:pjr-p038-register-domain-split]]            |
| 2   | `exec-worktree-ops.ts`・`exec-repo-integration.ts`・`exec-reporter.ts` を分ける | DEV  | open | [[prj-0001:pjr-13m6-exec-worktree-integration-split]]  |
| 3   | `exec-plans.ts`・`exec.ts`・`exec-trial.ts` を分ける                            | DEV  | open | [[prj-0001:pjr-na04-exec-plans-trial-split]]           |
| 4   | `job.ts`・`routine.ts` を分ける                                                 | DEV  | open | [[prj-0001:pjr-3p4w-job-routine-split]]                |
| 5   | `dashboard.ts`・`catalog-build.ts`・`schedule-strategy-generate.ts` を分ける    | DEV  | open | [[prj-0001:pjr-r0k4-dashboard-catalog-schedule-split]] |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-th4b-eslint-max-lines-guard]]: 本項目の後に行の上限を決める。
