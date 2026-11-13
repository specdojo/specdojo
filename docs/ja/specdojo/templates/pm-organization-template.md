---
specdojo:
  id: specdojo:pm-organization-template
  type: template
  status: ready
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:pm-organization
      type: project
      status: draft
      rulebook: specdojo:pm-organization-rulebook
      based_on:
        - _PROJECT_ID_:prj-overview
        - _PROJECT_ID_:prj-stakeholder-register
      supersedes: []
---

# 組織定義: _PROJECT_NAME_

## 1. 組織モデル

_TODO_: プロジェクト規模、兼務方針、当事者・利用者の確認、人間とAI Agentの境界を記述する。

| 責任領域 | 設計方針 | 最終判断 | 実行・確認 |
| -------- | -------- | -------- | ---------- |
| _TODO_   | _TODO_   | _TODO_   | _TODO_     |

## 2. ロール・owner方針

| Role code     | 採用／未採用 | 判断理由・プロジェクトでの扱い | 未採用時の代替方針 |
| ------------- | ------------ | ------------------------------ | ------------------ |
| `_ROLE_CODE_` | _TODO_       | _TODO_                         | _TODO_             |

_TODO_: 標準ロールごと、および独自ロールがあればその採用判断を記入する。未採用がなければ「なし」と記す。

使用可能な `owner`: _TODO_: 採用集合のうち Schedule に使える Role code を列挙する。

_TODO_: RACI の採用列・省略列の扱いと、実行主体・兼務・Agent 支援を管理するメンバー定義を示す。

## 3. 正本と責任境界

| 情報   | 正本   | 本書で扱うこと |
| ------ | ------ | -------------- |
| _TODO_ | _TODO_ | _TODO_         |

## 4. 見直し条件

| トリガー | 確認すること | 更新先 | 判断者 |
| -------- | ------------ | ------ | ------ |
| _TODO_   | _TODO_       | _TODO_ | _TODO_ |
