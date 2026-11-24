---
specdojo:
  id: specdojo:prj-success-criteria-and-acceptance-criteria-template
  type: template
  status: ready
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:prj-success-criteria-and-acceptance-criteria
      type: project
      status: draft
      rulebook: specdojo:prj-success-criteria-and-acceptance-criteria-rulebook
      based_on:
        - _PROJECT_ID_:prj-overview
        - _PROJECT_ID_:prj-scope
      supersedes: []
---

# 成功基準と受入条件: _PROJECT_NAME_

## 1. 判定対象と適用範囲

_TODO_: 判定対象、対象外、初期受入に必須とする条件 ID、運用開始後に判定する条件 ID を記述する。

| 業務価値 ID | 業務価値         | 主な判定段階     |
| ----------- | ---------------- | ---------------- |
| _BV_ID_     | _BUSINESS_VALUE_ | _DECISION_STAGE_ |

## 2. 成功基準

| ID      | 対応する業務価値 | 条件                | 判定基準           | 測定方法             | 判定時期          | 確認者          |
| ------- | ---------------- | ------------------- | ------------------ | -------------------- | ----------------- | --------------- |
| _SC_ID_ | _BV_ID_          | _SUCCESS_CONDITION_ | _PASSING_CRITERIA_ | _MEASUREMENT_METHOD_ | _DECISION_TIMING_ | _VERIFIER_ROLE_ |

## 3. 受入条件

| ID      | 対応する業務価値 | 種別              | 条件                   | 合格基準           | 証跡       | 確認者          | 承認者          |
| ------- | ---------------- | ----------------- | ---------------------- | ------------------ | ---------- | --------------- | --------------- |
| _AC_ID_ | _BV_ID_          | _ACCEPTANCE_TYPE_ | _ACCEPTANCE_CONDITION_ | _PASSING_CRITERIA_ | _EVIDENCE_ | _VERIFIER_ROLE_ | _APPROVER_ROLE_ |

## 4. 判定手順と証跡

_TODO_: 証跡の保存先と公開範囲を記述する。

1. _TODO_: 条件 ID ごとの確認順、確認者、判定時期を記述する。
2. _TODO_: 証跡を合格基準と照合し、結果を記録する手順を記述する。
3. _TODO_: 否決時の是正内容、再確認する条件 ID、再判定時期を記述する。
4. _TODO_: 承認者が受入可否を判断し、記録する手順を記述する。
5. _TODO_: 運用開始後の成功基準を判定時期に判定し、記録する手順を記述する。

## 5. 例外条件と未解決事項

| 論点    | 判定への影響          | 当面の扱い          |
| ------- | --------------------- | ------------------- |
| _ISSUE_ | _AFFECTED_CONDITIONS_ | _UNDECIDED_: _TODO_ |
