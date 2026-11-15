---
specdojo:
  id: specdojo:bac-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _LOCAL_ID_
      type: requirement
      status: draft
      rulebook: specdojo:bac-rulebook
      based_on: _BASED_ON_
---

# _DELIVERABLE_NAME_

_DELIVERABLE_OVERVIEW_

## 1. 概要

- 受入対象: _TODO_
- 対象者・業務課題: _TODO_
- 業務価値・対応するシナリオ ID: _TODO_
- 利用場面・対象範囲（開始点・終了点）: _TODO_
- 対象外・委譲先: _TODO_
- 根拠: _TODO_

| 役割             | 確認・合意する内容 |
| ---------------- | ------------------ |
| _CONFIRMER_ROLE_ | _TODO_             |
| _APPROVER_ROLE_  | _TODO_             |

## 2. 受入条件

共通前提: _TODO_

### 2.1. BAC-01 _SCENARIO_NAME_

根拠（業務仕様の文書・項目 ID）: _TODO_

#### 2.1.1. 前提

- 開始状態: _TODO_
- 入力: _TODO_
- 担当者・権限: _TODO_
- 共通前提との差分: _TODO_

#### 2.1.2. 操作

- 担当者・業務行為: _TODO_

#### 2.1.3. 期待結果

- 状態・記録の変化: _TODO_
- 停止時に確定しないもの: _TODO_
- 引き継ぎ先・内容・再開条件: _TODO_

<!-- ケース表は条件差分がある場合に使用する。不要なら削除する。 -->

| ケース ID | 条件・入力 | 期待結果（観測点） |
| --------- | ---------- | ------------------ |
| _CASE_ID_ | _TODO_     | _TODO_             |

#### 2.1.4. 判定方法

| 対応する期待結果・ケース ID | 確認者 | 確認時点 | 観測先（証跡） | 照合対象 |
| --------------------------- | ------ | -------- | -------------- | -------- |
| _TODO_                      | _TODO_ | _TODO_   | _TODO_         | _TODO_   |

## 3. メモ / 将来課題

<!-- 未決事項がない場合は表を「なし」に置き換える。 -->

| 論点            | 影響するシナリオ ID・受入への影響 | 担当・判断者 | 判断時点・解消条件 | 追跡先 |
| --------------- | --------------------------------- | ------------ | ------------------ | ------ |
| _TODO_: _ISSUE_ | _TODO_                            | _TODO_       | _TODO_             | _TODO_ |
