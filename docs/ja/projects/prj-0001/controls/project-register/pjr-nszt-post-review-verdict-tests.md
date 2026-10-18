---
specdojo:
  id: prj-0001:pjr-nszt-post-review-verdict-tests
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-18T14:58:36Z"
  derived_from:
    - PJR-T46Y
---

# PJR-NSZT 統合後の review の判定のテストを補う

## 1. 概要

T46Y の完了条件のうち、verdict が complete・complete-with-findings のときに close すること、decision・question を close しないことを確かめる単体テストが入っていない（tests/src/exec/register-post-review.test.ts には incomplete と runner のコードを変えた項目の 2 件だけがある）

## 2. 完了条件

- `tests/src/exec/register-post-review.test.ts` に、次の単体テストを加える。
  - verdict が `complete` のとき、todo と issue を close する判定になる。
  - verdict が `complete-with-findings` のとき、todo と issue を close する判定になり、指摘が close の理由に残る。
  - decision と question は、verdict にかかわらず close しない判定になる（`exec run --register` が対象にしない種類でも、判定の関数としてそう振る舞うことを確かめる）。
- 本番のコードは変えない。テストを書くために変える必要がある場合は、理由を result に書き、変更を最小にする。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG には記載しない（テストだけの変更のため）。

## 3. 作業内容

| No  | 作業               | 担当 | 状態 | メモ |
| --- | ------------------ | ---- | ---- | ---- |
| 1   | 判定のテストを補う | DEV  | done | -    |

## 4. 対応結果

- 実施内容:
  - `tests/src/exec/register-post-review.test.ts` に、PJR-T46Y で不足していた `registerPostReviewDisposition` の単体テストを追加した。
  - verdict が `complete` のとき、`todo` と `issue` を自動 close する判定（`transition: "done"`, `outcome: "success"`）になることを確認。
  - verdict が `complete-with-findings` のとき、`todo` と `issue` を自動 close する判定になり、指摘が close の理由（`explanation`）に残ることを確認。
  - `decision` と `question` は、verdict（`complete`, `complete-with-findings`, `incomplete`, `undefined`）にかかわらず close しない判定（`transition !== "done"`）になることを確認。
  - 本番コードは変更していない。
- 成果物:
  - `tests/src/exec/register-post-review.test.ts`
- 残課題:
  - なし

## 5. 関連ドキュメント

- [[prj-0001:pjr-t46y-register-post-run-review-auto-close]]（元の項目）
