---
id: prj-charter-template
type: template
status: draft
frontmatter_template:
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

| 項目            | 内容                              |
| --------------- | --------------------------------- |
| プロジェクト名  | _PROJECT_NAME_                    |
| プロジェクト ID | `_PROJECT_ID_`                    |
| 認可対象        | _AUTHORIZED_SCOPE_                |
| 認可しない範囲  | _NOT_AUTHORIZED_SCOPE_            |
| 直接根拠        | _BASIS_DOCUMENTS_                 |
| 承認責任        | _APPROVER_ROLE_                   |
| 認可条件        | _AUTHORIZATION_CONDITION_OR_NONE_ |

_TODO_: 承認に条件を付ける場合のみ「認可条件」行を残し、条件がない場合は行ごと削除する。

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

- _TODO_: 予算枠の新設・確定・増額
- _TODO_: 公開可否
- _TODO_: ライセンス方針の確定
- _TODO_: 主要スコープ変更
- _TODO_: GO / Not GO 判断

## 9. 主要前提・制約

| 区分 | 内容                           | 詳細化先                                   |
| ---- | ------------------------------ | ------------------------------------------ |
| 前提 | _ASSUMPTION_ITEM_              | `prj-assumptions-constraints-dependencies` |
| 制約 | _CONSTRAINT_ITEM_              | `prj-assumptions-constraints-dependencies` |
| 制約 | _BUDGET_BOUNDARY_OR_UNDECIDED_ | 未決事項                                   |

## 10. 後続で作成・詳細化する文書

| 文書                                                      | 目的                                             |
| --------------------------------------------------------- | ------------------------------------------------ |
| `dct-index` / `dct-project-definition`                    | 成果物一覧、配置、生成元、派生関係を整理する     |
| `prj-scope`                                               | 対象範囲、対象外、境界判断を定義する             |
| `prj-success-criteria-and-acceptance-criteria`            | 成功基準、完了定義、受入条件、判定方法を定義する |
| `prj-assumptions-constraints-dependencies`                | 実行上の前提条件、制約事項、外部依存を明示する   |
| `prj-issues-and-approach`                                 | 主要課題と解決アプローチを整理する               |
| `pm-plan`                                                 | プロジェクト全体の管理方針と実行計画を定義する   |
| `pm-organization` / `pm-roles` / `pm-members` / `pm-raci` | ロール、実行主体、責任分担を定義する             |
| `pm-quality-management-plan` / `pm-communication-plan`    | 品質管理とコミュニケーション方針を定義する       |

_TODO_: プロジェクトの成果物体系に合わせて、上記の文書一覧を過不足なく調整する。

## 11. 本格実行開始の GO / Not GO 判断

| 判断観点 | 確認内容              | 記録先              |
| -------- | --------------------- | ------------------- |
| 目的整合 | _CONFIRMATION_DETAIL_ | _EVIDENCE_LOCATION_ |
| 公開適性 | _CONFIRMATION_DETAIL_ | _EVIDENCE_LOCATION_ |
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
