---
specdojo:
  id: specdojo:directory-layout-reference
  type: reference
  status: draft
  based_on:
    - specdojo:docs-structure-guide
---

# ディレクトリレイアウトリファレンス

Directory Layout Reference

SpecDojo Unit（1つの `docs/` ルート）配下の、プロジェクトドキュメントとプロダクトドキュメントの標準ディレクトリ構成を、ファイル単位で一覧します。

**対象範囲**

- `docs/ja/projects/<project-id>/` 配下のプロジェクトドキュメント構成
- `docs/ja/product/` 配下のプロダクトドキュメント構成
- 両者が共有する `docs/ja/specdojo/` 配下の実践体系ディレクトリ

**ここで引けるもの**

- 各ドメイン・横断領域のディレクトリと、そこへ置く代表ファイルの配置先

**詳細の参照先**

- 分類・ライフサイクル・命名規約・構成方針（なぜこの配置か）は [ドキュメント構成ガイド](../guides/docs-structure-guide.md) を正本とします。本リファレンスは配置の一覧に徹します。
- 各成果物の目的・推奨ファイル名は [成果物リファレンス](deliverables-reference.md)、CLI 視点のリポジトリ構成は [CLI概要ガイド](../guides/cli-overview-guide.md) を参照してください。

本リファレンスのツリーは代表例です。ディレクトリ名のプレフィックス番号や横断ディレクトリの扱いなどの方針は [ドキュメント構成ガイド](../guides/docs-structure-guide.md) の `ディレクトリ・ファイルの命名ルール` と `プロジェクトドキュメントの構成` を参照してください。実際のパスは `.specdojo/specdojo.config.json` の project 設定で変更できます。

## 1. プロジェクトドキュメントの構成

