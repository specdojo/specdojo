---
specdojo:
  id: specdojo:cnd-template
  type: template
  status: draft
  rulebook: specdojo:cnd-rulebook
  frontmatter_template:
    specdojo:
      id: _LOCAL_ID_
      type: architecture
      status: draft
      rulebook: specdojo:cnd-rulebook
      part_of: []
      based_on: _BASED_ON_
      supersedes: []
---

# _DELIVERABLE_NAME_

## 1. 概要

_TODO_: 対象システム、上位コンテキスト図との対応、分割の目的、対象外を記入する。派生した提供経路を加える場合は範囲の違いを説明する。

_TODO_: 実行・配備の前提を示す。仮定は _ASSUMPTION_: とし、影響・確認先を「メモ / 将来課題」へ記入する。

_TODO_: 承認対象とする範囲・利用場面、作成担当・確認者・最終判断者の Role code を記入する。

## 2. C4コンテナ図（Mermaid）

<!-- 要素・関係は対象に応じて増減する。Person・外部システム・ストアが該当しない場合は理由を定義欄へ書く。骨組みの接続自体を確定構成として扱わない。 -->

```mermaid
flowchart LR
  person["👤 _PERSON_NAME_"]
  subgraph boundary["_SYSTEM_NAME_"]
    app1("_CONTAINER_ONE_")
    app2("_CONTAINER_TWO_")
    store[("_STORE_NAME_")]
  end
  external["_EXTERNAL_NAME_"]

  person -->|"_USE_LABEL_"| app1
  app1 -->|"_INTERNAL_LABEL_"| app2
  app2 -->|"_STORE_LABEL_"| store
  app2 -->|"_EXTERNAL_LABEL_"| external

  classDef person fill:#fff3bf,stroke:#f08c00,color:#000;
  classDef system fill:#d0ebff,stroke:#1c7ed6,color:#000;
  classDef external fill:#e9ecef,stroke:#495057,color:#000;
  class person person;
  class app1,app2,store system;
  class external external;
  style boundary fill:#ffffff,fill-opacity:0,stroke:#868e96,stroke-width:1px,stroke-dasharray: 5 5;
```

_TODO_: 矢印の意味、応答の省略、構築時だけ成立する関係、任意依存を説明する。

_TODO_: 上位図の利用目的・外部依存について、担当コンテナと経路、描かない経路の対象外理由を記入する。

## 3. 要素と境界の定義

### 3.1. 対象システムとシステム境界

_TODO_: 境界内に含める責務と、境界外へ委ねる処理を対にして記入する。物理配置と責務の境界を区別する。

### 3.2. Person（人・ロール）

| Person（図中ラベル） | 利用目的・接点  | 判断・確認の責務        |
| -------------------- | --------------- | ----------------------- |
| `_PERSON_NAME_`      | `_USE_PURPOSE_` | `_USER_RESPONSIBILITY_` |

### 3.3. Container（コンテナ）

| コンテナ（図中ラベル） | 責務                   | 技術区分・実行配備の前提 |
| ---------------------- | ---------------------- | ------------------------ |
| `_CONTAINER_ONE_`      | `_RESPONSIBILITY_ONE_` | `_EXECUTION_ONE_`        |
| `_CONTAINER_TWO_`      | `_RESPONSIBILITY_TWO_` | `_EXECUTION_TWO_`        |

### 3.4. Data Store（データストア）

| ストア（図中ラベル） | 保持する情報・正本        | アクセスと生成物の境界              |
| -------------------- | ------------------------- | ----------------------------------- |
| `_STORE_NAME_`       | `_PERSISTED_INFORMATION_` | `_READERS_WRITERS_AND_DERIVATIVES_` |

### 3.5. External Software System（外部システム）

| 外部システム（図中ラベル） | 利用条件・責任分界                          | 不在・障害時の影響 |
| -------------------------- | ------------------------------------------- | ------------------ |
| `_EXTERNAL_NAME_`          | `_DEPENDENCY_CONDITION_AND_RESPONSIBILITY_` | `_FAILURE_IMPACT_` |

### 3.6. Relationship（関係・連携契約）

