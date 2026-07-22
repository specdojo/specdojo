---
specdojo:
  id: prj-success-criteria-and-acceptance-criteria-template
  type: template
  status: ready
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:prj-success-criteria-and-acceptance-criteria
      type: project
      status: draft
      rulebook: prj-success-criteria-and-acceptance-criteria-rulebook
      based_on:
        - _PROJECT_ID_:prj-overview
        - _PROJECT_ID_:prj-scope
      supersedes: []
---

# 成功基準と受入条件: _PROJECT_NAME_

## 1. 判定対象と適用範囲

_TODO_: _PROJECT_NAME_ について、初期公開・初期リリース、短期、中長期のどの段階を判定するか記述する。初期 GO / Not GO の必須条件、後続時期に判定する成功基準、対象外を区別する。

_TODO_: 低コスト、費用負担の軽減、無償提供などを業務価値に置く場合は、追加の現金支出、人の作業時間、継続的な運用負荷を分け、既存資産、寄付、無償枠の扱いを記述する。人の無償労働への負荷転嫁を成功とみなさない。

| 業務価値 ID | 業務価値         | 主な判定段階                                           |
| ----------- | ---------------- | ------------------------------------------------------ |
| _BV_ID_     | _BUSINESS_VALUE_ | _TODO_: 初期公開・初期リリース、短期、中長期のいずれか |

## 2. 成功基準

_TODO_: 各業務価値について、成功した状態、判定基準、測定方法、判定時期、確認者を記述する。初期公開・初期リリースでは利用者の作業完遂、短期では利用・定着・直接的改善、中長期では事業・社会的成果への寄与を検討する。閾値には対象・単位・母数または比較対象を含める。

| ID      | 対応する業務価値 | 条件                | 判定基準           | 測定方法             | 判定時期          | 確認者          |
| ------- | ---------------- | ------------------- | ------------------ | -------------------- | ----------------- | --------------- |
| _SC_ID_ | _BV_ID_          | _SUCCESS_CONDITION_ | _PASSING_CRITERIA_ | _MEASUREMENT_METHOD_ | _DECISION_TIMING_ | _VERIFIER_ROLE_ |

## 3. 受入条件

_TODO_: 初期公開・初期リリースで価値提供を開始できる条件を、利用者視点、技術的受入、品質、公開適性などの種別ごとに記述する。公開後の利用件数や中長期成果は初期受入の必須条件にしない。承認者には人間の役割を置く。

| ID      | 対応する業務価値 | 種別              | 条件                   | 合格基準           | 証跡       | 確認者          | 承認者          |
| ------- | ---------------- | ----------------- | ---------------------- | ------------------ | ---------- | --------------- | --------------- |
| _AC_ID_ | _BV_ID_          | _ACCEPTANCE_TYPE_ | _ACCEPTANCE_CONDITION_ | _PASSING_CRITERIA_ | _EVIDENCE_ | _VERIFIER_ROLE_ | _APPROVER_ROLE_ |

## 4. 判定手順と証跡

1. _TODO_: 確認者、対象条件、確認順を記述する。
2. _TODO_: 証跡を確認する手順を記述する。
3. _TODO_: 否決時の是正内容、再確認する条件 ID、再判定予定の記録方法を記述する。
4. _TODO_: 承認者が受入可否または GO / Not GO を判断する手順を記述する。
5. _TODO_: 公開・運用開始後の成功基準を、誰が、いつ、どの証跡で判定するか記述する。

## 5. 例外条件と未解決事項

_TODO_: 例外条件と未解決事項は _UNDECIDED_: で明示し、決定期限と担当を記述する。

| 論点    | 扱い                | 解決期限 / 判断タイミング | 責任者       |
| ------- | ------------------- | ------------------------- | ------------ |
| _ISSUE_ | _UNDECIDED_: _TODO_ | _DECISION_TIMING_         | _OWNER_ROLE_ |
