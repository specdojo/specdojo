---
specdojo:
  id: prj-0001:pjr-1zqk-run-record-layout-guard
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T22:40:41Z"
  due_on: "2026-11-20"
  derived_from:
    - PJR-DVNV
  commit_type: fix
  commit_scope: exec
---

# PJR-1ZQK plan だけの run の記録を commit せず、記録の配置の検査を push の前に流す

## 1. 概要

setup で止まった run の plan だけの記録が develop に入り、CI の Check execution record layout が落ちた

## 2. 入力

- 2026-11-16、push した develop（54b7722）で CI の Check execution record layout が落ちた。原因は c9792389a（orchestrator がたまっていた実行記録をまとめて commit したもの）に、setup で止まった run（T-KATA-WAVE-2-bac-task-execution-005 の 0169b6b4）の plan.md だけが入っていたこと。evidence.json と result.md がないため exec validate --records-only が missing を出す。a9beaef99 でこの plan.md を git から外して直した
- PJR-DVNV で runner は統合の後の記録も自動で commit するようになった。setup や executor の起動前に止まった run が plan だけを残すと、同じ形の記録が runner の commit で develop に入り、CI を落とすおそれがある

## 3. 完了条件

- setup で止まる run を再現するテストで、commit される記録が配置の検査を通る。
- push の前の検査が、配置の誤りを含む commit で失敗し、正しい commit では通る。
- `npm run check` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                                                                                                                                                     | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | runner が plan だけの run を残さない、または止まった理由を含めて記録をそろえる（どちらにするかは exec の記録の配置の規約と合わせて決める）                                               | DEV  | open | -    |
| 2   | lefthook の pre-push などで exec validate --project prj-0001 --records-only を流し、CI より先に気づけるようにする。ローカルにしかない空の run のディレクトリで誤検出しないことも確かめる | DEV  | open | -    |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-dvnv-exec-commit-trailing-records]]
