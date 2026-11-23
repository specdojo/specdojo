---
specdojo:
  id: specdojo:cdfd-template
  type: template
  status: ready
  frontmatter_template:
    specdojo:
      id: cdfd-_GROUP_ID_
      type: flow
      status: draft
      rulebook: specdojo:cdfd-rulebook
      based_on:
        - cdfd-overview
      supersedes: []
---

# 概念データフロー図（プロセスグループ別）: _GROUP_NAME_

_TODO_: 全体概要（`cdfd-overview`）のどのプロセスグループ（_AREA_ID_RANGE_）を詳細化した文書かを一文で示す。

## 1. 目的

_TODO_: 対象グループの内部フロー、領域間の受け渡し、主要例外、グループ外への委譲を、どの利用場面（業務境界の合意、後続設計の入力など）で何を判断するための文書かを 1〜2 文で書く。文書を作る・確かめる・承認する役割の割り当ては書かない。

## 2. 適用範囲

- **対象**: _GROUP_NAME_ グループ（_AREA_ID_RANGE_）の _START_EVENT_ から _END_EVENT_ まで、_TODO_: 対象期間と組織・システム境界を 1 行で書く。
- **対象外**: _TODO_: 補助操作・実装詳細、他グループの責務（`cdfd-_OTHER_GROUP_`）、横断ユースケース（`cdfd-uc-_TOPIC_`）、状態定義・遷移を委ねる STSD を 1 行で示し、人間と AI Agent の責任分担などの共通原則は全体概要を参照する。

## 3. プロセス領域

_GROUP_NAME_ グループは全体概要の _AREA_COUNT_ 領域を引き継ぐ。領域 ID、名称、業務目的、主な担当、起点イベントは全体概要、受け渡しは概念データフローを正本とし、本章では領域ごとのプロセスを定める。

<!-- 対象グループに属する領域ごとに 3.n の節を繰り返す。各節にはプロセスの表だけを置き、領域の要約文や主要入力・主要出力・データストアの箇条書きは置かない。 -->

### 3.1. _AREA_NAME_（_AREA_ID_）

| プロセス ID    | プロセス       | 業務目的           | 主な担当     | 起動条件          | 完了条件               | 必須性        |
| -------------- | -------------- | ------------------ | ------------ | ----------------- | ---------------------- | ------------- |
| `_PROCESS_ID_` | _PROCESS_NAME_ | _BUSINESS_PURPOSE_ | _OWNER_ROLE_ | _START_CONDITION_ | _COMPLETION_CONDITION_ | _REQUIREMENT_ |

### 3.2. _AREA_NAME_（_AREA_ID_）

| プロセス ID    | プロセス       | 業務目的           | 主な担当     | 起動条件          | 完了条件               | 必須性        |
| -------------- | -------------- | ------------------ | ------------ | ----------------- | ---------------------- | ------------- |
| `_PROCESS_ID_` | _PROCESS_NAME_ | _BUSINESS_PURPOSE_ | _OWNER_ROLE_ | _START_CONDITION_ | _COMPLETION_CONDITION_ | _REQUIREMENT_ |

<!-- プロセス ID は所属領域 ID に二桁の枝番を付けた P-01-01 形式にする。各領域に一つ以上のプロセスを置き、全プロセスを一行ずつ追加する。完了条件は主要出力または正本の確定から yes / no で判定できる事実を書く。必須性は必須／条件付き／選択から選び、条件付き・選択では非起動時の正常な扱いも同じセルに書く。単一領域グループでは 3.2 の節を削除する。 -->

## 4. データストア

全体概要の「データストア」から、_GROUP_NAME_ グループが読み書きする行だけを同じ名称・区分で示す。各行は概念データフローの同名ノードと対応する。

### 4.1. マスタ・構成データ

| データストア      | 読み書き                    | 本グループでの利用 |
| ----------------- | --------------------------- | ------------------ |
| _DATA_STORE_NAME_ | _READ_WRITE_CLASSIFICATION_ | _USAGE_            |

