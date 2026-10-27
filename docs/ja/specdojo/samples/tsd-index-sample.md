---
specdojo:
  id: specdojo:tsd-index-sample
  type: architecture
  status: draft
  rulebook: specdojo:tsd-index-rulebook
---

# 技術スタック一覧（TSD Index）サンプル

本書は、駄菓子屋きぬや販売管理システムの構築・運用で採用する技術スタックと担当責務を一覧化した技術スタック一覧（TSD Index）のサンプルである。店頭タブレット端末およびサーバー実行基盤に必要な技術と、開発・検証・文書化・運用を支えるツールの対象範囲・版・正本を俯瞰し、詳細な設計・設定手順への導線を提供する。

## 1. 技術スタック一覧

| 区分               | 採用技術       | 担当責務                                                        | 版・正本                                                            | 適用範囲           |
| ------------------ | -------------- | --------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------ |
| 言語               | TypeScript     | フロントエンド・バックエンドの共通実装                          | 5.x / `package.json`（固定版は `package-lock.json`）                | 全環境（必須）     |
| ランタイム         | Node.js        | サーバーサイド処理および開発ツールの実行環境                    | 22.x / `.node-version`、`Dockerfile`                                | 全環境（必須）     |
| Web フレームワーク | Next.js        | 店頭タブレット向けの販売・在庫・つけ管理 UI と API ルートの提供 | 14.x / `package.json`（固定版は `package-lock.json`）               | 全環境（必須）     |
| DB                 | PostgreSQL     | 販売履歴、在庫データ、常連客のつけ残高の永続化                  | 16.x / `Dockerfile`（詳細設定は [[specdojo:tsd-sample\|詳細定義]]） | 本番・開発（必須） |
| ORM                | Prisma         | スキーマ定義、マイグレーション管理、型安全なクエリ実行          | 5.x / `package.json`（固定版は `package-lock.json`）                | 本番・開発（必須） |
| ホスティング       | Fly.io         | Web アプリケーションおよび DB コンテナの実行ホスティング環境    | - / `fly.toml`                                                      | 本番環境（必須）   |
| ソースコード管理   | GitHub         | リポジトリ管理、変更履歴の追跡、プルリクエストによるレビュー    | - / `https://github.com`（SaaS）                                    | 開発環境（必須）   |
| CI/CD              | GitHub Actions | 静的検査・テストの自動実行および本番環境への自動デプロイ        | - / `.github/workflows/`                                            | 開発・運用（必須） |
| テスト             | Vitest         | 売上計算・つけ残高更新ロジックの単体・統合テスト実行            | 2.x / `package.json`（固定版は `package-lock.json`）                | 開発環境（必須）   |
| コードフォーマット | Prettier       | TypeScript・Markdown ファイルの書式・コードスタイルの自動統一   | 3.x / `package.json`（固定版は `package-lock.json`）                | 開発環境（必須）   |
| 静的解析           | ESLint         | TypeScript / JavaScript コードの構文検査と品質規約チェック      | 9.x / `package.json`（固定版は `package-lock.json`）                | 開発環境（任意）   |
| ドキュメント図解   | Mermaid        | 業務フロー図・状態遷移図・構成図のテキスト定義とレンダリング    | 11.x / `package.json`（固定版は `package-lock.json`）               | 文書化（任意）     |
| エラー監視         | Sentry         | 店頭端末および本番環境での例外検知とエラーログ収集              | 8.x / `package.json`（固定版は `package-lock.json`）                | 本番環境（任意）   |

## 2. 補足・詳細への導線

- データベース（PostgreSQL）の詳細設定・接続認証・Prisma 連携・バックアップ手順は、[[specdojo:tsd-sample|データベース詳細定義（TSD）サンプル]] を参照。本サンプルの詳細 TSD の題材として位置づける。
- ホスティング環境（Fly.io）の構成・デプロイ手順は、`tsd-hosting.md` を参照（未作成のため仮置き）。
- CI/CD パイプライン（GitHub Actions）のワークフロー構成・シークレット管理は、`tsd-ci.md` を参照（未作成のため仮置き）。
