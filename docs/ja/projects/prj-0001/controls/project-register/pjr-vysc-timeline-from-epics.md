---
specdojo:
  id: prj-0001:pjr-vysc-timeline-from-epics
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: medium
  owner: ARC
  registered_at: "2026-11-03T22:56:13Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-05T22:56:32Z"
  conclusion: "C 案: timeline を非推奨にし、全体計画（順序・期間・範囲）を epic から作る。実装は PJR-PE19、文書と prj-0001 は PJR-JM29"
  commit_type: docs
  commit_scope: register
---

# PJR-VYSC timeline を epic とその依存関係から作る形に変える

## 1. 背景

手書きの tml-index.yaml の track 計画をやめ、epic を全体計画の単位とし、epic の depends_on・状態・schedule の予定と実績から timeline を作る。tml-index.yaml の役割と、未着手の計画や古い track の扱いを決める

## 2. 入力

- tml-index.yaml には 22 の track があり、order・`parallel_group`・`depends_on` は「初期案。人が見直す」のまま更新されておらず、全体スケジュールの管理に使われていない（2026-11-04）
- epic は 1 つの track を担い、epic 同士は register の `depends_on` で順番を持てる。tml-index.yaml の track の `depends_on` と二重になっている。epic を起票するには先に tml-index.yaml に track を書く必要がある（2026-11-03 の data-flow-uc-rewrite でも手で足した）。timeline の期間はカタログの推定日数から計算し、schedule の予定や実績が反映されない（2026-11-04）
- 利用者の提案: epic を起票し、epic 間の依存関係を timeline として表示する（2026-11-04）
- 論点: (1) 未着手の計画の表し方（open の epic を先に起票するか）、(2) epic のない古い track（data-flow・data-flow-pdca など）の扱い、(3) tml-index.yaml に残す内容（起点の日付やカレンダーなどの設定だけにするか、生成物にするか）、(4) 未着手の epic の期間（推定日数の項目を足すか）、(5) 表示の場所と形（dashboard の timeline のガントなど）（2026-11-04）
- 利用者の決定: B 案を基本とする。全体計画の順序の正本を epic の `depends_on` に寄せ、timeline はそこから作る。epic がない track は timeline（tml-index.yaml）に置かない。tml-index.yaml はまだほとんど使っていないため、移行してよい（2026-11-06）
- orchestrator の調査: tml-index.yaml の track 23 本のうち epic があるのは 3 本（PJR-3APD は open、GQN3・GEZN は done）、strategy があるのは 7 本。dashboard の timeline は tml-index の `planned_start_date` とカタログの `catalog_duration_estimate_days` から作られ、tml-index は wave・catalog scaffold の検出・strategy の入力にも使われている。手書きの order の誤りで PJR-WSND が止まった（2026-11-06）
- 影響: epic のない track は dashboard の timeline から外れる。利用者は了承した（2026-11-06）

## 3. 検討した選択肢

| 選択肢 | 内容                                                                                                                 | 利点                         | 懸念                                                                                                        |
| ------ | -------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| A      | `tml-index.yaml` を正本として残し、order の整合を検査する                                                            | 変更が小さい                 | 順序を epic と二重に持ち続ける                                                                              |
| B      | 順序の正本を epic の `depends_on` に寄せ、`tml-index.yaml` は epic のある track の `domains`・推定日数などだけに絞る | 順序の二重管理がなくなる     | `tml-index.yaml` が epic の写しになり、track と domain の対応は二重に残る                                   |
| C      | timeline の概念を非推奨にし、全体計画を epic から作る。track と domain の対応も epic に持たせる                      | 計画の正本が epic だけになる | epic のスキーマ・dashboard・strategy の生成・Kata・ガイドに変更が及ぶ。ほかの利用者のために互換の期間が要る |

## 4. 決定内容

C を採る。

- 全体計画（順序・期間・範囲）の正本を epic とする。順序は epic の `depends_on`、範囲は epic の `domains`、期間は epic の着手・完了の記録と `due_on` から作る。
- epic がない track は全体計画に出さない。
- `tml-index.yaml`・`timeline build`・`timeline_path` は非推奨とし、あれば読んで警告する。削除は後の版で行う。
- 実装は PJR-PE19（runner とスキーマ）、文書と prj-0001 のデータは PJR-JM29 で行う。

## 5. 採択理由

- 手書きの order の誤りで PJR-WSND が止まった。順序を 2 か所に持つ限り、ずれは起きる。
- B では `tml-index.yaml` が epic のある track だけの一覧になり、epic の情報の写しが残る。
- `tml-index.yaml` はまだほとんど使っておらず、`catalog_status` は既に register から導いている。移すのは今が最も安い。

## 6. 承認

| 項目     | 内容                                          |
| -------- | --------------------------------------------- |
| 決定者   | indie                                         |
| 決定日   | 2026-11-06                                    |
| 承認方式 | commit                                        |
| 証跡     | 本個票を `decided` で close する記帳の commit |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | epic のスキーマと CLI、dashboard の全体計画、strategy の生成、カタログの検出、tml の Kata、ガイドとリファレンス、prj-0001 の epic とカタログ |
| 必要な対応 | PJR-PE19 の後に PJR-JM29 を行う                                                                                                              |
| 追跡先     | PJR-PE19、PJR-JM29                                                                                                                           |

## 8. 関連ドキュメント

- [[specdojo:tml-rulebook]]: 非推奨にする Kata
