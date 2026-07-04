---
specdojo:
  id: prj-stakeholder-register-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:prj-stakeholder-register
      type: project
      status: ready
      rulebook: prj-stakeholder-register-rulebook
      based_on:
        - _PROJECT_ID_:prj-overview
      supersedes: []
---

# ステークホルダー登録簿: _PROJECT_NAME_

_TODO_: プロジェクトの目的、利用者、期待効果との関係を一文で記述する。個人名、連絡先、非公開情報は記載しない。

## 1. 関係者一覧

_TODO_: 意思決定者、実行担当、利用者、外部協力者、影響受容者を、役割名または集団名で識別する。対応 Role code は採用済みのものだけを記載する。

| ID                      | 関係者             | 関与区分              | 所属/組織      | 対応 Role code      | 主な責任                 | 備考   |
| ----------------------- | ------------------ | --------------------- | -------------- | ------------------- | ------------------------ | ------ |
| `STH-_STAKEHOLDER_KEY_` | _STAKEHOLDER_NAME_ | _ENGAGEMENT_CATEGORY_ | _ORGANIZATION_ | _ROLE_CODE_OR_NONE_ | _PRIMARY_RESPONSIBILITY_ | _TODO_ |
| `STH-_STAKEHOLDER_KEY_` | _STAKEHOLDER_NAME_ | _ENGAGEMENT_CATEGORY_ | _ORGANIZATION_ | _ROLE_CODE_OR_NONE_ | _PRIMARY_RESPONSIBILITY_ | _TODO_ |

## 2. 影響度/関心度分析

_TODO_: 影響度は方針・範囲・利用・合意形成への影響、関心度は継続的な確認の必要性を根拠に High / Medium / Low で評価する。

| ID                      | 関係者             | 影響度         | 関心度           | 主な期待      | 主な懸念  | 必要な合意           | 評価根拠               |
| ----------------------- | ------------------ | -------------- | ---------------- | ------------- | --------- | -------------------- | ---------------------- |
| `STH-_STAKEHOLDER_KEY_` | _STAKEHOLDER_NAME_ | _IMPACT_LEVEL_ | _INTEREST_LEVEL_ | _EXPECTATION_ | _CONCERN_ | _REQUIRED_AGREEMENT_ | _ASSESSMENT_RATIONALE_ |
| `STH-_STAKEHOLDER_KEY_` | _STAKEHOLDER_NAME_ | _IMPACT_LEVEL_ | _INTEREST_LEVEL_ | _EXPECTATION_ | _CONCERN_ | _REQUIRED_AGREEMENT_ | _ASSESSMENT_RATIONALE_ |

## 3. エンゲージメント方針

_TODO_: 現状と目標の差分を埋める対応方針を記述する。責任者、期限、証跡を置き、未確定なら `_TODO_:` / `_UNDECIDED_:` / `_ASSUMPTION_:` を使う。

| ID                      | 関係者             | 現状            | 目標           | 対応方針            | 責任者             | 期限            | 証跡       |
| ----------------------- | ------------------ | --------------- | -------------- | ------------------- | ------------------ | --------------- | ---------- |
| `STH-_STAKEHOLDER_KEY_` | _STAKEHOLDER_NAME_ | _CURRENT_STATE_ | _TARGET_STATE_ | _ENGAGEMENT_ACTION_ | _RESPONSIBLE_ROLE_ | _DUE_CONDITION_ | _EVIDENCE_ |
| `STH-_STAKEHOLDER_KEY_` | _STAKEHOLDER_NAME_ | _CURRENT_STATE_ | _TARGET_STATE_ | _ENGAGEMENT_ACTION_ | _RESPONSIBLE_ROLE_ | _DUE_CONDITION_ | _EVIDENCE_ |

## 4. コミュニケーション要件

_TODO_: 詳細な会議体・頻度はコミュニケーション計画へ委譲し、各関係者が必要とする情報、手段、合意・報告、証跡を記述する。

| ID                      | 関係者             | 情報要求           | 希望チャネル | 合意・報告の必要性            | 証跡要件               | コミュニケーション計画への反映 |
| ----------------------- | ------------------ | ------------------ | ------------ | ----------------------------- | ---------------------- | ------------------------------ |
| `STH-_STAKEHOLDER_KEY_` | _STAKEHOLDER_NAME_ | _INFORMATION_NEED_ | _CHANNEL_    | _AGREEMENT_OR_REPORTING_NEED_ | _EVIDENCE_REQUIREMENT_ | _PLAN_INPUT_                   |
| `STH-_STAKEHOLDER_KEY_` | _STAKEHOLDER_NAME_ | _INFORMATION_NEED_ | _CHANNEL_    | _AGREEMENT_OR_REPORTING_NEED_ | _EVIDENCE_REQUIREMENT_ | _PLAN_INPUT_                   |

## 5. 見直し条件

_TODO_: プロジェクトの目的、範囲、体制、公開・利用方針、主要な利用者影響が変わる場合の見直しを定義する。

| 更新トリガー     | 見直し内容     | 見直し責任者    | 承認者          | 証跡       |
| ---------------- | -------------- | --------------- | --------------- | ---------- |
| _UPDATE_TRIGGER_ | _REVIEW_SCOPE_ | _REVIEWER_ROLE_ | _APPROVER_ROLE_ | _EVIDENCE_ |
| _UPDATE_TRIGGER_ | _REVIEW_SCOPE_ | _REVIEWER_ROLE_ | _APPROVER_ROLE_ | _EVIDENCE_ |
