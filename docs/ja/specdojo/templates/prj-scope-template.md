---
specdojo:
  id: specdojo:prj-scope-template
  type: template
  status: ready
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:prj-scope
      type: project
      status: draft
      rulebook: specdojo:prj-scope-rulebook
      based_on:
        - _PROJECT_ID_:prj-overview
      supersedes: []
---

# プロジェクトスコープ: _PROJECT_NAME_

_TODO_: （任意）プロジェクト概要を受け、何の境界を定める文書かを 1 文で記述する。

## 1. 対象業務

_TODO_: 対象とする業務または活動領域を、対象者、利用場面、利用者影響とともに記述する。

- _TODO_: 対象業務または活動領域 1
- _TODO_: 対象業務または活動領域 2
- _TODO_: 対象業務または活動領域 3

## 2. 対象システム

_TODO_: 対象業務を支えるシステム、成果物、文書体系、基盤、外部連携範囲を 1 行ずつ記述する。各行がどの対象業務を支えるかを内容または境界から読み取れるようにする。

| 対象   | 内容   | 境界   |
| ------ | ------ | ------ |
| _TODO_ | _TODO_ | _TODO_ |
| _TODO_ | _TODO_ | _TODO_ |

## 3. 対象期間

_TODO_: 初期対象期間、判断イベント、継続改善との切り分けを記述する。

- _TODO_: 初期対象期間
- _TODO_: 初期リリースまたは初回公開前に含めること
- _TODO_: 初期リリースまたは初回公開後に扱うこと
- _UNDECIDED_: 具体日付が未確定の場合は、決定タイミングを記述する。

## 4. スコープ外

_TODO_: 今回扱わない対象を、外す理由と後続で扱う条件とともに記述する。

| 対象（Out） | 理由   | 補足   |
| ----------- | ------ | ------ |
| _TODO_      | _TODO_ | _TODO_ |
| _TODO_      | _TODO_ | _TODO_ |

## 5. 境界の判断基準

_TODO_: （任意）含めるか外すかで迷ったときの判断原則を、優先順位の順に記述する。

1. _TODO_: 判断基準 1
2. _TODO_: 判断基準 2
3. _TODO_: 判断基準 3

## 6. スコープ変更方針

_TODO_: （任意）スコープを追加・削除・変更するときの入口、影響評価、承認者、記録先を記述する。

| 項目     | 内容   |
| -------- | ------ |
| 変更入口 | _TODO_ |
| 影響評価 | _TODO_ |
| 承認者   | _TODO_ |
| 記録先   | _TODO_ |

_TODO_: 初期リリース前にスコープを追加する場合のトレードオフ確認方針を記述する。
