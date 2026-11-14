---
specdojo:
  id: specdojo:sysd-index-sample
  type: architecture
  status: draft
  rulebook: specdojo:sysd-index-rulebook
---

# 駄菓子屋きぬや 販売管理 CLI システム設計索引（SYSD Index）

店番担当が販売を記録し、開発担当が会計・保存・印刷の変更先を探せるよう、設計の正本（SSOT: Single Source of Truth）への入口を集約する。詳細な値・構文・構造は各正本へ委ねる。

## 1. 概要（対象範囲・更新責任）

対象は単一店舗・現金販売の CLI `kinuya-pos`、取引・売上・レシートのローカル記録、本部の商品・売上 API との接続、外部印刷コマンドへの依頼である。通常利用のタブレット画面とは別の学習用 CLI を店舗端末1台で人が操作する。会計確定と印字完了を区別し、通信結果不明の取引を未登録と断定しない。通常操作と停止時の引継ぎは [[specdojo:clis-sample|販売管理 CLI 仕様]] を参照する。つけ販売、在庫調整、EC、複数店舗管理、本格会計連携は本索引の対象外である。

_ASSUMPTION_: 以下のコード・schema・script のパスと検証ケースは、完成した索引の粒度を示す架空リポジトリの設定であり、本リポジトリには同梱しない。パス・コマンドの基準はそのリポジトリルートとする。実在する sample へのリンクは記述例の参照であり、架空ファイルの存在や採用技術の合意を示すものではない。

| ロール                      | 更新・確認・承認の対象                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| 技術メンター（ARC / PM）    | ARC として接続境界と索引を更新し、PM として未整備の契約に伴う後続作業と依存関係を管理する |
| 開発担当（DEV）             | CLI、API クライアント、保存 schema、生成・検証コマンドを更新する                          |
| 店舗運営アドバイザー（OPS） | ログ設定、手動照合・再印刷の手順、障害時の引継ぎを更新する                                |
| 同行レビュー担当（QE）      | 正常販売、保存失敗、通信結果不明、印字警告のケースと期待結果を確認する                    |
| 店主代表（PO）              | 結果不明の取引を保留する扱い、運用負担、未決事項の留保と公開可否を承認する                |

略語は、SYSD が System Design（システム設計）、C4 が構成を段階的に示す図法、NFR が Non-Functional Requirements（非機能要件）、OPD / OPR が Operations Policy and Design / Operations Procedure（運用方針・設計 / 運用手順）、DEC が Decision Record（判断記録）を表す。

## 2. SSOT 一覧（表形式）

