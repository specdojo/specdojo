---
specdojo:
  id: specdojo:ifx-file-sample
  type: api
  status: draft
  rulebook: specdojo:ifx-file-rulebook
  part_of: []
  based_on: []
---

# 駄菓子屋きぬや 外部ファイル連携仕様 サンプル

## 1. 概要

店主代表（`PO`）と家族利用者代表（`PO` 業務助言）が日々の店頭販売と在庫把握を行う「駄菓子屋きぬや」において、[[specdojo:ifx-file-rulebook|外部ファイル連携仕様作成ルール]] に従う 2 つの代表的なファイル受け渡し契約（**単一ファイル・インライン定義**および**複数ファイル・正本スキーマ参照**）を示す完成例である。外部取引先へ送付するバッチファイルと、店頭 CLI の実行段階間で授受・照合する状態・証跡ファイルの双方について、配置・命名・必須項目・書き手と読み手・失敗時の回復手順を検証可能な形で定義する。

_ASSUMPTION_: [[specdojo:prj-overview-sample|プロジェクト概要]] および [[specdojo:ifx-index-sample|外部システムI/F一覧]] では、初期リリースの対象を店頭販売・在庫・つけ管理とし、仕入れ先とのシステム連携は初期スコープ外としている。本書では、外部取引先との単一ファイル契約（`file` と `schema.fields`）の完成例として次期拡張候補の「週次発注 CSV 連携」（第3.1節）を、初期スコープ内の複数ファイル協調契約（`files` と `schema_ref` / `required_fields`）の完成例として [[specdojo:clis-sample|販売管理 CLI 仕様]] の「取引状態・販売実績控え JSON 連携」（第3.2節）を示す。ロールと体制の正本は [[specdojo:pm-roles-sample|ロール定義]] および [[specdojo:pm-members-sample|メンバー定義]] とする。

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
  location: data/outbound/orders/orders_YYYYMMDD.csv（転送先: /inbound/orders/orders_YYYYMMDD.csv）
  description: 駄菓子卸問屋（丸和商会）へ週次で送付する商品別発注データ
  writer: 店舗端末の発注バッチ処理（毎週日曜 21:30 に確定済み発注候補から生成）
  reader: 丸和商会 発注受付システム（週次バッチ取込および翌朝配送分の出荷引当処理）
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
  atomic_write: 一時ファイル（orders_YYYYMMDD.csv.tmp）で転送完了後に orders_YYYYMMDD.csv へリネーム

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
      description: 店舗コード（きぬやは固定値 KINUYA-01）
      required: true
      example: "KINUYA-01"
      constraints:
        pattern: "^KINUYA-\\d{2}$"
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

    - name: order_quantity
      type: integer
      description: 発注数量（ボールまたは箱単位）
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
      日曜 21:45 までに生成完了フラグが確認できない場合、店舗端末へ未生成警告を表示し、
      店主代表（PO）による手動再実行または問屋への電話発注手順へ切り替える。
  malformed:
    action: >-
      必須列の欠落、文字コード不正、または constraints 違反を検知した場合は SFTP 送信を中止し、
      対象ファイルを data/quarantine/ へ隔離して前回確定済み控えを保持したまま開発担当（DEV）へ通知する。
  transport_failure:
    action: >-
      SFTP 接続タイムアウトまたは転送失敗時は送信待ちキュー（data/outbound/orders/）に保持したまま
      5 分間隔で最大 3 回再試行し、22:00 までに完了しない場合は自動再送を止めて店主代表へ電話発注を促す。
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
    - specdojo:ifx-index-sample

# _ASSUMPTION_: [[specdojo:clis-sample|販売管理 CLI 仕様]] の各サブコマンド実行時に、
# 進行中の取引状態と確定後の販売実績控え（エビデンス）をローカルで授受・照合する契約例。
# 構造の正本は未同梱の架空参照名（kinuya-session-schema, kinuya-sales-record-schema）とし、
# 技術メンター（ARC）が正本分離と atomic_write 方式を管理し、PO が ready 昇格を判断する。

