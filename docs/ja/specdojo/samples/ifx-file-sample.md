---
specdojo:
  id: specdojo:ifx-file-sample
  type: api
  status: ready
  rulebook: specdojo:ifx-file-rulebook
  part_of: []
  based_on: []
---

# 駄菓子屋きぬや 外部ファイル連携仕様 サンプル

## 1. 概要

店主代表（`PO`）と家族利用者代表（`PO` 業務助言）が日々の店頭販売と在庫把握を行う「駄菓子屋きぬや」において、[[specdojo:ifx-file-rulebook|外部ファイル連携仕様作成ルール]] に従う 2 つの代表的なファイル受け渡し契約（**単一ファイル・インライン定義**および**複数ファイル・正本スキーマ参照**）を示す完成例である。外部取引先へ送付するバッチファイルと、店頭 CLI の実行段階間で授受・照合する状態・証跡ファイルの双方について、配置・命名・必須項目・書き手と読み手・失敗時の回復手順を検証可能な形で定義する。

_ASSUMPTION_: [[specdojo:prj-overview-sample|プロジェクト概要]] および [[specdojo:ifx-index-sample|外部システムI/F一覧]] では、初期リリースの対象を店頭販売・在庫・つけ管理とし、仕入れ先とのシステム連携は初期スコープ外としている。本書では、外部取引先との単一ファイル契約（`file` と `schema.fields`）の完成例として次期拡張候補の「週次発注 CSV 連携」を、初期スコープ内の複数ファイル協調契約（`files` と `schema_ref` / `required_fields`）の完成例として [[specdojo:clis-sample|販売管理 CLI 仕様]] の「取引状態・販売実績控え JSON 連携」を示す。ロールと体制の正本は [[specdojo:pm-roles-sample|ロール定義]] および [[specdojo:pm-members-sample|メンバー定義]] とする。

_UNDECIDED_: 本サンプルの仕様は学習用の完成例（`status: draft`）であり、実運用の採否、問屋側 SFTP 接続条件の確定、および `status: ready` への昇格は人間の店主代表（`PO`）が最終判断する。

## 2. 利用目的と対象ユーザー

| 対象者（ロール）                 | 解決する課題・達成する結果                                       | 確認・合意する内容                                                                       |
| -------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 店主代表（`PO`）・家族利用者代表 | 発注漏れ・二重会計・通信障害時の記録消失を防ぎ、店番を引き継ぐ   | 連携タイミング、欠落・送信失敗・破損時の店頭代替手順（電話確認・保留照合）、公開採否     |
| 技術メンター（`ARC`）            | 一覧・CLI 仕様・正本スキーマとの重複や競合書き込みリスクを防ぐ   | `ifx-index` との対応、`atomic_write` 方式、`schema_ref` による正本分離、責務境界         |
| 開発担当（`DEV` / `BA` / `PM`）  | ファイル生成・読取・検証・退避ロジックを実装し、残課題を管理する | 配置パス、`naming_rule`、文字コード・改行、必須項目、異常時の終了コードと Schedule / PJR |
| 同行レビュー担当（`QE`）         | 正常系・境界値・異常系の受入判定と回復手順が検証可能か確認する   | `required_fields`、`constraints`、`missing` / `malformed` / `transport_failure` の期待値 |

CLI の対話操作と終了コード体系は [[specdojo:clis-sample|販売管理 CLI 仕様]]、外部印刷コマンド（`receipt-print`）の起動と印字用テキスト（`receipts/receipt-YYYYMMDD-NNNN.txt`）の入力契約は [[specdojo:ifx-cmd-sample|レシート印刷コマンド連携仕様]]、外部 I/F 全体の一覧は [[specdojo:ifx-index-sample|外部システムI/F一覧]] を正本とし、本書はファイル自体の永続化・受け渡し契約を扱う。

## 3. 外部ファイル連携仕様（YAML 完成例）

### 3.1. 単一ファイル・インライン定義の例（週次発注 CSV 連携）

