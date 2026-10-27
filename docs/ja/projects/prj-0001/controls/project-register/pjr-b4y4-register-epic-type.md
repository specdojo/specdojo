---
specdojo:
  id: prj-0001:pjr-b4y4-register-epic-type
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: hard
  registered_at: "2026-10-27T22:58:19Z"
  block_reason: "parent validation failed: test-unit"
  derived_from:
    - PJR-NJJ7
---

# PJR-B4Y4 register に epic の type を追加する

## 1. 概要

schema・個票のテンプレート・register の各コマンドで epic を扱い、exec run --register の対象から外す。子 todo を --from でたどる一覧を出す

- PJR-NJJ7 の決定に従い、track の仕事を担う新しい type `epic` を register に加える。

## 2. 完了条件

- 個票の frontmatter の schema と event の schema の type に `epic` がある。状態は todo と同じ（終端は `done`、ほかに `rejected` / `deferred`）。
- `epic` は担う track を frontmatter に持つ。フィールド名は executor が決める。`tml-index.yaml` があるときは、その track が定義済みかを検証する。
- 個票のテンプレート `pjr-epic-template.md` があり、節は「概要」「範囲（track と domain）」「完了の判断の基準」「子項目」「対応結果」「関連ドキュメント」である。
- `register add` / `close` / `update` などの記帳のコマンドで `epic` を扱える。
- `exec run --register` に `epic` を指定すると、epic は実行の対象ではないと示して止まる。夜間の orchestrator は `epic` を飛ばす。
- `register build` が、`epic` ごとに子項目（`derived_from` で `epic` を指す項目）とその状態を並べたビューを生成する。
- pjr-rulebook と register-operation-guide の type の表に `epic` を足し、command-reference に反映する。
- CHANGELOG の `## [Unreleased]` に追記する。公開済みの版の節は変えない。
- orchestrator の指示（agent の定義）の type の表は保護された設定のため直接変えず、変更の案を本個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもとで行う。
- 単体テストで、schema・記帳・実行から外す判定・ビューを確かめる。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。

## 3. 作業内容

| No  | 作業                                                  | 担当     | 状態 | メモ |
| --- | ----------------------------------------------------- | -------- | ---- | ---- |
| 1   | schema・テンプレート・記帳のコマンドに `epic` を追加  | executor | open | -    |
| 2   | 実行の対象から外す判定を実装する                      | executor | open | -    |
| 3   | epic ごとの子項目のビューを追加する                   | executor | open | -    |
| 4   | rulebook・ガイド・command-reference・CHANGELOG を更新 | executor | open | -    |
| 5   | 単体テストを追加し、検査を通す                        | executor | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:pjr-rulebook]]
- [[specdojo:register-operation-guide]]
- [[specdojo:command-reference]]