```text
docs/
├── ja/                                           # 多言語化対応（将来: en/ など）
│   ├── specdojo/
│   │   ├── philosophy/                       # 規約の前提となる方針・概念
│   │   ├── guides/                           # ドキュメント作成ガイド
│   │   ├── references/                       # 一覧・比較のためのリファレンス
│   │   ├── standards/                            # 共通標準・メタ規約
│   │   ├── rulebooks/                            # ドキュメント記述規約
│   │   ├── recipes/                              # 成果物ごとの作成手順
│   │   ├── samples/                              # 成果物の完成例
│   │   ├── templates/                            # 成果物・plan/result の雛形
│   │   ├── schemas/                              # 言語固有の文書構造スキーマ
│   │
│   ├── projects/
│   │   ├── prj-0001/                             # プロジェクト（ID）
│   │   │   ├── 010-deliverables-catalog/         # 成果物カタログ
│   │   │   │   ├── dct-index.md                  # 成果物カタログの索引
│   │   │   │   ├── dct-project-definition.yaml   # プロジェクト定義の成果物カタログ（正本）
│   │   │   │   ├── dct-project-management.yaml   # プロジェクトマネジメントの成果物カタログ（正本）
│   │   │   │   └── generated/                    # 正本から生成される補助一覧
│   │   │   │       ├── dct-project-definition.md
│   │   │   │       └── dct-project-management.md
│   │   │   │
│   │   │   ├── 020-project-definition/           # プロジェクト定義
│   │   │   │   ├── prj-overview.md               # プロジェクト概要
│   │   │   │   ├── prj-stakeholder-register.md   # ステークホルダー登録簿
│   │   │   │   ├── prj-charter.md                # プロジェクト憲章
│   │   │   │   ├── prj-scope.md                  # プロジェクトスコープ
│   │   │   │   ├── prj-success-criteria-and-acceptance-criteria.md # 成功基準と受入条件
│   │   │   │   ├── prj-issues-and-approach.md    # プロジェクト課題と解決アプローチ
│   │   │   │   ├── prj-assumptions-constraints-dependencies.md # 前提・制約・依存関係
│   │   │   │   └── prj-comparison-of-alternatives.md # 代替案の比較
│   │   │   │
│   │   │   ├── 030-project-management/           # プロジェクトマネジメント
│   │   │   │   ├── pm-plan.md                    # プロジェクト管理計画
│   │   │   │   ├── pm-communication-plan.md      # コミュニケーション計画
│   │   │   │   ├── pm-quality-management-plan.md # 品質管理計画
│   │   │   │   ├── pm-review-viewpoints.yaml     # レビュー観点
│   │   │   │   ├── pm-organization.md            # 組織とロールの定義
│   │   │   │   ├── pm-roles.yaml                 # ロール定義
│   │   │   │   ├── pm-members.yaml               # メンバー定義
│   │   │   │   └── pm-raci.md                    # 組織体制とRACI
│   │   │   │
│   │   │   ├── 040-current-state/                # 現状（必要な成果物だけを配置）
│   │   │   │   └── 010-business-specs/          # 現行の業務仕様（例）
│   │   │   │
│   │   │   ├── 050-impact-analysis/              # 影響調査
│   │   │   │   ├── imp-business.md               # 業務影響
│   │   │   │   ├── imp-data.md                   # データ影響
│   │   │   │   ├── imp-interface.md              # インターフェース影響
│   │   │   │   ├── imp-test.md                   # テスト影響
│   │   │   │   └── imp-operations.md             # 運用影響
│   │   │   │
│   │   │   ├── 060-migration-planning/           # 移行計画
│   │   │   │   ├── mip-index.md                  # 移行計画
│   │   │   │   ├── dmd-index.md                  # データ移行設計
│   │   │   │   ├── mtp-index.md                  # 移行テスト計画（リハーサル計画）
│   │   │   │   ├── cop-index.md                  # カットオーバー計画（本番切替手順）
│   │   │   │   └── otp-index.md                  # 運用切替計画（ハイパーケア含む）
│   │   │   │
│   │   │   ├── ...                               # 050- 以降の成果物ドメイン
│   │   │   │
│   │   │   ├── controls/                         # 管理台帳・管理ビュー（全ドメイン横断）
│   │   │   │   ├── project-register/             # 統合管理台帳（正本）
│   │   │   │   │   ├── pjr-index.md              # プロジェクト登録簿
│   │   │   │   │   ├── pjr-0001-auth.md          # 登録項目（認証）
│   │   │   │   │   ├── pjr-0002-payment.md       # 登録項目（決済）
│   │   │   │   │   └── generated/                # 正本から生成される補助一覧
│   │   │   │   │       └── pjr-views.md          # 台帳ビュー（状態別・優先度別・担当者別）
│   │   │   │   │
│   │   │   │   ├── reviews/                      # レビュー結果 ※成果物カタログ管理対象外
│   │   │   │   │
│   │   │   │   └── generated/                    # type別の派生管理ビュー
│   │   │   │       ├── pm-risk-register.md       # type=risk の抽出ビュー
│   │   │   │       ├── pm-issue-log.md           # type=issue の抽出ビュー
│   │   │   │       ├── pm-change-request-log.md  # type=change-request の抽出ビュー
│   │   │   │       ├── pm-decision-log.md        # type=decision の抽出ビュー
│   │   │   │       └── traceability/             # ID参照から生成する任意のトレースビュー
│   │   │   │
│   │   │   ├── schedule/                         # Schedule
│   │   │   │   ├── sch-milestones.yaml           # マイルストーン定義
│   │   │   │   ├── sch-defaults.yaml             # 共通デフォルト設定
│   │   │   │   ├── sch-track-<track>.yaml        # トラックごとのSchedule定義
│   │   │   │   └── sch-strategy-<track>.yaml     # トラックごとのタスク生成戦略
│   │   │   │
│   │   │   ├── routines/                         # 定期実行ルーチン ※成果物カタログ管理対象外
│   │   │   │   └── rtn-<name>.yaml               # ルーチン定義
│   │   │   │
│   │   │   ├── execution/                        # 実行管理 ※成果物カタログ管理対象外
│   │   │   │   ├── exec/                         # タスク実行ワークスペース
│   │   │   │   │   ├── plans/                    # 実行プラン
│   │   │   │   │   ├── results/                  # 実行結果
│   │   │   │   │   ├── events/                   # イベントログ
│   │   │   │   │   └── .locks/                   # 実行ロック
│   │   │   │   └── generated/                    # 自動生成成果物
│   │   │   │
│   │   │   └── reporting/                        # レポート
│   │   │       ├── progress-reports/             # 進捗報告
│   │   │       │   ├── pr-2026-03-01-01.md       # 進捗報告
│   │   │       │   └── pr-2026-03-08-01.md       # 進捗報告
│   │   │       └── meeting-minutes/              # 議事録
│   │   │           ├── mm-2026-03-01-01.md       # 議事録
│   │   │           └── mm-2026-03-08-01.md       # 議事録
│   │   │
│   │   └── prj-0002/ ...                         # 他プロジェクト
│   │
│   └── product/
│
└── en/                                           # 将来の英語ドキュメント用ディレクトリ
```

