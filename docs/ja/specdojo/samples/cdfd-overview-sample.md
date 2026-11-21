---
specdojo:
  id: specdojo:cdfd-overview-sample
  type: flow
  status: ready
  rulebook: specdojo:cdfd-overview-rulebook
  based_on: []
  supersedes: []
---

# 概念データフロー図（全体概要）: 駄菓子屋きぬや販売管理

本書は、駄菓子屋きぬやの店舗運営について、仕入から店頭販売、在庫管理、常連客のつけ管理、日次・月次の締めまでを業務プロセスとして整理する。

## 1. 目的

駄菓子屋きぬやの販売管理業務の全体像として、仕入・販売・在庫・顧客・締めの五つのプロセスグループと、それらが読み書きするデータの関係を示す。

## 2. 適用範囲

- 対象は、単一店舗での仕入計画から入荷、店頭販売、在庫確認と補充判断、常連客の登録とつけ精算、日次締めと月次見直しまでの店舗運営全体である。
- 本書が扱うのは、プロセス領域の分割と、領域間・データストア間の受け渡しまでである。各領域の内部（レジ操作の手順、記録項目、値引き・取消を行う処理、記録漏れ時の復旧手順）は対象外とし、プロセスグループ別 CDFD で詳細化する。状態名・意味・成立条件・遷移元・遷移先・イベント・遷移条件はステータス定義（Status Definition: STSD）を正本とし、詳細 CDFD は参照に留める。
- 商品検索、在庫参照、つけ残高参照など、記録を変更しない参照操作は独立した業務フローに含めず、各領域を支える補助操作として扱う。EC、複数店舗、本格会計、仕入先とのシステム連携は対象外とする。
- 店主と家族の店番担当、およびシステムの責任分担は [[specdojo:prj-overview-sample|プロジェクト概要]] に従う。補充の判断、つけの承認、締めの確定は店主が担い、システムは記録と確認を支援する。

## 3. プロセス領域

業務は 10 のプロセス領域を五つのプロセスグループにまとめる。領域の分割は本書の表、受け渡しは本書の図、領域内の詳細はプロセスグループ別 CDFD を正本とする。

### 3.1. 仕入（P-01〜P-02）

<!-- prettier-ignore -->
| 領域 ID | プロセス領域 | 業務目的 | 主な担当 | 起点イベント |
| --- | --- | --- | --- | --- |
| `P-01` | 仕入計画 | 補充対象と数量を発注単位に合わせて確定し、仕入先へ発注する。 | 店主代表 | 在庫から補充依頼を受けた |
| `P-02` | 入荷検品 | 納品された商品を検品し、売場棚へ出して仕入記録と在庫記録を更新する。 | 店番担当（管理責任: 店主代表） | 仕入先から商品が納品された |

### 3.2. 販売（P-03〜P-04）

<!-- prettier-ignore -->
| 領域 ID | プロセス領域 | 業務目的 | 主な担当 | 起点イベント |
| --- | --- | --- | --- | --- |
| `P-03` | 店頭販売 | 現金販売を記録し、商品を顧客へ渡す。 | 店番担当（管理責任: 店主代表） | 顧客が商品を購入した |
| `P-04` | つけ販売 | つけ上限と残高を確認したうえで、つけ販売を記録する。 | 店主代表 | 常連客がつけでの購入を依頼した |

### 3.3. 在庫（P-05〜P-06）

<!-- prettier-ignore -->
| 領域 ID | プロセス領域 | 業務目的 | 主な担当 | 起点イベント |
| --- | --- | --- | --- | --- |
| `P-05` | 在庫確認 | 販売と入荷を在庫記録へ反映し、現在庫を確認できる状態に保つ。 | 店番担当（管理責任: 店主代表） | 販売または入荷が記録された |
| `P-06` | 補充判断 | 補充基準を下回った商品を特定し、補充対象と数量を判断する。 | 店主代表 | 在庫が補充基準を下回った |

### 3.4. 顧客（P-07〜P-08）

<!-- prettier-ignore -->
| 領域 ID | プロセス領域 | 業務目的 | 主な担当 | 起点イベント |
| --- | --- | --- | --- | --- |
| `P-07` | 顧客登録 | 常連客の情報とつけ上限を登録し、つけ販売の可否を判断できるようにする。 | 店主代表 | 常連客がつけの利用を申し出た |
| `P-08` | つけ精算 | つけ残高の支払を受け付け、残高を更新する。 | 店主代表 | 常連客がつけの支払を申し出た |

