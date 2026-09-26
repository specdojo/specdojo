---
specdojo:
  id: prj-0001:pjr-bwyw-bps-2-grade
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: low
  owner: QE
  registered_at: "2026-09-26T10:47:19Z"
---

# PJR-BWYW BPS 2 件の grade 指摘を解消する

## 1. 概要

[[prj-0001:pjr-h5z7-cdfd-3-bps-2-grade-finding]] で BPS 2 件を評価した。`bps-task-completion` は `pass`（96 点）、`bps-deliverable-evaluation` は `needs-work`（92 点）で、指摘は 4 件ある。いずれも構造上の問題ではなく記述の整理である。

## 2. 指摘

| 文書                         | 重大度 | 観点                          | 指摘                                                            |
| ---------------------------- | ------ | ----------------------------- | --------------------------------------------------------------- |
| `bps-deliverable-evaluation` | major  | `vp-qe-omissions-consistency` | `T-02` の不成立時の扱いが「本プロセスを開始する」で論理的に矛盾 |
| `bps-deliverable-evaluation` | minor  | `vp-arc-conciseness`          | 既存評価結果の再利用の記述が 2・3・5 章で反復                   |
| `bps-task-completion`        | minor  | `vp-arc-conciseness`          | 再評価しない方針が概要と処理ステップで重複                      |
| `bps-task-completion`        | minor  | `vp-qe-omissions-consistency` | 前提条件に yes / no で判定できない遵守事項が入っている          |

`T-02` の指摘は `bps-rulebook.md` のトリガー表規約（不成立時の扱いは「非起動、差戻し、または主要例外 ID」）に反している。

`bps-task-completion` の 2 件目は `bps-rulebook.md` の「前提条件は yes / no で判定できる文にし」に反する。「PO と PM は grade の観点を用いて成果物を再評価しない」は遵守事項であり前提条件ではない。**原則 1 の表現として重要なため、削除せず概要または処理の遵守事項へ移す。**

## 3. 完了条件

- `bps-deliverable-evaluation` の `T-02` の不成立時の扱いが、非起動・差戻し・主要例外 ID のいずれかになっている。
- 再利用の記述が 1 箇所へ集約されている。
- `bps-task-completion` の「再評価しない」が前提条件から移され、失われていない。
- grade を再実行し、`bps-deliverable-evaluation` の major が解消している。

## 4. 作業内容

| No  | 作業                             | 担当 | 状態 | メモ                    |
| --- | -------------------------------- | ---- | ---- | ----------------------- |
| 1   | `T-02` の不成立時の扱いを直す    | QE   | open | major                   |
| 2   | 再利用の記述を集約する           | QE   | open |                         |
| 3   | 「再評価しない」を遵守事項へ移す | QE   | open | 原則 1 の表現として残す |
| 4   | grade を再実行する               | QE   | open | `--stages 1` を明示する |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-h5z7-cdfd-3-bps-2-grade-finding]]
- [[bps-deliverable-evaluation]]
- [[bps-task-completion]]
- `docs/ja/specdojo/rulebooks/bps-rulebook.md`
