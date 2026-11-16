---
specdojo:
  id: prj-0001:pjr-c5af-command-inventory
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: PO
  registered_at: "2026-11-16T10:59:36Z"
  due_on: null
  commit_type: docs
  commit_scope: references
---

# PJR-C5AF 不要なコマンドを棚卸しし、消す・まとめる・内部用にするものを決める

## 1. 背景

0.8.0 までにコマンドを機能ごとに足してきた結果、22 系統・サブコマンド 92 個になった。利用者が覚える範囲と、実装・保守と不具合の面が広がっている（2026-11-16、利用者の指摘）。

## 2. 入力

- 2026-11-16、利用者がコマンドを増やしすぎたとして棚卸しを依頼した。22 系統・サブコマンド 92 個を、ガイド・オーケストレーターの定義・playbook・コードでの出現数と、prj-0001 の実行イベント 1,666 件での使われ方で洗い出した
- 利用者は orchestrator の推奨（分類の案を decision で決め、分類ごとの todo で非推奨の警告から削除までを 2 段階で行う。0.8.0 の後）を承認した（2026-11-16）

## 3. 検討した選択肢

| 選択肢 | 内容                                                               | 利点                                                                   | 懸念                                           |
| ------ | ------------------------------------------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------- |
| A      | 分類ごとに、次の版で非推奨の警告を出し、その次の版で消す（2 段階） | 利用者のスクリプトに移行の期間を与えられる。分類ごとに小さく進められる | 消し終えるまでに 2 版かかる                    |
| B      | 不要なものを次の版で一度に消す                                     | すぐに減る                                                             | 利用者のスクリプトが予告なく壊れる             |
| C      | 消さずに、ガイドとリファレンスで使うものだけを示す                 | 互換性を壊さない                                                       | 実装と保守の負担が減らず、不具合の面も広いまま |

## 4. 決定内容

A を採る。分類の案は次のとおりとし、分類ごとの todo で、残すかどうかを確かめながら進める（0.8.0 の後）。

- 消す候補（非推奨の警告から）: すでに非推奨の `timeline where`・`timeline build`。実行イベントに一度も記録がない `exec note`・`exec link`・`exec estimate`。移行用の `exec migrate-records`・`grade migrate`・`register migrate`・`config migrate-members`（外部の利用者の移行期間をおく）
- まとめる候補: 場所を表示する `where` の 6 つ（`exec`・`catalog`・`schedule`・`timeline`・`job`・`routine`）を 1 つに。区分ごとの build の 6 つ（`index`・`catalog`・`schedule`・`register`・`dashboard`・`yaml-pages`）を `build --only <区分>` に
- 内部用にして利用者の一覧から外す候補: `grade` の `plan`・`apply`・`translation-plan`・`localize`・`state`・`result`・`validate`（定期の job を `grade run` に移してから）、`agent launch`・`agent run`、`exec trial`・`exec slots`・`exec scheduler`
- 役割を決めてから整理する: 夜間の仕組みの 3 つ（`orchestrator night`・`routine run`・`job`）
- 残す: `init`、`register` の主な操作、`exec` の主な操作（`run`・`resume`・`status`・`claim`・`complete`・`block`・`unblock`・`reopen`・`release`・`cancel`・`validate`）、`grade run`・`grade list`、`kata list`・`kata show`、`dashboard build`、`devcontainer`、`catalog` の `validate`・`scaffold`

## 5. 採択理由

- 実行イベント 1,666 件の内訳（claim 649・complete 558・block 171・unblock 115・cancel 80・release 70・reopen 23）に、`note`・`link`・`estimate` の記録がない。
- 場所の表示と区分ごとの build は、同じ種類のコマンドが系統ごとに分かれて数を増やしている。
- 一度に消すと利用者のスクリプトが壊れるため、非推奨の警告を 1 版はさむ。

## 6. 承認

| 項目     | 内容                     |
| -------- | ------------------------ |
| 決定者   | indie（利用者）          |
| 決定日   | 2026-11-16               |
| 承認方式 | commit                   |
| 証跡     | register close の commit |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                 |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| 影響範囲   | CLI のコマンド、コマンドリファレンス・ガイド、オーケストレーターの定義と playbook、定期の job        |
| 必要な対応 | 分類ごとの todo（非推奨の警告、where の統合、build の統合、内部用の整理）と、夜間の仕組みの question |
| 追跡先     | 起票した todo と question（関連ドキュメントを参照）                                                  |

## 8. 関連ドキュメント

- [[prj-0001:pjr-bsck-deprecate-unused-commands]]
- [[prj-0001:pjr-jkqx-unify-where-commands]]
- [[prj-0001:pjr-c4j1-unify-build-commands]]
- [[prj-0001:pjr-r7bq-hide-internal-commands]]
- [[prj-0001:pjr-y7ff-nightly-mechanisms-roles]]
- [[specdojo:command-reference]]
