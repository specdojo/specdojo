---
specdojo:
  id: dct-index-sample
  type: project
  status: draft
  rulebook: dct-index-rulebook
---

# 成果物カタログ

Project Deliverables Catalog

駄菓子屋きぬや販売管理システム構築プロジェクトの成果物カタログです。
プロジェクト内で管理する各ドメインとドメイン別成果物カタログ（`dct-<domain>.md`）への参照を一元管理し、ドメインと参照先リンクの整合性を保ちます。
各ドメインに属する成果物の詳細情報（配置先・根拠・派生関係など）は、それぞれのドメイン別カタログに集約しています。

## 1. 共通ルール

- `local-id` は成果物の論理名とし、ファイル名・Frontmatter `id` の基礎として使用する（例: `prj-overview`）。
- `ARTIFACT` は `local-id` の短縮名で、Schedule などで識別子を短縮する場面で使用する。
- 成果物本体のファイル名は `<local-id>.md` 形式とする。
- 成果物本体の Frontmatter `id` は `<project-id>:<local-id>` 形式とする。
- `ドメイン` は成果物の分類識別子。`DOMAIN` はその短縮名で Schedule などで使用する。
- `根拠` には主要な依存関係を `local-id` で記載する。
- `based_on` には直接根拠のみを記載し、`根拠` と差分があってもよい。
- 種別は `work` / `control` / `generated` の3値のみを使用し、スケジュール展開対象は `work` のみとする。

## 2. 成果物カタログ一覧

| ドメイン           | 名称               | 成果物カタログ                                          | 概要                                                 |
| ------------------ | ------------------ | ------------------------------------------------------- | ---------------------------------------------------- |
| project-definition | プロジェクト定義   | `[dct-project-definition](./dct-project-definition.md)` | 目的、スコープ、前提条件などの定義成果物を管理する。 |
| project-management | プロジェクト管理   | `[dct-project-management](./dct-project-management.md)` | 計画、課題、進捗、会議体などの管理成果物を管理する。 |
| product-change     | プロダクト変更管理 | `[dct-product-change](./dct-product-change.md)`         | 変更要求から反映判断までの変更管理成果物を管理する。 |
