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

店主代表と家族利用者代表がタブレット端末で記録した販売実績・在庫データをもとに、外部の駄菓子卸問屋へ週次で発注データを送付（CSV形式）し、地域本部システムへ日次で売上・在庫スナップショット（JSON形式）を連携するための外部ファイル連携仕様である。手書き伝票や電話発注による品切れ・過剰在庫を防ぎ、通信障害時にも店舗運営を継続できるようにする。

## 2. 利用目的と対象ユーザー

| 対象者           | 解決する課題・達成する結果                                   | 確認・合意する内容                                                 |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------------ |
| 店主代表         | 電話やメモでの発注ミス・欠品を減らし、安定した仕入れを行う   | 発注データの締め時刻、送信タイミング、問屋との受領確認手順         |
| 開発担当         | 自動生成された連携ファイルの配置・伝送・エラー検知を実装する | ファイル形式、必須カラム、文字コード、伝送プロトコル、異常時の退避 |
| 同行レビュー担当 | 正常系・異常系の受領判定と回復手順が検証可能か確認する       | 欠落・破損・重複ファイルに対する振る舞い、テスト用入力データ       |

本連携は [[specdojo:prj-overview-sample|プロジェクト概要]] の「欠品削減（月間50%削減）」および「在庫適正化（年間20%削減）」を達成するための施策である。対象は店舗端末から外部ストレージへのファイル生成・送信とし、問屋側の倉庫管理システム内部処理や本部の本格会計システム内部ロジックは対象外とする。

_ASSUMPTION_: 店舗端末は夜間に Wi-Fi 経由で共有クラウドストレージ（SFTP / HTTPS）へ接続できる環境を前提とする。通信遮断時はローカルにファイルを保持し、翌営業日に再送可能な設計とする。

## 3. ファイル連携の流れと運用手順

1. **データ集計と生成**: 店舗端末の販売管理システムは、指定時刻（日次 21:00、週次日曜 21:30）にローカルの SQLite データベースから対象レコードを抽出し、所定のフォーマット（JSON / CSV）で一時ディレクトリにファイルを生成する。
2. **形式検証と確定**: 生成されたファイルの必須項目、行数、チェックサムをローカルで検証し、問題がなければ送信待ちキュー（`data/outbound/`）へ移動する。
3. **安全な伝送（転送）**: SFTP クライアントまたは HTTPS アップローダーが、外部接続先へファイルをアトミック（一時拡張子 `.tmp` で転送後にリネーム）に配置する。
4. **受付確認とアーカイブ**: 外部からの受付完了応答またはステータス確認後、送信済みファイルをローカルのアーカイブディレクトリ（`data/archive/`）へ移動し、30 日間保管する。
5. **異常検知と回復**: 送信失敗や相手先でのフォーマットエラー検知時は、店番担当および開発担当へ通知し、手動再送または問屋への電話確認手順へ引き継ぐ。

## 4. 外部ファイル連携仕様（YAML 正本）

以下は、本システムで実際に運用される外部ファイル連携仕様の YAML 定義である。

### 4.1. 週次発注データ連携仕様（CSV形式）

```yaml
x-spec-meta:
  id: ifx-file-kinuya-orders
  type: api
  status: draft
  title: 駄菓子屋きぬや 週次発注データ連携仕様
  rulebook: specdojo:ifx-file-rulebook
  based_on: []

file:
  name: orders.csv
  naming_rule: orders_YYYYMMDD.csv
  location: /inbound/orders/
  description: 駄菓子卸問屋（丸和商会）へ送付する週次発注データ

source: 駄菓子屋きぬや販売管理システム
target: 丸和商会発注受付システム
direction: source_to_target
format: CSV
timing: 毎週日曜日 21:30（翌朝配送分締め切り前）

transport:
  method: SFTP
  endpoint: sftp.maruwa-dagashi.example.com:/inbound/orders
  frequency: 週次

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

    - name: product_name
      type: string
      description: 商品名（確認用）
      required: true
      example: "チョコバット"
      mapping:
        csv:
          column: product_name

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
    action: 日曜 22:00 までに未生成の場合、店主代表のタブレットへ警告を表示し、手動発注を促す
  malformed:
    action: カラム不足や型不正検知時は送信を中止し、エラーログを記録して前回確定時の控えを保持する
  transport_failure:
    action: SFTP 接続不能時は 15 分間隔で最大 3 回再試行し、回復しない場合は店主代表へ電話発注手順を通知する
```

