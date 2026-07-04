---
specdojo:
  id: prj-0001:dct-index
  type: project
  status: draft
  size: large
  rulebook: dct-index-rulebook
---

# 成果物カタログ

Project Deliverables Catalog

SpecDojo プロジェクトで作成する成果物とその説明をまとめたプロジェクト成果物カタログです。
ドメイン別成果物カタログへの参照先を一元管理し、成果物体系の参照起点を明確にします。
個別成果物の詳細情報は各 `dct-<domain>.md` に集約し、本書では共通ルールとドメイン一覧を管理します。

## 1. 共通ルール

- Frontmatter の `id` は `<project-id>:<local-id>` とします。
- `ドメイン`は、成果物の分類を示すために使用します。また、`DOMAIN`はその短縮名で、Schedule などで使用します。
- Frontmatter の `based_on` には、直接根拠として参照した文書のみを記載します。
- `local-id` は成果物の論理名を表し、ファイル名および frontmatter の `id` の基礎として使用します。
- `ARTIFACT` は、`local-id`の短縮名で、Schedule などで使用します。
- ファイルは以下の形式で命名し、`配置先`に保存します。
  - Markdownの場合は、`<local-id>.md` もしくは、`<成果物名>.md`
  - YAMLの場合は、`<local-id>.yaml` もしくは、`<成果物名>.yaml`
- `根拠`には、その成果物の検討・作成における主要な依存関係を記載します。
- `根拠` と `based_on` は原則として一致させますが、必要に応じて差分があっても構いません。
- 種別は、`work`（作成する成果物）、`control`（管理用のドキュメント）、`generated`（自動生成したドキュメント等）とします。スケジュールへの展開対象は `work` のみです。

## 2. 成果物カタログ一覧

| ドメイン             | 名称             | 成果物カタログ                                                  | 概要                                       |
| -------------------- | ---------------- | --------------------------------------------------------------- | ------------------------------------------ |
| `project-definition` | プロジェクト定義 | [dct-project-definition](./generated/dct-project-definition.md) | プロジェクト定義に関する成果物の一覧と説明 |
| `project-management` | プロジェクト管理 | [dct-project-management](./generated/dct-project-management.md) | プロジェクト管理に関する成果物の一覧と説明 |
