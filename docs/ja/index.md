# SpecDojo 日本語ドキュメント

SpecDojo は、仕様駆動開発のためのドキュメントフレームワークです。
プロダクトの構築・改修に必要な情報を体系化し、人が判断理由を理解でき、生成 AI とツールが成果物を安定して作成・検証・更新できる状態を目指します。

## このページの役割

このページは、日本語ドキュメントサイトの入口です。
SpecDojo の概要と、目的に合うガイドやリファレンスへの導線を提供します。

リポジトリの概要と入手方法は `README.md`、具体的な導入手順は [Quick Start ガイド](./specdojo/guides/quick-start-guide.md)、文書の配置は [ドキュメント構成ガイド](./specdojo/guides/docs-structure-guide.md) をそれぞれ正本とし、このページには詳細を重複して掲載しません。

## はじめに

目的に合わせて、次の文書から始めてください。

| 目的                                     | 読む文書                                                                                  |
| ---------------------------------------- | ----------------------------------------------------------------------------------------- |
| SpecDojo の全体像を理解する              | [全体概要ガイド](./specdojo/guides/specdojo-overview-guide.md)                            |
| CLI を初期設定し、基本フローを試す       | [Quick Start ガイド](./specdojo/guides/quick-start-guide.md)                              |
| 設定キーと必要なコマンドを調べる         | [SpecDojo設定リファレンス](./specdojo/references/specdojo-config-reference.md)            |
| 文書の分類、ライフサイクル、配置を決める | [ドキュメント構成ガイド](./specdojo/guides/docs-structure-guide.md)                       |
| CLI の役割と代表的な操作を確認する       | [遂行の技活用ガイド](./specdojo/guides/waza-guide.md)                                     |
| 成果物の種類と目的を調べる               | [成果物リファレンス](./specdojo/references/deliverables-reference.md)                     |
| ファイル単位の配置を調べる               | [ディレクトリレイアウトリファレンス](./specdojo/references/directory-layout-reference.md) |

やりたいことから文書を探す場合は、[全体概要ガイド](./specdojo/guides/specdojo-overview-guide.md)の「目的別の次の読み物」を参照してください。

## ドキュメントの主な領域

| 領域                     | 内容                                                                     |
| ------------------------ | ------------------------------------------------------------------------ |
| `specdojo/`              | 方針、共通規約、成果物別ルール、作成手順、テンプレート、サンプル、ガイド |
| `projects/<project-id>/` | 個別プロジェクトの目的、計画、判断、実行記録                             |
| `product/`               | プロダクトの現在の要件、仕様、設計、品質保証、運用                       |
| `sample-gcs-projects/`   | おばあちゃんの駄菓子屋を題材にしたプロジェクト文書例                     |
| `sample-gcs-product/`    | おばあちゃんの駄菓子屋を題材にしたプロダクト文書例                       |
