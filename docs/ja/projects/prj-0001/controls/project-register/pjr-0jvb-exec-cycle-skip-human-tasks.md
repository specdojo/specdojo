---
specdojo:
  id: prj-0001:pjr-0jvb-exec-cycle-skip-human-tasks
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-22T23:53:44Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-561Q
  commit_type: fix
  commit_scope: exec
---

# PJR-0JVB exec cycle が agent を指定すると人の確定のタスクを拾って失敗する

## 1. 課題内容

11-23 朝の exec cycle が第 3 波の完成版確定（execution: human）13 件を edit として拾い、plan の生成で止まって failed になった。agent を指定した自動の実行でも人のタスクを外す

## 2. 入力

- 2026-11-23 の朝の exec cycle（JBR-exec-cycle-eb11b9add2df）の stderr に、`T-KATA-WAVE-3-*-140` の 13 件で「has execution: human; claim it to create and use its result instead of a plan.」が出て、auto=failure になった
- 見立て（未確認）: src/exec/run/schedule-prepare.ts は agent の候補が無いときだけ人のタスクを止める。cycle が --edit-by で agent を渡すと、この判定を通り抜けて src/exec/plans-generation.ts の plan の生成で止まる
- PJR-561Q の記録では、--auto は execution: human のタスクを自動で飛ばしていた

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
