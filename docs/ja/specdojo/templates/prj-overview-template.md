---
specdojo:
  id: specdojo:prj-overview-template
  type: template
  status: ready
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:prj-overview
      type: project
      status: draft
      rulebook: specdojo:prj-overview-rulebook
      based_on: []
      supersedes: []
---

# プロジェクト概要: _PROJECT_NAME_

_TODO_: 対象プロジェクトまたはフレームワークを、何を通じて、誰を支援し、どの状態を実現するかが分かる一文で定義する。

## 1. 背景

_TODO_: 現状と文脈を記述する。

_TODO_: 顕在化している問題と、その頻度・件数・影響を記述する。推測による値は根拠と置き換え方を添える。

| 問題      | 頻度・影響         |
| --------- | ------------------ |
| _PROBLEM_ | _FREQUENCY_IMPACT_ |
| _PROBLEM_ | _FREQUENCY_IMPACT_ |

## 2. 必要性

_TODO_: なぜ今取り組むか、既存のやり方を続けた場合に何が起きるかを記述する。

_ASSUMPTION_: 中心仮説を置く場合は、誰のどの課題に、どの働きかけを行うと、どの変化が生じるかを一文で記述し、確かめる時間軸を添えた価値仮説へ分ける。

1. _VALUE_HYPOTHESIS_（_TIME_AXIS_ で確かめる）
2. _VALUE_HYPOTHESIS_（_TIME_AXIS_ で確かめる）

## 3. 基本的な考え方

1. **_PRINCIPLE_NAME_**: _PRINCIPLE_DESCRIPTION_ _PRINCIPLE_MEANING_
2. **_PRINCIPLE_NAME_**: _PRINCIPLE_DESCRIPTION_ _PRINCIPLE_MEANING_

## 4. 実現したいこと

- _DESIRED_STATE_
- _DESIRED_STATE_

詳細な対象範囲と対象外は `prj-scope` で扱う。

## 5. 期待効果

_TODO_: 目標値が初期仮説であること、ベースラインと判定時期、外部要因に対する寄与の確かめ方を記述する。確定した成功判定は `prj-success-criteria-and-acceptance-criteria` で管理する。

<!-- 時間軸の指標は任意。置かない時間軸は見出しと表をまとめて削除し、省略理由または別の判定時期を期待効果の本文に記述する。 -->

### 5.1. 初期公開指標

_TODO_: 初期公開前に、誰がどの利用場面を試行して何を判定するかを記述する。

| 観点        | 指標        | 目標     | 測定方法             |
| ----------- | ----------- | -------- | -------------------- |
| _VIEWPOINT_ | _INDICATOR_ | _TARGET_ | _MEASUREMENT_METHOD_ |

### 5.2. 短期指標

_TODO_: 公開・運用開始後の判定時期と、何を判定するかを記述する。

| 観点        | 指標        | 初期目標         | 測定方法             |
| ----------- | ----------- | ---------------- | -------------------- |
| _VIEWPOINT_ | _INDICATOR_ | _INITIAL_TARGET_ | _MEASUREMENT_METHOD_ |

### 5.3. 中長期指標

_TODO_: 判定時期と、どの成果への寄与を確かめるかを記述する。

| 観点        | 指標        | 初期目標         | 測定方法             |
| ----------- | ----------- | ---------------- | -------------------- |
| _VIEWPOINT_ | _INDICATOR_ | _INITIAL_TARGET_ | _MEASUREMENT_METHOD_ |

## 6. 前提条件

本プロジェクトで変えない前提は次のとおりとする。

- _UNCHANGED_PREMISE_

本プロジェクトが成り立つために、次の条件に依存する。

- _DEPENDENT_CONDITION_

判断責任、AI Agent の役割、公開方針、取捨選択方針は次のとおりとする。

- _HUMAN_DECISION_RESPONSIBILITY_
- _AI_AGENT_ROLE_
- _DISCLOSURE_POLICY_
- _SELECTION_POLICY_
- _UNDECIDED_: _UNDECIDED_ITEM_ は _DECISION_DOCUMENT_OR_TIMING_ で決定する。
