---
specdojo:
  id: specdojo:cdfd-uc-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: cdfd-uc-_TOPIC_
      type: flow
      status: draft
      rulebook: specdojo:cdfd-uc-rulebook
      based_on:
        - cdfd-overview
      supersedes: []
---

# 概念データフロー図（ユースケース別）: _USE_CASE_NAME_

_TODO_: 全体概要のケース `_CASE_ID_` が扱うユースケースまたは系統を一文で示す。

## 1. 目的

_TODO_: その業務が何のためにあるか、どの出来事からどの成果までを成立させるかを 1〜2 文で書く。読み手の承認・設計・確認作業は書かない。

## 2. 適用範囲

- **対象**: ケース `_CASE_ID_`「_USE_CASE_NAME_」の _START_EVENT_ から _END_EVENT_ まで、_TODO_: 参加単位と必要な組織・システム境界を 1 行で書く。
- **対象外**: _TODO_: rulebook の「描き方の選択」に従う対象外、補助操作・実装詳細、状態定義・遷移を委ねる STSD を 1 行で示し、共通の責任分担は全体概要を参照する。

<!-- based_on と本文では、有効な全体概要や後継文書を参照し、deprecated の文書は参照しない。既存文書は project 修飾 doc id の wikilink、未作成文書は ID のインラインコードにする。 -->

## 3. プロセス領域

_TODO_: ケース `_CASE_ID_` の正常系の順序を示す。名称・領域分割は全体概要、役割は本章の表、受け渡しは図を正本とする。

<!-- rulebook の「描き方の選択」に従い、全体概要と同じグループ・区分ごとに節を置く。各節には役割表だけを置き、主要入力・主要出力の箇条書きは置かない。以下はグループ代表ノードの例。領域単位の場合は「含む領域」を「プロセス領域」にし、P-xx 領域名を書く。PDCA は必要な場合だけ独立した列で追加し、グループ・区分の列に入れない。 -->

### 3.1. _GROUP_OR_CATEGORY_NAME_（_AREA_ID_RANGE_）

| 順序 | プロセスグループ・区分   | 含む領域          | 横断上の役割     | 参照先               |
| ---- | ------------------------ | ----------------- | ---------------- | -------------------- |
| 1    | _GROUP_OR_CATEGORY_NAME_ | `_AREA_ID_RANGE_` | _RESPONSIBILITY_ | _TODO_: 有効な参照先 |

### 3.2. _GROUP_OR_CATEGORY_NAME_（_AREA_ID_RANGE_）

| 順序 | プロセスグループ・区分   | 含む領域          | 横断上の役割     | 参照先               |
| ---- | ------------------------ | ----------------- | ---------------- | -------------------- |
| 2    | _GROUP_OR_CATEGORY_NAME_ | `_AREA_ID_RANGE_` | _RESPONSIBILITY_ | _TODO_: 有効な参照先 |

## 4. データストア

全体概要から、このケースで参照・更新する正本だけを同じ名称・区分で示す。

### 4.1. マスタ・構成データ

| データストア        | 関連する参加単位              | 横断上の利用 |
| ------------------- | ----------------------------- | ------------ |
| _MASTER_STORE_NAME_ | _PARTICIPANT_NAME_OR_AREA_ID_ | _USAGE_      |

### 4.2. トランザクションデータ

| データストア             | 関連する参加単位              | 横断上の利用 |
| ------------------------ | ----------------------------- | ------------ |
| _TRANSACTION_STORE_NAME_ | _PARTICIPANT_NAME_OR_AREA_ID_ | _USAGE_      |

<!-- 該当する行がない区分は節ごと削除する。図のデータストアと対応させ、新しい名称・区分を本書だけへ追加しない。 -->

## 5. 概念データフロー

### 5.1. _BUSINESS_FLOW_TITLE_

_TODO_: 図から読み取れる流れや関係を 1 文で書く。題は「起票から完了記録まで」のような業務の言葉にする。

<!-- 開始から終了まで上から下へ配置する。イベントは一ノード一出来事の短い文にし、長ければ原文を保って改行する。系統の入口は全体概要の表と同じ文言にし、複数の出来事は分ける。引き渡し条件のイベント・引き渡し ID・Orchestrator は置かない。以下は D2 の例。実際の記法・色は全体概要の凡例に合わせる。 -->

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
  material_flow: {
    style: {
      stroke-width: 3
    }
  }
}

start: "_START_EVENT_" { class: event }
source: "_SOURCE_GROUP_NAME_\n_SOURCE_AREA_ID_RANGE_" { class: process }
target: "_TARGET_GROUP_NAME_\n_TARGET_AREA_ID_RANGE_" { class: process }
end: "_END_EVENT_" { class: event }
master_store: "_MASTER_STORE_NAME_" { class: store_master }
transaction_store: "_TRANSACTION_STORE_NAME_" { class: store_transaction }

start -> source: "起動条件"
master_store -> source: "_REFERENCE_INFORMATION_"
source -> target: "_TRANSFER_INFORMATION_"
target -> transaction_store: "_RESULT_INFORMATION_"
target -> end: "_COMPLETION_INFORMATION_"
```

_TODO_: 全体概要の「凡例（本プロダクト共通）」を参照する短い注記と、使用線種・省略事項・図を分ける場合の共有ノードを書く。

<!-- 領域単位の場合は source / target のラベルを P-xx 領域名へ置き換える。物を渡す線には material_flow class を適用し、現物の保管先には physical_store class を使う。不要なノード・線・classes は削除する。読みづらい場合は連続する業務の範囲で分割し、同じ名称・領域 ID のノードで接続を追えるようにする。引き渡し ID は作らない。 -->

<!-- 業務上重要な戻りがある場合だけ以下の節を使い、不要なら節ごと削除する。「引き渡し」「例外時の戻り先」の章や条件表は設けない。 -->

### 5.2. 例外時の戻り

_TODO_: 不足や不一致をどこへ返すか、図から読み取れることを 1 文で書く。

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
}

source: "_SOURCE_GROUP_NAME_\n_SOURCE_AREA_ID_RANGE_" { class: process }
target: "_TARGET_GROUP_NAME_\n_TARGET_AREA_ID_RANGE_" { class: process }

source <- target: "_RETURN_INFORMATION_"
source -> target: "_CORRECTED_INFORMATION_"
```

_TODO_: 全体概要の凡例を参照し、通常の図と共有する参加単位、省略事項、戻りが業務上重要な理由を短く注記する。

<!-- 戻りは補完・再判断を担う参加単位へ向け、返す情報と再提示する情報を名詞の線のラベルにする。条件イベントや内部の再試行手順は置かない。 -->

<!-- 未決事項がある場合だけ以下の章を使い、ない場合は章ごと削除する。 -->

## 6. 未決事項

| 論点                | 影響するケース・参加単位                    | 決定者          | 決定時期          |
| ------------------- | ------------------------------------------- | --------------- | ----------------- |
| _UNDECIDED_: _TODO_ | `_CASE_ID_` / _PARTICIPANT_NAME_OR_AREA_ID_ | _DECISION_ROLE_ | _DECISION_TIMING_ |
