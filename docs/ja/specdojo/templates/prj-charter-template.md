---
id: _PROJECT_ID_:prj-charter
type: project
status: ready
rulebook: prj-charter-rulebook
based_on:
  - _PROJECT_ID_:prj-overview
  - _PROJECT_ID_:prj-stakeholder-register
supersedes: []
---

# プロジェクト憲章: _PROJECT_NAME_

_TODO_: 本書が、立ち上げ認可と権限委譲を記録する憲章であることを 1 文で記述する。PO またはスポンサーが最終判断と説明責任を担うことを明示する。

## 1. 本書の目的

- _TODO_: 何の立ち上げを認可するかを記述する。
- _TODO_: 誰に、どの初期準備または詳細計画策定の権限を委譲するかを記述する。
- _TODO_: 本書で認可しない範囲を記述する。

## 2. 認可対象

| 項目            | 内容                   |
| --------------- | ---------------------- |
| プロジェクト名  | _PROJECT_NAME_         |
| プロジェクト ID | `_PROJECT_ID_`         |
| 認可対象        | _AUTHORIZED_SCOPE_     |
| 認可しない範囲  | _NOT_AUTHORIZED_SCOPE_ |
| 直接根拠        | _BASIS_DOCUMENTS_      |
| 承認責任        | _APPROVER_ROLE_        |

## 3. プロジェクトの目的

_TODO_: プロジェクト概要に基づき、認可判断に必要な目的と期待効果を要約する。詳細本文を丸写ししない。

| 観点              | 認可判断で確認する期待効果 | 根拠    |
| ----------------- | -------------------------- | ------- |
| _VALUE_VIEWPOINT_ | _EXPECTED_EFFECT_          | _BASIS_ |
| _VALUE_VIEWPOINT_ | _EXPECTED_EFFECT_          | _BASIS_ |

## 4. ハイレベルスコープ

| 区分   | 内容                | 詳細化先    |
| ------ | ------------------- | ----------- |
| 対象   | _IN_SCOPE_ITEM_     | `prj-scope` |
| 対象   | _IN_SCOPE_ITEM_     | `prj-scope` |
| 対象外 | _OUT_OF_SCOPE_ITEM_ | `prj-scope` |
| 未確定 | _UNDECIDED_ITEM_    | 未決事項    |

## 5. ハイレベル成果物

| 成果物群            | 内容                      | 詳細化先          |
| ------------------- | ------------------------- | ----------------- |
| _DELIVERABLE_GROUP_ | _DELIVERABLE_DESCRIPTION_ | _DETAIL_DOCUMENT_ |
| _DELIVERABLE_GROUP_ | _DELIVERABLE_DESCRIPTION_ | _DETAIL_DOCUMENT_ |

## 6. ハイレベル成功基準

| 観点                | 成功判定の候補      | 詳細化先                                       |
| ------------------- | ------------------- | ---------------------------------------------- |
| _SUCCESS_VIEWPOINT_ | _SUCCESS_CANDIDATE_ | `prj-success-criteria-and-acceptance-criteria` |
| _SUCCESS_VIEWPOINT_ | _SUCCESS_CANDIDATE_ | `prj-success-criteria-and-acceptance-criteria` |

## 7. 初期ステークホルダー

| ID                      | 関係者             | 関与区分              | 対応 Role code      | 認可判断における主な責任           |
| ----------------------- | ------------------ | --------------------- | ------------------- | ---------------------------------- |
| `STH-_STAKEHOLDER_KEY_` | _STAKEHOLDER_NAME_ | _ENGAGEMENT_CATEGORY_ | _ROLE_CODE_OR_NONE_ | _RESPONSIBILITY_FOR_AUTHORIZATION_ |
| `STH-_STAKEHOLDER_KEY_` | _STAKEHOLDER_NAME_ | _ENGAGEMENT_CATEGORY_ | _ROLE_CODE_OR_NONE_ | _RESPONSIBILITY_FOR_AUTHORIZATION_ |

_TODO_: 関係者の詳細を正とするステークホルダー登録簿を記述する。

## 8. 権限委譲

| 項目         | 決裁者           | 実行責任者         | 協議先           | 証跡       |
| ------------ | ---------------- | ------------------ | ---------------- | ---------- |
| 立ち上げ認可 | _DECISION_OWNER_ | _ACCOUNTABLE_ROLE_ | _CONSULTED_ROLE_ | _EVIDENCE_ |
| 詳細計画策定 | _DECISION_OWNER_ | _ACCOUNTABLE_ROLE_ | _CONSULTED_ROLE_ | _EVIDENCE_ |
| 本格実行開始 | _DECISION_OWNER_ | _ACCOUNTABLE_ROLE_ | _CONSULTED_ROLE_ | _EVIDENCE_ |

_TODO_: PO またはスポンサーの承認を必要とする事項を箇条書きで記述する。

- _TODO_: 主要スコープ変更
- _TODO_: 予算枠の確定または増額
- _TODO_: 本格実行開始または公開可否

## 9. 主要前提・制約

| 区分 | 内容                           | 詳細化先                                   |
| ---- | ------------------------------ | ------------------------------------------ |
| 前提 | _ASSUMPTION_ITEM_              | `prj-assumptions-constraints-dependencies` |
| 制約 | _CONSTRAINT_ITEM_              | `prj-assumptions-constraints-dependencies` |
| 制約 | _BUDGET_BOUNDARY_OR_UNDECIDED_ | 未決事項                                   |

## 10. 後続で作成・詳細化する文書

| 文書                                           | 目的   |
| ---------------------------------------------- | ------ |
| `prj-scope`                                    | _TODO_ |
| `prj-success-criteria-and-acceptance-criteria` | _TODO_ |
| `prj-assumptions-constraints-dependencies`     | _TODO_ |
| `pm-plan`                                      | _TODO_ |

## 11. 本格実行開始の GO / Not GO 判断

| 判断観点 | 確認内容              | 記録先              |
| -------- | --------------------- | ------------------- |
| 目的整合 | _CONFIRMATION_DETAIL_ | _EVIDENCE_LOCATION_ |
| 予算枠   | _CONFIRMATION_DETAIL_ | _EVIDENCE_LOCATION_ |
| 体制     | _CONFIRMATION_DETAIL_ | _EVIDENCE_LOCATION_ |
| 品質     | _CONFIRMATION_DETAIL_ | _EVIDENCE_LOCATION_ |

## 12. 承認

| 版        | 承認日      | 承認者          | 承認対象         | 証跡リンク  |
| --------- | ----------- | --------------- | ---------------- | ----------- |
| _VERSION_ | _UNDECIDED_ | _APPROVER_ROLE_ | _APPROVAL_SCOPE_ | _UNDECIDED_ |

_TODO_: 未承認の場合は、正式な立ち上げ認可文書として扱わない旨を記述する。

## 13. 未決事項

| 論点        | 期限                    | 担当         | 対応方針        |
| ----------- | ----------------------- | ------------ | --------------- |
| _OPEN_ITEM_ | _DUE_DATE_OR_CONDITION_ | _OWNER_ROLE_ | _ACTION_POLICY_ |
| _OPEN_ITEM_ | _DUE_DATE_OR_CONDITION_ | _OWNER_ROLE_ | _ACTION_POLICY_ |
