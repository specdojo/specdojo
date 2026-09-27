---
specdojo:
  id: prj-0001:pjr-2f3y-grade-unreviewed-content-hash
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-09-27T06:22:09Z"
---

# PJR-2F3Y grade の unreviewed 契機を内容の変化がある文書に絞る

## 1. 概要

PJR-N03W で追加した `grade list --unreviewed`（`src/grade.ts`）は、schedule のタスクが割り当てられていない文書を選ぶ。ただし、評価結果の有無や `content_hash` の一致を見ないため、評価済みで内容が変わっていない文書も毎回すべて選ぶ。

2026-09-27 の時点で、kata は全 262 件、成果物は 41 件中 19 件が該当した。routine で有効にすると、`limit`（kata 15 件、成果物 10 件）の分だけ、変更のない文書が毎晩 codex で再評価される。PJR-2ZVS の 3.6 節の「対象文書の `content_hash` が既存 sidecar と一致する場合は再実行しない」に反する。

利用者の判断により、`rtn-grade-recheck.yaml` と `rtn-grade-deliverable-recheck.yaml` の `unreviewed` を `"false"` にして N03W を close し、本項目で修正する。

あわせて、`--dependency-changed` は依存先の `content_hash` ではなく評価日時（依存先の `graded_at` が自身より新しいか）で判定している。依存先を再評価しただけで、内容が変わっていなくても該当する。この扱いは PJR-Z47X（照合先の変化検出）で方針を決めるため、本項目では扱わない。

## 2. 完了条件

- `--unreviewed` は、schedule のタスクがない文書のうち、未評価の文書、または評価時の `content_hash` と現在の内容が一致しない文書だけを選ぶ。
- 評価済みで内容が変わっていない文書は選ばれない。これを確かめる単体テストがある。
- 変更後の対象件数（kata・成果物）を対応結果に記録する。
- `rtn-grade-recheck.yaml` と `rtn-grade-deliverable-recheck.yaml` の `unreviewed` を `"true"` に戻し、無効化の理由を書いたコメントを外す。
- `npm run check` が成功する。

## 3. 作業内容

| No  | 作業                                                                      | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | `--unreviewed` の選択に、未評価または `content_hash` 不一致の条件を加える | DEV  | open | -    |
| 2   | 単体テストを追加する                                                      | DEV  | open | -    |
| 3   | routine の `unreviewed` を有効に戻す                                      | DEV  | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- PJR-N03W（`--unreviewed` を追加した項目）、PJR-2ZVS（3.4 節・3.6 節）、PJR-Z47X（`--dependency-changed` の判定方式）
- `src/grade.ts`、`docs/ja/projects/prj-0001/routines/rtn-grade-recheck.yaml`、`docs/ja/projects/prj-0001/routines/rtn-grade-deliverable-recheck.yaml`
