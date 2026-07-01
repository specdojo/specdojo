---
id: _PROJECT_ID_:prj-success-criteria-and-acceptance-criteria
type: project
status: draft
rulebook: prj-success-criteria-and-acceptance-criteria-rulebook
based_on:
  - _PROJECT_ID_:prj-scope
supersedes: []
---

# 成功基準と受入条件: _PROJECT_NAME_

## 1. 判定対象と適用範囲

_TODO_: _PROJECT_NAME_ の何について、どの判断（完了、公開、受入など）に用いるかを記述する。対象外と、公開後に測定する効果を明示する。

| 業務価値 ID | 業務価値         | 判定対象との対応                                   |
| ----------- | ---------------- | -------------------------------------------------- |
| _BV_ID_     | _BUSINESS_VALUE_ | _TODO_: 対象利用者、利用場面、期待する状態との対応 |

## 2. 成功基準

_TODO_: 各業務価値について、成功した状態、判定基準、測定方法、判定時期、確認者を記述する。閾値には対象・単位・母数または比較対象を含める。

| ID      | 対応する業務価値 | 条件                | 判定基準           | 測定方法             | 判定時期          | 確認者          |
| ------- | ---------------- | ------------------- | ------------------ | -------------------- | ----------------- | --------------- |
| _SC_ID_ | _BV_ID_          | _SUCCESS_CONDITION_ | _PASSING_CRITERIA_ | _MEASUREMENT_METHOD_ | _DECISION_TIMING_ | _VERIFIER_ROLE_ |

## 3. 受入条件

_TODO_: 利用者視点、技術的受入、品質、公開適性などの種別ごとに、合格基準と証跡を記述する。承認者には人間の役割を置く。

| ID      | 対応する業務価値 | 種別              | 条件                   | 合格基準           | 証跡       | 確認者          | 承認者          |
| ------- | ---------------- | ----------------- | ---------------------- | ------------------ | ---------- | --------------- | --------------- |
| _AC_ID_ | _BV_ID_          | _ACCEPTANCE_TYPE_ | _ACCEPTANCE_CONDITION_ | _PASSING_CRITERIA_ | _EVIDENCE_ | _VERIFIER_ROLE_ | _APPROVER_ROLE_ |

## 4. 判定手順と証跡

1. _TODO_: 確認者、対象条件、確認順を記述する。
2. _TODO_: 証跡を確認する手順を記述する。
3. _TODO_: 否決時の是正内容、再確認する条件 ID、再判定予定の記録方法を記述する。
4. _TODO_: 承認者が受入可否または GO / Not GO を判断する手順を記述する。

## 5. 例外条件と未解決事項

_TODO_: 例外条件と未解決事項は `_UNDECIDED_:` で明示し、決定期限と担当を記述する。

| 論点    | 扱い                | 解決期限 / 判断タイミング | 責任者       |
| ------- | ------------------- | ------------------------- | ------------ |
| _ISSUE_ | _UNDECIDED_: _TODO_ | _DECISION_TIMING_         | _OWNER_ROLE_ |
