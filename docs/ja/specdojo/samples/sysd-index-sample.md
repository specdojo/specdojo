---
specdojo:
  id: specdojo:sysd-index-sample
  type: architecture
  status: draft
  rulebook: specdojo:sysd-index-rulebook
  based_on:
    - specdojo:tsd-index-sample
---

# 駄菓子屋きぬや 販売管理システム システム設計索引（SYSD Index）サンプル

本書は、[[specdojo:prj-overview-sample|駄菓子屋きぬや 販売管理システム構築]] におけるシステム設計の正本（SSOT: Single Source of Truth）、自動生成物、変更の入口、および関連仕様への導線を 1 箇所に集約したシステム設計索引（SYSD Index）のサンプルである。コードや宣言的定義ファイルを仕様の正本とする運用（Code as Spec）に基づき、技術メンター（`ARC` / `PM`）、開発担当（`DEV`）、店舗運営アドバイザー（`BA` / `OPS`）、同行レビュー担当（`QE`）、店主代表（`PO`）が迷わず一次情報と検証経路へ到達できる状態を維持する。

## 1. 概要（対象範囲・更新責任）

対象範囲は、店頭タブレットおよびバックオフィスで利用する Web アプリケーション（Next.js）、売上・在庫・常連客の「つけ（掛売）」残高を管理するデータベース（PostgreSQL / Prisma）、閉店後の日次売上集計・データ送信を担う販売管理 CLI（`kinuya-pos`）、レシートプリンター連携、および本番ホスティング・監視基盤（Fly.io / Sentry / GitHub Actions）である。

- **基本方針（Code as Spec）**: API スキーマ、データベーススキーマ、CLI 設定スキーマ、環境変数定義はリポジトリ内の宣言的定義ファイルと型定義を正本（SSOT）とし、本書には転載しない。また、常駐メッセージブローカーのように本システムで採用しない構成要素は、記載漏れと区別するため SSOT 一覧で非該当理由と代替手段を明記する。
- **ロール別の更新・確認・承認責務**:
  - **技術メンター（`ARC` / `PM`）**: システム境界、SSOT 一覧、関連ドキュメント導線の構造整合、および変更計画・依存リスクの管理を担う。
  - **開発担当（`DEV`）**: OpenAPI 定義、Prisma スキーマ・マイグレーション、Next.js / CLI 実装コード、自動生成コマンドの保守を担う。
  - **店舗運営アドバイザー（`BA` / `OPS`）**: 業務データフロー（CDFD）・画面/CLI 仕様との整合確認、日次バッチ・バックアップ・監視設定および運用手順（OPD / OPR）の更新を担う。
  - **同行レビュー担当（`QE`）**: 変更トリガーごとの検証コマンド、単体・結合・システムテスト仕様（UTC / ITC / ETC / STC）の対象ケースと合否基準の確認を担う。
  - **店主代表（`PO`）**: 店舗運用に影響するシステム境界、未決事項の留保判断、および本番公開・`status: ready` 昇格の最終承認を担う。
- **主要略語**: SSOT（Single Source of Truth: 正本）、SYSD（System Design: システム設計）、TSD（Technology Stack Definition: 技術スタック定義）、CDFD（Conceptual Data Flow Diagram: 概念データフロー図）、CDSD（Conceptual Data Store Definition: 概念データストア定義）、IFX（External Interface Specification: 外部インターフェース仕様）、CLIS（CLI Specification: CLI 仕様）、UIS（User Interface Specification: 画面仕様）、NFR（Non-Functional Requirements: 非機能要件）、OPD（Operations Policy and Design: 運用方針・設計）、OPR（Operations Procedure: 運用手順）、DEC（Decision Record: 決定記録）。

## 2. SSOT 一覧（表形式）