リポジトリ内に別途スキーマ定義が存在しない外部取引先との単一ファイル連携では、`file` オブジェクトに基本情報と `writer` / `reader` を記載し、`schema.csv` と `schema.fields` に型・必須性・制約（`constraints`）・列マッピング（`mapping.csv.column`）を直接定義する。

```yaml
# specdojo-schema: none reason=no-ifx-file-schema
x-spec-meta:
  id: ifx-file-kinuya-orders
  type: api
  status: draft
  title: 駄菓子屋きぬや 週次発注データ連携仕様
  rulebook: specdojo:ifx-file-rulebook
  based_on:
    - specdojo:prj-overview-sample

# _ASSUMPTION_: 初期リリース後の次期拡張として、店舗端末から駄菓子卸問屋（丸和商会）へ
# 週次発注データを SFTP 送付する学習用の単一ファイル契約例。
# _UNDECIDED_: 問屋側 SFTP ホストおよび受領確認（ACK）方式は未確定。技術メンター（ARC）と
# 開発担当（DEV）が接続方式を詰め、人間の店主代表（PO）が採否と ready 昇格を判断する。

file:
  name: orders.csv
  naming_rule: orders_YYYYMMDD.csv
  location: data/outbound/orders/orders_YYYYMMDD.csv
  description: 駄菓子卸問屋（丸和商会）へ週次で送付する商品別発注データ
  writer: 店舗端末の発注バッチ処理（毎週日曜 21:30 に確定済み発注候補から生成）
  reader: 丸和商会 発注受付システム（確定名のファイルだけを週次バッチで取り込み、翌朝配送分を出荷引当する）
  format: CSV
  encoding: UTF-8

source: 駄菓子屋きぬや販売管理システム
target: 丸和商会発注受付システム
direction: source_to_target
format: CSV
timing: 毎週日曜日 21:30（月曜朝配送分の問屋締め切り 22:00 前）

transport:
  method: SFTP
  endpoint: sftp.maruwa-dagashi.example.com:/inbound/orders/
  frequency: 週次
  atomic_write: >-
    生成時は data/outbound/orders/ に orders_YYYYMMDD.csv.tmp を書き出してから orders_YYYYMMDD.csv へリネームして確定する。
    転送時は店舗端末が同名の .tmp を送り、送信完了後に SFTP の rename で問屋側の orders_YYYYMMDD.csv へ置き換える。
    リネーム済みの確定ファイルの存在を生成完了・転送完了とみなし、別の完了フラグは置かない。

schema:
  csv:
    delimiter: ","
    header: true
    quote: '"'
    encoding: UTF-8
    line_ending: CRLF

  fields:
    - name: store_code
      type: string
      description: 店舗コード（きぬやは固定値 KINUYA-01。他の値は受け付けない）
      required: true
      example: "KINUYA-01"
      constraints:
        pattern: "^KINUYA-01$"
      mapping:
        csv:
          column: store_code

    - name: order_date
      type: date
      description: 発注日（YYYY-MM-DD）
      required: true
      example: "2026-11-15"
      mapping:
        csv:
          column: order_date

    - name: product_code
      type: string
      description: 問屋共通商品コード（JANコードまたは問屋品番）
      required: true
      example: "4901234567890"
      constraints:
        maxLength: 14
      mapping:
        csv:
          column: product_code

    - name: order_unit
      type: string
      description: >-
        発注単位。丸和商会の商品マスタで product_code ごとに登録された発注単位と一致させる
        （BALL はボール、BOX は箱）。不一致の行は数量を換算せず malformed とする。
      required: true
      example: "BOX"
      constraints:
        enum: [BALL, BOX]
      mapping:
        csv:
          column: order_unit

    - name: order_quantity
      type: integer
      description: 発注数量（order_unit で示す単位の個数。例は箱 5 個）
      required: true
      example: 5
      constraints:
        min: 1
        max: 999
      mapping:
        csv:
          column: order_quantity

error_handling:
  missing:
    action: >-
      日曜 21:45 時点で確定ファイル orders_YYYYMMDD.csv（.tmp ではないもの）が存在しない場合、
      店舗端末へ未生成警告を表示し、店主代表（PO）が発注バッチを 1 回だけ手動再実行する。
      再実行後も 22:00 までに転送完了しない場合は自動送信を止め、transport_failure の 22:00 以降の手順に従う。
  malformed:
    action: >-
      必須列の欠落、文字コード不正、constraints 違反、または order_unit と商品マスタの発注単位の不一致を
      検知した場合は SFTP 送信を中止し、
      対象ファイルを data/quarantine/ へ隔離して前回確定済み控えを保持したまま開発担当（DEV）へ通知する。
  transport_failure:
    action: >-
      問屋側は確定名の orders_YYYYMMDD.csv だけを取り込み、.tmp は取り込まない。確定名は rename でだけ現れるので、
      rename 要求を出す前の失敗（接続・ログインの失敗、.tmp の転送中の失敗）は「未着の確定」とする。
      未着の確定なら送信待ちキュー（data/outbound/orders/）に保持したまま、5 分間隔で最大 3 回再試行する。
      rename 要求を出した後に完了応答を得られない場合は、届いたかどうかを「不明」とし、自動再送を止める。
      問屋側は取込後に確定ファイルを移動・削除することがあるので、一覧に確定名がないことを未着の根拠にしない。
      22:00 までに完了しない場合も自動再送を止める。すべての試行が未着の確定なら店主代表（PO）が電話発注し、
      CSV を data/outbound/orders/phoned/ へ移して後から自動送信しない。
      不明の場合は電話発注の前に、PO が問屋へ CSV の受領有無を電話で確認する。受領済みなら電話発注せず CSV を
      data/outbound/orders/sent/ へ移す。未受領、または問屋が受領した CSV の取消に応じた場合だけ電話発注し、
      CSV を phoned/ へ移す。問屋が確認できない間は電話発注も再送もしない。
```

