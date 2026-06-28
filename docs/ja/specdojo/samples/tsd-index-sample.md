---
id: tsd-index
type: architecture
status: draft
rulebook: tsd-index-rulebook
---

# [技術スタック定義（TSD Index）](../rulebooks/tsd-index-rulebook.md) サンプル

## 1. 技術スタック一覧

| 区分               | 採用技術        | 担当責務                                     |
| ------------------ | --------------- | -------------------------------------------- |
| 言語               | TypeScript 5.x  | フロントエンド・バックエンドの共通実装言語   |
| ランタイム         | Node.js 22.x    | サーバーサイドの実行環境                     |
| Web フレームワーク | Next.js 14.x    | 販売・在庫・顧客管理画面の提供とサーバー処理 |
| DB                 | PostgreSQL 16.x | 販売履歴・在庫・顧客データの永続化           |
| ORM                | Prisma 5.x      | スキーマ定義・マイグレーション・型安全クエリ |
| コードフォーマット | Prettier 3.x    | TypeScript ファイルの書式統一                |
| テスト             | Vitest 2.x      | ユニットテスト・統合テストの実行環境         |
| ソースコード管理   | GitHub          | リポジトリ管理・レビュー・ブランチ戦略       |
| CI/CD              | GitHub Actions  | テスト自動実行・本番デプロイの自動化         |
| ホスティング       | Fly.io          | 販売管理サービスのコンテナ実行・ルーティング |

## 2. 補足

- DB の詳細設定・バージョン固定手順は `tsd-database.md` を参照。
- ホスティング構成・デプロイ手順は `tsd-hosting.md` を参照。
