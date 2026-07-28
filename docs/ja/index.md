# SpecDojo

SpecDojo は、**仕様駆動開発のためのドキュメントフレームワーク**です。
プロダクトの構築・改修に必要な情報を体系化し、記述規約、サンプル、テンプレート、CLI を通じて、プロジェクトの定義から実行・レビューまでを支援します。

人が内容と判断理由を理解でき、生成 AI とツールが成果物を安定して作成・検証・更新できるドキュメント体系を目指しています。

## はじめに

初めて SpecDojo に触れる場合は、次の順に読むと全体像をつかめます。

1. [全体概要ガイド](./specdojo/guides/specdojo-overview-guide.md)：SpecDojo の目的、文書体系、成果物から実行管理までの流れを説明します。
2. [ドキュメント構成ガイド](./specdojo/guides/docs-structure-guide.md)：プロダクト文書とプロジェクト文書の分類、配置を説明します。
3. [トラック設計ガイド](./specdojo/guides/track-design-guide.md)：プロジェクトの作業系列であるトラックの構成と実行順序を説明します。

CLI による実行管理から確認したい場合は、[CLI概要ガイド](./specdojo/guides/cli-overview-guide.md)から始めてください。

やりたいことから文書を探す場合は、[全体概要ガイド](./specdojo/guides/specdojo-overview-guide.md)の`目的別の次の読み物`を参照してください。guide と reference を目的別にまとめた唯一の一覧です。

## Quick Start

SpecDojo を利用するリポジトリは、次のいずれかの方法で準備できます。

- [specdojoリポジトリ](https://github.com/specdojo/specdojo)の`Use this template`から、新しいリポジトリを作成する
- リポジトリをダウンロードし、`docs/ja/specdojo/`以下の文書体系を既存プロジェクトへ取り込む

導入後は、次の小さな単位から始めます。

1. プロジェクトの目的とスコープを整理します。
2. 必要な成果物を選び、成果物カタログへ登録します。
3. 小さな Schedule に展開して、成果物を一つ作成・レビューします。
4. 必要に応じて登録簿、自動実行、branch / worktree運用を追加します。

具体的な CLI 操作は[CLI概要ガイド](./specdojo/guides/cli-overview-guide.md)を参照してください。

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
