---
specdojo:
  id: prj-0001:pjr-rmmm-uis-kata-confirm
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: medium
  registered_at: "2026-11-08T04:01:13Z"
  completed_at: "2026-11-08T06:47:11Z"
  conclusion: uis の型は直す。CLI を新しい種類 clis に分け、uis は GUI の画面仕様だけにし、rulebook のサンプルの章を消す
  derived_from:
    - PJR-2GD6
  depends_on:
    - PJR-0YNQ
---

# PJR-RMMM 画面仕様（uis）の手入れした型を確定する

## 1. 背景

uis も実装と同じことを書かない対象に加えたため（2026-11-08）、PJR-0YNQ で手入れした uis の型を人が確かめて確定する。確定した型で、カタログの説明の直し（PJR-6MCW）と代表の作成を進める。

## 2. 入力

- 型の確定は人が行う（PJR-RZ9Q と同じ扱い）。

## 3. 検討した選択肢

| 選択肢       | 内容                                                                                                                      | 利点                                                                                     | 懸念                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 確定         | PJR-0YNQ で手入れした uis の型を、そのまま確定する                                                                        | 手戻りがない                                                                             | GUI と CLI を同じ 9 章に押し込み、CLI に合わない章と CLI 特有のことが混ざる |
| 直す（採用） | CLI を新しい種類 `clis`（CLI Specification）に分け、uis は GUI の画面仕様だけにする。rulebook の「8. サンプル」の章を消す | それぞれの章立てが中身に合う。uis の rulebook が標準（サンプルは sample へ外出し）に合う | clis の型を新しく作り、もう一度確定する手間がかかる                         |

## 4. 決定内容

「直す」を採る。

- uis は GUI の画面仕様だけにする。PJR-0YNQ で CLI 向けに足した部分を外し、rulebook の「8. サンプル」の章を消す（完成例は `uis-sample` にあるため）。
- CLI は新しい種類 `clis`（CLI Specification、CLI 仕様）とし、rulebook と sample を新しく作る。PJR-0YNQ の CLI の部分（コマンドリファレンスの参照、操作の流れ、表示の要点、エラーと利用者の次の手）を土台にする。
- clis は SpecDojo 自身の CLI を利用者から見た仕様で、SpecDojo が起動する外部の CLI との約束である ifx-cmd とは分ける。
- prj-0001 のカタログの `uis-index`・`uis-exec-commands` を `clis-index`・`clis-exec-commands` にする。uis の代表は作らず（SpecDojo に GUI はない）、clis の代表を作る。

## 5. 採択理由

- uis の手入れの結果、GUI と CLI を同じ章立てに押し込むと、CLI に合わない章と CLI 特有のことが混ざると分かった（indie の指摘、2026-11-08）。
- rulebook の書き方の標準では、サンプルの章は sample へ外出しするまでの経過措置である。

## 6. 承認

| 項目     | 内容                                                                           |
| -------- | ------------------------------------------------------------------------------ |
| 決定者   | indie                                                                          |
| 決定日   | 2026-11-08                                                                     |
| 承認方式 | commit                                                                         |
| 証跡     | この個票の close の commit（オーケストレーターとの対話で「推奨通りで」と回答） |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------ |
| 影響範囲   | uis の型、新しい clis の型、prj-0001 の uis のカタログ、業務仕様の代表（PJR-2GD6）         |
| 必要な対応 | clis の型の作成、uis の型の手入れ、カタログの付け替え、clis の型の確定、の各項目を起票する |
| 追跡先     | PJR-2GD6 の子の項目                                                                        |

## 8. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 型の手入れ: [[prj-0001:pjr-0ynq-uis-kata-reference-to-command-reference]]
- 前例: [[prj-0001:pjr-rz9q-business-specs-reps-kata-confirm]]
