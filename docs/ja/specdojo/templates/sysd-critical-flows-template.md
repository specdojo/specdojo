---
specdojo:
  id: specdojo:sysd-critical-flows-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _LOCAL_ID_
      type: architecture
      status: draft
      owner: ARC
      rulebook: specdojo:sysd-critical-flows-rulebook
      part_of: []
      based_on: _BASED_ON_
---

# _DELIVERABLE_NAME_

## 1. 概要

- **対象・対象外**: _SCOPE_ENTRY_EXIT_AND_EXCLUSIONS_
- **最大5件の管理方針**: _FLOW_SELECTION_CONSOLIDATION_AND_REPLACEMENT_POLICY_
- **設計索引・状態用語の定義先**: _DESIGN_INDEX_AND_STATE_DEFINITION_SOURCE_
- **公開範囲・除外情報・人間の最終承認責任**: _PUBLICATION_SCOPE_EXCLUSIONS_AND_HUMAN_APPROVER_

## 2. 重要フロー一覧

| ID          | 名称        | 事故論点           | 対象者           | 業務影響          | 期待効果・選定理由                    |
| ----------- | ----------- | ------------------ | ---------------- | ----------------- | ------------------------------------- |
| `_FLOW_ID_` | _FLOW_NAME_ | _ACCIDENT_CONCERN_ | _AFFECTED_ROLES_ | _BUSINESS_IMPACT_ | _EXPECTED_EFFECT_AND_PRIORITY_REASON_ |

<!-- 一覧と詳細は同じ ID の集合とし、総数は最大5件。対象者には影響を受ける利用者・運用者、業務影響には放置時の損失、選定理由には通常処理より優先する理由を記入する。 -->

## 3. フロー詳細

_TODO_: 図の矢印・同期／非同期・境界の凡例を記入する。以下の節をフローごとに複製し、見出し番号を連番にする。

### 3.1. _FLOW_ID_: _FLOW_NAME_

- **目的・起動**: _PURPOSE_AND_TRIGGER_
- **範囲・入出力**: _SCOPE_INPUT_OUTPUT_AND_EXCLUSIONS_
- **図**: _TODO_: システム内外、サービス／プロセスと保存先、主要識別子、同期・非同期の区別を表す図を記入する。
- **永続化点・成功の確定**: _PERSISTENCE_AND_SUCCESS_CONFIRMATION_
- **整合性・冪等・再実行**: _CONSISTENCY_IDEMPOTENCY_AND_REPLAY_CONDITIONS_
- **失敗・保持・補償・再開**: _FAILURE_RETENTION_COMPENSATION_AND_RESUME_CONDITIONS_
- **受入条件**: `_ACCEPTANCE_ID_`: _USER_OBSERVABLE_ACCEPTANCE_

## 4. 観測性と運用連携

### 4.1. 検知と責任

_TODO_: 共通の必須記録と trace 方針を記入する。フロー別の伝搬範囲または非採用理由・代替の追跡方法は下表に記入する。

| Flow ID     | 相関キーと追跡範囲                   | 検知条件・閾値の正本             | 実装動作             | 人間の一次対応・照会先          |
| ----------- | ------------------------------------ | -------------------------------- | -------------------- | ------------------------------- |
| `_FLOW_ID_` | _CORRELATION_SCOPE_AND_TRACE_POLICY_ | _DETECTION_AND_THRESHOLD_SOURCE_ | _AUTOMATED_BEHAVIOR_ | _HUMAN_RESPONSE_AND_ESCALATION_ |

### 4.2. 管理記録への引渡し

| 条件・対象        | 記録種別      | 担当Role code・対応方針 | 報告・判断先                     |
| ----------------- | ------------- | ----------------------- | -------------------------------- |
| _CONTROL_TRIGGER_ | _RECORD_TYPE_ | _OWNER_AND_RESPONSE_    | _REPORT_OR_DECISION_DESTINATION_ |

## 5. 関連ドキュメント導線

### 5.1. 正本と変更影響

| Flow ID     | 実装・設定の一意な参照先           | 変更時の契約・schema・生成物・CLI・互換性 | 運用・判断への導線               |
| ----------- | ---------------------------------- | ----------------------------------------- | -------------------------------- |
| `_FLOW_ID_` | _IMPLEMENTATION_AND_CONFIG_SOURCE_ | _CHANGE_IMPACT_                           | _OPERATIONS_AND_DECISION_SOURCE_ |

### 5.2. 検証への引渡し

| 検証ID / フロー / 受入条件ID                          | 実在する確認先・実行方法     | 対象条件         | 期待結果・失敗判定       | 確認状況・不足の解消先                                |
| ----------------------------------------------------- | ---------------------------- | ---------------- | ------------------------ | ----------------------------------------------------- |
| `_VERIFICATION_ID_` / `_FLOW_ID_` / `_ACCEPTANCE_ID_` | _TEST_REFERENCE_AND_COMMAND_ | _TEST_CONDITION_ | _PASS_AND_FAIL_CRITERIA_ | _LOCATION_COVERAGE_EXECUTION_STATUS_AND_GAP_TRACKING_ |

<!-- 確認先は実在するテストパスまたはテスト ID。内部結合は ITC（itc- 系）、外部結合は ETC（etc- 系）。所在・網羅性・実行結果を区別し、不足は「未決事項と後続作業」の ID・担当へ接続する。 -->

### 5.3. 未決事項と後続作業

| ID / 対象                       | 未充足事項・依存とScheduleへの影響   | 作業単位・依存順・担当Role code | 完了条件・判断時期・登録先                |
| ------------------------------- | ------------------------------------ | ------------------------------- | ----------------------------------------- |
| `_UNRESOLVED_ID_` / `_FLOW_ID_` | _GAP_DEPENDENCY_AND_SCHEDULE_IMPACT_ | _WORK_SEQUENCE_AND_OWNER_       | _CLOSURE_TIMING_AND_TRACKING_DESTINATION_ |

<!-- 未決事項がなければ行を削除し、確認した範囲と「なし」を記す。未作成参照はwikilinkにせずIDをコード表記し、追跡IDと作成担当を付ける。 -->

### 5.4. 承認対象と公開前条件

| 判断対象    | 設計確認担当と合意事項              | 人間の承認責任・確定条件      |
| ----------- | ----------------------------------- | ----------------------------- |
| `_FLOW_ID_` | _DESIGN_REVIEW_ROLES_AND_AGREEMENT_ | _HUMAN_APPROVER_AND_EVIDENCE_ |

_TODO_: 公開／`ready` 昇格前の未決事項の解消または留保、人間承認の証跡、公開情報の確認、運用導線の充足条件を記入する。