### 4.2. 日次売上・在庫スナップショット連携仕様（JSON形式）

```yaml
x-spec-meta:
  id: ifx-file-kinuya-inventory-snapshot
  type: api
  status: draft
  title: 駄菓子屋きぬや 日次売上・在庫スナップショット連携仕様
  rulebook: specdojo:ifx-file-rulebook
  based_on: []

file:
  name: inventory_snapshot.json
  naming_rule: snapshot_YYYYMMDD.json
  location: /backup/snapshots/
  description: 地域本部サーバーへ日次バックアップと売上集計のために送付するスナップショット

source: 駄菓子屋きぬや販売管理システム
target: 地域本部集計サーバー
direction: source_to_target
format: JSON
timing: 毎日営業終了後 21:00

transport:
  method: HTTPS
  endpoint: https://api.honbu.example.com/v1/snapshots/upload
  frequency: 日次

schema:
  json:
    root_type: object
    content_type: application/json
    encoding: UTF-8

  fields:
    - name: snapshot_date
      type: date
      description: 集計対象年月日（YYYY-MM-DD）
      required: true
      example: "2026-11-15"
      mapping:
        json:
          pointer: /snapshot_date

    - name: total_sales_amount
      type: integer
      description: 当日現金売上合計金額（税込）
      required: true
      example: 18500
      constraints:
        min: 0
      mapping:
        json:
          pointer: /total_sales_amount

    - name: total_transactions
      type: integer
      description: 当日総取引件数
      required: true
      example: 42
      constraints:
        min: 0
      mapping:
        json:
          pointer: /total_transactions

    - name: items
      type: string
      description: 商品別在庫残数・販売数配列（JSON 配列文字列または階層オブジェクト）
      required: true
      mapping:
        json:
          pointer: /items

error_handling:
  missing:
    action: 営業日にスナップショットが生成されない場合、翌朝端末起動時に未送信通知を表示する
  malformed:
    action: JSON パースエラーや必須項目欠落時は送信キューに残し、破損ファイルとして隔離する
  transport_failure:
    action: ネットワーク未接続時はオフラインキューへ保持し、次回ネットワーク接続時に自動送信する
```

## 5. 入力と出力の要点

### 5.1. 生成・送信ファイル（出力情報）

| 連携名               | ファイル種別       | 格納場所・転送先                   | 主な内容                             | 正本の参照                                | 失敗時の影響                                                 |
| -------------------- | ------------------ | ---------------------------------- | ------------------------------------ | ----------------------------------------- | ------------------------------------------------------------ |
| 週次発注連携         | CSV（UTF-8, CRLF） | 問屋 SFTP サーバ `/inbound/orders` | 商品コード、品名、発注数量           | `ifx-file-kinuya-orders.yaml`             | 発注が間に合わず、火曜日に人気商品が品切れになる恐れがある   |
| 日次スナップショット | JSON（UTF-8）      | 本部 HTTPS `/v1/snapshots/upload`  | 当日売上合計、取引数、商品別在庫残数 | `ifx-file-kinuya-inventory-snapshot.yaml` | 本部での集計が遅延するが、店舗側の翌日営業には直接支障しない |

### 5.2. 受領・読込ファイル（入力情報）