### 3.2. 複数ファイル・正本参照の例（取引状態・販売実績控え JSON 連携）

同一実行サイクル内で複数の状態・証跡ファイルを協調更新し、データ構造の正本が別スキーマに存在する場合は、`files` 配列にファイルごとの `writer`・`reader`・`schema_ref`・`required_fields` を定義し、`schema.references` で正本を参照して全フィールドの再掲を避ける。

```yaml
# specdojo-schema: none reason=no-ifx-file-schema
x-spec-meta:
  id: ifx-file-kinuya-sales-evidence
  type: api
  status: draft
  title: 駄菓子屋きぬや 取引状態・販売実績控えファイル連携仕様
  rulebook: specdojo:ifx-file-rulebook
  based_on:
    - specdojo:clis-sample

# _ASSUMPTION_: [[specdojo:clis-sample|販売管理 CLI 仕様]] の各サブコマンド実行時に、
# 進行中の取引状態と確定後の販売実績控え（エビデンス）をローカルで授受・照合する契約例。
# CLI 内部の取引記録は外部 I/F 一覧の登録対象外のため、ifx-index の spec_ref からは参照せず、
# 販売管理 CLI 仕様の入出力表（kinuya-session-schema / kinuya-sales-record-schema）から本契約へ辿る。
# 構造の正本は店舗アプリの schemas/ 配下の JSON Schema とし、その内容例を本書「参照する正本スキーマの例と検証」に示す。
# 技術メンター（ARC）が正本分離と atomic_write 方式を管理し、PO が ready 昇格を判断する。

files:
  - name: current-tx.json
    naming_rule: current-tx.json
    location: <store-data-dir>/.session/current-tx.json
    description: >-
      進行中の現金販売取引の明細・金額集計・会計要求状態を保持し、
      コマンド間での状態引き継ぎ、二重開始防止、および中断時の再開判定に用いる状態ファイル。
    writer: 販売管理 CLI（sales start で新規生成、sales add / complete でアトミック更新、会計確定または open での cancel で削除）
    reader: 販売管理 CLI（各サブコマンド起動時の状態検証・再開判定）および店主代表・開発担当（障害時の状態照合）
    format: JSON
    encoding: UTF-8
    schema_ref: schemas/kinuya-session.schema.json
    required_fields:
      - schema_version
      - tx_id
      - started_at
      - status
      - line_items
      - subtotal_yen
      - tax_yen
      - total_yen

  - name: TX-YYYYMMDD-NNNN.json
    naming_rule: TX-<YYYYMMDD>-<NNNN>.json
    location: <store-data-dir>/data/sales/TX-<YYYYMMDD>-<NNNN>.json
    description: >-
      会計確定要求時の販売実績明細（商品・単価・数量）と金額集計、預かり金・釣銭、本部売上登録 API の受付結果、
      およびレシート印字状態を記録する証跡（エビデンス）ファイル。current-tx.json の削除後も明細の正本として残し、
      販売管理 CLI は会計確定後に削除・上書きしない（受付結果と印字状態の更新を除く）。
    writer: 販売管理 CLI（sales complete の送信前に pending で新規生成し、本部受付応答受領・receipt-print 実行後にアトミック更新）
    reader: 販売管理 CLI（二重送信抑止・回復照合）、店主代表（PO）・開発担当（DEV）（通信失敗・印字未完了時の照合）
    format: JSON
    encoding: UTF-8
    schema_ref: schemas/kinuya-sales-record.schema.json
    required_fields:
      - schema_version
      - tx_id
      - business_date
      - seq_no
      - line_items
      - subtotal_yen
      - tax_yen
      - total_yen
      - tendered_yen
      - change_yen
      - api_sync_status
      - print_status
      - recorded_at

source: 店舗端末の販売管理 CLI（sales start / add / total / complete / cancel）
target: 店舗端末の販売管理 CLI（後続サブコマンド・回復照合処理）および店頭運用・保守確認
direction: bidirectional
format: JSON
timing: >-
  取引開始時、明細追加時、会計確定要求前後、本部売上登録応答受領時、
  レシート印字完了後、および中断・障害後の再開照合時

transport:
  method: ローカルファイルシステム
  endpoint: <store-data-dir>/（.session/ および data/sales/）
  frequency: 取引操作ごとに都度
  atomic_write: >-
    各ファイルは同一ディレクトリ内の一時ファイル（.tmp）へ書き込んで fsync し、renameSync で置換した後に
    ディレクトリも fsync する。sales complete は次の順に書き、前の段の永続化を確かめてから次へ進む。
    (1) current-tx.json の明細と金額を写した TX-*.json を api_sync_status pending で書く。
    (2) current-tx.json の status を payment_requested にする。
    (3) 本部売上登録 API へ送り、応答で TX-*.json の api_sync_status を accepted / rejected / unknown にする。
    rejected なら「売上登録失敗（exit code 3）」、unknown なら「売上登録結果不明（exit code 3）」で停止し、
    current-tx.json と TX-*.json をどちらも保持する。(4) と (5) へは進まない。
    (4) accepted の永続化を確かめた後だけ receipt-print を実行し、TX-*.json の print_status を更新する。
    (5) TX-*.json が accepted で永続化されていることを確かめた場合だけ current-tx.json を削除する。
    本部へ送るのは (2) の後に限るので、status が open なら未送信と判定できる。
    途中で止まったファイルの組み合わせの扱いは本書「会計確定の書き込み順序と再開判定」に従う。

schema:
  json:
    root_type: object
    content_type: application/json
    encoding: UTF-8
  references:
    session_schema: schemas/kinuya-session.schema.json
    sales_record_schema: schemas/kinuya-sales-record.schema.json

error_handling:
  missing:
    current_tx_json:
      action: >-
        sales start 実行時に存在しない場合は、生成の前に data/sales/ の控えを検査する。
        api_sync_status が pending / unknown / rejected の控えが 1 件でもあれば生成せず、
        「売上登録結果不明（exit code 3）」で停止して店主代表（PO）と開発担当（DEV）の本部受付照合へ引き継ぐ。
        未解決の控えがない場合だけ新規取引として生成する。
        sales add / total / complete / cancel 実行時に欠落している場合は「取引未開始（exit code 2）」として停止し、
        空の状態ファイルを自動生成しない。
    sales_record_json:
      action: >-
        会計要求後の回復照合時に該当取引の控えファイルが欠落している場合は、未登録と即断せず
        current-tx.json を保持したまま「売上登録結果不明（exit code 3）」として停止し、
        店主代表（PO）と開発担当（DEV）による本部受付照会へ引き継ぐ。

  malformed:
    current_tx_json:
      action: >-
        JSON 構文不正または required_fields 欠落を検知した場合は、二重会計や明細消失を防ぐため
        「取引記録破損（exit code 2）」として即時停止し、破損ファイルを削除・強制初期化せず保持して
        店主代表（PO）と開発担当（DEV）の照合へ引き継ぐ。
    sales_record_json:
      action: >-
        JSON 解析失敗またはスキーマ不整合を検知した場合は、自動再送や上書きを行わず
        破損ファイルを data/quarantine/ へ退避コピーしたうえで元ファイルを保持し、
        開発担当（DEV）の調査と店主代表（PO）の本部受付照合を促す。

  transport_failure:
    io_error:
      action: >-
        ディスク容量不足、書き込み権限不足、ファイルロック競合等の I/O エラー発生時は、
        標準エラー出力に対象パス・取引番号・受付状態を出力して即時異常停止（exit code 4）させ、
        確定済み売上の再登録を行わずに開発担当（DEV）の環境復旧へ引き継ぐ。
```

