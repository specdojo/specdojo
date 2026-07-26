# SpecDojo

SpecDojo は、**仕様駆動開発のためのドキュメントフレームワーク**です。
プロダクトの構築・改修に必要な情報を体系化し、記述規約、サンプル、テンプレート、CLI を通じて、プロジェクトの定義から実行・レビューまでを支援します。

人が内容と判断理由を理解でき、生成 AI とツールが成果物を安定して作成・検証・更新できるドキュメント体系を目指しています。

## はじめに

初めて SpecDojo に触れる場合は、次の順に読むと全体像をつかめます。

1. [全体概要ガイド](./specdojo/guides/specdojo-overview-guide.md)：SpecDojo の目的、文書体系、成果物から実行管理までの流れを説明します。
2. [ドキュメント構成ガイド](./specdojo/guides/docs-structure-guide.md)：プロダクト文書とプロジェクト文書の分類、配置を説明します。
3. [ドキュメント作成順ガイド](./specdojo/guides/docs-authoring-order-guide.md)：プロジェクトで成果物を検討・作成する順序を説明します。

CLI による実行管理から確認したい場合は、[CLI概要ガイド](./specdojo/guides/specdojo-cli-overview-guide.md)から始めてください。

## 目的から探す

### SpecDojoの考え方を理解する

| 知りたいこと                           | 参照先                                                                                         |
| -------------------------------------- | ---------------------------------------------------------------------------------------------- |
| SpecDojo 全体の構成と流れ              | [全体概要ガイド](./specdojo/guides/specdojo-overview-guide.md)                                 |
| ドキュメンテーションの原則             | [ドキュメンテーションポリシーガイド](./specdojo/guides/specdojo-documentation-policy-guide.md) |
| 要求・要件・仕様・設計・実装の違い     | [ドキュメントフェーズ概要ガイド](./specdojo/guides/docs-phases-overview-guide.md)              |
| プロダクト文書とプロジェクト文書の構造 | [ドキュメント構成ガイド](./specdojo/guides/docs-structure-guide.md)                            |

### 作成する成果物を決める

| やりたいこと                                   | 参照先                                                                         |
| ---------------------------------------------- | ------------------------------------------------------------------------------ |
| 成果物の種類、目的、主な内容を調べる           | [成果物リファレンス](./specdojo/references/specdojo-deliverables-reference.md) |
| 成果物を検討・作成する順序を決める             | [ドキュメント作成順ガイド](./specdojo/guides/docs-authoring-order-guide.md)    |
| rulebook、recipe、sample、templateを使い分ける | [参考資料活用ガイド](./specdojo/guides/specdojo-reference-materials-guide.md)  |

成果物を実際に記述するときは、`specdojo/rulebooks/`で対象成果物の rulebook を確認し、`specdojo/templates/`と`specdojo/samples/`を雛形・記述例として利用します。

### 成果物の作成を計画する

| やりたいこと                                 | 参照先                                                                                                   |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 成果物カタログからScheduleへの流れを理解する | [成果物カタログからScheduleへの展開ガイド](./specdojo/guides/specdojo-deliverables-to-schedule-guide.md) |
| フェーズ、タスク、依存関係、反復を設計する   | [Schedule設計ガイド](./specdojo/guides/specdojo-schedule-design-guide.md)                                |

### プロジェクトを実行・管理する

| やりたいこと                               | 参照先                                                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| CLIの役割、初期設定、代表フローを知る      | [CLI概要ガイド](./specdojo/guides/specdojo-cli-overview-guide.md)                            |
| CLIのコマンドとオプションを調べる          | [CLIコマンドリファレンス](./specdojo/references/specdojo-command-reference.md)               |
| 課題、リスク、変更要求、意思決定を管理する | [登録簿運用ガイド](./specdojo/guides/specdojo-register-operation-guide.md)                   |
| Scheduleのタスクを実行・再実行する         | [exec運用ガイド](./specdojo/guides/specdojo-exec-operation-guide.md)                         |
| エージェント、権限、共通実行設定を変更する | [exec設定ガイド](./specdojo/guides/specdojo-exec-config-guide.md)                            |
| planとresultの生成・保管・再実行を理解する | [plan/resultライフサイクルガイド](./specdojo/guides/specdojo-plan-result-lifecycle-guide.md) |
| worktreeを使って手動で隔離実行する         | [exec worktree運用ガイド](./specdojo/guides/specdojo-exec-worktree-guide.md)                 |
| projectとtaskのブランチを運用する          | [ブランチワークフローガイド](./specdojo/guides/specdojo-branch-workflow-guide.md)            |

### 成果物をレビューする

成果物の妥当性、整合性、トレーサビリティを確認し、review planとreview resultを残す方法は、[レビューガイド](./specdojo/guides/specdojo-review-guide.md)を参照してください。

### Markdownを編集する

VS Code のプレビュー、見出し番号、Markdown 表の編集方法は、[ドキュメント編集ガイド](./specdojo/guides/docs-editing-guide.md)を参照してください。

## Quick Start

SpecDojo を利用するリポジトリは、次のいずれかの方法で準備できます。

- [specdojoリポジトリ](https://github.com/specdojo/specdojo)の`Use this template`から、新しいリポジトリを作成する
- リポジトリをダウンロードし、`docs/ja/specdojo/`以下の文書体系を既存プロジェクトへ取り込む

導入後は、次の小さな単位から始めます。

1. プロジェクトの目的とスコープを整理します。
2. 必要な成果物を選び、成果物カタログへ登録します。
3. 小さな Schedule に展開して、成果物を一つ作成・レビューします。
4. 必要に応じて登録簿、自動実行、branch / worktree運用を追加します。

具体的な CLI 操作は[CLI概要ガイド](./specdojo/guides/specdojo-cli-overview-guide.md)を参照してください。

## 提供する資料

| ディレクトリ           | 内容                                                   |
| ---------------------- | ------------------------------------------------------ |
| `specdojo/guides/`     | 全体像、判断方法、操作手順                             |
| `specdojo/references/` | 成果物、コマンド、設定などを一覧・比較して参照する資料 |
| `specdojo/standards/`  | 文書種別を横断する共通規約                             |
| `specdojo/rulebooks/`  | 成果物ごとの記述規則                                   |
| `specdojo/recipes/`    | 成果物を作成・更新する手順                             |
| `specdojo/templates/`  | 成果物の雛形                                           |
| `specdojo/samples/`    | 成果物の記述例                                         |
| `sample-gcs-projects/` | おばあちゃんの駄菓子屋を題材にしたプロジェクト文書例   |
| `sample-gcs-product/`  | おばあちゃんの駄菓子屋を題材にしたプロダクト文書例     |

## 基本ディレクトリ構成

```text
docs/
├── ja/
│   ├── specdojo/
│   │   ├── guides/
│   │   ├── references/
│   │   ├── standards/
│   │   ├── rulebooks/
│   │   ├── recipes/
│   │   ├── templates/
│   │   └── samples/
│   ├── projects/
│   │   └── <project-id>/
│   ├── product/
│   ├── sample-gcs-projects/
│   └── sample-gcs-product/
└── en/
```

プロジェクト内部の詳しい構成は[ドキュメント構成ガイド](./specdojo/guides/docs-structure-guide.md)を参照してください。

## ライセンス

本リポジトリは MIT ライセンスです。

## 著者・問い合わせ

Author: @naoji3x

Issue または Pull Request によるフィードバックを歓迎します。
