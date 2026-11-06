---
specdojo:
  id: prj-0001:pjr-74qp-epic-plan-start-date
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-05T23:58:10Z"
  derived_from:
    - PJR-PE19
---

# PJR-74QP epic に予定の開始日（start_on）を持たせ全体計画に使う

## 1. 概要

epic に着手の記録がないため全体計画の開始日がすべて未定になる。epic に予定の開始日 start_on を持たせ、全体計画の開始日に使う。

## 2. 入力

- 由来: PJR-PE19 の統合後に orchestrator が dashboard build を実行した。epic 3 件（PJR-3APD・PJR-GEZN・PJR-GQN3）とも開始日が未定、稼働日数が - で、ガントに期間が出ない（2026-11-06）
- 原因の見立て: PE19 は開始日を epic 自身の着手 event から取るが、epic は exec run --register の対象外で start が記帳されない（2026-11-06）
- 決定（A 案）: 開始日は epic の `start_on` を最優先し、なければ epic 自身の着手の記録、先行 epic の終わりの翌稼働日の順で使い、どれもなければ未定とする。子の todo の着手や起票日からは補わない。実績の開始日を別の列に出すこと（B 案）は範囲外（2026-11-06 indie が決定）
- 既にある epic 3 件の `start_on` は日付が決まっていないため、この項目では入れない（2026-11-06）

## 3. 完了条件

- `register-item-frontmatter.schema.yaml` に `start_on`（`YYYY-MM-DD` の暦日、任意）を足し、持てるのは `item_type: epic` だけとする。
- `register add` / `update` に `--start-on <YYYY-MM-DD>` を足し、`--start-on -` で外せる。epic 以外の type に指定したとき、また日付の形式が正しくないときは、記帳の前にエラーで止まる。
- dashboard の全体計画（`src/dashboard/epic-plan.ts`）の開始日を、入力の決定の順（`start_on`、epic 自身の着手の記録、先行 epic の終わりの翌稼働日、未定）で求める。`start_on` と `due_on` の両方があれば稼働日数とガントの期間が出る。
- `start_on` が `due_on` より後のときは `register build` が警告を出し、期間は未定として扱う。
- 単体テストで、`start_on` があるとき、ないとき（先行 epic から求める）、どちらもないとき（未定）、`start_on` が `due_on` より後のとき、epic 以外に指定したとき（エラー）を確かめる。
- Kata の `pjr-rulebook`（項目の表と全体計画の規則）、登録簿運用ガイド、コマンドリファレンスを `start_on` に合わせる。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えない。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run lint:md` が通り、親の検証（`test-integration`）が通る。
- 既にある epic 3 件（PJR-3APD・PJR-GEZN・PJR-GQN3）の `start_on` は入れない。

## 4. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ |
| --- | ------------------------------------------------ | ---- | ---- | ---- |
| 1   | schema に `start_on` を足す                      | DEV  | open | -    |
| 2   | `register add` / `update` に `--start-on` を足す | DEV  | open | -    |
| 3   | 全体計画の開始日を決定の順で求める               | DEV  | open | -    |
| 4   | `start_on` が `due_on` より後のときの警告を足す  | DEV  | open | -    |
| 5   | 単体テストを足す                                 | DEV  | open | -    |
| 6   | Kata・ガイド・リファレンス・CHANGELOG を合わせる | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:pjr-rulebook]]: 登録簿の項目と全体計画の規則
- [[specdojo:register-operation-guide]]: 全体計画の生成と期間未定の扱い
