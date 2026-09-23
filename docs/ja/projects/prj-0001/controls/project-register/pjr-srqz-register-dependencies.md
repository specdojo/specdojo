---
specdojo:
  id: prj-0001:pjr-srqz-register-dependencies
  type: project
  status: deprecated
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: rejected
  priority: medium
  owner: ARC
  registered_at: "2026-09-07T13:20:54Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-07T13:27:23Z"
---

# PJR-SRQZ 登録簿項目へ依存関係と着手可能判定を導入する

## 1. 概要

beads との比較から、register 項目に依存関係の表現と着手可能判定がないことを欠落として起票した。
判定の結果、前提が誤っていたため却下する。

## 2. 完了条件

- 却下のため設定しない。

## 3. 作業内容

| No  | 作業                                     | メモ                     |
| --- | ---------------------------------------- | ------------------------ |
| 1   | 順序判定の責務がどこにあるかを実装で確認 | 却下の根拠として実施済み |

## 4. 対応結果

却下する。起票時の前提が3点で誤っていた。

**責務の取り違え**。順序判定の置き場は既に存在する。track 間の順序は timeline の `depends_on` /
`parallel_group` / `order` が持ち、タスク単位の順序と ready 判定は schedule の CPM が持つ。
`src/schedule.ts` が読むのは `getProjectCatalogPath` / `getProjectTimelinePath` /
`getProjectRolesPath` であり、`getProjectRegisterPath` は参照しない。register へ依存グラフを
追加すると、この2層に対する二重実装になる。

beads が tracker 内で依存判定を行うのは planning 層を持たないためである。構造的制約であって
優位点ではない。競合の制約を優位点と誤認して模倣するところであった。

**根拠の誤読**。「依存関係を考慮して順番に実行ください」という指示を欠落の証拠として扱ったが、
誤りである。register 項目は todo / question / risk / issue などのアドホックな項目で、backlog の
並び順は本来 human の判断領域である。計算で決めるものではない。正常な運用を defect と読み違えた。

**適用可能性の未確認**。`register add` に工数・期間の項目はない。CPM の入力を満たさず、そもそも
成立しない。

register 項目を schedule の対象とすべきかは論点として成立するが、現時点で必要性の根拠がない。
必要になった時点で timeline 側の課題として起票する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-36qg-competitive-landscape-and-release]]: 起票の発端となった beads との比較。