## 2. プロダクトドキュメントの構成

```text
docs/
├── ja/                                           # 多言語化対応（将来: en/ など）
│   ├── specdojo/
│   │   ├── philosophy/                       # 規約の前提となる方針・概念
│   │   ├── guides/                           # ドキュメント作成ガイド
│   │   ├── references/                       # 一覧・比較のためのリファレンス
│   │   ├── standards/                            # 共通標準・メタ規約
│   │   ├── rulebooks/                            # ドキュメント記述規約
│   │   ├── recipes/                              # 成果物ごとの作成手順
│   │   ├── samples/                              # 成果物の完成例
│   │   ├── templates/                            # 成果物・plan/result の雛形
│   │   ├── schemas/                              # 言語固有の文書構造スキーマ
│   │
│   ├── projects/
│   │   ├── prj-0001/                             # プロジェクト（ID）
│   │   └── prj-0002/ ...                         # 他プロジェクト
│   │
│   └── product/
│       ├── 010-business-specs/                   # 業務仕様
│       │   ├── 010-data-flow/                    # データフロー
│       │   │   └── cdfd-sales-management.md      # 概念データフロー図（例：販売管理）
│       │   ├── 020-data-model/                   # データモデル
│       │   │   ├── bdd-sales-management.md       # 業務データ辞書（例：販売管理）
│       │   │   ├── cdsd-sales-management.md      # 概念データストア定義（例：販売管理）
│       │   │   ├── sld-sales-management.md       # 保管場所定義（例：倉庫・店舗）
│       │   │   ├── stsd-product-lifecycle.md     # ステータス定義（例：商品ライフサイクル）
│       │   │   ├── cld-product-category.md       # 分類定義（例：商品カテゴリ）
│       │   │   ├── ccd-sales-management.md       # 概念クラス図（例：販売管理）
│       │   │   └── cstd-product-lifecycle.md     # 概念状態遷移図（例：商品ライフサイクル）
│       │   ├── 030-business-model/               # 業務モデル
│       │   │   ├── bps-sales-order-flow.md       # 業務プロセス仕様（例：受注フロー）
│       │   │   ├── br-reorder-point.md           # ビジネスルール（例：発注点判定）
│       │   │   ├── bes-index.md                  # 業務イベント仕様（全体構成）（例：販売管理）
│       │   │   └── bes-order-approved.md         # 業務イベント仕様（個別）（例：受注承認）
│       │   ├── 040-interface-model/              # インターフェースモデル
│       │   │   ├── uis-order-entry.md            # 画面仕様（例：受注入力）
│       │   │   └── bds-order-summary.md          # 帳票仕様（例：受注明細）
│       │   └── 050-common/                       # 共通
│       │       ├── sf-index.md                   # システム化機能一覧（全体構成）
│       │       ├── sf-order-entry.md             # システム化機能一覧（個別）（例：受注入力）
│       │       └── gl-sales-management.md        # 用語集（例：販売管理）
│       │
│       ├── 020-external-interface-specs/         # 外部I/F仕様
│       │   ├── ifx-index.yaml                    # 外部システムI/F一覧
│       │   ├── ifx-api-supplier-system.yaml      # 外部API仕様（例：仕入先システム）
│       │   ├── ifx-file-inventory-sync.yaml      # 外部ファイル連携仕様（例：在庫同期）
│       │   └── ifx-msg-stock-changed.yaml        # 外部メッセージ仕様（例：在庫変更通知）
│       │
│       ├── 030-architecture/                     # アーキテクチャ
│       │   ├── 010-c4/                           # C4（構造・依存関係）
│       │   │   ├── cxd-sales-management.md       # C4コンテキスト図（例：販売管理）
│       │   │   ├── cnd-sales-management.md       # C4コンテナ図（例：販売管理）
│       │   │   └── cpd-sales-management.md       # C4コンポーネント図（例：販売管理）
│       │   └── 020-infrastructure/               # インフラ・技術選定
│       │       ├── ifd-production-environment.md # インフラ構成図（例：本番環境）
│       │       └── tsd-sales-management.md       # 技術スタック一覧（例：販売管理）
│       │
│       ├── 040-system-design/                    # システム設計
│       │   ├── sysd-index.md                     # 全体構成（リンク集）
│       │   ├── sysd-critical-flows.md            # 重要フロー
│       │   └── sysd-cross-cutting-policy.md      # 横断ルール
│       │
│       ├── 050-business-acceptance-criteria/     # 業務受入条件
│       │   └── bac-sales-order.md                # 業務受入条件（例：受注）
│       │
│       ├── 060-non-functional-requirements/      # 非機能要件
│       │   ├── nfr-index.md                      # 非機能要件
│       │   ├── nfr-reliability.md                # 非機能要件 / 信頼性
│       │   ├── nfr-availability.md               # 非機能要件 / 可用性
│       │   ├── nfr-maintainability.md            # 非機能要件 / 保守性
│       │   ├── nfr-integrity.md                  # 非機能要件 / 完全性
│       │   ├── nfr-security-safety.md            # 非機能要件 / 機密性・安全性
│       │   ├── nfr-performance.md                # 非機能要件 / 性能
│       │   ├── nfr-operations.md                 # 非機能要件 / 運用
│       │   └── nfr-usability.md                  # 非機能要件 / 操作性
│       │
│       ├── 070-system-acceptance-criteria/       # システム受入条件
│       │   └── sac-sales-management.md           # システム受入条件（例：販売管理）
│       │
│       ├── 080-test-specs/                       # テスト仕様
│       │   ├── 010-test-strategy-and-policy/     # テスト戦略・方針
│       │   │   └── tsp-index.md                  # テスト戦略・方針
│       │   ├── 020-unit-test-catalog/            # 単体テストカタログ
│       │   │   ├── utc-index.md                  # 単体テスト
│       │   │   └── utc-order-service.md          # 単体テスト対象別（例：受注サービス）
│       │   ├── 030-internal-integration-test-catalog/ # 内部結合テストカタログ
│       │   │   ├── itc-index.md                  # 内部結合テスト
│       │   │   └── itc-order-flow.md             # 内部結合テスト対象別（例：受注フロー）
│       │   ├── 040-external-integration-test-catalog/ # 外部結合テストカタログ
│       │   │   ├── etc-index.md                  # 外部結合テスト
│       │   │   └── etc-payment-gateway.md        # 外部結合テスト対象別（例：決済GW）
│       │   ├── 050-system-test-catalog/          # 総合結合テストカタログ
│       │   │   ├── stc-index.md                  # 総合テスト
│       │   │   └── stc-order-to-settlement.md    # 総合テスト対象別（例：受注〜決済）
│       │   └── 060-acceptance-test-catalog/      # 受入結合テストカタログ
│       │       ├── atc-index.md                  # 受入テスト
│       │       └── atc-store-operations.md       # 受入テスト対象別（例：店舗運用）
│       │
│       └── 090-operations/                       # 運用
│           ├── opd-index.md                      # 運用方針・設計
│           ├── opd-monitoring.md                 # 運用方針・設計（監視）（例：アラート運用）
│           ├── opr-index.md                      # 運用手順（例：全体手順）
│           ├── opr-incident.md                   # 運用手順（障害対応）（例：P1対応）
│           └── opr-backup-restore.md             # 運用手順（バックアップ・リストア）（例：復旧演習）
│
└── en/                                           # 将来の英語ドキュメント用ディレクトリ
```
