---
id: specdojo-project-docs-guide
type: guide
status: draft
---

# SpecDojo プロジェクトドキュメントガイド

## ディレクトリ・ファイル構成

```text
docs/
└── ja/
    └── projects/
        └── prj-0001/ # プロジェクト（ID）
            ├── 010-project-definition/         # プロジェクト定義
            │   ├── prj-overview.md             # プロジェクト概要
            │   ├── prj-charter.md              # プロジェクト憲章
            │   ├── prj-stakeholder-register.md # ステークホルダー登録簿
            │   ├── prj-scope.md                # プロジェクトスコープ
            │   ├── prj-success-criteria-and-acceptance-criteria.md # 成功基準と受入条件
            │   ├── prj-deliverables-catalog.md # 成果物カタログ
            │   ├── prj-issues-and-approach.md  # プロジェクト課題と解決アプローチ
            │   ├── prj-assumptions-constraints-dependencies.md # 前提・制約・依存関係
            │   └── prj-comparison-of-alternatives.md # 代替案の比較
            │
            ├── 020-product-change/                   # プロダクト変更
            │   ├── 010-as-is/                        # 現状定義（As-Is）
            │   │   └── 010-business-specifications/  # 業務仕様
            │   │
            │   ├── 020-impact-analysis/              # 影響調査
            │   │   ├── imp-business.md               # 業務影響
            │   │   ├── imp-data.md                   # データ影響
            │   │   ├── imp-interface.md              # インターフェース影響
            │   │   ├── imp-test.md                   # テスト影響
            │   │   └── imp-operations.md             # 運用影響
            │   │
            │   ├── 030-traceability/                     # トレーサビリティ
            │   │    └── generated/                       # 自動生成成果物
            │   │        ├── trc-requirements-to-specs.md # 要求と仕様のトレース
            │   │        └── trc-requirements-to-tests.md # 要求とテストのトレース
            │   │
            │   └── 040-migration/ # 移行
            │       ├── mip-index.md # 移行計画
            │       ├── dmd-index.md # データ移行設計
            │       ├── mtp-index.md # 移行テスト計画（リハーサル計画）
            │       ├── cop-index.md # カットオーバー計画（本番切替手順）
            │       └── otp-index.md # 運用切替計画（ハイパーケア含む）
            │
            ├── 030-project-management/ # プロジェクトマネジメント
            │   ├── 010-management-plan/ # 管理計画
            │   │   ├── pm-plan.md # プロジェクト管理計画
            │   │   ├── pm-communication-plan.md # コミュニケーション計画
            │   │   ├── pm-quality-management-plan.md # 品質管理計画
            │   │   ├── pm-organization.md # 組織体制とRACI
            │   │
            │   ├── 020-controls/ # 管理台帳
            │   │   ├── pm-risk-register.md # リスク登録簿
            │   │   ├── pm-issue-log.md # 課題ログ
            │   │   └── pm-change-request-log.md # 変更要求ログ
            │   │
            │   │
            │   ├── 040-schedule/ # スケジュール
            │   │   ├── sch-milestones.yaml # マイルストーン定義
            │   │   ├── sch-auth.yaml # スケジュール定義（認証）
            │   │   ├── sch-auth-api.yaml # スケジュール定義（認証API）
            │   │   └── sch-payment.yaml # スケジュール定義（決済）
            │   │
            │   └── 050-reporting/ # レポート
            │       ├── progress-reports/ # 進捗報告
            │       │   ├── pr-2026-03-01-01.md # 進捗報告
            │       │   └── pr-2026-03-08-01.md # 進捗報告
            │       │
            │       └── meeting-minutes/ # 議事録
            │           ├── mm-2026-03-01-01.md # 議事録
            │           └── mm-2026-03-08-01.md # 議事録
            │
            ├── 040-execution/ # 実行管理
            │   ├── exec/ # タスク実行ワークスペース
            │   │   ├── events/ # イベントログ
            │   │   └── .locks/ # 実行ロック
            │   │
            │   └── generated/ # 自動生成成果物
            │
            └── 050-decision-log/ # 決定記録
                ├── dec-0001-auth.md # 決定記録（認証）
                └── dec-0002-payment.md # 決定記録（決済）
```
