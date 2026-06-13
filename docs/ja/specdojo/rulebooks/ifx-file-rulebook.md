# 外部ファイル連携仕様（External File Exchange Specification: EFES）作成ルール

外部システム（仕入先、物流、会計など）と **ファイル連携**するために、ファイルの形式・項目・制約・受け渡し手順を定義します。

EFES は ESIL（外部システムIF一覧）から参照される「詳細仕様」です。
ESIL 側の `spec_ref: ifx-file-...` は、このEFESのID（およびファイル名）と対応させます。

この章では **表ではなく YAML 1ファイル**で EFES を管理します。

対応フォーマット:

- **CSV / TSV**
- **JSON**
- **XML**

## 1. ファイル規約

- ファイル名: `ifx-file-<短い英小文字ハイフン>.yaml`
- ESILからの参照: `spec_ref: ifx-file-...`（例: `ifx-file-orders`）
- 1ファイル = 1つのファイル連携仕様（1つの連携ファイル、または同一契約での複数ファイル群）

## 2. 記載方針（必須）

- **外部との合意に必要な最小十分**を記載する（内部実装の都合は書かない）
- 実ファイルの「**生成/受領の責任境界**」が分かるようにする（送信者/受信者/方向）
- 「どこに置くか/どう受け渡すか」（SFTP/共有ストレージ等）は **概要レベル**に留める
- フォーマットの差異（CSV/TSV/JSON/XML）に応じて、**検証可能な構造定義**を置く
- **メタ情報は `x-spec-meta` に集約**し、トレーサビリティを確保する
- 仕様ファイル（このYAML）のキーは snake_case を用いる

禁止（書かない）:

- DB物理テーブル名・物理カラム名・SQL全文
- 実装クラス/関数名・内部モジュール構成
- UI操作の逐語列挙

## 3. 必須構造（EFES YAML）

最低限、以下を必ず含めます。

- `x-spec-meta`（`id`, `type`, `status` を含む）
- `file`（ファイル名/拡張子/命名規則）
- `direction`（連携方向）
- `format`（`CSV`/`TSV`/`JSON`/`XML`）
- `transport`（受け渡し方法の概要）
- `schema`（フォーマット別の構造定義）

## 3.1 メタ情報（x-spec-meta）

| キー       | 説明                                                   | 必須 |
| ---------- | ------------------------------------------------------ | ---- |
| id         | ファイル仕様ID（`ifx-file-...`）、ESILの `spec_ref` と対応 | ○    |
| type       | `file` 固定                                            | ○    |
| status     | `draft` / `ready` / `deprecated`                       | ○    |
| based_on   | 根拠となる他仕様のIDリスト（例: `["ifx-api-auth"]`）     | 任意 |

## 4. 主要項目

### 4.1 direction（連携方向）

- `source_to_target` / `target_to_source`

※ ESIL の `direction` と同じ語彙で揃えます。

### 4.2 format（ファイルフォーマット）

- `CSV` / `TSV` / `JSON` / `XML`

### 4.3 transport（受け渡し方法）

手段は実環境で変わりやすいため、仕様では以下を最低限にします。

- `method`: `SFTP` / `HTTPS` / `共有ストレージ` / `その他` / `TBD`
- `endpoint`: 接続先の説明（URL/ホスト名/共有パス等。機密値は書かない）
- `frequency`: 連携頻度（例: 日次 02:00、都度、手動）

## 5. schema（フォーマット別の構造定義）

EFES は「構造定義」を機械判読可能にするため、以下のいずれか（または両方）を採用します。

- **フィールド一覧（共通・推奨）**: `schema.fields` で項目を列挙（CSV/TSV/JSON/XMLいずれも対応）
- **厳密スキーマ（任意）**:
  - JSON: `schema.json_schema`（JSON Schema相当をYAMLで記述、または外部参照）
  - XML: `schema.xsd_ref`（XSDへの参照）

### 5.1 schema.fields（共通フィールド定義）

- `schema.fields` は配列
- 各フィールド要素は以下を持つ

| キー        | 説明                                                                       | 必須 |
| ----------- | -------------------------------------------------------------------------- | ---- |
| name        | 項目名（snake_case推奨）                                                   | ○    |
| type        | `string` / `integer` / `number` / `boolean` / `date` / `datetime` / `enum` | ○    |
| description | 項目説明                                                                   | 任意 |
| required    | 必須かどうか（true/false）                                                 | 任意 |
| example     | 例値                                                                       | 任意 |
| constraints | 制約（min/max/pattern等。必要な範囲で）                                    | 任意 |
| enum        | `type: enum` の場合の許容値                                                | 任意 |
| mapping     | フォーマット別の対応付け（CSV列名、JSONパス、XPath等）                     | 任意 |