| 連携名                 | ファイル種別 | 取得元                     | 役割・活用内容                                   | 正本の参照                     | 欠損・破損時の扱い                                       |
| ---------------------- | ------------ | -------------------------- | ------------------------------------------------ | ------------------------------ | -------------------------------------------------------- |
| 発注受付確認結果       | JSON         | 問屋 SFTP `/outbound/ack/` | 問屋側での発注受付番号、欠品・取扱終了の通知確認 | `maruwa-order-ack-schema`      | 欠落時は受付未了とみなし、店主代表が電話で受領確認を行う |
| 商品マスタ更新ファイル | CSV          | 本部共有ストレージ         | 新商品・価格改定データの店舗端末への取り込み     | `kinuya-product-master-schema` | 破損時は更新を適用せず、現行マスタで販売を継続する       |

## 6. 異常系の扱いとエラーリカバリ

### 6.1. 異常事象の分類と判定基準

| 区分       | 事象                       | 判定基準                                            | システムの動作                                                        |
| ---------- | -------------------------- | --------------------------------------------------- | --------------------------------------------------------------------- |
| 送信前異常 | ファイル欠落               | 予定刻限（21:30）に生成完了フラグが存在しない       | アラートログ記録、店主端末の画面上に未生成警告ダイアログ表示          |
| 送信前異常 | スキーマ・フォーマット不正 | 必須列の欠落、数値型のパース失敗、空行混入          | 送信キューへの投入を中止し、ファイルを `data/quarantine/` へ隔離      |
| 伝送異常   | 接続タイムアウト・認証拒否 | SFTP / HTTPS の接続確立不可、認証エラー（5 回連続） | 送信キューに保持したまま指数バックオフで再試行、上限到達で停止        |
| 送信後異常 | 二重送信・重複ファイル     | 同一日付の同一命名ファイルが相手先に既に存在        | 相手先の上書きポリシーに従い、更新版は `_rev1` 等のサフィックスを付与 |

### 6.2. 代表的な異常事象と利用者の次の手

| 事象・条件                           | 影響度 | 表示要点                                               | 利用者（店主代表・開発担当）の次の手・回復の確認                                                |
| ------------------------------------ | ------ | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| 発注 CSV 生成失敗                    | 高     | 「発注データ作成に失敗しました（商品コード不正）」     | 開発担当が端末ログを確認して不正商品コードを特定し、店主代表が電話で問屋へ暫定発注を伝える      |
| ネットワーク遮断による SFTP 転送失敗 | 中     | 「問屋サーバーへ接続できませんでした（再試行待機中）」 | 店主代表が Wi-Fi ルーターの電源と通信ランプを確認する。回復すれば自動で再送されることを確認する |
| 本部スナップショット送信失敗         | 低     | 「売上バックアップ未完了（端末内に保存済み）」         | 翌朝端末起動時に自動再送されるため、その日の販売記録はそのまま継続する                          |
| 受領確認ファイル（ACK）の欠落        | 中     | 「問屋からの受領確認が届いていません」                 | 翌朝 09:00 までに届かない場合、店主代表が問屋担当者へ電話し、発注が受理されているか確認する     |

## 7. メモ / 将来課題

| 項目                             | 未整備事項と影響                                                   | 担当・解消条件・引き継ぎ先                                       |
| -------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------- |
| 問屋 ACK 連携仕様                | 問屋側の受領応答形式（ACK JSON）の正式仕様書が未作成               | 開発担当が問屋システム担当者と照合し、正式な IF 仕様書を作成する |
| オフライン長期間継続時の容量制限 | 1 週間以上オフラインが続いた場合の一時ディレクトリ容量逼迫         | 開発担当がローカルストレージの自動パージ・容量監視機能を設計する |
| 暗号化要件（S/MIME / PGP）       | 発注データに個人情報は含まれないが、改ざん防止の暗号化要否が未検討 | 技術メンターと相談し、将来のインターネット直接伝送時に再検討する |
| 電子インボイス対応               | 仕入れ明細の適格請求書要件のファイル連携への反映                   | 店主代表と税理士の確認を経て、BA が将来の要件定義へ組み込む      |
