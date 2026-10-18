---
specdojo:
  id: prj-0001:pjr-8tgq-agent-members-templates-update
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-14T22:18:53Z"
  due_on: null
---

# PJR-8TGQ 配布する agent の雛形を 2 段構成へ改める

## 1. 概要

config scaffold・init などが生成する agent の名簿と定義の雛形を 2 段構成へ改め、ガイドと移行の手順を更新する。CHANGELOG の 0.4.0 に記載する。 PJR-ZM1K の決定に基づく（Y8P9 の完了後、0.4.0）

## 2. 完了条件

- PJR-8MPY の完了後に行う。
- `config scaffold`・`init` などが生成する agent の名簿と定義の雛形を、実体と別名の 2 段構成へ改める。今の名前は別名として残す。
- 既存の利用者の 1 段の名簿がそのまま動くことと、2 段へ移す手順を [[specdojo:exec-config-guide]] に書く。
- 空のリポジトリで `init --yes` と `config scaffold` を行い、生成した名簿が schema の検証を通ることを統合テストで確かめる。
- CHANGELOG の `## [0.4.0] - 未定` の節に、2 段構成と移行の手順を書く。公開済みの版の節は変えない。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 3. 作業内容

| No  | 作業                                     | 担当 | 状態 | メモ |
| --- | ---------------------------------------- | ---- | ---- | ---- |
| 1   | 配布する agent の雛形を 2 段構成へ改める | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-zm1k-agent-members-model-alias]]（決定）