| 種別               | SSOT（正本）                                                                      | 参照先                                                                                                                                                         | 更新責任  | 検証方法・備考                                                                                                          |
| ------------------ | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| 公開操作・内部 API | CLI 定義。内部 HTTP API は非該当（端末上の CLI のみ）                             | `src/cli/kinuya-pos.ts`、`kinuya-cli-reference`、[[specdojo:clis-sample\|販売管理 CLI 仕様]]                                                                   | DEV / ARC | `npm run typecheck` と `tests/cli/sales.test.ts`。構文・終了コード値はリファレンスを正とする                            |
| 外部 API           | 商品照会・売上登録の契約                                                          | `contracts/products.openapi.yaml`、`contracts/sales.openapi.yaml`、`src/infra/head-office.ts`                                                                  | ARC / DEV | `npm run lint:api`。受付照会・重複排除契約は公開前の未決事項                                                            |
| 非同期連携         | ブローカー・AsyncAPI は非該当（要求・応答による連携）                             | `src/infra/head-office.ts`                                                                                                                                     | ARC / DEV | 結果不明は保存記録と本部受付の照合へ渡す。自動再送を前提にしない                                                        |
| DB schema・移行    | RDBMS・SQL migration は非該当（ファイル保存）。取引・販売控えの schema と移行処理 | `schemas/session.schema.json`（`kinuya-session-schema`）、`schemas/sales-record.schema.json`（`kinuya-sales-record-schema`）、`src/storage/migrate-records.ts` | DEV       | `npm run validate:records` と `tests/storage/migration.test.ts`。旧形式の読込と再移行時の重複なしを確認                 |
| レシート形式       | 保存・印刷に共通のレシート形式（DB の代替となるファイル契約）                     | `schemas/receipt-format.schema.json`（`kinuya-receipt-format-schema`）                                                                                         | DEV / OPS | `npm run validate:records` と `tests/infra/printer.test.ts`。保存済み控えと印刷入力が同じ形式に適合することを確認       |
| モジュール境界     | CLI、取引処理、保存、本部接続、印刷アダプター                                     | `src/cli/`、`src/sales/`、`src/storage/`、`src/infra/`、`eslint.config.js`                                                                                     | ARC / DEV | `npm run lint`。取引処理から直接プリンタを操作しない                                                                    |
| 設定・実行構成     | 店舗設定・環境変数の読込と設定 schema                                             | `config/store-config.yaml`、`schemas/store-config.schema.json`（`kinuya-store-config-schema`）、`src/config/load.ts`                                           | DEV / OPS | `npm run validate:config`。秘密値を表示・ログへ出力しない。設定破損時は停止する                                         |
| 外部コマンド       | 印刷契約とアダプター                                                              | [[specdojo:ifx-cmd-sample\|レシート印刷コマンド連携仕様]]、`src/infra/printer.ts`                                                                              | DEV / OPS | `tests/infra/printer.test.ts` で成功・用紙切れ・時間切れを検証                                                          |
| Job・定期処理      | 非該当（店番担当が対話操作する範囲）                                              | [[specdojo:clis-sample\|販売管理 CLI 仕様]]                                                                                                                    | PO / OPS  | 閉店集計・自動同期の追加は別の要求・運用判断を必要とする                                                                |
| 監視・ログ・通知   | 構造化ログとローカル障害表示。常駐 APM・外部通知は初期例では非該当                | `config/logging.json`、`schemas/audit-event.schema.json`、`src/infra/logger.ts`                                                                                | OPS / DEV | `tests/ops/logging.test.ts`。対象取引・停止原因・照合待ちを残し、秘密値を記録しない。有人確認で運用可能かは PO 承認待ち |
| ソース管理・CI     | ブランチ・PR の統合規約、ワークフロー、ローカル検査設定                           | `docs/development/contributing.md`、`.github/workflows/ci.yml`、`package.json`                                                                                 | DEV / QE  | DEV が PR を作成し、QE の検査確認後に統合する。CI で lint、schema、テスト、ビルドの成功を確認                           |

## 3. 自動生成物（生成コマンド/生成先/閲覧先）

次の生成物は直接編集せず、入力正本を変えて再生成する。取引データや売上控えは業務記録であり、設計から再生成するファイルには含めない。

| 生成物               | 入力元（SSOT）                                                    | 生成コマンド               | 生成先                                   | 閲覧先・更新タイミング                               |
| -------------------- | ----------------------------------------------------------------- | -------------------------- | ---------------------------------------- | ---------------------------------------------------- |
| API クライアント型   | `contracts/products.openapi.yaml`、`contracts/sales.openapi.yaml` | `npm run api:generate`     | `src/generated/api-types.ts`             | IDE と型検査。いずれかの契約変更時に生成             |
| 保存レコード型       | `schemas/session.schema.json`、`schemas/sales-record.schema.json` | `npm run records:generate` | `src/generated/record-types.ts`          | 保存・読込処理。取引・販売控えの schema 変更時に生成 |
| CLI 構文リファレンス | `src/cli/kinuya-pos.ts`                                           | `npm run docs:cli`         | `docs/reference/kinuya-cli-reference.md` | `kinuya-cli-reference`。コマンド定義変更時に生成     |
| 配布 CLI             | `src/`、生成済み型                                                | `npm run build`            | `dist/`                                  | 店舗端末へ導入する配布物。リリース時に生成           |

## 4. 変更の入口（典型ケース）

