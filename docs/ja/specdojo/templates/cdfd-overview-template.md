---
specdojo:
  id: specdojo:cdfd-overview-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _AUTHORITY_:cdfd-overview
      type: flow
      status: draft
      rulebook: specdojo:cdfd-overview-rulebook
      based_on: []
      supersedes: []
---

# 概念データフロー図（全体概要）: _TARGET_NAME_

_TODO_: 誰が、どの業務または運用の対象境界と領域間フローを合意するために使う全体概要かを 1〜3 文で記述する。

## 1. 目的

_TODO_: この全体概要を使用する対象者（対象範囲を承認する役割、領域別 CDFD を設計入力として使う役割、領域分割の重複・欠落を確認する役割等）と、利用場面（承認、領域別詳細化、設計入力、網羅性確認等）を結び付けて 1〜3 文で記述する。「分かりやすくする」のような曖昧な表現ではなく、利用結果を判定できる表現にする。

## 2. 適用範囲

- 対象: _TODO_: 開始点、終了点、対象業務、組織、システム境界を記述する。
- 対象外・補助操作: _TODO_: 補助操作、領域内の手順、実装詳細、別成果物や外部主体へ委譲する事項を記述する。
- 責任分担: _TODO_: 人間と AI Agent の責任分担の原則を本文で再定義せず、対応する文書への参照を記述する（例: `[[_AUTHORITY_:prj-overview|プロジェクト概要]]`）。

## 3. プロセス領域

_TODO_: 業務がいくつのプロセス領域に分かれるかを一文で記述する（例: "業務は N のプロセス領域に分かれる"）。主要入力・主要出力・データストア・詳細化先の役割・委譲境界は「個別プロセス領域概要」に記載する。

<!-- prettier-ignore -->
| 領域 ID | プロセス領域 | 業務目的 | 主な担当 | 起点イベント | 領域別 CDFD |
| --- | --- | --- | --- | --- | --- |
| `_PROCESS_AREA_ID_` | _PROCESS_AREA_NAME_ | _BUSINESS_PURPOSE_ | _OWNER_ROLE_ | _START_EVENT_ | `_DETAIL_CDFD_ID_` |
| `_PROCESS_AREA_ID_` | _PROCESS_AREA_NAME_ | _BUSINESS_PURPOSE_ | _OWNER_ROLE_ | _START_EVENT_ | `_DETAIL_CDFD_ID_` |

<!-- 領域が3件以上ある場合は、同じ形式で行を追加する。 -->

## 4. 概念データフロー（概要）

_TODO_: 代表ノードの数がおおむね7〜9件を超える場合は、業務の性質が近い領域をプロセスグループへまとめ、代表ノードをグループ単位にする。外部主体・物理保管・データストアとの受け渡しを一つの図で追える場合は、下記の単一図をそのまま使う。一画面で追いにくい場合だけ、「4.1. 外部主体と物理保管に着目した概要フロー」「4.2. データストアに着目した概要フロー」に分ける。

<!-- 単一図で足りる場合は、以下の図・凡例をそのまま使い、4.1/4.2 の見出しごと削除する。二図に分ける場合は、この単一図・凡例を削除し、4.1/4.2 を使う。 -->

```mermaid
flowchart LR
  classDef process fill:#e3f2fd,stroke:#1e88e5,color:#000
  classDef store fill:#e8f5e9,stroke:#43a047,color:#000
  classDef actor fill:#f5f7fa,stroke:#607d8b,color:#000

  _EXTERNAL_ACTOR_NODE_ID_["_EXTERNAL_ACTOR_NAME_"]

  _PROCESS_AREA_NODE_ID_("_PROCESS_AREA_ID_ _PROCESS_AREA_NAME_")

  _DATA_STORE_NODE_ID_[("_DATA_STORE_NAME_")]

  _EXTERNAL_ACTOR_NODE_ID_ -->|"_INPUT_LABEL_"| _PROCESS_AREA_NODE_ID_
  _PROCESS_AREA_NODE_ID_ -->|"_OUTPUT_FLOW_LABEL_"| _DATA_STORE_NODE_ID_

  class _PROCESS_AREA_NODE_ID_ process
  class _DATA_STORE_NODE_ID_ store
  class _EXTERNAL_ACTOR_NODE_ID_ actor
```

凡例: 角丸長方形はプロセス領域またはプロセスグループ（内訳は「プロセス領域」の一覧表を参照）、円柱はデータストア、四角は外部主体、`-->` は情報の流れを表す。個々の領域の起点イベントは「プロセス領域」の一覧表または「個別プロセス領域概要」に記載し、本図では省略する。本図は情報の流れを対象とし、現物の流れは対象外とする。

### 4.1. 外部主体と物理保管に着目した概要フロー

```mermaid
flowchart LR
  classDef process fill:#e3f2fd,stroke:#1e88e5,color:#000
  classDef store fill:#e8f5e9,stroke:#43a047,color:#000
  classDef actor fill:#f5f7fa,stroke:#607d8b,color:#000

  _EXTERNAL_ACTOR_NODE_ID_["_EXTERNAL_ACTOR_NAME_"]

  _PROCESS_AREA_NODE_ID_("_PROCESS_AREA_ID_ _PROCESS_AREA_NAME_")

  _PHYSICAL_STORAGE_NODE_ID_(["_PHYSICAL_STORAGE_NAME_"])

  _EXTERNAL_ACTOR_NODE_ID_ ==>|"_PHYSICAL_INPUT_LABEL_"| _PROCESS_AREA_NODE_ID_
  _PROCESS_AREA_NODE_ID_ ==>|"_PHYSICAL_OUTPUT_LABEL_"| _PHYSICAL_STORAGE_NODE_ID_

  class _PROCESS_AREA_NODE_ID_ process
  class _PHYSICAL_STORAGE_NODE_ID_ store
  class _EXTERNAL_ACTOR_NODE_ID_ actor
```

