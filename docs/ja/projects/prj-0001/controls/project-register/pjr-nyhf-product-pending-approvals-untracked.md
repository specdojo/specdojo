---
specdojo:
  id: prj-0001:pjr-nyhf-product-pending-approvals-untracked
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: question
  item_status: open
  priority: medium
  registered_at: "2026-11-22T00:10:02Z"
  derived_from:
    - PJR-RS2P
---

# PJR-NYHF 製品の成果物から外した承認と留保のうち、追跡先のない 5 件をどう決めるか

## 1. 確認事項

PJR-RS2P で本文から外した承認と留保のうち、登録簿に追跡先がない 5 成果物（bes-task-ready-selected・stsd-routine-run・cdsd-execution・br-task-selection-strategy・cpd-specdojo-cli）の未決の点を、いつ誰がどう決めるかを決める。

## 2. 入力

- 一覧は PJR-RS2P の個票の 5.4 にある。ほかの 9 件には追跡先の項目がある。
- まとめて 1 件の question として起票し、決める時期は後で決める（indie の決定、2026-11-22）。

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
