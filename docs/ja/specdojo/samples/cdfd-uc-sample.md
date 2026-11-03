---
specdojo:
  id: specdojo:cdfd-uc-sample
  type: flow
  status: draft
  rulebook: specdojo:cdfd-uc-rulebook
  based_on:
    - specdojo:cdfd-overview-sample
  supersedes: []
---

# 概念データフロー図（ユースケース別）: 欠品から補充まで

本書は、駄菓子屋きぬやの [[specdojo:cdfd-overview-sample|概念データフロー図（全体概要）]] のケース `C-02`「欠品から補充まで」について、在庫・仕入・販売を通る流れと、受け渡す情報・商品を示す。product 成果物として作成する場合の ID は `cdfd-uc-replenishment` とする。

## 1. 目的

欠品した商品を補充し、売場で販売できるようにするために、在庫の補充判断から仕入を経て販売が商品を引き受けるまでの流れを示す。

## 2. 適用範囲

- **対象**: 単一店舗の `C-02`「欠品から補充まで」として、在庫が補充基準を下回ってから在庫（`P-05`〜`P-06`）→ 仕入（`P-01`〜`P-02`）→ 販売（`P-03`〜`P-04`）を経て、受入品を売場棚へ配置し、販売が商品を扱えるまでを対象とする。
- **対象外**: 在庫計算・補充判断・発注・入荷検品・店頭販売の内部は `cdfd-inventory`・`cdfd-purchasing`・`cdfd-sales`、商品の状態定義・遷移は `stsd-product` へ委ね、補助操作・画面・保存方式・仕入先との通信は扱わず、店主代表・店番担当・システムの責任分担は [[specdojo:cdfd-overview-sample|全体概要]] を参照する。

## 3. プロセス領域

ケース `C-02` は在庫、仕入、販売の三グループをこの順に横断する。領域の分割・名称は全体概要を正本とし、本章は各グループの役割、図は受け渡しの正本とする。

ほかのケースも通る領域の内部は、次の役割表の参照先をそれぞれ唯一の正本とし、本書では各グループを 1 つの代表ノードにして受け渡しの線だけを描く。

### 3.1. 在庫（P-05〜P-06）

| 順序 | プロセスグループ・区分 | 含む領域       | 横断上の役割                                                                                       | 参照先           |
| ---- | ---------------------- | -------------- | -------------------------------------------------------------------------------------------------- | ---------------- |
| 1    | 在庫                   | `P-05`〜`P-06` | 商品台帳で補充対象を特定し、発注単位に合う数量を確定して、店主代表が承認した補充依頼を仕入へ渡す。 | `cdfd-inventory` |

### 3.2. 仕入（P-01〜P-02）

| 順序 | プロセスグループ・区分 | 含む領域       | 横断上の役割                                                                                           | 参照先            |
| ---- | ---------------------- | -------------- | ------------------------------------------------------------------------------------------------------ | ----------------- |
| 2    | 仕入                   | `P-01`〜`P-02` | 補充依頼を受けて発注・入荷を行い、受入結果と入荷数量を記録し、記録と一致する受入品を売場棚へ配置する。 | `cdfd-purchasing` |

### 3.3. 販売（P-03〜P-04）

| 順序 | プロセスグループ・区分 | 含む領域       | 横断上の役割                                                                               | 参照先       |
| ---- | ---------------------- | -------------- | ------------------------------------------------------------------------------------------ | ------------ |
| 3    | 販売                   | `P-03`〜`P-04` | 売場棚へ配置された受入品を、確定した入荷数量・受入結果と照合し、販売対象として引き受ける。 | `cdfd-sales` |

## 4. データストア

全体概要からこのケースで参照・更新する正本だけを同じ名称・区分で示す。

### 4.1. マスタ・構成データ

| データストア | 関連する参加単位 | 横断上の利用                                   |
| ------------ | ---------------- | ---------------------------------------------- |
| 商品台帳     | 在庫             | 補充基準と発注単位を参照し、補充対象を特定する |

### 4.2. トランザクションデータ

| データストア | 関連する参加単位 | 横断上の利用                                           |
| ------------ | ---------------- | ------------------------------------------------------ |
| 在庫記録     | 在庫、仕入       | 在庫数量を参照して補充対象を判断し、入荷数量を反映する |
| 仕入記録     | 仕入             | 発注・受入結果を記録する                               |
| 売場棚       | 仕入、販売       | 受入品を配置し、販売が売場商品を引き受ける（物理保管） |

## 5. 概念データフロー

### 5.1. 欠品から売場補充まで

在庫が承認済みの補充依頼を仕入へ渡し、仕入が入荷数量・受入結果を記録して、販売が売場商品を引き受ける。

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

start: "⚡ 在庫が補充基準を\n下回った" { class: event }
inventory: "📦 在庫\nP-05〜P-06" { class: process }
purchasing: "🚚 仕入\nP-01〜P-02" { class: process }
sales: "🛒 販売\nP-03〜P-04" { class: process }
end: "⚡ 販売が売場商品を\n扱える" { class: event }
item_master: "📐 商品台帳" { class: store_master }
inventory_record: "📒 在庫記録" { class: store_transaction }
purchase_record: "📒 仕入記録" { class: store_transaction }
display_shelf: "🏬 売場棚" { class: physical_store }

start -> inventory: "起動条件"
item_master -> inventory: "補充基準・発注単位"
inventory_record -> inventory: "在庫数量"
inventory -> purchasing: "補充依頼（商品・数量・承認）"
purchasing -> purchase_record: "発注・受入結果"
inventory_record <- purchasing: "入荷数量"
purchasing -> display_shelf: "受入品" { class: material_flow }
purchasing -> sales: "入荷数量・受入結果"
display_shelf -> sales: "売場商品" { class: material_flow }
sales -> end: "販売対象の引受結果"
```

凡例は [[specdojo:cdfd-overview-sample|全体概要]] の「凡例（本プロダクト共通）」を参照し、通常線は情報、太線は商品の流れに用いる。ノードには凡例の方針に従って絵文字を付け、次の図でも同じ対象には同じ絵文字を使う。各グループ内部は役割表の参照先へ委ね、次の図でも在庫・仕入・販売の代表ノードを共有する。

### 5.2. 例外時の戻り

補充依頼の不足は仕入から在庫へ、受入結果や売場配置の不一致は販売から仕入へ返し、補完・再判断後の情報を再提示する。

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

inventory: "📦 在庫\nP-05〜P-06" { class: process }
purchasing: "🚚 仕入\nP-01〜P-02" { class: process }
sales: "🛒 販売\nP-03〜P-04" { class: process }

inventory <- purchasing: "不足項目・商品候補・現在庫・補充基準"
inventory -> purchasing: "修正・再承認済みの補充依頼"
purchasing <- sales: "数量の差異・未確定の受入結果・配置状況"
purchasing -> sales: "照合・配置確認済みの入荷数量・受入結果"
```

凡例は [[specdojo:cdfd-overview-sample|全体概要]] を参照し、本図は本ケースでグループ間を戻る補充依頼の不足と受入結果・売場配置の不一致を漏れなく示す。通常の図と同じ代表ノードを使い、通常線で情報の戻りと再提示を描く。データストアと物の流れは通常の図、各グループ内部の例外は役割表の参照先へ委ね、内部の再試行は描かない。通常の図は 10 本、戻りの図は 4 本の線で、一ノードの入出力は最多 5 本のため、rulebook の分割の目安内に収まっている。