### 3.3. 参照する正本スキーマの例と検証

「複数ファイル・正本参照の例（取引状態・販売実績控え JSON 連携）」の `schema_ref` が指す正本の内容例を示す。項目の追加・型の変更はこの正本で行い、同節の YAML には `required_fields` だけを残す。どちらも JSON Schema 2020-12 で書き、`additionalProperties: false` で未定義の項目を拒否する。

`schemas/kinuya-session.schema.json`（進行中の取引状態）:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "kinuya-session-schema",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "tx_id",
    "started_at",
    "status",
    "line_items",
    "subtotal_yen",
    "tax_yen",
    "total_yen"
  ],
  "properties": {
    "schema_version": { "const": 1 },
    "tx_id": { "type": "string", "pattern": "^TX-\\d{8}-\\d{4}$" },
    "started_at": { "type": "string", "format": "date-time" },
    "status": { "enum": ["open", "payment_requested"] },
    "line_items": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["product_code", "product_name", "unit_price_yen", "quantity"],
        "properties": {
          "product_code": { "type": "string", "maxLength": 14 },
          "product_name": { "type": "string", "minLength": 1 },
          "unit_price_yen": { "type": "integer", "minimum": 0 },
          "quantity": { "type": "integer", "minimum": 1, "maximum": 99 }
        }
      }
    },
    "subtotal_yen": { "type": "integer", "minimum": 0 },
    "tax_yen": { "type": "integer", "minimum": 0 },
    "total_yen": { "type": "integer", "minimum": 0 }
  },
  "if": { "properties": { "status": { "const": "payment_requested" } } },
  "then": { "properties": { "line_items": { "minItems": 1 } } }
}
```

`schemas/kinuya-sales-record.schema.json`（販売実績控え）:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "kinuya-sales-record-schema",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "tx_id",
    "business_date",
    "seq_no",
    "line_items",
    "subtotal_yen",
    "tax_yen",
    "total_yen",
    "tendered_yen",
    "change_yen",
    "api_sync_status",
    "print_status",
    "recorded_at"
  ],
  "properties": {
    "schema_version": { "const": 1 },
    "tx_id": { "type": "string", "pattern": "^TX-\\d{8}-\\d{4}$" },
    "business_date": { "type": "string", "format": "date" },
    "seq_no": { "type": "integer", "minimum": 1, "maximum": 9999 },
    "line_items": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["product_code", "product_name", "unit_price_yen", "quantity"],
        "properties": {
          "product_code": { "type": "string", "maxLength": 14 },
          "product_name": { "type": "string", "minLength": 1 },
          "unit_price_yen": { "type": "integer", "minimum": 0 },
          "quantity": { "type": "integer", "minimum": 1, "maximum": 99 }
        }
      }
    },
    "subtotal_yen": { "type": "integer", "minimum": 0 },
    "tax_yen": { "type": "integer", "minimum": 0 },
    "total_yen": { "type": "integer", "minimum": 0 },
    "tendered_yen": { "type": "integer", "minimum": 0 },
    "change_yen": { "type": "integer", "minimum": 0 },
    "api_sync_status": { "enum": ["pending", "accepted", "rejected", "unknown"] },
    "print_status": { "enum": ["not_requested", "printed", "failed", "unknown"] },
    "recorded_at": { "type": "string", "format": "date-time" }
  },
  "if": { "properties": { "api_sync_status": { "not": { "const": "accepted" } } } },
  "then": { "properties": { "print_status": { "const": "not_requested" } } }
}
```

