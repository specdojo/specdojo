---
specdojo:
  id: prj-0001:pjr-8mpy-agent-members-migration
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-14T22:18:44Z"
  due_on: null
---

# PJR-8MPY 本リポジトリの agent の名簿を 2 段構成へ移す

## 1. 概要

本リポジトリの agent-members.yaml と exec-defaults.yaml を実体と別名の 2 段へ移し、今の名前を別名として残す。Job・routine の指定が別名で動くことを確かめる。 PJR-ZM1K の決定に基づく（Y8P9 の完了後、0.4.0）

## 2. 完了条件

- PJR-TSP6 の完了後に行う。
- 本リポジトリの `.specdojo/agent-members.yaml` と `.specdojo/exec-defaults.yaml` を、実体と別名の 2 段へ移す案を作る。今の名前はすべて別名として残す。
- 保護された設定のため、executor は変更の案（差分）を result に書き、人が `exec handoff apply` か feature ブランチで反映する。
- 反映の後、Job（`job-grade-deliverable`・`job-grade-kata`）・routine・文書で使っている名前が別名で動くことを、`exec run --dry-run` などで確かめる。
- 今の名簿の `disabled` の member（使っていない local LLM など）を、実体に移すか消すかの一覧を result に書く。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG には記載しない（内部の変更のため）。

## 3. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ |
| --- | -------------------------------------------- | ---- | ---- | ---- |
| 1   | 本リポジトリの agent の名簿を 2 段構成へ移す | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-zm1k-agent-members-model-alias]]（決定）
