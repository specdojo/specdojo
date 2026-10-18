---
specdojo:
  id: prj-0001:pjr-e025-src-remaining-cycles
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: low
  owner: DEV
  registered_at: "2026-10-17T08:45:12Z"
  due_on: null
---

# PJR-E025 汎用の部品の移動の後に残る循環をほどく

## 1. 概要

register から exec/worktree-ops・exec/slot-lock、job から exec/plans、grade から exec/schedule-index、exec から grade/result などの残りを 1 件ずつ見て、shared へ移すか依存の向きを逆にする。 PJR-QQKY の決定に基づく。動作は変えない

## 2. 完了条件

- 次の残りの循環を 1 件ずつ見て、`src/shared/` へ移すか依存の向きを逆にするかを決め、件ごとの判断と理由を result に書く。
  - `register` → `exec/worktree-ops`・`exec/slot-lock`
  - `job` → `exec/plans`
  - `grade` → `exec/schedule-index`
  - `exec` → `grade/result`
- `src/shared/` へ移すのは、他の機能から使われている汎用の部分に限る。
- 作業の後、上の組の間に循環する import が残らないことを確かめ、確かめ方を result に書く。
- ESLint の依存の向きの規則はこの項目では足さない（PJR-WSET で足す）。
- 移す・直すのは構造だけとし、動作は変えない。全コマンドの `--help` の出力が変更の前後で一致することを確かめ、result に書く。
- runner のコードを移した場合は、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG には記載しない（内部の変更のため）。

## 3. 作業内容

| No  | 作業                        | 担当 | 状態 | メモ |
| --- | --------------------------- | ---- | ---- | ---- |
| 1   | 残りの循環を 1 件ずつほどく | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-qqky-src-feature-cycles]]（決定）