状態値の意味と組み合わせは次のとおり。`current-tx.json` は会計確定（本部受付と控え保存の確認後）または `open` での取消で削除するため、`status` は未解決の 2 値だけを持つ。明細は送信前に控えの `line_items` へ写すので、`current-tx.json` の削除後も控えから品目・単価・数量を確認できる。印字は会計確定後に限るので、`api_sync_status` が `accepted` 以外なら `print_status` は `not_requested` に限る。`tendered_yen - total_yen = change_yen` の一致はスキーマで表せないため、読み手の CLI が追加で検査し、不一致は `malformed` とする。

| 項目              | 値                          | 意味と扱い                                                                              |
| ----------------- | --------------------------- | --------------------------------------------------------------------------------------- |
| `status`          | `open`                      | 明細追加中。`sales add` / `total` / `cancel` を受け付ける                               |
| `status`          | `payment_requested`         | 控えを `pending` で保存した後、本部へ送る前に書く。送信済みの可能性があるため取消は不可 |
| `api_sync_status` | `pending`                   | 送信前に控えを保存した状態。送信済みかどうかは `current-tx.json` の `status` で判定する |
| `api_sync_status` | `accepted`                  | 本部が受付を返した。会計確定済みで、再送しない                                          |
| `api_sync_status` | `rejected`                  | 本部が拒否を返した。未受付と確認済みで、原因を直した後だけ同じ取引を再送できる          |
| `api_sync_status` | `unknown`                   | 接続不能・時間切れで受付結果が不明。未登録と断定せず、本部受付の照会まで保留する        |
| `print_status`    | `not_requested` / `printed` | 印字前、または印字完了                                                                  |
| `print_status`    | `failed` / `unknown`        | 印字未完了の警告。会計は維持し、保存済みレシートだけを再印刷する                        |

