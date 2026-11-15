---
specdojo:
  id: prj-0001:pjr-n6gk-register-work-table-sync
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T22:55:46Z"
  due_on: "2026-11-30"
  commit_type: fix
  commit_scope: exec
---

# PJR-N6GK executor が個票の作業内容の表を実績に合わせ、open の行が残れば完了にしない

## 1. 概要

0.8.0 の手直し 20 件で、対応結果は書かれたが作業内容の表が open のまま残った

## 2. 入力

- 2026-11-16、0.8.0 の手直しの 20 件（VEHX・X1RW・JFRX など）で、executor は個票の対応結果を書いたが、作業内容の表の状態を open のまま残していた。AWW3・T123 は作業の行が `_TODO_` のままだった。orchestrator も close の前に表を確かめず、4 件（BJ7E・3HXQ・Y5XH・8ZX8）をそのまま close した。fc9ee201c で手で直した

## 3. 完了条件

- open の行を残した個票で、完了の検査が止まり理由が出る。
- すべての行が done、または理由つきで残された行だけの個票では通る。
- plan の共通の約束にこの指示が入っている。
- `npm run check` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                                                                                                                                                                                  | 担当 | 状態 | メモ |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | exec plan の共通の約束（register の項目を対象にする plan）に、作業内容の表の各行の状態とメモを実績に合わせることを足す。executor が実行できない行（grade の起動など）は、その理由をメモに書き、状態を open のまま残す | DEV  | open | -    |
| 2   | reporter、または register の post-review・close の前の検査で、作業内容の表に open・`_TODO_` の行が残っていれば完了にせず、理由を示す                                                                                  | DEV  | open | -    |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
