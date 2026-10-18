---
specdojo:
  id: prj-0001:pjr-eank-agent-members-alias-schema
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-14T22:18:18Z"
  due_on: null
---

# PJR-EANK agent の名簿の schema に実体の model と別名を加える

## 1. 概要

agent-members の schema に、実体の provider・model・effort と、別名（実体を指す名前）を加え、検証（別名の循環・存在しない実体・無効な実体を指す別名）を入れる。 PJR-ZM1K の決定に基づく（Y8P9 の完了後、0.4.0）

## 2. 完了条件

- agent-members の schema（`docs/specdojo/schemas/v1/agent-members.schema.yaml`）に、実体の `provider`・`model`・`effort`・役割と、別名（実体を指す名前）を加える。
- 実体の名前は model の系統（`opus`・`sonnet`・`sol`・`terra`・`flash` など）と役割で付け、版は `model` の欄に書く。既定でない provider の実体は provider の名前を前に付ける（`agy-opus-executor` など）。この命名を schema の説明か [[specdojo:exec-config-guide]] に書く。
- 名簿の読み込みで、別名の循環、存在しない実体を指す別名、無効（`disabled`）な実体を指す別名をエラーにする。エラーのメッセージには名簿のファイルと名前を含める。
- 今の 1 段の名簿（別名のない形）もそのまま読める。
- 単体テストで、正しい 2 段の名簿、今の 1 段の名簿、3 通りのエラーを確かめる。
- 本件では名前の解決（`--executor-by` などや自動選択）は変えない（PJR-YK1C で行う）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG に記載する場合は、未公開の版の節（`## [0.4.0] - 未定`）に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ |
| --- | ------------------------------------------ | ---- | ---- | ---- |
| 1   | agent の名簿の schema に実体と別名を加える | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-zm1k-agent-members-model-alias]]（決定）