### 3.5. 締め（P-09〜P-10）

<!-- prettier-ignore -->
| 領域 ID | プロセス領域 | 業務目的 | 主な担当 | 起点イベント |
| --- | --- | --- | --- | --- |
| `P-09` | 日次締め | 当日の販売、仕入、在庫、つけを突き合わせ、差異を確認して締めを確定する。 | 店主代表 | 閉店した |
| `P-10` | 月次見直し | 月次の売上・欠品・つけ残高を報告し、売価、補充基準、つけ上限を見直す。 | 店主代表 | 月末の締めが確定した |

## 4. データストア

店舗運営で読み書きするデータストアを、マスタ・構成データとトランザクションデータに分けて示す。現行の保管先はレジ横のノートと店主の記憶であり、システム化後の保管先は未確定のため「主な保管先」列に `_UNDECIDED_` を含む。常連客ノートと販売ノートは物理媒体を共有するが、顧客情報とつけ記録、および販売明細と日次締め記録は、それぞれ専用の欄を論理境界として別の正本にする。店頭のタブレット端末そのものは保管先の候補であり、データストアとしては扱わない。

### 4.1. マスタ・構成データ

<!-- prettier-ignore -->
| データストア | 主な内容 | 主な保管先 |
| --- | --- | --- |
| 商品台帳 | 商品名、売価、補充基準、仕入先、発注単位 | 商品ノート（現行）、<br>_UNDECIDED_: システム化後の保管先 |
| 顧客台帳 | 常連客の氏名、連絡先、つけ上限 | 常連客ノートの顧客欄（つけ台帳と媒体を共有）、<br>_UNDECIDED_: システム化後の保管先 |

### 4.2. トランザクションデータ

<!-- prettier-ignore -->
| データストア | 主な内容 | 主な保管先 |
| --- | --- | --- |
| 販売記録 | 販売日時、商品、数量、金額、支払区分（現金・つけ） | 販売ノートの販売明細欄（日次締め記録と媒体を共有）、<br>_UNDECIDED_: システム化後の保管先 |
| 仕入記録 | 発注日、仕入先、商品、数量、入荷日、仕入額 | 仕入ノート（現行）、<br>_UNDECIDED_: システム化後の保管先 |
| 在庫記録 | 商品ごとの現在庫、入出庫の履歴 | 店主の記憶（現行）、<br>_UNDECIDED_: システム化後の保管先 |
| つけ台帳 | 顧客ごとのつけ販売、精算、残高 | 常連客ノートのつけ欄（顧客台帳と媒体を共有）、<br>_UNDECIDED_: システム化後の保管先 |
| 日次締め記録 | 日ごとの売上、仕入額、在庫差異、つけ残高合計 | 販売ノート末尾の日次締め欄（販売記録と媒体を共有）、<br>_UNDECIDED_: システム化後の保管先 |
| 月次報告 | 月ごとの売上、欠品回数、つけ残高、見直し内容 | 未作成（現行）、<br>_UNDECIDED_: システム化後の保管先 |
| 売場棚 | 店頭に陳列した商品の現物 | 店内の売場棚（物理保管） |

## 5. 概念データフロー（概要）

本書は、データストアの区分で図を分ける今の方式を採用する。代表ノード 5 とデータストア 9 の計 14 ノードのため、1 図で示す。

仕入から販売と締めまでのデータの関係

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

supplier: "🏭 仕入先" {
  class: actor
}
customer: "🧑 顧客" {
  class: actor
}
purchasing: "🚚 仕入\nP-01〜P-02" {
  class: process
}
sales: "🛒 販売\nP-03〜P-04" {
  class: process
}
inventory: "📦 在庫\nP-05〜P-06" {
  class: process
}
customer_management: "👥 顧客\nP-07〜P-08" {
  class: process
}
closing: "🧮 締め\nP-09〜P-10" {
  class: process
}
product_master: "📐 商品台帳" {
  class: store_master
}
customer_master: "📐 顧客台帳" {
  class: store_master
}
sales_record: "📒 販売記録" {
  class: store_transaction
}
purchase_record: "📒 仕入記録" {
  class: store_transaction
}
inventory_record: "📒 在庫記録" {
  class: store_transaction
}
credit_ledger: "📒 つけ台帳" {
  class: store_transaction
}
daily_closing_record: "📒 日次締め記録" {
  class: store_transaction
}
monthly_report: "📊 月次報告" {
  class: store_transaction
}
display_shelf: "🏬 売場棚" {
  class: physical_store
}