検証は JSON Schema 2020-12 に対応したバリデータ（`format` の検査を有効にする）で、`current-tx.json` を `kinuya-session-schema`、`TX-*.json` を `kinuya-sales-record-schema` に照らして行う。`QE` は次の受入ケースで期待結果を確認する。

| ケース             | 対象と入力の要点                                                                                           | 期待結果                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 正常（明細追加）   | `current-tx.json`、`status: open`、明細 1 件、`total_yen` が明細と税の合計                                 | スキーマ適合。`sales add` / `total` を継続できる                      |
| 正常（会計確定）   | `TX-*.json`、明細 1 件、`api_sync_status: accepted`、`print_status: printed`、釣銭が一致                   | スキーマ適合。`current-tx.json` は削除済みで、明細は控えに残る        |
| 不正（控えの明細） | `TX-*.json` から `line_items` を除く                                                                       | スキーマ不適合。`malformed` として退避し照合へ引き継ぐ                |
| 不正（必須欠落）   | `current-tx.json` から `status` を除く                                                                     | スキーマ不適合。`malformed` として「取引記録破損（exit code 2）」     |
| 不正（状態値）     | `current-tx.json`、`status: completed`                                                                     | スキーマ不適合（`enum` 違反）。`malformed` として扱う                 |
| 不正（組み合わせ） | `TX-*.json`、`api_sync_status: unknown`、`print_status: printed`                                           | スキーマ不適合（`then` 違反）。`malformed` として退避し照合へ引き継ぐ |
| 未解決             | `TX-*.json` が `api_sync_status: unknown`、`current-tx.json` が同じ `tx_id` で `status: payment_requested` | スキーマ適合だが未解決。新規取引を始めず、本部受付の照会を待つ        |

