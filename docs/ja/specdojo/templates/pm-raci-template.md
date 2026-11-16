---
specdojo:
  id: specdojo:pm-raci-template
  type: template
  status: ready
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:pm-raci
      type: project
      status: draft
      rulebook: specdojo:pm-raci-rulebook
      based_on:
        - specdojo:people-and-organization-definition-standard
        - _PROJECT_ID_:pm-organization
      supersedes: []
---

# RACI: _PROJECT_NAME_

## 1. 適用方針

_TODO_: 対象とする主要成果物・判断、省略範囲、使用するRole code、兼務とAgent支援の扱いを記述する。

記号の意味は [[specdojo:people-and-organization-definition-standard|人と組織の定義標準]] に従う。

## 2. 成果物別 RACI

_TODO_: `_ROLE_CODE_` を採用 Role に置換して列を必要数に増減する。複数 `R` の行には対象作業ごとの主担当と担当範囲を注記する。

| 成果物 | `_ROLE_CODE_` |
| ------ | ------------- |
| _TODO_ | _TODO_        |

## 3. 判断・プロセス別 RACI

| 判断・プロセス | `_ROLE_CODE_` |
| -------------- | ------------- |
| _TODO_         | _TODO_        |

## 4. Schedule・実行主体との対応

### 4.1. 主担当と照合先

_TODO_: WBS・Schedule の正本と主担当を示す。`owner` の優先順と承認・レビュー・外部待ちの扱いは [[specdojo:people-and-organization-definition-standard|人と組織の定義標準]] の「Schedule への担当展開」に従う。

| 対象作業 | 主担当・`owner` | 対応する行と照合内容 |
| -------- | --------------- | -------------------- |
| _TODO_   | _TODO_          | _TODO_               |

_TODO_: Member、兼務、Agent 支援の割り当て先となる正本を記述する。

### 4.2. 不一致時の更新先

| 不一致の原因・具体例 | 更新する正本と確認 |
| -------------------- | ------------------ |
| _TODO_               | _TODO_             |

## 5. 見直し条件

| トリガー | 確認すること |
| -------- | ------------ |
| _TODO_   | _TODO_       |
