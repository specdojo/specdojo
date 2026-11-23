---
specdojo:
  id: specdojo:prj-charter-template
  type: template
  status: ready
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:prj-charter
      type: project
      status: draft
      rulebook: specdojo:prj-charter-rulebook
      based_on:
        - _PROJECT_ID_:prj-overview
        - _PROJECT_ID_:prj-stakeholder-register
      supersedes: []
---

# プロジェクト憲章: _PROJECT_NAME_

_TODO_: 立ち上げ認可と権限委譲の記録であること、承認しない範囲を 2〜3 文で記述する。

## 1. 認可対象

| 項目            | 内容                              |
| --------------- | --------------------------------- |
| プロジェクト名  | _PROJECT_NAME_                    |
| プロジェクト ID | `_PROJECT_ID_`                    |
| 認可対象        | _AUTHORIZED_SCOPE_                |
| 認可しない範囲  | _NOT_AUTHORIZED_SCOPE_            |
| 直接根拠        | _BASIS_DOCUMENTS_                 |
| 承認責任        | _APPROVER_ROLE_                   |
| 認可条件        | _AUTHORIZATION_CONDITION_OR_NONE_ |

## 2. プロジェクトの目的

_TODO_: 認可判断に必要な目的を 1〜2 文で要約する。

| 観点              | 認可判断で確認する期待効果 |
| ----------------- | -------------------------- |
| _VALUE_VIEWPOINT_ | _EXPECTED_EFFECT_          |
| _VALUE_VIEWPOINT_ | _EXPECTED_EFFECT_          |

成功判定の観点と受入条件は `prj-success-criteria-and-acceptance-criteria` を正とする。

## 3. ハイレベルスコープ

| 区分   | 内容                | 詳細化先    |
| ------ | ------------------- | ----------- |
| 対象   | _IN_SCOPE_ITEM_     | `prj-scope` |
| 対象   | _IN_SCOPE_ITEM_     | `prj-scope` |
| 対象外 | _OUT_OF_SCOPE_ITEM_ | `prj-scope` |
| 未確定 | _UNDECIDED_ITEM_    | 未決事項    |

_TODO_: AI Agent を利用する場合は、支援対象の活動と委譲範囲を記述する。

成果物群と、憲章承認後に作成・詳細化する文書の一覧は、成果物カタログ（`dct-index`）を正とする。

## 4. 初期ステークホルダー

| ID                      | 関係者             | 関与区分              | 対応 Role code      | 認可判断における主な責任           |
| ----------------------- | ------------------ | --------------------- | ------------------- | ---------------------------------- |
| `STH-_STAKEHOLDER_KEY_` | _STAKEHOLDER_NAME_ | _ENGAGEMENT_CATEGORY_ | _ROLE_CODE_OR_NONE_ | _RESPONSIBILITY_FOR_AUTHORIZATION_ |
| `STH-_STAKEHOLDER_KEY_` | _STAKEHOLDER_NAME_ | _ENGAGEMENT_CATEGORY_ | _ROLE_CODE_OR_NONE_ | _RESPONSIBILITY_FOR_AUTHORIZATION_ |

_TODO_: 詳細の正本とするステークホルダー登録簿を記述する。

## 5. 権限委譲

| 項目         | 決裁者           | 実行責任者         | 協議先           | 証跡       |
| ------------ | ---------------- | ------------------ | ---------------- | ---------- |
| 立ち上げ認可 | _DECISION_OWNER_ | _ACCOUNTABLE_ROLE_ | _CONSULTED_ROLE_ | _EVIDENCE_ |
| 詳細計画策定 | _DECISION_OWNER_ | _ACCOUNTABLE_ROLE_ | _CONSULTED_ROLE_ | _EVIDENCE_ |
| 本格実行開始 | _DECISION_OWNER_ | _ACCOUNTABLE_ROLE_ | _CONSULTED_ROLE_ | _EVIDENCE_ |

_TODO_: 承認責任者に留保する判断（予算枠の新設・確定・増額、公開可否、ライセンス方針、主要スコープ変更、GO / Not GO 判断）を記述する。

## 6. 主要前提・制約

_TODO_: 認可判断に直結する事項だけを記載する。

| 区分 | 内容                            | 詳細化先                                   |
| ---- | ------------------------------- | ------------------------------------------ |
| 前提 | _ASSUMPTION_ITEM_               | `prj-assumptions-constraints-dependencies` |
| 制約 | _CONSTRAINT_ITEM_               | `prj-assumptions-constraints-dependencies` |
| 制約 | _BUDGET_BOUNDARY_OR_UNDECIDED_  | 未決事項                                   |
| 制約 | _PUBLICATION_SUITABILITY_       | `prj-assumptions-constraints-dependencies` |
| 制約 | _HUMAN_DECISION_RESPONSIBILITY_ | `prj-assumptions-constraints-dependencies` |

## 7. 本格実行開始の GO / Not GO 判断

| 判断観点 | 確認内容              | 合格条件         | 記録先              |
| -------- | --------------------- | ---------------- | ------------------- |
| 目的整合 | _CONFIRMATION_DETAIL_ | _PASS_CONDITION_ | _EVIDENCE_LOCATION_ |
| 公開適性 | _CONFIRMATION_DETAIL_ | _PASS_CONDITION_ | _EVIDENCE_LOCATION_ |
| 予算枠   | _CONFIRMATION_DETAIL_ | _PASS_CONDITION_ | _EVIDENCE_LOCATION_ |
| 体制     | _CONFIRMATION_DETAIL_ | _PASS_CONDITION_ | _EVIDENCE_LOCATION_ |
| 品質     | _CONFIRMATION_DETAIL_ | _PASS_CONDITION_ | _EVIDENCE_LOCATION_ |

## 8. 承認

| 承認日      | 承認者          | 承認対象         | 証跡リンク  |
| ----------- | --------------- | ---------------- | ----------- |
| _UNDECIDED_ | _APPROVER_ROLE_ | _APPROVAL_SCOPE_ | _UNDECIDED_ |

_TODO_: 未承認の場合の扱いを記述する。

## 9. 未決事項

| 論点        | 影響     | 当面の扱い         |
| ----------- | -------- | ------------------ |
| _OPEN_ITEM_ | _IMPACT_ | _INTERIM_HANDLING_ |
| _OPEN_ITEM_ | _IMPACT_ | _INTERIM_HANDLING_ |
