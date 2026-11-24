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
