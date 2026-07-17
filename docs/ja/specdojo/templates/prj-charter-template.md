---
specdojo:
  id: prj-charter-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
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

_TODO_: 本書が、立ち上げ認可と権限委譲を記録する憲章であることを 2〜3 文で記述する。何の立ち上げを認可し、誰にどの権限を委譲するか、本格実行開始や外部公開を承認しないことを含め、PO またはスポンサーが最終判断と説明責任を担うことを明示する。

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

_TODO_: 承認に条件を付ける場合のみ「認可条件」行を残し、条件がない場合は行ごと削除する。

## 2. プロジェクトの目的

_TODO_: プロジェクト概要に基づき、認可判断に必要な目的を 1〜2 文で要約する。背景、必要性、数値目標、測定方法、中長期指標はプロジェクト概要を正とし、本書では再掲しない。

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

成果物群と、憲章承認後に作成・詳細化する文書の一覧は、成果物カタログ（`dct-index`）を正とする。

## 4. 初期ステークホルダー

| ID                      | 関係者             | 関与区分              | 対応 Role code      | 認可判断における主な責任           |
| ----------------------- | ------------------ | --------------------- | ------------------- | ---------------------------------- |
| `STH-_STAKEHOLDER_KEY_` | _STAKEHOLDER_NAME_ | _ENGAGEMENT_CATEGORY_ | _ROLE_CODE_OR_NONE_ | _RESPONSIBILITY_FOR_AUTHORIZATION_ |
| `STH-_STAKEHOLDER_KEY_` | _STAKEHOLDER_NAME_ | _ENGAGEMENT_CATEGORY_ | _ROLE_CODE_OR_NONE_ | _RESPONSIBILITY_FOR_AUTHORIZATION_ |

_TODO_: 関係者の詳細を正とするステークホルダー登録簿を記述する。

## 5. 権限委譲

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

## 6. 主要前提・制約

_TODO_: 前提・制約の全量は `prj-assumptions-constraints-dependencies` を正とし、認可判断に直結する事項（予算枠、公開適性、人間の判断責任）だけを記載する。

| 区分 | 内容                           | 詳細化先                                   |
| ---- | ------------------------------ | ------------------------------------------ |
| 前提 | _ASSUMPTION_ITEM_              | `prj-assumptions-constraints-dependencies` |
| 制約 | _CONSTRAINT_ITEM_              | `prj-assumptions-constraints-dependencies` |
| 制約 | _BUDGET_BOUNDARY_OR_UNDECIDED_ | 未決事項                                   |

## 7. 本格実行開始の GO / Not GO 判断

| 判断観点 | 確認内容              | 記録先              |
| -------- | --------------------- | ------------------- |
| 目的整合 | _CONFIRMATION_DETAIL_ | _EVIDENCE_LOCATION_ |
| 公開適性 | _CONFIRMATION_DETAIL_ | _EVIDENCE_LOCATION_ |
| 予算枠   | _CONFIRMATION_DETAIL_ | _EVIDENCE_LOCATION_ |
| 体制     | _CONFIRMATION_DETAIL_ | _EVIDENCE_LOCATION_ |
| 品質     | _CONFIRMATION_DETAIL_ | _EVIDENCE_LOCATION_ |

## 8. 承認

| 承認日      | 承認者          | 承認対象         | 証跡リンク  |
| ----------- | --------------- | ---------------- | ----------- |
| _UNDECIDED_ | _APPROVER_ROLE_ | _APPROVAL_SCOPE_ | _UNDECIDED_ |

_TODO_: 未承認の場合は、正式な立ち上げ認可文書として扱わない旨を記述する。証跡リンクには、承認の意思表示と承認対象の文書状態を特定できる記録（決定記録、Pull Request など）を記載する。

## 9. 未決事項

| 論点        | 期限                    | 担当         | 対応方針        |
| ----------- | ----------------------- | ------------ | --------------- |
| _OPEN_ITEM_ | _DUE_DATE_OR_CONDITION_ | _OWNER_ROLE_ | _ACTION_POLICY_ |
| _OPEN_ITEM_ | _DUE_DATE_OR_CONDITION_ | _OWNER_ROLE_ | _ACTION_POLICY_ |