# 配置制御用（受け渡しではない）
purchasing -> sales -> inventory -> customer_management -> closing: {style.opacity: 0}

product_master -> purchasing: "仕入先・発注単位"
purchasing <- inventory: "補充依頼"
supplier <- purchasing: "発注"
supplier -> purchasing: "商品" {
  class: material_flow
}
purchasing -> display_shelf: "商品" {
  class: material_flow
}
purchasing -> purchase_record: "仕入情報"
purchasing -> inventory_record: "入荷数量"
customer -> sales: "購入依頼・支払"
display_shelf -> sales: "商品" {
  class: material_flow
}
customer <- sales: "商品" {
  class: material_flow
}
product_master -> sales: "売価"
customer_master -> sales: "つけ上限"
sales <- credit_ledger: "つけ残高"
sales -> sales_record: "販売情報"
sales -> credit_ledger: "つけ販売情報"
sales_record -> inventory: "販売数量"
product_master -> inventory: "補充基準"
inventory -> inventory_record: "在庫数量"
customer -> customer_management: "登録依頼・つけの支払"
credit_ledger -> customer_management: "つけ残高"
customer_master <- customer_management: "顧客情報・つけ上限"
credit_ledger <- customer_management: "精算記録"
sales_record -> closing: "当日の販売"
purchase_record -> closing: "当日の仕入額"
inventory_record -> closing: "在庫差異"
credit_ledger -> closing: "つけ残高合計"
closing -> daily_closing_record: "日次締め"
closing -> monthly_report: "月次の売上・欠品・つけ残高"
product_master <- closing: "売価・補充基準の見直し"
customer_master <- closing: "つけ上限の見直し"
```

仕入・販売・在庫・顧客・締めの五つのグループが、商品と支払を受け渡し、台帳や記録を読み書きして店舗運営を支える関係を示す。

## 6. 詳細 CDFD 一覧

本書の詳細化先は、プロセスグループ別 CDFD とユースケース別 CDFD の 2 種類である。役割分担は次のとおり。

- プロセスグループ別 CDFD は、グループに属する領域の内部プロセス、起点イベント、例外・復旧、データストアの読み書きを定める正本である。状態の定義と遷移は STSD を正本とし、プロセスグループ別 CDFD は参照に留める。各領域はちょうど一つのプロセスグループ別 CDFD に属する。
- ユースケース別 CDFD は、複数のプロセスグループをまたぐ順序と引き渡し条件だけを定める。グループ内部のプロセスは再掲せず、プロセスグループ別 CDFD を参照する。単一のグループに閉じる業務はユースケース別 CDFD を作らない。

### 6.1. プロセスグループ別 CDFD

<!-- prettier-ignore -->
| プロセスグループ | 含む領域 | プロセスグループ別 CDFD |
| --- | --- | --- |
| 仕入 | `P-01`〜`P-02` | `cdfd-purchasing` |
| 販売 | `P-03`〜`P-04` | `cdfd-sales` |
| 在庫 | `P-05`〜`P-06` | `cdfd-inventory` |
| 顧客 | `P-07`〜`P-08` | `cdfd-customer` |
| 締め | `P-09`〜`P-10` | `cdfd-closing` |

### 6.2. ユースケース別 CDFD

複数のプロセスグループを横断する業務のうち、順序と引き渡し条件を定める必要があるものを示す。顧客登録や日次締めのように単一のグループに閉じる業務はプロセスグループ別 CDFD で扱い、必要になった時点でユースケース別 CDFD を追加する。

<!-- prettier-ignore -->
| ケース ID | ユースケース | 業務目的 | 横断するプロセスグループ | ユースケース別 CDFD |
| --- | --- | --- | --- | --- |
| `C-01` | つけ販売から精算まで | つけ上限の確認、つけ販売の記録、精算、月次のつけ上限見直しまでの引き渡しを定める | 販売 → 顧客 → 締め | `cdfd-uc-credit-sales` |
| `C-02` | 欠品から補充まで | 在庫の補充判断、発注、入荷検品、売場への補充までの引き渡しを定める | 在庫 → 仕入 → 販売 | `cdfd-uc-replenishment` |

## 7. 凡例（本プロダクト共通）

本プロダクトの全 CDFD（本書、プロセスグループ別 CDFD、ユースケース別 CDFD）が共通して参照するノード形状・色・絵文字の対応を示す。個々の CDFD は、以下の定義を再掲せず、本章への参照に留める。

図の記法には D2（[[specdojo:cdfd-d2-rulebook|D2 記法ルール]]）を採用し、`direction: down` で縦に配置する。プロセスは五つのプロセスグループの代表ノード、データストアは一覧の各行をノードとする。矢印は情報または実行要求の受け渡しであり、実行順や毎回の通過を意味しない。更新の線は更新前の参照を含む。`->`（戻りは `<-`）の通常線は情報、`material_flow` class の太線は商品の物の流れであり、売場棚は物理保管として描く。配置制御用の非表示の線は受け渡しを表さない。起点イベントと担当はプロセス領域の表に置き、図では省略する。店主代表と店番担当は領域の担当であり、対象範囲外の顧客と仕入先だけを外部主体にする。

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

actor_node: "🧑 外部主体" {
  class: actor
}
event_node: "⚡ 起点イベント" {
  class: event
}
process_node: "⚙️ プロセス／プロセスグループ" {
  class: process
}
master_store: "🗄️ マスタ・構成データ" {
  class: store_master
}
transaction_store: "🗄️ トランザクションデータ" {
  class: store_transaction
}
physical_store_node: "🏬 物理保管" {
  class: physical_store
}

actor_node -> process_node: "情報の流れ"
event_node -> process_node: "起動条件"
process_node -> master_store: "参照・更新"
process_node -> transaction_store: "更新"
process_node -> physical_store_node: "物の流れ" {
  class: material_flow
}
```

