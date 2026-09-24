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

# PJR-N03W grade の定期実行を変化検知に限定する

## 1. 概要

[[prj-0001:pjr-2zvs-grade-review-integration]] の決定のうち、定期実行の契機を実装する。依存先の `content_hash` 変化、kata 更新後の遡及確認、review 経路を持たない文書の 3 契機に限定し、全件の時間契機実行をやめる。

### 1.1. owner ロール認識を範囲から外した

当初は「対象文書の owner ロールの観点を主の判定軸とし、他ロールの `agent` 観点は severity を抑える」も含めていたが、2026-09-24 の調査で前提が誤りと判明したため外した。

実データでは `done_criteria` の viewpoint の 75% が `human` 評価であり、grade の findings の 93% は `done_criteria` が宣言する観点の外に分類される。当初の方式を採ると findings の 93% が格下げされ、grade がほぼ機能しなくなる。owner による切り分けでも同じ結果になる。

詳細と撤回の根拠は [[prj-0001:pjr-2zvs-grade-review-integration]] の `grade の agent 観点は責務で重み付けしない` に記録した。文書へ owner を宣言させる案自体は [[prj-0001:pjr-d4kg-document-owner-declaration]] で別途扱う。

本項目は**契機の変更だけ**を扱う。

## 2. 完了条件

- 定期実行の契機が次の 3 つに限定されている。全件の時間契機実行を行わない。
  - 依存先の `content_hash` 変化
  - kata（rulebook / standard）の更新後、それを宣言する文書の遡及確認
  - schedule タスクが割り当てられていない文書
- `rtn-grade-*` の routine 定義が新しい契機に合わせて更新されている。
- 契機判定を検証する単体テストがある。依存先が変わった場合と変わらない場合、kata 更新後に該当する場合としない場合を含む。
- 変更前後で、定期実行の対象になる文書の集合がどう変わるかを実例で示している。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ                            |
| --- | ---------------------------------------------------- | ---- | ---- | ------------------------------- |
| 1   | 依存先の `content_hash` 変化を検知する契機を実装する | DEV  | open | `depends_on` を辿る             |
| 2   | kata 更新後の遡及確認の契機を実装する                | DEV  | open | `rulebook` 宣言から逆引きする   |
| 3   | review 経路を持たない文書を対象とする判定を実装する  | DEV  | open | schedule タスクの有無で判定する |
| 4   | `rtn-grade-*` を新しい契機へ更新する                 | DEV  | open | 全件実行をやめる                |
| 5   | 対象集合の変化を実例で確認する                       | DEV  | open | 変更前後の件数と内訳            |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-2zvs-grade-review-integration]]
- [[prj-0001:pjr-kcmh-review-grade-verdict]]
- [[prj-0001:pjr-d4kg-document-owner-declaration]]
- [[prj-0001:pjr-xkks-grade-sidecar]]
- `src/grade.ts`