凡例: 角丸長方形はプロセス領域（内訳は「プロセス領域」の一覧表を参照）、スタジアム形は物理保管、四角は外部主体、`==>` は現物・現金の流れを表す。情報の流れはデータストアに着目した概要フロー（4.2）を参照する。

### 4.2. データストアに着目した概要フロー

```mermaid
flowchart LR
  classDef process fill:#e3f2fd,stroke:#1e88e5,color:#000
  classDef store fill:#e8f5e9,stroke:#43a047,color:#000
  classDef actor fill:#f5f7fa,stroke:#607d8b,color:#000

  _EXTERNAL_ACTOR_NODE_ID_["_EXTERNAL_ACTOR_NAME_"]

  _PROCESS_AREA_NODE_ID_("_PROCESS_AREA_ID_ _PROCESS_AREA_NAME_")

  _DATA_STORE_NODE_ID_[("_DATA_STORE_NAME_")]

  _EXTERNAL_ACTOR_NODE_ID_ -->|"_INPUT_LABEL_"| _PROCESS_AREA_NODE_ID_
  _PROCESS_AREA_NODE_ID_ -->|"_OUTPUT_FLOW_LABEL_"| _DATA_STORE_NODE_ID_

  class _PROCESS_AREA_NODE_ID_ process
  class _DATA_STORE_NODE_ID_ store
  class _EXTERNAL_ACTOR_NODE_ID_ actor
```

凡例: 角丸長方形はプロセス領域（内訳は「プロセス領域」の一覧表を参照）、円柱はデータストア、四角は外部主体、`-->` は情報の流れを表す。現物の流れは外部主体と物理保管に着目した概要フロー（4.1）を参照する。

## 5. 個別プロセス領域概要

<!-- プロセスグループを設けない場合は、以下のグループ見出し（5.1、5.2）を省略し、領域見出し（5.1.1、5.1.2 相当）を 5.1、5.2 として直接並べる。 -->

### 5.1. _AREA_GROUP_NAME_（_PROCESS_AREA_ID_ 〜 _PROCESS_AREA_ID_）

_TODO_: グループが扱う範囲を数行で要約する。

#### 5.1.1. _PROCESS_AREA_ID_ _PROCESS_AREA_NAME_

- 業務目的: _BUSINESS_PURPOSE_
- 主な担当: _OWNER_ROLE_
- 起点イベント: _START_EVENT_
- 主要入力: _MAIN_INPUTS_
- 主要出力: _MAIN_OUTPUTS_
- データストア: _DATA_STORES_
- 詳細化先（正本）: `_DETAIL_CDFD_ID_` — _DETAIL_CDFD_ROLE_（その領域別 CDFD が正本とする横断的な決めごとを記述する）。
- 委譲境界: _DELEGATION_BOUNDARY_

<!-- グループ内に領域が3件以上ある場合は、5.1.3 として同じ構成を繰り返す。 -->

#### 5.1.2. _PROCESS_AREA_ID_ _PROCESS_AREA_NAME_

- 業務目的: _BUSINESS_PURPOSE_
- 主な担当: _OWNER_ROLE_
- 起点イベント: _START_EVENT_
- 主要入力: _MAIN_INPUTS_
- 主要出力: _MAIN_OUTPUTS_
- データストア: _DATA_STORES_
- 詳細化先（正本）: `_DETAIL_CDFD_ID_` — _DETAIL_CDFD_ROLE_（その領域別 CDFD が正本とする横断的な決めごとを記述する）。
- 委譲境界: _DELEGATION_BOUNDARY_

<!-- グループが3件以上ある場合は、5.3 として「グループ要約＋領域詳細」の構成を繰り返す。 -->

### 5.2. _AREA_GROUP_NAME_（_PROCESS_AREA_ID_ 〜 _PROCESS_AREA_ID_）

_TODO_: グループが扱う範囲を数行で要約する。

#### 5.2.1. _PROCESS_AREA_ID_ _PROCESS_AREA_NAME_

- 業務目的: _BUSINESS_PURPOSE_
- 主な担当: _OWNER_ROLE_
- 起点イベント: _START_EVENT_
- 主要入力: _MAIN_INPUTS_
- 主要出力: _MAIN_OUTPUTS_
- データストア: _DATA_STORES_
- 詳細化先（正本）: `_DETAIL_CDFD_ID_` — _DETAIL_CDFD_ROLE_（その領域別 CDFD が正本とする横断的な決めごとを記述する）。
- 委譲境界: _DELEGATION_BOUNDARY_

<!-- 未決事項がある場合のみ、以下の章を追加する。ない場合は章ごと削除する。

## 6. 未決事項

| 論点 | 影響 | 決定者 | 決定時期 |
| --- | --- | --- | --- |
| _UNDECIDED_: _TODO_ | _IMPACT_ | _DECISION_ROLE_ | _DECISION_TIMING_ |

-->