### 4.2. トランザクションデータ

| データストア      | 読み書き                    | 本グループでの利用 |
| ----------------- | --------------------------- | ------------------ |
| _DATA_STORE_NAME_ | _READ_WRITE_CLASSIFICATION_ | _USAGE_            |

<!-- 「読み書き」は参照／更新／参照・更新のいずれかとする。該当する行がない区分は節ごと削除する。物の保管先は全体概要と同じ区分へ置き、利用内容に現物の受け渡しであることを書く。 -->

## 5. 概念データフロー

_TODO_: 「プロセス領域」の各表の行を一つのプロセスノードとして配置し、同一グループ内の領域間の受け渡し、起点イベント、「データストア」の各行、必要な外部主体、グループ外の委譲先をつなぐ。条件付き・選択プロセスは、起動する経路と非起動でも正常完了する経路の双方をたどれるようにする。図は領域ごと、または業務の性質が近いプロセスごとに分ける。一図のプロセスノードが 15 個を超える場合も分割する。

### 5.1. _FLOW_SCOPE_NAME_（_AREA_ID_RANGE_）

<!-- 以下は D2 の例。記法は全体概要の「凡例（本プロダクト共通）」の宣言に従う。凡例が D2 を宣言した場合は specdojo:cdfd-d2-rulebook に従い、凡例が Mermaid を宣言した場合、記法を宣言しない場合、または凡例がない場合は、本図を specdojo:cdfd-mermaid-rulebook に従う Mermaid の flowchart へ置き換える。色・絵文字の割り当ては凡例があればそれに合わせる。対象グループで使わない雛形のノード・線・classes は削除し、物を渡す線には material_flow class、現物の保管先には physical_store class を使う。 -->

```d2
direction: down

classes: {
  process: {
    shape: rectangle
    style: {
      border-radius: 8
      fill: "#e3f2fd"
      stroke: "#1e88e5"
      font-color: "#000000"
    }
  }
  event: {
    shape: hexagon
    style: {
      fill: "#fff3e0"
      stroke: "#fb8c00"
      font-color: "#000000"
    }
  }
  store_master: {
    shape: cylinder
    style: {
      fill: "#e8f5e9"
      stroke: "#43a047"
      font-color: "#000000"
    }
  }
  store_transaction: {
    shape: cylinder
    style: {
      fill: "#c8e6c9"
      stroke: "#2e7d32"
      font-color: "#000000"
    }
  }
  physical_store: {
    shape: rectangle
    style: {
      border-radius: 20
      fill: "#c8e6c9"
      stroke: "#2e7d32"
      font-color: "#000000"
    }
  }
  actor: {
    shape: rectangle
    style: {
      fill: "#f5f7fa"
      stroke: "#607d8b"
      font-color: "#000000"
    }
  }
  material_flow: {
    style: {
      stroke-width: 3
    }
  }
}

external: "_EXTERNAL_NAME_" { class: actor }
start_event: "_START_EVENT_" { class: event }
process: "_PROCESS_ID_ _PROCESS_NAME_" { class: process }
master_store: "_MASTER_STORE_NAME_" { class: store_master }
transaction_store: "_TRANSACTION_STORE_NAME_" { class: store_transaction }

external -> start_event: "_EVENT_INPUT_LABEL_"
start_event -> process: "起動条件"
master_store -> process: "_REFERENCE_LABEL_"
process -> transaction_store: "_OUTPUT_LABEL_"
```

_TODO_: 凡例の適用元を書く。全体概要に「凡例（本プロダクト共通）」がある場合はその章を参照し、ない場合は「ノード形状・線種・色・絵文字は `specdojo:cdfd-mermaid-rulebook` の既定凡例に従う」と書く。続けて、使用した線種（D2 は `->`・`<-` と `material_flow` class、Mermaid は `-->` / `==>`）、省略した入出力と理由、別図と共有するノード、他グループの内部処理を省略したことを 1〜2 文で書く。状態名をノードとして並べず、状態間の遷移を描かない。

