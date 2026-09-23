---
specdojo:
  id: prj-0001:pjr-n03w-grade-role-and-triggers
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-09-23T05:17:28Z"
  due_on: "2026-11-14"
---

# PJR-N03W grade に owner ロール認識を加え、定期実行を変化検知に限定する

## 1. 概要

PJR-2ZVS の決定のうち grade 本体と routine を実装する。対象文書の owner ロールの観点を主の判定軸とし、他ロールの agent 観点は入力適合性の確認に限定して blocker / major を出す条件を絞る。定期実行は依存先の content_hash 変化、kata 更新後の遡及確認、review 経路を持たない文書の 3 契機に限定し、全件の時間契機実行をやめる。

## 2. 完了条件

- grade が対象文書の owner ロールを解決し、owner ロールの観点を主の判定軸としている。
- owner 以外のロールの `agent` 観点は入力適合性の確認に限定され、`blocker` / `major` を出せるのは「そのロールが自分の責務の成果物を作成できない」場合だけになっている。それ以外は `note` となり level を下げない。
- 定期実行の契機が次の 3 つに限定されている。全件の時間契機実行を行わない。
  - 依存先の `content_hash` 変化
  - kata（rulebook / standard）の更新後、それを宣言する文書の遡及確認
  - schedule タスクが割り当てられていない文書
- `rtn-grade-*` の routine 定義が新しい契機に合わせて更新されている。
- owner ロール判定と severity 抑制、契機判定を検証する単体テストがある。
- 既存の grade 結果との差分を確認し、責務範囲外の指摘で level が下がっていた文書が改善することを実例で示している。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ                                  |
| --- | ---------------------------------------------------- | ---- | ---- | ------------------------------------- |
| 1   | 対象文書の owner ロールを解決する経路を作る          | DEV  | open | catalog の owner を使う               |
| 2   | owner 以外のロールの severity 上限を実装する         | DEV  | open | 入力適合性を損なう場合だけ major 以上 |
| 3   | 依存先の `content_hash` 変化を検知する契機を実装する | DEV  | open | `depends_on` を辿る                   |
| 4   | kata 更新後の遡及確認の契機を実装する                | DEV  | open | `rulebook` 宣言から逆引きする         |
| 5   | `rtn-grade-*` を新しい契機へ更新する                 | DEV  | open | 全件実行をやめる                      |
| 6   | 既存結果との差分を確認し、改善の実例を記録する       | DEV  | open | `cdfd-overview` などで確認            |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-kcmh-review-grade-verdict]]
- [[prj-0001:pjr-xkks-grade-sidecar]]
- `src/grade.ts`
