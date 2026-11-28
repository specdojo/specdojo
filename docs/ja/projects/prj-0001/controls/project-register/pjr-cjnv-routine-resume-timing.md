---
specdojo:
  id: prj-0001:pjr-cjnv-routine-resume-timing
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: question
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-11-28T13:23:20Z"
  due_on: "2026-12-31"
---

# PJR-CJNV 止めた routine をいつ、どれから再開するか

## 1. 確認事項

2026-11-28 に codex の週間上限が近いため止めた 5 つの routine（dashboard-refresh・exec-cycle・exec-watch-scan・night-approved-register・nightly-integration-tests）を、いつ、どれから、どの agent で再開するかを決める

## 2. 入力

- 2026-11-28 に indie の依頼で、有効だった 5 つの routine を enabled: false にした（feature/prj-0001/pause-routines を develop に取り込み）。再開は indie の指示による
- rtn-exec-cycle は `edit_by`・`review_by` が sol（codex）、見張りの診断は watch-diagnoser（codex terra）を使う。codex は 2026-12-01 1:00 JST まで使わない
- 担当 DEV・期限 2026-12-31 は indie の指示（2026-11-28）

## 3. 背景

_TODO_: この確認が必要になった背景、前提、制約を記載する。

## 4. 回答候補

| 候補 | 内容   | 利点   | 懸念   |
| ---- | ------ | ------ | ------ |
| A    | _TODO_ | _TODO_ | _TODO_ |

## 5. 回答・結論

_TODO_: 回答または採択した方針を記載する。未回答の場合は `-` とする。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 回答者   | _TODO_ |
| 回答日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は既定で `commit`（`register close` により `decided` へ遷移）を用いる。
- 回答が不可逆・高リスク・framework schema 破壊的変更を伴う場合は `PR` 方式で承認し、証跡に PR URL と merge SHA を記載する。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