<!-- 図が一つで足りる場合は 5.1 の見出しを削除して図を直下へ置く。複数図に分ける場合は 5.2 以降として同じ「見出し＋図＋直後の注記」を繰り返す。 -->

## 6. 個別プロセス主要入出力

### 6.1. _PROCESS_SCOPE_NAME_（_AREA_ID_RANGE_）

_TODO_: この表が扱う領域または業務上のまとまりを一文で要約する。業務目的、主な担当、起動条件、必須性は「プロセス領域」の表と重複させない。

| プロセス ID    | プロセス       | 主要入力      | 主要出力       | データストア  |
| -------------- | -------------- | ------------- | -------------- | ------------- |
| `_PROCESS_ID_` | _PROCESS_NAME_ | _MAIN_INPUTS_ | _MAIN_OUTPUTS_ | _DATA_STORES_ |

<!-- 概念データフローを分けた単位と同じ節を設け、全プロセスをいずれか一つの表へ一行ずつ追加する。 -->

## 7. 状態遷移の参照

_TODO_: 状態を変えるプロセスがある場合は次の表へ記入する。CDFD には状態名、状態説明、遷移元・遷移先、遷移条件を記載しない。状態を変えるプロセスがない場合は、その事実と確認根拠を一文で記述して表を削除する。

| 対象           | 状態を変えるプロセス | ステータス定義（STSD） |
| -------------- | -------------------- | ---------------------- |
| _STATE_TARGET_ | `_PROCESS_ID_`       | `stsd-_TERM_`          |

## 8. 主要例外とグループ外への委譲

### 8.1. 主要例外

| 例外 ID          | 対象プロセス   | 検出条件              | 停止範囲         | 本グループでの扱い   | 継続・再開条件                |
| ---------------- | -------------- | --------------------- | ---------------- | -------------------- | ----------------------------- |
| `_EXCEPTION_ID_` | `_PROCESS_ID_` | _DETECTION_CONDITION_ | _STOPPING_SCOPE_ | _EXCEPTION_HANDLING_ | _RESUME_OR_HANDOFF_CONDITION_ |

<!-- 例外 ID は最初に検出する領域番号を使った E-01-01 形式にし、主要例外を一行ずつ追加する。停止範囲には、確定または起動してはならない後続プロセス、出力、委譲を書く。主要例外が 0 件なら表を削除し、正常系・条件付きプロセス・更新失敗を確認した範囲と該当なしの結論を一文で残す。 -->

### 8.2. グループ外への委譲

| 委譲先               | 委譲する事項               | 引き渡す情報          | 本グループへ戻す条件 |
| -------------------- | -------------------------- | --------------------- | -------------------- |
| `cdfd-_OTHER_GROUP_` | _DELEGATED_RESPONSIBILITY_ | _HANDOFF_INFORMATION_ | _RETURN_CONDITION_   |
| `cdfd-uc-_TOPIC_`    | _CROSS_GROUP_SEQUENCE_     | _HANDOFF_INFORMATION_ | _RETURN_CONDITION_   |

<!-- 同一グループ内の領域間受け渡しは本表に置かず、概念データフローへ描く。委譲先が未作成の場合も ID をバッククォートで示し、他グループの内部プロセスは展開しない。グループ外委譲が 0 件なら表を削除し、対象外の他グループ責務と横断ユースケースを確認した範囲と該当なしの結論を一文で残す。 -->

<!-- 未決事項がある場合のみ、以下の章を追加する。追加時は章番号を 9 とする。ない場合は章ごと削除する。

## 9. 未決事項

| 論点                | 影響する領域・プロセス・例外・委譲 | 決定者          | 決定時期          |
| ------------------- | ---------------------------------- | --------------- | ----------------- |
| _UNDECIDED_: _TODO_ | _IMPACTED_IDS_OR_TARGETS_          | _DECISION_ROLE_ | _DECISION_TIMING_ |

-->
