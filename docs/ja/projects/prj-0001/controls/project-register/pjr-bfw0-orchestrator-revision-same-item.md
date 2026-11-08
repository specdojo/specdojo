---
specdojo:
  id: prj-0001:pjr-bfw0-orchestrator-revision-same-item
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: low
  difficulty: easy
  registered_at: "2026-11-08T13:51:58Z"
  completed_at: "2026-11-08T13:57:01Z"
  conclusion: オーケストレーターの本文の「close の前の確かめ方」に、同じ型の手直しは同じ項目で回す決まりを足し、develop へ統合した
---

# PJR-BFW0 オーケストレーターの本文に、同じ型の手直しは同じ項目で回す決まりを足す

## 1. 概要

確かめた結果や利用者の確認で直す点が出たとき、同じ目的・同じファイルの手直しは新しく起票せず、元の todo に回目の完了条件を足して流し直し、確定の decision は確定まで開けておく決まりを、配布するオーケストレーターの本文に足す

## 2. 入力

- 2026-11-08、clis の型の手直しで todo と decision を 4 回ずつ起票したことへの indie の指摘から。運用メモではなく配布する本文に書く（indie が決定）。orchestrator が直接対応する。

## 3. 完了条件

- `.agents/specdojo-orchestrator.agent.md` の「close の前の確かめ方」に、同じ目的・同じ対象のファイルの手直しは新しく起票せず、元の todo に回目の完了条件を足して `review` のまま流し直し、確定の decision は確定まで開けておく決まりと、新しく起票する場合の条件を足している。
- 4 つの環境のラッパーを `orchestrator:sync` でそろえ、`validate-orchestrator-sync` が通っている。
- 保護された設定のため、利用者の承認のもと feature ブランチで commit し、develop へ `--no-ff` で統合している。

## 4. 作業内容

| No  | 作業                                   | 担当                  | 状態 | メモ        |
| --- | -------------------------------------- | --------------------- | ---- | ----------- |
| 1   | 本文に決まりを足し、ラッパーをそろえる | specdojo-orchestrator | done | `0df297715` |
| 2   | develop へ統合する                     | specdojo-orchestrator | open | -           |

## 5. 対応結果

### 5.1. 実施内容

- 「close の前の確かめ方」の「見つけた別の問題は…起票する」の前に、同じ問題の手直しは同じ項目で回す 1 項目を足した。別の問題なら起票、同じなら同じ項目、という対で読めるようにするためである。
- 本体と 4 つの環境のラッパー・テンプレート（計 11 ファイル）を `feature/prj-0001/orchestrator-revision-same-item` に commit した（`0df297715`）。

### 5.2. CHANGELOG に書く事項

- 区分: 変更
- 文案: オーケストレーターが、確認で直す点が出たときに同じ目的・同じファイルの手直しを新しく起票せず、元の todo に直す点を足して流し直すようにしました。

## 6. 関連ドキュメント

- 前例: [[prj-0001:pjr-5znk-stale-run-record-paths]]、[[prj-0001:pjr-ksgc-changelog-handoff-playbook]]