<!-- prettier-ignore -->
| 概念 | 形状 | 色 | 絵文字例 |
| --- | --- | --- | --- |
| プロセス／プロセスグループ | 角丸四角形（`style.border-radius: 8`） | 青（`#e3f2fd` / `#1e88e5`） | 業務内容が伝わる絵文字（例: 🛒） |
| 起点イベント | 六角形（`shape: hexagon`） | 橙（`#fff3e0` / `#fb8c00`） | 出来事が伝わる絵文字（例: 🚦） |
| データストア（マスタ・構成データ） | 円柱（`shape: cylinder`） | 薄い緑（`#e8f5e9` / `#43a047`） | 保管物が伝わる絵文字（例: 📐） |
| データストア（トランザクションデータ） | 円柱（`shape: cylinder`） | 中間の緑（`#c8e6c9` / `#2e7d32`） | 保管物が伝わる絵文字（例: 📒） |
| 物理保管 | 大角丸四角形（`style.border-radius: 20`） | 中間の緑（トランザクションデータと同じ） | 保管場所が伝わる絵文字（例: 🏬） |
| 外部主体 | 四角形（`shape: rectangle`） | グレー（`#f5f7fa` / `#607d8b`） | 主体が伝わる絵文字（例: 🧑） |
| 情報の流れ | ラベル付き通常線 `->`（戻りは `<-`） | — | — |
| 物の流れ | ラベル付き太線 `->`（`material_flow` class） | — | — |

データストアの色分けは、大分類「データストア」の中の業務上のサブ分類を表す。マスタ・構成データは、他のプロセスから参照される比較的安定した基準情報（商品台帳、顧客台帳）を指す。トランザクションデータは、業務活動に伴い都度更新される記録（販売記録、仕入記録、在庫記録、つけ台帳、締めの記録）を指す。物理保管は現物の保管先であり、いずれの区分にも属さないため、便宜上トランザクションデータと同じ色を用いる。

ノード形状・線種そのものの記法は [[specdojo:cdfd-d2-rulebook|D2 記法ルール]] に従う。本章は、その記法に基づき駄菓子屋きぬや販売管理の全 CDFD が実際に採用する色・絵文字の割り当てを固定する。

## 8. 未決事項

<!-- prettier-ignore -->
| 論点 | 影響 | 決定者 | 決定時期 | 状態 |
| --- | --- | --- | --- | --- |
| _UNDECIDED_: システム化後の各データストアの保管先（タブレット端末内、クラウド、紙との併用） | 「データストア」の保管先列と、プロセスグループ別 CDFD の記録・復旧手順 | 店主代表（技術メンターの助言を受けて） | システム設計の着手前 | open |