### 3.4. 会計確定の書き込み順序と再開判定

`sales complete` の途中で止まった後、次に起動した CLI は `current-tx.json` と同じ `tx_id` の控えの組み合わせで次のように判定する。書き込み順序は「複数ファイル・正本参照の例（取引状態・販売実績控え JSON 連携）」の `atomic_write` を正とする。

| `current-tx.json` の `status` | 控えの状態                                  | 判定と CLI の扱い                                                                                                                  |
| ----------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `open`                        | なし                                        | 明細追加中。通常どおり受け付ける                                                                                                   |
| `open`                        | `pending`                                   | 送信前に停止した（未送信が確定）。`sales complete` は控えを作り直して続ける。`sales add` / `cancel` は先に控えを削除してから進める |
| `payment_requested`           | `pending`                                   | 送信したかどうか不明。控えを `unknown` にして「売上登録結果不明（exit code 3）」で停止し、本部受付の照会を待つ                     |
| `payment_requested`           | `unknown`                                   | 本部受付の照会を待つ。照会の結果で `accepted` または `rejected` にする                                                             |
| `payment_requested`           | `rejected`                                  | 未受付が確定。原因を直した後だけ同じ `tx_id` で再送する                                                                            |
| `payment_requested`           | `accepted`（`print_status: not_requested`） | 印字したかどうか不明。`print_status` を `unknown` にして警告し、`current-tx.json` を削除する。再印刷は保存済みレシートだけで行う   |
| `payment_requested`           | `accepted`（`not_requested` 以外）          | 削除の前に停止した。`current-tx.json` を削除して会計確定とする                                                                     |
| `payment_requested`           | なし                                        | 書き込み順序と矛盾する。`missing` の `sales_record_json` に従い exit code 3 で停止する                                             |
| なし                          | `accepted`                                  | 会計確定済み。新規取引を受け付ける                                                                                                 |
| なし                          | `pending` / `unknown` / `rejected`          | 書き込み順序と矛盾する。「取引状態の欠落」の扱いに従い、本部受付と照合するまで新規取引を始めない                                   |

## 4. 異常時の判断と利用者の次の手

YAML 内の `error_handling` に基づき、店頭での業務継続と二重処理防止のために利用者が行う判断と回復確認を次表に整理する。

