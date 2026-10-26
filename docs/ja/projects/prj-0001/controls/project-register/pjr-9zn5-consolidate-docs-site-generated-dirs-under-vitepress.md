---
specdojo:
  id: prj-0001:pjr-9zn5-consolidate-docs-site-generated-dirs-under-vitepress
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  owner: indie
  registered_at: "2026-10-26T12:48:16Z"
---

# PJR-9ZN5 @specdojo/docs-siteが生成するpublic/mermaid等を.vitepress配下に集約する

## 1. 概要

現在 @specdojo/docs-site (packages/docs-site) の build / dev / mermaid 実行時に、Mermaid SVG の出力先（public/mermaid）や kata ステージング（specdojo-kata-staging）が利用リポジトリのワークスペース直下に生成されるため、利用側のルートディレクトリが散らかり .gitignore にも複数のエントリ追加が必要になっている。これらの一時・生成ディレクトリを .vitepress/ 配下（例: .vitepress/mermaid や .vitepress/kata-staging 等）に集約し、VitePress 側の静的配信設定および README / config init の .gitignore テンプレートを整理する。

## 2. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 3. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