<!-- 図の全関係に対応させ、端点・ラベルを一致させる。詳細の正本は実在する文書なら wikilink、未作成なら ID またはファイル名をインラインコードで記入する。構文・値・データ構造は参照先へ委ねる。 -->

| 関係 ID  | 起点 → 終点                           | 図中ラベル         | 方式・条件と情報の要点             | 詳細の正本                  |
| -------- | ------------------------------------- | ------------------ | ---------------------------------- | --------------------------- |
| `REL-01` | `_PERSON_NAME_` → `_CONTAINER_ONE_`   | `_USE_LABEL_`      | `_USER_CHANNEL_AND_INFORMATION_`   | `_USER_SPEC_REFERENCE_`     |
| `REL-02` | `_CONTAINER_ONE_` → `_CONTAINER_TWO_` | `_INTERNAL_LABEL_` | `_INTERNAL_CHANNEL_AND_TIMING_`    | `_INTERNAL_SPEC_REFERENCE_` |
| `REL-03` | `_CONTAINER_TWO_` → `_STORE_NAME_`    | `_STORE_LABEL_`    | `_STORE_ACCESS_AND_TIMING_`        | `_DATA_SPEC_REFERENCE_`     |
| `REL-04` | `_CONTAINER_TWO_` → `_EXTERNAL_NAME_` | `_EXTERNAL_LABEL_` | `_EXTERNAL_CHANNEL_AND_CONDITION_` | `_EXTERNAL_SPEC_REFERENCE_` |

## 4. 技術前提・制約と検証観点

### 4.1. 技術前提・制約

- `_EXECUTION_AND_DEPLOYMENT_PRECONDITION_`
- `_BUILD_TIME_AND_RUNTIME_BOUNDARY_`
- `_LOCAL_REMOTE_AND_READ_WRITE_BOUNDARIES_`
- `_TRUST_AND_APPROVAL_CONSTRAINT_`

### 4.2. コンテナ間・外部依存の検証対象

<!-- 正常時は下流の結合検証へ渡す全経路に対応させる。保存先・外部依存では不在・失敗・結果不明時の状態も区別する。行は対象ごとに増減し、未確定の期待結果は「メモ / 将来課題」へ引き継ぐ。 -->

| 確認区分     | 対象関係・境界                     | 観測する結果                            | 主確認ロール    |
| ------------ | ---------------------------------- | --------------------------------------- | --------------- |
| 正常時       | `_RELATIONSHIP_OR_BOUNDARY_`       | `_NORMAL_RESULT_`                       | `_REVIEW_ROLE_` |
| 不在・失敗時 | `_STORE_OR_EXTERNAL_RELATIONSHIP_` | `_UNAVAILABLE_OR_FAILED_RESULT_`        | `_REVIEW_ROLE_` |
| 結果不明時   | `_STORE_OR_EXTERNAL_RELATIONSHIP_` | `_UNKNOWN_RESULT_AND_RETAINED_RECORDS_` | `_REVIEW_ROLE_` |

### 4.3. 検証・承認前の確認

<!-- 確認内容・合格条件は rulebook の「検証・承認前の確認」に従う。 -->

- 文書検査・描画確認・内容レビューの記録: `_REVIEW_EVIDENCE_REFERENCE_`
- 未解決指摘と後続作業の制限: `_OPEN_FINDINGS_AND_RESTRICTIONS_`
- PO の承認・保留・差し戻しの記録: `_APPROVAL_RECORD_REFERENCE_`
- OPS による承認対象と公開対象の照合記録: `_PUBLICATION_SCOPE_CHECK_REFERENCE_`
- 改訂・廃止時の窓口と追従先・担当ロール: `_CHANGE_CONTACT_IMPACT_AND_ROLES_`

## 5. メモ / 将来課題

<!-- 仮定・未確定事項がない場合だけ章ごと削除する。最終列には解消条件、PJR 等の転送先レコード、判断者の Role code と判断期限または判断時点を記入する。 -->

| 対象・論点     | 影響範囲   | 担当ロール     | 解消条件・引き継ぎ先                     |
| -------------- | ---------- | -------------- | ---------------------------------------- |
| `_OPEN_TOPIC_` | `_IMPACT_` | `_OWNER_ROLE_` | `_RESOLUTION_RECORD_DECIDER_AND_TIMING_` |
