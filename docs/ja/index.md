# SpecDojo

SpecDojoは、**仕様駆動開発のためのドキュメントフレームワーク** です。
プロダクトの構築・改修に必要なドキュメントを体系化し、
記述規約、サンプル、生成AI向け指示テンプレート、ツールを通じて、
プロダクトのライフサイクル全体を一貫して支援します。

仕様駆動開発に適した、**生成AIが扱い易く、人も理解できて、記述も負担にならない**、
そんなドキュメントのフレームワークを目指しています。

**SpecDojo** では、仕様駆動開発のためのドキュメントの、

- **作成ルール**と**ガイドライン**
- 生成AI向け**指示テンプレート**
- **サンプルドキュメント** (おばあちゃんの駄菓子屋)
- **作成支援ツール**

を、オープンソース・テンプレートリポジトリとして公開しています。

## Quick Start

- GitHubのテンプレートプロジェクトとして公開していますので、[specdojoリポジトリ](https://github.com/specdojo/specdojo)の右上の`Use this template`ボタンから`Create a new repository`クリックして新規リポジトリを作成してください。

- [specdojoリポジトリ](https://github.com/specdojo/specdojo)の右上の`Code`ボタンから`Download ZIP`をクリックして、ファイルをダウンロードし、`docs/ja/specdojo`以下をプロジェクトに取り込んでください。

## ドキュメントガイド

- [構成ガイド](./specdojo/guidelines/docs-structure-guide.md)では、SpecDojoで扱うドキュメントの全体構成について説明します。
- [内容ガイド](./specdojo/guidelines/docs-contents-guide.md)では、各ドキュメントの内容について説明します。
- [編集ガイド](./specdojo/guidelines/docs-editing-guide.md)では、エディターやツールの使い方の豆知識を説明します。

## ディレクトリ構成

```plaintext
docs/
├── ja/                   # 多言語化対応（将来: en/ etc.）
│   ├── specdojo/
│   │   ├── guidelines/   # ドキュメント作成ガイド
│   │   ├── rules/        # ドキュメント記述規約
│   │   └── instructions/ # 生成AIへの指示テンプレート
│   ├── sample-gcs-projects/ # おばあちゃんの駄菓子屋サンプルドキュメント
│   │   ├── prj-0001/ # プロジェクトの構築や改修時に追加されるドキュメント群
│   │   │   ├── 010-project-overview/            # プロジェクト概要
│   │   │   ├── 020-project-scope/               # プロジェクトスコープ
│   │   │   ├── 030-project-issues-and-approach/ # プロジェクト課題と解決アプローチ
│   │   │   ├── 040-project-management/          # プロジェクトマネジメント
│   │   │   └── 090-decision-log/                # 決定記録
│   │   └── prj-0002/ ...
│   └── sample-gcs-product/ # おばあちゃんの駄菓子屋サンプルドキュメント
│       ├── 010-business-specifications/        # 業務仕様
│       ├── 020-external-if-specifications/     # 外部I/F仕様
│       ├── 030-architecture/                   # アーキテクチャ
│       ├── 040-system-design/                  # システム設計
│       ├── 050-business-acceptance-criteria/   # 業務受入条件
│       ├── 060-non-functional-requirements/    # 非機能要件
│       ├── 070-system-acceptance-criteria/     # システム受入条件
│       ├── 080-testing/                        # テスト
│       ├── 090-migration/                      # 移行
│       └── 100-operations/                     # 運用
└── en/                   # 将来の英語ドキュメント用ディレクトリ
```

## ライセンス

本リポジトリは MIT ライセンスです。

## 著者 / 問い合わせ

Author: @naoji3x<br>
Issue もしくは Pull Request にてフィードバックを歓迎します。