| 種別                            | SSOT（正本）                                       | 参照先                                                                                                                                             | 更新責任      | 検証方法・備考                                                                                                                      |
| ------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 内部 Web API 定義               | OpenAPI 3.1 定義ファイル                           | `openapi/internal-pos-api.yaml`、`src/app/api/`                                                                                                    | `DEV` / `ARC` | 店頭タブレット UI と Next.js Route Handlers 間の会計・在庫・つけ残高 API 契約。`npm run lint:openapi` で検証                        |
| 外部 API・ファイル連携定義      | 外部インターフェース仕様（IFX）およびスキーマ      | [[specdojo:ifx-index-sample\|外部I/F一覧]]、[[specdojo:ifx-api-sample\|外部API仕様]]、[[specdojo:ifx-file-sample\|外部ファイル連携仕様]]           | `ARC` / `DEV` | 会計ソフト向け CSV 出力・日次売上集計送信の契約。JSON Schema `schemas/daily-summary.schema.json` で構造検証                         |
| 非同期メッセージ連携定義        | 外部メッセージ仕様（常駐ブローカーは非該当）       | [[specdojo:ifx-msg-sample\|外部メッセージ仕様]]、`src/jobs/outbox-dispatcher.ts`                                                                   | `ARC` / `DEV` | Kafka / RabbitMQ 等の常駐ブローカーは非該当（小規模店舗構成のため PostgreSQL の送信キューテーブルで代替）                           |
| CLI・外部コマンド連携定義       | 販売管理 CLI 仕様・外部コマンド連携仕様            | [[specdojo:clis-sample\|販売管理 CLI 仕様]]、[[specdojo:ifx-cmd-sample\|レシート印刷コマンド連携仕様]]、`src/cli/kinuya-pos.ts`                    | `DEV` / `OPS` | 閉店後の日次売上集計 CLI（`kinuya-pos`）と感熱レシートプリンター起動契約。構文詳細は `docs/spec/cli-command-reference.md`（未作成） |
| データベーススキーマ・移行      | Prisma スキーマおよびマイグレーション履歴          | `prisma/schema.prisma`、`prisma/migrations/*`、[[specdojo:tsd-sample\|DB詳細定義]]、[[specdojo:dmd-sample\|データモデル定義]]                      | `DEV` / `ARC` | 商品、販売明細、在庫移動、つけ台帳のテーブル・制約定義。`npx prisma validate` と `npm run db:migrate:verify` で検証                 |
| モジュール境界・共通ルール      | アプリケーション層構成およびシステム設計横断ルール | `src/domain/`、`src/usecases/`、`src/infra/`、[[specdojo:sysd-cross-cutting-policy-sample\|横断ルール]]、[[specdojo:cpd-sample\|コンポーネント図]] | `ARC` / `DEV` | 冪等キー（`sale_request_id`）、トランザクション境界、例外分類の正本。`npm run lint`（ESLint 境界ルール）で検証                      |
| 設定・環境変数・実行既定値      | 環境変数スキーマおよび CLI 設定ファイル            | `src/config/env.schema.ts`、`config/pos-cli.yaml`、`schemas/pos-cli-config.schema.json`、`.env.example`                                            | `DEV` / `OPS` | 起動時に Zod / JSON Schema で型検証。秘密情報（`DATABASE_URL`、`SENTRY_DSN`）は Fly.io Secrets で管理し Git 非格納                  |
| バッチ・定期処理定義            | 日次集計・バックアップジョブ定義                   | `.github/workflows/nightly-closing.yml`、`scripts/backup-db.sh`、[[specdojo:opr-batch-sample\|バッチ運用手順]]                                     | `OPS` / `DEV` | 閉店後の未送信データ検知、日次バックアップ実行、リトライ上限（最大 3 回）の定義                                                     |
| 監視・エラー検知・監査ログ      | Sentry 設定および構造化監査ログ定義                | `sentry.server.config.ts`、`src/infra/logger.ts`、[[specdojo:opd-monitoring-sample\|監視設計]]、[[specdojo:opr-monitoring-sample\|監視手順]]       | `OPS` / `DEV` | 決済・つけ残高変更の監査ログ（操作者・変更前後金額・`trace_id`）と例外通知閾値の設定                                                |
| ソース管理・CI/CD・デプロイ構成 | Fly.io 構成定義および GitHub Actions ワークフロー  | `fly.toml`、`Dockerfile`、`.github/workflows/ci.yml`、[[specdojo:tsd-index-sample\|技術スタック一覧]]                                              | `DEV` / `OPS` | PR 時の型検査・テスト・マイグレーション検証と `main` ブランチ統合後の本番デプロイ境界                                               |

## 3. 自動生成物（生成コマンド/生成先/閲覧先）

以下のファイルは SSOT からコマンドにより機械生成される派生成果物であり、直接の手編集を禁止する。

| 生成物                     | 入力元（SSOT）                  | 生成コマンド              | 生成先                                  | 閲覧先・更新タイミング                                             |
| -------------------------- | ------------------------------- | ------------------------- | --------------------------------------- | ------------------------------------------------------------------ |
| Prisma Client 型・クエリ層 | `prisma/schema.prisma`          | `npm run db:generate`     | `node_modules/.prisma/client/`          | IDE 型補完・ビルド時参照（スキーマ変更時および `npm ci` 時に生成） |
| 内部 API 型定義            | `openapi/internal-pos-api.yaml` | `npm run api:generate`    | `src/generated/openapi-types.ts`        | フロントエンド・Route Handlers の型参照（OpenAPI 変更時に生成）    |
| OpenAPI HTML リファレンス  | `openapi/internal-pos-api.yaml` | `npm run docs:api`        | `public/docs/api/index.html`            | 開発サーバー `/docs/api/` または CI アーティファクト（PR 時）      |
| 日次売上集計ファイル       | PostgreSQL 販売・つけ台帳データ | `kinuya-pos close --date` | `var/exports/daily-summary-<date>.json` | バックオフィス確認・本部送信控え（毎日の閉店締め操作時に生成）     |

