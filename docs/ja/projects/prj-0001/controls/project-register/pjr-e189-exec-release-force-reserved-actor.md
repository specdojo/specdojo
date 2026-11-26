---
specdojo:
  id: prj-0001:pjr-e189-exec-release-force-reserved-actor
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: question
  item_status: open
  priority: medium
  registered_at: "2026-11-22T04:46:40Z"
  derived_from:
    - PJR-ESE7
---

# PJR-E189 オーケストレーターに、他の agent の claim を release する --force を許すか

## 1. 確認事項

exec release の --force は人だけが使え、agent が claim したまま止まったタスクをオーケストレーターが戻せない。予約名 specdojo-orchestrator に許すかを決める

## 2. 入力

- 2026-11-22、第 3 波の 090 の blocked 10 件は opus-review-executor が claim していたため、オーケストレーターは release できず、indie が tmp/orchestrator/release-090.sh で --force を付けて戻した。
- PJR-ESE7 で exec の --by は予約名を受け付けるようになったが、持ち主以外の release に要る --force は人に限られたまま。
- 利用者（indie）の承認で、ESE7 に含めず別の question として起票した（2026-11-22）。

## 3. 背景

- `exec release --force` は人の actor のときだけ効く（`src/exec/events.ts` の `canOverrideCrossActor`）。`specdojo-orchestrator` が持ち主以外の claim を戻すと「別の actor が作業中」で断られる。
- 2026-11-26 にも、opus-executor が claim したまま止まった review 9 件と imp-interface-140 を、indie が `--force` で戻した。オーケストレーターはスクリプトを用意して流してもらった。
- `--by indie` で流せば通るが、実際の操作者と記録が食い違うため、オーケストレーターは使わない。
- 戻してよいかの判断の要点は、claim を持つ run が動いていないことである。いまの CLI はこれを確かめずに `--force` を受け付ける。

## 4. 回答候補

| 候補 | 内容                                                                                                                                                                                | 利点                                                                             | 懸念                                                                                     |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| A    | `specdojo-orchestrator` に `--force` を許すのは、claim を持つ run が動いていないと CLI が確かめられるときだけにする。`--reset-worktree` と `--all-blocked` は利用者の承認を得て使う | 止まったタスクの戻しを待たずに進められる。動いている run を戻す事故を CLI が防ぐ | 生死の判定（lock・プロセス）の実装と、判定を誤ったときの扱いが要る                       |
| B    | 今のまま、`--force` は人だけにする                                                                                                                                                  | 実装が要らない。人の確認が必ず入る                                               | 夜間や不在のときに止まったタスクが残る。毎回スクリプトを用意して流してもらう手間がかかる |
| C    | `specdojo-orchestrator` に条件なしで `--force` を許す                                                                                                                               | 実装が小さい                                                                     | 動いている run の claim を戻し、二重の実行や記録の食い違いを起こしうる                   |

- 推奨は A（オーケストレーターの提案、2026-11-26）。indie の判断待ち。

## 5. 回答・結論

候補 A を採る。`specdojo-orchestrator` に `exec release --force` を許すのは、claim を持つ run が動いていないと CLI が確かめられるときだけにする。動いているか判定できないときは、今と同じく断る。`--reset-worktree` と `--all-blocked` は、オーケストレーターが使う場合も利用者の承認を得てから使う。実装は別の todo で行う。

## 6. 承認

| 項目     | 内容                                        |
| -------- | ------------------------------------------- |
| 回答者   | indie                                       |
| 回答日   | 2026-11-26                                  |
| 承認方式 | commit                                      |
| 証跡     | 対話での承認（推奨の A を採る、2026-11-26） |

- 承認方式は既定で `commit`（`register close` により `decided` へ遷移）を用いる。
- 回答が不可逆・高リスク・framework schema 破壊的変更を伴う場合は `PR` 方式で承認し、証跡に PR URL と merge SHA を記載する。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