コマンドは架空リポジトリのルートで実行する。下表は変更時の検証手順であり、実行済みの証跡ではない。テストコマンドは各対象ファイルの全ケース成功、静的検査・生成・ビルドは終了コード `0` を合格とする。

| 変更トリガー                 | 最初に更新する SSOT                                                                                 | 追従する生成物・関連文書                                              | 検証対象ケース・実行コマンド・期待結果                                                                                                                                                                                                                                                              |
| ---------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 本部 API 契約の変更          | `contracts/products.openapi.yaml` または `contracts/sales.openapi.yaml`、`src/infra/head-office.ts` | API 型、販売操作仕様、照合手順                                        | `npm run lint:api`、`npm run api:generate`、`npm run test:integration -- tests/infra/head-office.test.ts`。商品未登録で明細を増やさず、正常受付で同じ取引を1件だけ記録し、売上応答欠落では保持記録を照合待ちにする                                                                                  |
| 保存形式・移行の変更         | `schemas/session.schema.json`、`schemas/sales-record.schema.json`、`src/storage/migrate-records.ts` | 保存レコード型、復旧手順                                              | `npm run records:generate`、`npm run validate:records`、`npm run test:unit -- tests/storage/migration.test.ts tests/storage/recovery.test.ts`。旧形式を読み、再移行で販売記録を重複させない。容量不足・権限拒否で保存に失敗したときは取引番号・保存済み範囲・本部受付状態を残し、売上を再登録しない |
| CLI・設定の変更              | `src/cli/kinuya-pos.ts`、`schemas/store-config.schema.json`                                         | CLI リファレンス、[[specdojo:clis-sample\|販売管理 CLI 仕様]]         | `npm run docs:cli`、`npm run validate:config`、`npm run test:unit -- tests/cli/sales.test.ts`。設定破損で会計要求前に停止し、正常会計では本部受付とローカル保存を確認して完了を表示する                                                                                                             |
| 印刷連携・レシート形式の変更 | 外部印刷契約、`schemas/receipt-format.schema.json`、`src/infra/printer.ts`                          | [[specdojo:ifx-cmd-sample\|レシート印刷コマンド連携仕様]]、再印刷手順 | `npm run validate:records`、`npm run test:integration -- tests/infra/printer.test.ts`。正常時は控えと印字対象が一致し、用紙切れ・時間切れ・結果の対象不一致では警告と控えを残す。結果不明を自動再印刷せず、売上を再送しない                                                                         |
| Job・定期処理の新設          | 別途合意する要求と実行定義（現状は非該当）                                                          | 本索引、運用手順、対象処理のテスト                                    | PO が必要性を判断後、DEV / OPS が検証コマンドと正常・重複起動・失敗保持の期待結果を定義する。未定義のまま導入完了としない                                                                                                                                                                           |
| ログ・通知の変更             | `config/logging.json`、`schemas/audit-event.schema.json`                                            | 障害引継ぎ手順、監視判断記録                                          | `npm run test:unit -- tests/ops/logging.test.ts`。停止原因・対象取引・照合待ちが記録され、認証値を含まない。外部通知導入時は通知先・一次対応も別途受入確認する                                                                                                                                      |
| 正本の移動・廃止             | 移動する定義ファイルと `package.json` の入力パス                                                    | 本索引、生成型、操作仕様、復旧手順、対象テスト、CI                    | DEV が参照元のパスを検索して後継へ更新し、影響する表中の生成・検証コマンドを実行する。旧パス参照が残らず、後継から同じ出力を生成できることを QE が確認する。ARC は設計導線、OPS は運用手順、PM は後続作業を更新する                                                                                 |

全変更で `npm run lint`、`npm run typecheck`、`npm run build` を実行し、型と配布物への影響も確認する。

## 5. 関連ドキュメント導線（C4 / NFR / OPD / DEC 等）

