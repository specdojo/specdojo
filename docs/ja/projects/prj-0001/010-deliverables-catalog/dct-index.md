---
id: prj-0001:dct-index
type: project
status: draft
rulebook: dct-index-rulebook
---

# 成果物カタログ

Project Deliverables Catalog

本ドキュメントは、SpecDojo プロジェクトで作成する成果物とその説明をまとめた成果物カタログです。
ドメイン別成果物カタログは、以下のリンクから参照してください。

## 1. 共通ルール

- `local-id` は成果物の論理名を表し、ファイル名および frontmatter の `id` の基礎として使用します。
- ファイルは、`<local-id>.md` もしくは、`<local-id>.yaml` 形式で作成し、`配置先`に保存します。
- Frontmatter の `id` は `<project-id>:<local-id>` とします。
- `根拠`には、その成果物の検討・作成における主要な依存関係を記載します。
- Frontmatter の `based_on` には、直接根拠として参照した文書のみを記載します。
- `根拠` と `based_on` は原則として一致させますが、必要に応じて差分があっても構いません。
- 種別は、`work`（作成する成果物）、`control`（管理用のドキュメント）、`generated`（自動生成したドキュメント等）とします。WBSへの展開対象は `work` のみです。

## 2.　成果物カタログ一覧

| ドメイン             | 名称             | 成果物カタログ                                        | 概要                                       |
| -------------------- | ---------------- | ----------------------------------------------------- | ------------------------------------------ |
| `project-definition` | プロジェクト定義 | [dct-project-definition](./dct-project-definition.md) | プロジェクト定義に関する成果物の一覧と説明 |
| `project-management` | プロジェクト管理 | [dct-project-management](./dct-project-management.md) | プロジェクト管理に関する成果物の一覧と説明 |