| 事象・区分                                                       | 業務継続・再実行の判断基準                                                                                             | 利用者（店主代表・家族利用者代表・開発担当）の次の手と回復確認                                                                                                                                                             |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 週次発注 CSV の未生成（`missing`）                               | 日曜 21:45 に確定ファイルがなければ、手動再実行を 1 回だけ行う。22:00 までに転送完了しなければ転送失敗と同じ判断に移る | 店主代表（`PO`）が未生成警告を見て発注バッチを再実行し、22:00 までに送信完了しない場合は転送失敗の行に従い、確定済み発注候補の控えをもとに電話発注する                                                                     |
| 週次発注 CSV の転送失敗（`transport_failure`）                   | rename 要求前の失敗（未着の確定）は自動再試行（5 分間隔・最大 3 回）を待つ。rename 要求後の失敗は不明として再送しない  | 店主代表が Wi-Fi 通信状態を確認する。未着が確定なら電話発注する。不明なら問屋へ受領有無を確かめ、未受領か取消済みのときだけ電話発注して CSV を `phoned/` へ移し、受領済みなら `sent/` へ移す                               |
| 週次発注 CSV の形式不正（`malformed`）                           | 隔離された破損ファイルはそのまま送信せず、マスタ・数量の訂正後に再生成する                                             | 開発担当（`DEV`）が `data/quarantine/` のログから不正行を特定・修正し、同行レビュー担当（`QE`）と再生成結果を確認する                                                                                                      |
| 取引状態の欠落（`current_tx_json` の `missing`、「取引未開始」） | `sales start` が未解決の控えを検査し、1 件でもあれば新規取引を始めずに exit code 3 で停止する                          | 店番担当は `sales total` を使わずに停止し、店主代表と開発担当（`DEV`）が `data/sales/` の当日控えを確認する。未解決の控え（`api_sync_status` が `pending` / `unknown` / `rejected`）を本部受付と照合してから新規取引へ進む |
| 取引の二重開始（`current-tx.json` が既にある、「取引二重開始」） | 既存取引を解決するまで新規取引を開始しない                                                                             | 店番担当が `sales total` で既存明細を確認する。`status: open` なら同じ取引を続けるか取り消し、`payment_requested` なら店主代表が本部受付と `data/sales/` の控えを照合する                                                  |
| 取引状態・販売控えの破損・保存失敗（`malformed` / `io_error`）   | ファイル削除や強制再実行を禁止し、本部受付の有無を照合してから回復手段を選ぶ                                           | 開発担当が容量・権限を復旧し、店主代表が本部受付済みか確認する。受付済みなら控えのみ回復し、未受付時のみ再登録を実施する                                                                                                   |

## 5. メモ / 将来課題

| 項目                                 | 未整備事項と影響                                                                                                                       | 担当・解消条件・引き継ぎ先                                                                                                                                                          |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 次期拡張（週次発注連携）の採否と契約 | 仕入れ先連携は初期スコープ外であり、問屋側の SFTP 接続条件と受領確認（ACK）仕様が未確定                                                | 店主代表（`PO`）が次期フェーズでの着手可否を判断し、着手決定後に `BA` と `DEV` が問屋担当者と接続・ACK 仕様を合意して [[specdojo:ifx-index-sample\|外部システムI/F一覧]] へ追加する |
| ローカル JSON スキーマ正本の配置     | 「参照する正本スキーマの例と検証」の 2 スキーマは内容例であり、店舗アプリの `schemas/` への配置と CLI 仕様の参照名との対応付けが未実施 | 開発担当（`DEV`）がその内容で正本を配置して `ARC` と `atomic_write`・型整合を照合し、同行レビュー担当（`QE`）が同節の受入ケースで検証する                                           |
| 本部売上登録 API との回復照合接続    | `TX-YYYYMMDD-NNNN.json` の `api_sync_status` と照合する `ifx-api-kinuya-sales.yaml` の重複排除・受付照会仕様が未整備                   | `ARC` と `DEV` が本部 API 契約で受付照会方式を確定し、`QE` が受付済み・未受付・結果不明の期待結果を確認するまで自動再送を行わず店頭保留運用を維持する                               |
| Schedule・プロジェクト登録簿への接続 | 正本スキーマ整備、本部受付照合の確認、および次期発注連携の検討課題が学習用 Schedule・プロジェクト登録簿（PJR）に未登録                 | `PM`（開発担当兼務）が外部結合テスト計画の確定前に Schedule へ作業を登録し、結果不明時の二重登録リスクと次期拡張判断を PJR へ起票して `PO` の承認判断へ接続する                     |