## 4. 変更の入口（典型ケース）

| 変更トリガー                           | 最初に更新する SSOT                                                     | 追従する生成物・関連文書                                                                                               | 検証対象ケース・実行コマンド・期待結果                                                                                                                                   |
| -------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 店頭会計・在庫 API の項目追加・変更    | `openapi/internal-pos-api.yaml`、`src/app/api/`                         | `src/generated/openapi-types.ts`、[[specdojo:uis-sample\|画面仕様]]、[[specdojo:itc-index-sample\|内部結合テスト一覧]] | `npm run lint:openapi`、`npm run api:generate`、`npm run typecheck` が終了コード `0` で通過し、`npm run test:integration -- tests/api/sales.test.ts` が全件成功すること  |
| 売上・在庫・つけ台帳のテーブル構造変更 | `prisma/schema.prisma`、`prisma/migrations/*`                           | [[specdojo:dmd-sample\|データモデル定義]]、[[specdojo:cdsd-sample\|概念データストア定義]]                              | `npx prisma validate` と `npm run db:migrate:verify` が終了コード `0` で完了し、`npm run test:unit -- tests/domain/credit-ledger.test.ts` の残高整合ケースが成功すること |
| 日次売上集計 CLI・出力 JSON 形式の変更 | `schemas/daily-summary.schema.json`、`src/cli/kinuya-pos.ts`            | [[specdojo:clis-sample\|販売管理 CLI 仕様]]、[[specdojo:ifx-file-sample\|外部ファイル連携仕様]]                        | `npm run validate:schema` が違反 `0` 件で通過し、`npm run test:e2e -- tests/cli/daily-close.test.ts` で正常締め・未確定伝票停止・再送冪等ケースが全件成功すること        |
| レシートプリンター連携コマンドの変更   | `config/pos-cli.yaml`、`src/infra/printer-adapter.ts`                   | [[specdojo:ifx-cmd-sample\|レシート印刷コマンド連携仕様]]、[[specdojo:opr-incident-sample\|障害対応手順]]              | `npm run test:integration -- tests/infra/printer.test.ts` で印字成功・用紙切れ（終了コード非ゼロ）時の再印字待機ケースが全件成功すること                                 |
| 監視アラート閾値・バックアップ運用変更 | `sentry.server.config.ts`、`scripts/backup-db.sh`、`.github/workflows/` | [[specdojo:opd-monitoring-sample\|監視設計]]、[[specdojo:opr-backup-restore-sample\|バックアップ・リストア手順]]       | `npm run test:ops -- tests/ops/backup-verify.test.ts` でダンプ生成・リストア整合確認が終了コード `0` で通過し、テスト例外送信が Sentry 開発プロジェクトで検知されること  |

## 5. 関連ドキュメント導線（C4 / NFR / OPD / DEC 等）

