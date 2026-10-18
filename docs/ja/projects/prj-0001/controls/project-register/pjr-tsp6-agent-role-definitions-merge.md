---
specdojo:
  id: prj-0001:pjr-tsp6-agent-role-definitions-merge
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: DEV
  registered_at: "2026-10-14T22:18:36Z"
  due_on: null
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=.claude/agents/claude-executor.md, .claude/agents/claude-expert-ex…"
---

# PJR-TSP6 agent の定義を役割ごとの 1 ファイルにまとめる

## 1. 概要

claude・opencode の agent の定義を model ごとの複製から役割（executor・review executor・reporter など）ごとの 1 ファイルにまとめ、model は --model で渡す。 PJR-ZM1K の決定に基づく（Y8P9 の完了後、0.4.0）

## 2. 完了条件

- PJR-YK1C の完了後に行う。
- claude と opencode の agent の定義を、model ごとの複製から役割（executor・review executor・reporter など）ごとの 1 ファイルにまとめ、model は `--model {model}` で渡す。
- まとめる前と後で、各役割の指示の本文（権限・手順）が変わらないことを確かめ、違いがあれば result に書く。
- Claude Code の役割別の settings（`--settings`）など、agent の定義と組になっている設定が引き続き効く。
- 保護された設定（`.specdojo/**` など）を変える必要がある場合は、変更の案を result に書き、人が反映する。
- 代表的な役割（executor と reporter）で、claude と opencode の agent が実際に起動できることを確かめる。agent の起動が sandbox で行えない場合は `requires_human` とする。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG に記載する場合は、未公開の版の節（`## [0.4.0] - 未定`）に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                          | 担当 | 状態 | メモ |
| --- | --------------------------------------------- | ---- | ---- | ---- |
| 1   | agent の定義を役割ごとの 1 ファイルにまとめる | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-zm1k-agent-members-model-alias]]（決定）