| 区分               | ドキュメント                                                                     | 役割・参照目的                                     | 状態・備考                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| プロジェクト定義   | [[specdojo:prj-overview-sample\|駄菓子屋きぬや プロジェクト概要]]                | 日々の記録を継続する目的と単一店舗の前提を確認する | 例を参照可能。本索引は学習用 CLI の範囲に限定                                                                  |
| 操作仕様           | [[specdojo:clis-sample\|販売管理 CLI 仕様]]                                      | 店番担当の操作、停止理由、結果不明時の引継ぎ       | 例を参照可能。構文・設定・保存の正本は架空リポジトリ側                                                         |
| 外部コマンド契約   | [[specdojo:ifx-cmd-sample\|レシート印刷コマンド連携仕様]]                        | 会計と印刷の責任分界、応答・時間切れの扱い         | 例を参照可能。実機受入は未実施                                                                                 |
| 構成・システム設計 | `kinuya-cxd`、`kinuya-sysd-critical-flows`                                       | 本部・保存・印刷の境界と会計の重要経路             | 未作成。当面は本索引と操作仕様を参照                                                                           |
| 業務・データ契約   | `kinuya-sales-flow`、`ifx-api-kinuya-products.yaml`、`ifx-api-kinuya-sales.yaml` | 商品照会と売上登録・照合契約への接続               | 未作成。API 連携仕様は各 `contracts/` 正本への導線と責任分界を記す予定。構造は転載しない。受付回復の合意は未了 |
| 非機能・運用       | `kinuya-nfr-index`、`kinuya-opd-monitoring`、`kinuya-opr-recovery`               | 停止時の保留、有人監視、復旧と再印刷               | 未作成。有人確認の負担と運用可否が承認待ち                                                                     |
| テスト・判断記録   | `kinuya-test-index`、`kinuya-dec-recovery`                                       | 対象ケースと回復方式の承認記録                     | 未作成。現状は本索引の変更経路をテスト設計の入力にする                                                         |

## 6. 未決事項・変更影響・公開前確認

### 6.1. 未決事項と後続作業への影響

| 項目・対象           | 現状と影響範囲                                                                                                                                                   | 担当ロール          | 解消条件・次アクション                                                                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API の結果照合・回復 | _UNDECIDED_: 受付照会・重複排除・保存失敗後の回復契約が未合意。結果不明の取引は自動再送できない                                                                  | ARC / DEV / PO      | 公開前に契約と回復手順を整え、QE が受付済み・未受付・応答欠落の期待結果を確認する。API 正本、生成型、関連導線を更新                                             |
| 有人監視と通知       | _UNDECIDED_: 常駐監視・外部通知を持たず、店番担当が停止表示とログを確認する構成案。見逃しと参加負荷を評価できていない                                            | OPS / PO            | 店主代表が試行時の確認負担を評価し、公開前に有人方式の可否を判断。通知を追加するなら設定・手順・受入ケースを更新                                                |
| 詳細仕様・記録の索引 | _TODO_: 関連ドキュメント導線で未作成とした構成・業務・非機能・運用・テスト・判断記録がない。現状は本索引と操作・印刷仕様を代替参照とし、詳細設計の確認を保留する | ARC / OPS / QE / PM | 公開前に ARC が構成・業務・非機能、OPS が運用、QE がテストを整備し、PM が後続作業を管理する。ARC は本索引をリンクへ更新し、判断記録に PO の留保・承認結果を残す |
| 印刷の実機受入       | _TODO_: 用紙切れ・時間切れ時の紙面照合、二重印字の可能性を未確認                                                                                                 | DEV / QE / OPS      | 店舗端末で会計再実行なしの控え確認・再印刷を検証し、運用手順へ反映してから公開判断へ渡す                                                                        |

### 6.2. 公開・昇格前の確認条件

- ARC / DEV は架空参照を実案件の正本へ置き換え、API・保存・設定・監視の所在と生成コマンドを確認する。静的検査、対象ケース、ビルドが前記の期待結果を満たす。
- OPS / QE は通信結果不明、保存失敗、印字警告の引継ぎが同じ取引を追跡できることと、有人確認の負担を評価する。
- 人間の店主代表（PO）が回復契約、監視方式、未作成文書の留保可否を判断する。本例は `draft` のままとし、記載した構成案を業務判断の確定として扱わない。
