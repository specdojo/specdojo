---
specdojo:
  id: prj-0001:pjr-yk1c-agent-alias-resolution
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: DEV
  registered_at: "2026-10-14T22:18:27Z"
  due_on: null
  block_reason: "agent exited with non-zero code: parent validation failed: typecheck"
---

# PJR-YK1C agent の別名の解決と記録を実装する

## 1. 概要

--executor-by などの指定と自動選択で別名を実体へ解決し、model を command_template の {model} で CLI へ渡す。イベントと result の actor には実体の名前を記録する。 PJR-ZM1K の決定に基づく（Y8P9 の完了後、0.4.0）

## 2. 完了条件

- PJR-EANK の完了後に行う。
- `--executor-by`・`--reporter-by`・`--fallback-executor-by` などの指定と自動選択で、別名を実体へ解決する。実体の名前を直接指定しても動く。
- 実体の `model` を、command_template の `{model}` で CLI へ渡す。`{model}` を持たない command_template と、model を持たない実体は今のまま動く。
- イベントと result の actor には、別名ではなく実体の名前を記録する。指定した別名も分かるように記録するかを決めて実装し、理由を result に書く。
- Job・routine の定義で使っている今の名前（別名）が、そのまま動く。
- 単体テストで、別名の解決、実体の直接の指定、`{model}` の展開、actor の記録を確かめる。
- runner のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG に記載する場合は、未公開の版の節（`## [0.4.0] - 未定`）に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                               | 担当 | 状態 | メモ |
| --- | ---------------------------------- | ---- | ---- | ---- |
| 1   | agent の別名の解決と記録を実装する | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-zm1k-agent-members-model-alias]]（決定）