#### mapping の例

- CSV/TSV: `mapping.csv.column: "order_id"`（ヘッダ名）または `mapping.csv.index: 1`（1始まり）
- JSON: `mapping.json.pointer: "/data/order_id"`（JSON Pointer）
- XML: `mapping.xml.xpath: "/Order/OrderId"`（XPath例）

### 5.2 CSV/TSV 固有

`schema.csv` を定義します。

- `delimiter`: `,`（CSV）/ `\t`（TSV）
- `header`: true/false
- `quote`: `"` など（任意）
- `encoding`: `UTF-8` 推奨
- `line_ending`: `LF` 推奨（必要なら `CRLF`）

### 5.3 JSON 固有

`schema.json` を定義します。

- `root_type`: `object` / `array`
- `content_type`: `application/json`
- `json_schema`: 任意（厳密に縛る場合）

### 5.4 XML 固有

`schema.xml` を定義します。

- `root_element`: ルート要素名
- `namespace`: 任意
- `content_type`: `application/xml`
- `xsd_ref`: 任意（厳密に縛る場合。ファイル名やURLを記載）

## 6. サンプル（CSV）

```yaml
x-spec-meta:
  id: ifx-file-orders
  type: file
  status: draft
  based_on: []

file:
  name: orders.csv
  naming_rule: orders_YYYYMMDD.csv
  description: 発注データ（仕入先へ送付）

source: 受発注管理（コンテナ）
target: 仕入先システム

direction: source_to_target
format: CSV

timing: 発注確定時

transport:
  method: SFTP
  endpoint: supplier-sftp.example.com:/inbound/orders
  frequency: 都度

schema:
  csv:
    delimiter: ','
    header: true
    quote: '"'
    encoding: UTF-8
    line_ending: LF

  fields:
    - name: order_id
      type: string
      description: 発注ID
      required: true
      example: ORD-0001
      mapping:
        csv:
          column: order_id

    - name: ordered_at
      type: datetime
      description: 発注日時（RFC3339）
      required: true
      example: 2025-12-24T12:34:56Z
      mapping:
        csv:
          column: ordered_at

    - name: total_amount
      type: integer
      description: 合計金額
      required: true
      example: 1200
      constraints:
        min: 0
      mapping:
        csv:
          column: total_amount
```

## 7. サンプル（JSON）

```yaml
x-spec-meta:
  id: ifx-file-inventory-snapshot
  type: file
  status: draft
  based_on: []

file:
  name: inventory.json
  naming_rule: inventory_YYYYMMDD.json
  description: 在庫スナップショット

source: 在庫（コンテナ）
target: 物流システム

direction: source_to_target
format: JSON

timing: 日次集計後

transport:
  method: HTTPS
  endpoint: https://logistics.example.com/upload
  frequency: 日次 02:00

schema:
  json:
    root_type: object
    content_type: application/json

  fields:
    - name: snapshot_date
      type: date
      required: true
      example: 2025-12-24
      mapping:
        json:
          pointer: /snapshot_date

    - name: items
      type: string
      description: 明細配列（厳密に縛る場合は json_schema を使用）
      required: true
      mapping:
        json:
          pointer: /items
```

## 8. サンプル（XML）

```yaml
x-spec-meta:
  id: ifx-file-payment-result
  type: file
  status: draft
  based_on: []

file:
  name: payment_result.xml
  naming_rule: payment_result_YYYYMMDDHHmmss.xml
  description: 決済結果（外部→当社）

source: 決済サービス
target: 決済（コンテナ）

direction: target_to_source
format: XML

timing: 決済結果通知

transport:
  method: 共有ストレージ
  endpoint: /shared/payment/result
  frequency: 都度

schema:
  xml:
    root_element: PaymentResult
    namespace: TBD
    content_type: application/xml
    xsd_ref: TBD

  fields:
    - name: payment_id
      type: string
      required: true
      mapping:
        xml:
          xpath: /PaymentResult/PaymentId

    - name: status
      type: enum
      required: true
      enum: [PENDING, PAID, FAILED]
      mapping:
        xml:
          xpath: /PaymentResult/Status
```
