---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opd-access-control-sample-080-20261123t093945z-31f53d15
  type: exec-result
  task_id: T-KATA-WAVE-5-opd-access-control-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opd-access-control-sample-080/T-KATA-WAVE-5-opd-access-control-sample-080-20261123T093945Z-31f53d15/plan.md
  started_at: "2026-11-23T09:39:48.912Z"
  completed_at: "2026-11-23T16:31:45.854Z"
  agent: sonnet-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:opd-access-control-sample
  condense_records:
    - location: 1. 概要（access-control） 第1段落末尾
      category: repetition
      action: delete
      reason: 「本書は権限区分、付与・剥奪の契機、棚卸しの合否、監査ログの記録対象、緊急権限を定める」は2章の見出しと内容の再掲。分冊の目的と背景は残したため意味は変わらない
      cause:
        type: document
    - location: 2.1. 権限区分 導入文
      category: table-prose
      action: merge
      reason: 表が示す対応を本文で言い直していたため「次の表で具体化する。」に短縮。opd-index との差分の根拠は残した
      cause:
        type: document
    - location: 2.2. 付与・剥奪の契機 導入文
      category: table-prose
      action: delete
      reason: 表の内容の言い直しを削った。承認者と操作者の記述は残した
      cause:
        type: document
    - location: 2.4. 棚卸し 合格条件の表と直前の本文
      category: table-prose
      action: retain
      reason: 表は合否の条件、本文は照合の方法で役割が異なり、二重の説明ではない
      cause:
        type: document
    - location: 2.6. 緊急権限 表と直後の ASSUMPTION
      category: repetition
      action: retain
      reason: 表は承認・失効・延長の方針、ASSUMPTION は戻し方の前提で重複せず、判断に要る制約のため残す
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- `opd-access-control-sample.md` の冗長さを整理した。概要の章構成の再掲を削り、2.1 と 2.2 の表導入文を短縮した。意味と必須情報は維持し、新しい内容は足していない。
- `condense_records` は5件ある。内訳は削除1件、短縮・まとめ1件、削除1件、保持2件。原因はすべて `document` である。
- 2.4 の合格条件の表と本文は、役割が異なるため保持した。2.6 の緊急権限の表と `ASSUMPTION` は、重複しない制約なので保持した。
- runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は passed だった。変更種別に合わない検査は `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-access-control-sample.md`: 1章の概要末尾から、2章の見出しと内容の再掲になっていた章構成の列挙文を削除した。2.1 の表導入文は「次の表で具体化する。」に短縮した。2.2 の表導入文は、表の言い直し部分を削除した。分冊の目的と背景、opd-index との差分の根拠、承認者と操作者の記述は残した。

## 3. 申し送り

- executor が実行しなかった `npm run lint:md` は、runner の `lint:md:changed` が passed だった。全件の `lint:md` は変更種別により `not_applicable` である。

## 4. 進め方と実践の型の適用

condense。繰り返しと、表と本文の二重の説明を削除またはまとめた。役割が異なる箇所と判断に要る制約は `retain` として理由を記録した。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `1. 概要（access-control） 第1段落末尾` | `repetition` | `delete` | `「本書は権限区分、付与・剥奪の契機、棚卸しの合否、監査ログの記録対象、緊急権限を定める」は2章の見出しと内容の再掲。分冊の目的と背景は残したため意味は変わらない` | `document` |
| `2.1. 権限区分 導入文` | `table-prose` | `merge` | `表が示す対応を本文で言い直していたため「次の表で具体化する。」に短縮。opd-index との差分の根拠は残した` | `document` |
| `2.2. 付与・剥奪の契機 導入文` | `table-prose` | `delete` | `表の内容の言い直しを削った。承認者と操作者の記述は残した` | `document` |
| `2.4. 棚卸し 合格条件の表と直前の本文` | `table-prose` | `retain` | `表は合否の条件、本文は照合の方法で役割が異なり、二重の説明ではない` | `document` |
| `2.6. 緊急権限 表と直後の ASSUMPTION` | `repetition` | `retain` | `表は承認・失効・延長の方針、ASSUMPTION は戻し方の前提で重複せず、判断に要る制約のため残す` | `document` |