| 区分                      | ドキュメント                                                                                                                                                                                           | 役割・参照目的                                                             | 状態・備考                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 技術スタック（TSD）       | [[specdojo:tsd-index-sample\|技術スタック一覧]]、[[specdojo:tsd-sample\|データベース詳細定義]]                                                                                                         | 採用技術・バージョン・担当責務の俯瞰と PostgreSQL 構築・接続設定の参照     | 整備済み（`tsd-hosting.md`、`tsd-ci.md` は未作成）                     |
| アーキテクチャ図（C4）    | [[specdojo:cxd-sample\|システムコンテキスト図]]、[[specdojo:cnd-sample\|コンテナ図]]、[[specdojo:cpd-sample\|コンポーネント図]]、[[specdojo:ifd-sample\|インフラ構成図]]                               | 外部アクター・コンテナ境界・内部コンポーネント責務・配備構成の視覚的確認   | 整備済み                                                               |
| システム設計分冊（SYSD）  | [[specdojo:sysd-critical-flows-sample\|重要フロー]]、[[specdojo:sysd-cross-cutting-policy-sample\|横断ルール]]                                                                                         | 売上確定・在庫減算・つけ計上の冪等/補償フローと例外・ログ・認可原則の確認  | 整備済み                                                               |
| データモデル・ストア      | [[specdojo:dmd-index-sample\|データモデル定義一覧]]、[[specdojo:dmd-sample\|データモデル定義]]、[[specdojo:cdsd-sample\|概念データストア定義]]                                                         | 概念データストア（商品・売上・つけ台帳）と論理・物理テーブル設計の対応確認 | 整備済み                                                               |
| 業務データフロー（CDFD）  | [[specdojo:cdfd-overview-sample\|概念データフロー図（全体概要）]]、[[specdojo:cdfd-uc-sample\|概念データフロー図（ユースケース別）]]                                                                   | 店頭販売・入荷在庫反映・閉店締め処理の業務プロセスとデータ受け渡し境界確認 | 整備済み                                                               |
| UI・CLI・外部連携仕様     | [[specdojo:uis-sample\|画面仕様]]、[[specdojo:clis-sample\|販売管理 CLI 仕様]]、[[specdojo:ifx-index-sample\|外部I/F仕様一覧]]                                                                         | 店頭タブレット画面、閉店後 CLI 操作、外部 API・ファイル・印刷連携契約確認  | 整備済み（CLI 構文正本 `docs/spec/cli-command-reference.md` は未作成） |
| 非機能要件（NFR）         | [[specdojo:nfr-index-sample\|非機能要件一覧]]                                                                                                                                                          | 会計応答性能、オフライン耐性、つけ台帳の整合性・個人情報保護要件の確認     | 整備済み                                                               |
| 運用設計・手順（OPD/OPR） | [[specdojo:opd-index-sample\|運用方針・設計一覧]]、[[specdojo:opr-index-sample\|運用手順一覧]]                                                                                                         | 監視・アクセス管理・障害対応方針と、日次バッチ・バックアップ手順への接続   | 整備済み                                                               |
| テスト仕様                | [[specdojo:utc-index-sample\|単体テスト一覧]]、[[specdojo:itc-index-sample\|内部結合テスト一覧]]、[[specdojo:etc-index-sample\|外部結合テスト一覧]]、[[specdojo:stc-index-sample\|システムテスト一覧]] | 各 SSOT 変更時に検証すべきテストスイートと受入判定基準の追跡               | 整備済み                                                               |
| 設計判断記録（DEC）       | [[specdojo:dec-sample\|決定記録]]                                                                                                                                                                      | PostgreSQL 採用や常駐メッセージブローカー不採用など、構成判断の根拠追跡    | 整備済み                                                               |

## 6. 未決事項・変更影響・公開前確認

### 6.1. 未決事項と後続作業への影響

| 項目・対象                                                       | 現状と影響範囲                                                                                                              | 担当ロール    | 解消条件・次アクション                                                                                              |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------- |
| ホスティング・CI 詳細 TSD（`tsd-hosting.md` / `tsd-ci.md`）      | 未作成。Fly.io のリージョン冗長設定と GitHub Actions Secrets のローテーション手順が `fly.toml` とワークフロー定義のみに依存 | `ARC` / `OPS` | 本番移行リハーサル前に詳細 TSD 2 件を作成し、[[specdojo:tsd-index-sample\|技術スタック一覧]] と本書の導線を更新する |
| CLI コマンドリファレンス（`docs/spec/cli-command-reference.md`） | 未作成。`kinuya-pos` の全フラグ・既定値は `src/cli/kinuya-pos.ts` の `--help` 定義を暫定参照している                        | `DEV`         | CLI オプション確定時にリファレンス文書を生成し、[[specdojo:clis-sample\|販売管理 CLI 仕様]] と本書から接続する      |
| 外部会計連携 API のレート制限・再送間隔（未確定）                | 外部会計サービスの契約プランが未確定のため、日次集計送信の再試行間隔を暫定値（指数バックオフ・最大 3 回）で仮置き           | `PO` / `ARC`  | 店主代表（`PO`）が契約プランを確定後、[[specdojo:ifx-api-sample\|外部API仕様]] と `config/pos-cli.yaml` を更新する  |

### 6.2. 公開・`status: ready` 昇格前の確認条件

- **技術メンター（`ARC`）・開発担当（`DEV`）確認**: SSOT 一覧の全ファイルパスと生成コマンドがリポジトリの実態と一致し、`npm run typecheck`、`npm run lint`、`npx prisma validate` が終了コード `0` で通過していること。
- **店舗運営アドバイザー（`BA` / `OPS`）確認**: 閉店締め CLI、バックアップ、監視通知の運用手順（[[specdojo:opr-index-sample|運用手順一覧]]）と本書の変更トリガーが整合していること。
- **同行レビュー担当（`QE`）確認**: `変更の入口（典型ケース）` に記載された各テストコマンドで対象テストケースが再現可能であり、合否基準がテスト仕様と一致していること。
- **店主代表（`PO`）最終承認**: `未決事項と後続作業への影響` の留保事項（外部会計サービス契約プラン等）の扱いに合意し、人間によるレビューを経て `status: ready` へ昇格すること。
