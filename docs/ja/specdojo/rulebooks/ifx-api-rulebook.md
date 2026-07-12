# 外部API仕様（External API Specification: EAPIS）作成ルール

外部システム（仕入先、会計、物流、決済など）と連携する **1つのREST APIインターフェース**を、**OpenAPI形式**（YAML 1ファイル）で定義します。

EAPIS は ESIL（外部システムIF一覧）から参照される「詳細仕様」です。
ESIL 側の `spec_ref: ifx-api-...` は、このEAPISのID（およびファイル名）と対応させます。

## 1. ファイル規約

- ファイル名: `ifx-api-<短い英小文字ハイフン>.yaml`
- ESILからの参照: `spec_ref: ifx-api-...`（例: `ifx-api-payment`）
- 1ファイル = 1つのAPI（1つの外部連携インターフェース）

## 2. OpenAPIバージョン

- **OpenAPI 3.0.3**（推奨）または **OpenAPI 3.1.x** を利用する
- 本リポジトリでは互換性のため **3.0.3** を第一候補とする

## 3. 記載方針（必須）

- **外部との合意に必要な最小十分**を記載する（内部実装の都合は書かない）
- `paths` は **実際に提供/利用するエンドポイントのみ**定義する
- `operationId` は英字で一意にする（例: `createPayment`）
- スキーマは `components/schemas` に集約し、`$ref` で参照して使い回す
- 認証は `components/securitySchemes` に定義し、`security` で適用する
- **メタ情報は `x-spec-meta` に集約**し、トレーサビリティを確保する
- **payloadのプロパティ名は snake_case を推奨**（例: `order_id`, `payment_status`）

禁止（書かない）:

- DB物理テーブル名・物理カラム名・SQL全文
- 実装クラス/関数名・内部モジュール構成
- UI操作の逐語列挙

## 4. 必須構造（OpenAPI YAML）

最低限、以下を必ず含めます。

- `openapi`
- `info`（`title`を含む）
- `x-spec-meta`（`id`, `type`, `status` を含む）
- `servers`（少なくとも1つ）
- `paths`（少なくとも1つ）

## 4.1 メタ情報（x-spec-meta）

仕様のトレーサビリティ管理のため、以下を `x-spec-meta` に含めます。

| キー     | 説明                                                 | 必須 |
| -------- | ---------------------------------------------------- | ---- |
| id       | API仕様ID（`ifx-api-...`）、ESILの `spec_ref` と対応 | ○    |
| type     | `api` 固定                                           | ○    |
| status   | `draft` / `ready` / `deprecated`                     | ○    |
| based_on | 根拠となる他仕様のIDリスト（例: `["ifx-api-auth"]`） | 任意 |

## 5. エラー定義（推奨）

外部連携では、少なくとも以下のエラーレスポンスを定義します。

- `400`（入力不正）
- `401`（認証）/ `403`（認可）
- `404`（リソースなし）
- `409`（競合）
- `429`（レート制限）
- `500`（内部エラー）

共通形式（例: `components/schemas/ErrorResponse`）を用意し、各operationから参照する運用を推奨します。

## 6. サンプル（OpenAPI YAML）

以下は「1つの外部REST API」を表す最小サンプルです。

- 参照先: [[ifx-api-sample]]
