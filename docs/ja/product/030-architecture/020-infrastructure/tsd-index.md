---
id: tsd-index
type: architecture
status: draft
rulebook: tsd-index-rulebook
---

# SpecDojo 技術スタック定義

SpecDojo が採用する技術の一覧。各技術の担当責務を明示し、設計・実装・運用における前提条件として扱う。

## 1. 技術スタック一覧

| 区分                | 採用技術                                | 担当責務                                           |
| ------------------- | --------------------------------------- | -------------------------------------------------- |
| 言語                | TypeScript 5.x                          | CLI・ドキュメント生成ツールの実装言語              |
| ランタイム          | Node.js 24.x                            | TypeScript の実行環境                              |
| CLI フレームワーク  | Commander.js 12.x                       | コマンドライン引数解析・サブコマンド管理           |
| YAML 処理           | js-yaml 4.x                             | スケジュール定義・設定ファイルの読み書き           |
| 環境変数管理        | dotenv 16.x                             | ローカル開発設定（プロジェクトパス等）の読み込み   |
| スキーマ検証        | AJV 8.x（JSON Schema Draft 2020）       | YAML / JSON のスキーマバリデーション               |
| Markdown lint       | markdownlint-cli 0.45.x                 | Markdown 記法・フォーマット規約チェック            |
| Frontmatter 検証    | remark + remark-lint-frontmatter-schema | Frontmatter スキーマ整合性チェック                 |
| コードフォーマット  | Prettier 3.x                            | Markdown・TypeScript のフォーマット統一            |
| ドキュメントサイト  | VitePress 1.x                           | 仕様書・設計書の HTML ドキュメントビルド・配信     |
| 図解生成            | Mermaid CLI 11.x                        | Mermaid 記法の SVG 変換                            |
| Git フック          | lefthook 2.x                            | `pre-commit` / `pre-push` フック管理               |
| コミット規約        | commitlint（conventional commits）      | コミットメッセージの規約チェック                   |
| AI エージェント実行 | opencode                                | ドキュメント作成・コード生成の AI エージェント実行 |
| ローカル LLM        | Ollama                                  | Host Mac 上でのローカル LLM 実行                   |
| ソースコード管理    | GitHub                                  | リポジトリ管理・GitHub Actions による CI/CD        |
| パッケージ配信      | npm (npmjs.com)                         | `specdojo` CLI のパッケージ公開・配布              |

## 2. 補足

- ローカル LLM の詳細（モデル定義・チューニング）は [tsd-local-llm](tsd-local-llm.md) を参照。
- opencode の設定は [sysd-opencode-settings](../../040-system-design/sysd-opencode-settings.md) を参照。
