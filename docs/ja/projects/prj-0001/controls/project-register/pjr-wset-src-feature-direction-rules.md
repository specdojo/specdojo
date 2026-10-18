---
specdojo:
  id: prj-0001:pjr-wset-src-feature-direction-rules
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: low
  owner: DEV
  registered_at: "2026-10-17T08:45:28Z"
  due_on: null
---

# PJR-WSET 循環のなくなった機能の組に依存の向きの規則を足す

## 1. 概要

循環がなくなった機能の組（register は exec を import しない、など）の依存の向きを ESLint の規則として error で足す。 PJR-QQKY の決定に基づく。動作は変えない

## 2. 完了条件

- PJR-E025 の完了後に行う。
- 循環がなくなった機能の組について、依存の向きの規則（例: `register` は `exec` を import しない）を ESLint の `no-restricted-imports` に error で足す。
- 足した組と足さなかった組（まだ循環が残るもの）の一覧と理由を result に書く。
- 規則を足した時点で `npm run lint:ts` に違反がない。違反があれば規則を足さずに result に書く。
- `src/shared/` に置くものの範囲（他の機能から使われる汎用の部分に限る）を見直し、shared に置くべきでないものがあれば一覧にして result に書く。移すのは別の項目にする。
- `.github/instructions/typescript.instructions.md` の依存の向きの記述を、足した規則に合わせる。
- 移す・直すのは構造だけとし、動作は変えない。全コマンドの `--help` の出力が変更の前後で一致することを確かめ、result に書く。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG には記載しない（内部の変更のため）。

## 3. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------- | ---- | ---- | ---- |
| 1   | 循環のなくなった組の依存の向きを ESLint の規則に足す | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-qqky-src-feature-cycles]]（決定）