files:
  - name: current-tx.json
    naming_rule: current-tx.json
    location: <store-data-dir>/.session/current-tx.json
    description: >-
      進行中の現金販売取引の明細・金額集計・会計要求状態を保持し、
      コマンド間での状態引き継ぎ、二重開始防止、および中断時の再開判定に用いる状態ファイル。
    writer: 販売管理 CLI（sales start で新規生成、sales add / complete でアトミック更新、完了または確定前 cancel で終了）
    reader: 販売管理 CLI（各サブコマンド起動時の状態検証・再開判定）および店主代表・開発担当（障害時の状態照合）
    format: JSON
    encoding: UTF-8
    schema_ref: kinuya-session-schema#CurrentTransactionSession
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
      会計確定要求時の販売実績明細、預かり金・釣銭、本部売上登録 API の受付結果、
      およびレシート印字状態を記録する証跡（エビデンス）ファイル。
    writer: 販売管理 CLI（sales complete の会計要求・本部受付応答受領・receipt-print 実行後にアトミック更新）
    reader: 販売管理 CLI（二重送信抑止・回復照合）、店主代表（PO）・開発担当（DEV）（通信失敗・印字未完了時の照合）
    format: JSON
    encoding: UTF-8
    schema_ref: kinuya-sales-record-schema#SalesRecordEvidence
    required_fields:
      - schema_version
      - tx_id
      - business_date
      - seq_no
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
  atomic_write: 同一ディレクトリ内の一時ファイル（.tmp）へ書き込み・フラッシュ後に renameSync でアトミック置換を実施

schema:
  json:
    root_type: object
    content_type: application/json
    encoding: UTF-8
  references:
    session_schema: kinuya-session-schema
    sales_record_schema: kinuya-sales-record-schema

error_handling:
  missing:
    current_tx_json:
      action: >-
        sales start 実行時に存在しない場合は新規取引として生成する。
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

## 4. 異常時の判断と利用者の次の手

YAML 内の `error_handling` に基づき、店頭での業務継続と二重処理防止のために利用者が行う判断と回復確認を次表に整理する。

| 事象・区分                                                         | 業務継続・再実行の判断基準                                                       | 利用者（店主代表・家族利用者代表・開発担当）の次の手と回復確認                                                           |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 週次発注 CSV の未生成・転送失敗（`missing` / `transport_failure`） | 締め切り（日曜 22:00）前は再試行を待ち、超過時は自動送信を止めて手動へ切り替える | 店主代表（`PO`）が Wi-Fi 通信状態を確認し、22:00 までに送信完了しない場合は控えをもとに問屋へ電話発注して二重発注を防ぐ  |
| 週次発注 CSV の形式不正（`malformed`）                             | 隔離された破損ファイルはそのまま送信せず、マスタ・数量の訂正後に再生成する       | 開発担当（`DEV`）が `data/quarantine/` のログから不正行を特定・修正し、同行レビュー担当（`QE`）と再生成結果を確認する    |
| 取引状態の欠落・二重開始（`current_tx_json` の状態不整合）         | 未解決の会計がある間は新規取引を開始せず、既存取引の確定状態を先に確認する       | 店番担当が `sales total` で既存明細を確認し、会計要求後なら店主代表が本部受付と `data/sales/` の控えを照合する           |
| 取引状態・販売控えの破損・保存失敗（`malformed` / `io_error`）     | ファイル削除や強制再実行を禁止し、本部受付の有無を照合してから回復手段を選ぶ     | 開発担当が容量・権限を復旧し、店主代表が本部受付済みか確認する。受付済みなら控えのみ回復し、未受付時のみ再登録を実施する |

## 5. メモ / 将来課題

| 項目                                 | 未整備事項と影響                                                                                                       | 担当・解消条件・引き継ぎ先                                                                                                                                                          |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 次期拡張（週次発注連携）の採否と契約 | 仕入れ先連携は初期スコープ外であり、問屋側の SFTP 接続条件と受領確認（ACK）仕様が未確定                                | 店主代表（`PO`）が次期フェーズでの着手可否を判断し、着手決定後に `BA` と `DEV` が問屋担当者と接続・ACK 仕様を合意して [[specdojo:ifx-index-sample\|外部システムI/F一覧]] へ追加する |
| ローカル JSON スキーマ正本の整備     | 第3.2節で参照する `kinuya-session-schema` および `kinuya-sales-record-schema` は未同梱の架空参照名                     | 開発担当（`DEV`）が正本スキーマを作成して `ARC` と `atomic_write`・型整合を照合し、同行レビュー担当（`QE`）が `required_fields` と異常系テストを検証する                            |
| 本部売上登録 API との回復照合接続    | `TX-YYYYMMDD-NNNN.json` の `api_sync_status` と照合する `ifx-api-kinuya-sales.yaml` の重複排除・受付照会仕様が未整備   | `ARC` と `DEV` が本部 API 契約で受付照会方式を確定し、`QE` が受付済み・未受付・結果不明の期待結果を確認するまで自動再送を行わず店頭保留運用を維持する                               |
| Schedule・プロジェクト登録簿への接続 | 正本スキーマ整備、本部受付照合の確認、および次期発注連携の検討課題が学習用 Schedule・プロジェクト登録簿（PJR）に未登録 | `PM`（開発担当兼務）が外部結合テスト計画の確定前に Schedule へ作業を登録し、結果不明時の二重登録リスクと次期拡張判断を PJR へ起票して `PO` の承認判断へ接続する                     |
